/* Drill-down bar engine, hover-to-preview model.
   Three fixed rung slots (0/1/2) are always in the DOM. Each is resolved
   independently every render: hovering a segment previews the next rung
   (dulled) without committing; clicking commits for real. Ancestor rungs
   stay visible (dulled) once you've drilled past them, and stay
   hoverable/clickable. window.VIZ_CONFIG is set by the HTML file before
   this loads. */
(function () {
  "use strict";

  const CFG = window.VIZ_CONFIG;
  const fmtEur = (m) => {
    if (m >= 1e6) return `€${(m / 1e6).toFixed(2)}tn`;
    if (m >= 1e3) return `€${(m / 1e3).toFixed(1)}bn`;
    return `€${Math.round(m)}m`;
  };
  // Data-driven, and the `|| m` tail is the point: an unmapped metric prints
  // its own id -- visibly wrong in review -- rather than confidently printing
  // "assets" and telling a plausible lie.
  const METRIC_LABEL_FALLBACK = { assets: "assets", aum: "AUM" };
  const metricLabel = (m) =>
    (DATA && DATA.metric_labels && DATA.metric_labels[m]) ||
    METRIC_LABEL_FALLBACK[m] || m;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  // Touch browsers synthesize a "mouseover" immediately before the (often
  // ~300ms-delayed) synthetic "click" for a tap. Our hover-preview handlers
  // react to that mouseover by rebuilding the segment DOM (buildBar wipes
  // and recreates every segment element on each render) -- which orphans
  // the very element the pending click is about to land on, so the tap's
  // click is silently lost. A second tap then works because its mouseover
  // is a no-op (the hover state already matches) so nothing gets rebuilt
  // out from under it. There's no legitimate "hover to preview" gesture on
  // touch anyway (a finger can't hover), so the fix is to only run the
  // hover-preview mechanism on devices that report real hover + a precise
  // pointer -- touch taps go straight to the click handler, on the first
  // tap, with the DOM undisturbed.
  const supportsHoverPreview = !!(
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  // ---- views: ONE toggle, three views (2026-09-22) ------------------------
  // Standalone assets / Consolidated assets / Consolidated assets under
  // management. Until 2026-09-22 there were two controls (measure x basis) and
  // four views; AUM has no true standalone form, so the grid became a list.
  //
  // A balance sheet is what an institution owns; AUM is what it runs for other
  // people, much of which appears on the balance-sheet views as some insurer's
  // own assets. They are never added together, which is why they are separate
  // views rather than one bar.
  //
  // Definitions and every label come from data.json (viz/gfa/presentation.py
  // VIEWS). The literals below are only a fallback so this file still renders
  // against a data.json too old to carry them -- keep them in step with VIEWS.
  const VIEWS_FALLBACK = [
    { id: "assets:standalone", label: "Standalone assets",
      top_ids: ["banks", "insurers", "pension-institutions"],
      subtitle: "What financial institutions hold on their own balance sheets." },
    { id: "assets:consolidated", label: "Consolidated assets",
      top_ids: ["conglomerates", "monoline-banks", "monoline-insurers", "monoline-pensions"],
      subtitle: "What corporate groups hold, counting each subsidiary once inside its parent." },
    { id: "aum:consolidated", label: "Consolidated assets under management",
      top_ids: ["bank-owned-am", "insurer-owned-am", "independent-am"],
      subtitle: "What asset managers manage (on others' balance sheets), grouped by who owns them." },
  ];
  let VIEWS = VIEWS_FALLBACK;
  let viewId = VIEWS[0].id;

  function view() {
    return VIEWS.find((v) => v.id === viewId) || VIEWS[0];
  }
  // The categories visible in the current view, in data order. Every index in
  // `topIndex` and `hover` is an index INTO THIS ARRAY, not into DATA.top.
  function tops() {
    if (!DATA) return [];
    return view().top_ids.map((id) => DATA.top.find((t) => t.id === id)).filter(Boolean);
  }

  // ---- state -----------------------------------------------------------
  let DATA = null;
  let topIndex = null;    // real committed selection, unchanged semantics
  let subIndex = null;
  let hover = null;        // { depth: 0|1, index } -- ancestor hover-preview trigger
  let instPinned = null;   // key of the institution pinned open by a click, if any
  let bar2Segs = [];       // the segments currently built into bar-2, for hover lookups

  const els = {};
  function q(sel) { return document.querySelector(sel); }

  function init() {
    els.crumbs = q("#crumbs");
    els.title = q("#page-title");
    els.subtitle = q("#page-subtitle");

    els.rung0 = q("#rung-0");
    els.bar0 = q("#bar-0");
    els.rung1 = q("#rung-1");
    els.bar1 = q("#bar-1");
    els.blurb1 = q("#blurb-1");
    els.rung2 = q("#rung-2");
    els.bar2 = q("#bar-2");
    els.blurb2 = q("#blurb-2");
    els.callouts = q("#callouts");
    // One control. The host pages still carry the old two-toggle markup
    // (#measure-toggle + #basis-toggle); the first becomes the view toggle and
    // the second is REMOVED, so neither index file needs editing. Not merely
    // hidden: on the Hugo site the scoped `.view-toggle { display: flex }` beats
    // the [hidden] attribute and it drew as an empty pill.
    els.viewToggle = q("#measure-toggle") || q("#view-toggle");
    const oldBasis = q("#basis-toggle");
    if (oldBasis) oldBasis.remove();
    els.svg = q("#lines");
    els.stage2 = els.bar2.closest(".bar-wrap");
    els.hierarchy = q("#hierarchy");

    els.title.addEventListener("click", goHome);
    els.subtitle.addEventListener("click", goHome);
    window.addEventListener("resize", handleResize);

    // Delegated hover -- attached once, survives every bar rebuild, and
    // avoids the enter/leave race you'd get re-attaching per-segment
    // listeners on every render.
    els.bar0.addEventListener("mouseover", (e) => handleAncestorHover(0, e));
    els.bar0.addEventListener("mouseleave", () => handleAncestorLeave(0));
    els.bar1.addEventListener("mouseover", (e) => handleAncestorHover(1, e));
    els.bar1.addEventListener("mouseleave", () => handleAncestorLeave(1));
    els.bar2.addEventListener("mouseover", handleInstHover);
    els.bar2.addEventListener("mouseleave", handleInstLeave);

    fetch("data.json")
      .then((r) => r.json())
      .then((d) => {
        DATA = d;
        if (Array.isArray(d.views) && d.views.length) VIEWS = d.views;
        viewId = VIEWS[0].id;
        // Applies the one-category home rule before the first paint.
        resetSelection();
        renderAll();
      })
      .catch((e) => {
        els.crumbs.textContent = "Could not load data.json.";
        console.error(e);
      });
  }

  // ---- derived getters ---------------------------------------------------
  function level() {
    if (topIndex === null) return 0;
    if (subIndex === null) return 1;
    return 2;
  }
  function currentTop() { return topIndex === null ? null : tops()[topIndex]; }
  function currentSub() {
    const t = currentTop();
    return t && subIndex !== null ? t.sub[subIndex] : null;
  }

  function orderedTopIndices() {
    const T = tops();
    const idx = T.map((_, i) => i);
    if (CFG.topOrder === "size") {
      idx.sort((a, b) => T[b].size_eur_m - T[a].size_eur_m);
    } else {
      const fixed = CFG.fixedTopOrder;
      idx.sort((a, b) => fixed.indexOf(T[a].id) - fixed.indexOf(T[b].id));
    }
    return idx;
  }
  function orderedSubIndices(top) {
    const idx = top.sub.map((_, i) => i);
    if (CFG.subOrder === "size") {
      idx.sort((a, b) => {
        // Two kinds of segment are pinned right regardless of size, and the
        // rank makes their order relative to each other explicit rather than
        // accidental:
        //   1  no institutions -- an un-itemised bar. In the sector basis that
        //      is the "Other companies (not sampled)" placeholder; in the group
        //      basis it is a group whose members we hold no standalone figure
        //      for (Sparkasse Chemnitz). Several are the biggest slice of their
        //      bar, and sorting a "we don't know" bucket to the front misleads.
        //   2  pin_last -- the group basis's "Independent" bucket, which must
        //      be the RIGHTMOST segment. It is the largest segment in two of
        //      its four categories, but it is a residual of ungrouped
        //      institutions rather than a group, so it reads as the tail of the
        //      bar no matter its size. Requested explicitly on 2026-09-20.
        const rank = (x) =>
          x.pin_last ? 2 : x.institutions.length === 0 ? 1 : 0;
        const ra = rank(top.sub[a]), rb = rank(top.sub[b]);
        if (ra !== rb) return ra - rb;
        return top.sub[b].size_eur_m - top.sub[a].size_eur_m;
      });
    }
    return idx;
  }

  // ---- color -------------------------------------------------------------
  // A bare lookup returned undefined for an unmapped id, which produced
  // `hsl(undefined 62% 52%)` -- an invalid color, so the whole segment
  // rendered unstyled rather than merely wrong. Fall back instead.
  function topColor(topId) { return CFG.topHue[topId] ?? 220; }
  function segmentColor(kind, ctx) {
    if (kind === "top") return `hsl(${topColor(ctx.top.id)} 62% 52%)`;
    if (kind === "unobserved") return CFG.unobservedColor;
    if (kind === "sub") {
      if (CFG.colorMode === "consistent") {
        const hue = topColor(ctx.top.id);
        const l = 62 - ctx.rank * (26 / Math.max(1, ctx.n - 1));
        return `hsl(${hue} 55% ${l}%)`;
      }
      const hue = (CFG.levelHueSeed[1] + ctx.rank * (320 / Math.max(1, ctx.n))) % 360;
      return `hsl(${hue} 60% 55%)`;
    }
    if (CFG.colorMode === "consistent") {
      const hue = topColor(ctx.top.id);
      const l = 68 - ctx.rank * (48 / Math.max(1, ctx.n - 1));
      return `hsl(${hue} 60% ${clamp(l, 18, 70)}%)`;
    }
    const hue = (CFG.levelHueSeed[2] + ctx.rank * (320 / Math.max(1, ctx.n))) % 360;
    const l = 62 - ctx.rank * (18 / Math.max(1, ctx.n - 1));
    return `hsl(${hue} 55% ${clamp(l, 30, 65)}%)`;
  }

  // ---- resolve what each slot shows: hover preview > real > nothing -----
  function resolveBar1() {
    if (hover && hover.depth === 0 && hover.index !== topIndex) {
      return { top: tops()[hover.index], topRealIndex: hover.index, source: "preview" };
    }
    if (topIndex !== null) {
      return { top: tops()[topIndex], topRealIndex: topIndex, source: "real" };
    }
    return null;
  }

  function resolveBar2(b1) {
    if (hover && hover.depth === 0 && hover.index !== topIndex) return null; // ancestor preview hides rung 3
    if (hover && hover.depth === 1 && b1 && b1.source === "real" && hover.index !== subIndex) {
      const s = b1.top.sub[hover.index];
      return { top: b1.top, topRealIndex: b1.topRealIndex, sub: s, subRealIndex: hover.index, source: "preview" };
    }
    if (topIndex !== null && subIndex !== null) {
      const t = tops()[topIndex];
      return { top: t, topRealIndex: topIndex, sub: t.sub[subIndex], subRealIndex: subIndex, source: "real" };
    }
    return null;
  }

  // ---- render --------------------------------------------------------------
  // This environment (verified via testing) will occasionally re-fire a
  // synthetic mouseover on a segment right after its DOM is rebuilt out
  // from under a stationary cursor -- with no real mouse movement behind
  // it. Harmless most of the time (it just re-confirms whatever's already
  // real), but a click that un-commits a rung turns it harmful: the stray
  // hover lands on the segment the user just clicked and, since it no
  // longer matches the (now-cleared) real selection, gets misread as a
  // genuine hover-preview request. commitRender() briefly suppresses the
  // hover-preview handler after any real click/navigation so a same-spot
  // stray re-fire can't resurrect a preview the user didn't ask for.
  let suppressHoverUntil = 0;
  function commitRender() {
    suppressHoverUntil = performance.now() + 150;
    renderAll();
  }

  function renderAll() {
    const b1 = resolveBar1();
    const b2 = resolveBar2(b1);
    renderViewToggles();
    renderRung0();
    renderRung1(b1);
    renderRung2(b2);
    updateCrumbs();
    growMinHeight();
  }

  // ---- view toggle ---------------------------------------------------------
  // One renderer, two call sites. `options` comes straight from data.json, so
  // this file names no label of its own and prepare_data.py stays the single
  // source of truth for the wording.
  function renderToggle(el, options, activeId, onPick) {
    if (!el) return;
    el.innerHTML = "";
    options.forEach((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "view-tab" + (o.id === activeId ? " active" : "");
      b.textContent = o.label;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", o.id === activeId ? "true" : "false");
      b.addEventListener("click", () => onPick(o.id));
      el.appendChild(b);
    });
  }

  function renderViewToggles() {
    renderToggle(els.viewToggle, VIEWS, viewId, setView);
    els.subtitle.textContent = view().subtitle;
  }

  // A one-category view opens straight onto its sub-groups. Landing on a single
  // full-width segment with nothing to compare it against would waste the first
  // click. Defined once here because goHome() and first paint need it too --
  // before 2026-09-20 this rule lived only in setView, so a one-category view
  // rendered at startup showed an empty chart until something was clicked.
  function homeTopIndex() { return tops().length === 1 ? 0 : null; }

  // Everything that does not survive a change of view. Call it AFTER assigning
  // the new viewId: it reads tops() through the NEW view.
  function resetSelection() {
    topIndex = homeTopIndex();
    subIndex = null;
    hover = null;
    instPinned = null;
    bar2Segs = [];
    if (els.callouts) els.callouts.innerHTML = "";
    if (els.svg) els.svg.innerHTML = "";
    // The min-height ratchet is per-view. Without this, switching from a deeper
    // view to a shallower one leaves the taller view's blank space behind.
    // renderAll() ends with growMinHeight(), which re-establishes the floor
    // from the new content in the same frame, so there is no flash.
    maxHierarchyHeight = 0;
    if (els.hierarchy) els.hierarchy.style.minHeight = "";
  }

  function setView(id) {
    if (id === viewId) return;
    viewId = id;
    resetSelection();
    commitRender();
  }

  // ---- min-height ratchet --------------------------------------------------
  // Drilling back up (e.g. clicking a different rung-0 segment while rung 2
  // is open) collapses the DOM height instantly. If the page had scrolled
  // down to see the deeper rungs, that collapse yanks the scroll position
  // back up as the browser clamps it to the new (shorter) document height --
  // jarring, and it can leave the cursor hovering a completely different
  // segment than the one the user meant to act on. Fix: never let the
  // hierarchy container get shorter than the tallest it's ever been *at the
  // current viewport width* -- a plain ratchet, since content height is data-
  // driven (varies with which callouts are open) and not worth precomputing.
  let maxHierarchyHeight = 0;
  function growMinHeight() {
    if (!els.hierarchy) return;
    const h = els.hierarchy.scrollHeight;
    if (h > maxHierarchyHeight) {
      maxHierarchyHeight = h;
      els.hierarchy.style.minHeight = maxHierarchyHeight + "px";
    }
  }
  function handleResize() {
    drawInstLine();
    // The ratchet is only valid for one viewport width -- a min-height
    // calibrated for a wide desktop layout would force excess blank space
    // (or, worse, an under-sized one could clip content) once the layout
    // reflows for a narrower/wider width. Reset and let it re-establish
    // itself from the current, already-rendered content.
    if (!els.hierarchy) return;
    els.hierarchy.style.minHeight = "";
    maxHierarchyHeight = els.hierarchy.scrollHeight;
    els.hierarchy.style.minHeight = maxHierarchyHeight + "px";
  }

  function buildBar(barEl, segs, highlightRealIndex, boostSelected) {
    barEl.innerHTML = "";
    const withLabels = [];
    segs.forEach((seg) => {
      const el = document.createElement("div");
      el.className = "segment seg-" + (seg.kind || "normal");
      el.style.background = seg.color;
      el.style.width = seg.pct + "%";
      if (seg.key) el.dataset.key = seg.key;
      if (seg.realIndex !== undefined) el.dataset.realIndex = seg.realIndex;
      if (seg.label) {
        const wrap = document.createElement("div");
        wrap.className = "seg-label";
        const nameEl = document.createElement("div");
        nameEl.className = "seg-name";
        nameEl.textContent = seg.label;
        wrap.appendChild(nameEl);
        let sizeEl = null;
        if (seg.sizeLabel) {
          sizeEl = document.createElement("div");
          sizeEl.className = "seg-size";
          sizeEl.textContent = seg.sizeLabel;
          wrap.appendChild(sizeEl);
        }
        el.appendChild(wrap);
        withLabels.push({ wrap, nameEl, sizeEl });
      }
      if (seg.onClick) {
        el.classList.add("clickable");
        el.addEventListener("click", seg.onClick);
      }
      if (highlightRealIndex !== null && highlightRealIndex !== undefined) {
        const isSelected = seg.realIndex !== undefined && seg.realIndex === highlightRealIndex;
        // Two modes: a live hover-preview boosts the hovered segment above
        // its normal color (transient, at a focal bar) -- but the
        // "this is what you already clicked" indicator on a dulled
        // ancestor bar should just leave the selected segment at its own
        // plain color, only dimming the rest, not boost it further.
        if (boostSelected) el.classList.toggle("bright", isSelected);
        el.classList.toggle("dim", !isSelected);
      }
      barEl.appendChild(el);
    });
    // Now that everything has real pixel widths, hide whichever line of
    // each label would actually need to ellipsize -- independently, so a
    // segment whose name doesn't fit can still show just its size (and
    // vice versa) -- and hide the label entirely only if neither fits.
    withLabels.forEach(({ wrap, nameEl, sizeEl }) => {
      const nameFits = nameEl.scrollWidth <= nameEl.clientWidth + 1;
      if (!nameFits) nameEl.style.display = "none";
      let sizeFits = true;
      if (sizeEl) {
        sizeFits = sizeEl.scrollWidth <= sizeEl.clientWidth + 1;
        if (!sizeFits) sizeEl.style.display = "none";
      }
      if (!nameFits && !sizeFits) wrap.style.display = "none";
    });
  }

  // The view's own explanation, in the same place and the same voice as a
  // category blurb. A one-category view does not get one: rung 0 is hidden
  // there and its single category's blurb already occupies that slot, so
  // adding this would say the same thing twice.
  //
  // The <p> is created here rather than sitting in the host markup because
  // three separate pages host this engine (the standalone page, the Hugo
  // bundle, the Artifact) and an element added to only some of them is a
  // silent difference between them.
  function renderViewBlurb() {
    const v = view();
    let el = document.getElementById("blurb-0");
    if (!v.blurb) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("p");
      el.id = "blurb-0";
      el.className = "ancestor-line";
      els.rung0.insertBefore(el, els.rung0.firstChild);
    }
    el.innerHTML = "";
    el.appendChild(ancestorLine(v.blurb_label || "", v.blurb));
  }

  function ancestorLine(label, blurb) {
    const p = document.createElement("p");
    // A view-level blurb has no label (user's wording, 2026-09-22): plain text,
    // no bold "Label:" prefix and no leading space.
    if (label) {
      const strong = document.createElement("strong");
      strong.textContent = label + ":";
      p.appendChild(strong);
      p.appendChild(document.createTextNode(" "));
    }
    p.appendChild(document.createTextNode(blurb || ""));
    return p;
  }

  function renderRung0() {
    const T = tops();
    // A view with one category (Under management) has nothing to choose
    // between at this rung. A full-width segment that is always selected is
    // not a choice, it is a label -- so the rung is dropped entirely and that
    // view runs on two bars: sub-groups, then institutions. The category's
    // own blurb still appears, as the header line above the sub-group bar.
    if (T.length === 1) {
      els.rung0.hidden = true;
      return;
    }
    els.rung0.hidden = false;
    renderViewBlurb();
    const order = orderedTopIndices();
    const total = order.reduce((s, i) => s + T[i].size_eur_m, 0);
    const segs = order.map((i) => {
      const t = T[i];
      return {
        key: `top:${t.id}`,
        realIndex: i,
        label: t.seg_label || t.label,
        sizeLabel: fmtEur(t.size_eur_m),
        pct: (t.size_eur_m / total) * 100,
        color: segmentColor("top", { top: t }),
        kind: "top",
        onClick: () => {
          if (topIndex === i) { topIndex = null; subIndex = null; }
          else { topIndex = i; subIndex = null; }
          hover = null;
          commitRender();
        },
      };
    });
    // While focal (nothing committed), highlight tracks live hover, same
    // as before. Once dulled (something committed), the *committed*
    // segment stays highlighted permanently instead -- that's what makes
    // it obvious which one you clicked, even though the rest of the bar
    // is now an ancestor.
    const hi = topIndex !== null ? topIndex : (hover && hover.depth === 0 ? hover.index : null);
    buildBar(els.bar0, segs, hi, /* boostSelected */ topIndex === null);
    els.rung0.classList.toggle("focal", topIndex === null);
    els.rung0.classList.toggle("dulled", topIndex !== null);
  }

  function renderRung1(b1) {
    if (!b1) {
      els.rung1.hidden = true;
      return;
    }
    els.rung1.hidden = false;
    const t = b1.top;
    const order = orderedSubIndices(t);
    const total = t.size_eur_m;
    const segs = order.map((i, rank) => {
      const s = t.sub[i];
      if (s.institutions.length === 0) {
        return {
          key: `sub:${t.id}:${s.id}`,
          label: s.label,
          sizeLabel: fmtEur(s.size_eur_m),
          pct: (s.size_eur_m / total) * 100,
          color: segmentColor("unobserved", {}),
          kind: "placeholder",
        };
      }
      return {
        key: `sub:${t.id}:${s.id}`,
        realIndex: i,
        label: s.label,
        sizeLabel: fmtEur(s.size_eur_m),
        pct: (s.size_eur_m / total) * 100,
        color: segmentColor("sub", { top: t, rank, n: order.length }),
        kind: "sub",
        onClick: () => {
          if (b1.source === "real" && subIndex === i) { subIndex = null; }
          else { topIndex = b1.topRealIndex; subIndex = i; }
          hover = null;
          commitRender();
        },
      };
    });
    const bright = b1.source === "real" && subIndex === null;
    // Same rule as rung 0: while this bar is focal, highlight follows
    // hover; once it's dulled (subIndex committed), the committed
    // sub-group stays highlighted instead of everything going flat.
    const hi = !bright && b1.source === "real" && subIndex !== null
      ? subIndex
      : (hover && hover.depth === 1 && b1.source === "real" ? hover.index : null);
    buildBar(els.bar1, segs, hi, /* boostSelected */ bright);
    els.blurb1.innerHTML = "";
    els.blurb1.appendChild(ancestorLine(t.label, t.blurb));
    els.rung1.classList.toggle("focal", bright);
    els.rung1.classList.toggle("dulled", !bright);
  }

  function renderRung2(b2) {
    if (!b2) {
      els.rung2.hidden = true;
      els.svg.innerHTML = "";
      els.callouts.innerHTML = "";
      bar2Segs = [];
      instPinned = null;
      return;
    }
    els.rung2.hidden = false;
    const t = b2.top;
    const s = b2.sub;
    const total = s.size_eur_m;
    const segs = s.institutions.map((inst, rank) => ({
      key: `inst:${inst.short_name}`,
      // seg_label is a shorter form used only on the bar. A name that does not
      // fit its segment is hidden entirely by the ellipsize pass below, so a
      // long name on a narrow segment loses its label altogether -- an
      // abbreviation is the difference between a labelled slice and a blank
      // one. The callout and detail lines always use the full name.
      label: inst.seg_label || inst.short_name || inst.legal_name,
      sizeLabel: fmtEur(inst.size_eur_m),
      pct: (inst.size_eur_m / total) * 100,
      color: segmentColor("inst", { top: t, rank, n: s.institutions.length }),
      kind: "inst",
      detailLines: inst.detail_lines,
      url: inst.url,
      urlLabel: inst.url_label,
      onClick: () => {
        const key = `inst:${inst.short_name}`;
        if (b2.source === "preview") {
          topIndex = b2.topRealIndex;
          subIndex = b2.subRealIndex;
          hover = null;
          commitRender(); // rebuilds bar-2 as real content and resets instPinned
        }
        if (instPinned === key) {
          instPinned = null;
          highlightBar2(null);
          clearInstDetail();
        } else {
          instPinned = key;
          highlightBar2(key);
          renderInstDetail(inst.detail_lines, inst.url, inst.url_label);
          drawSingleLine(key);
        }
      },
    }));
    if (s.unobserved_eur_m > 0) {
      segs.push({
        key: "unobserved",
        // The remainder means something different on each basis, so the wording
        // travels with the data. By sector: institutions we have not collected.
        // By group: the rest of that group, overwhelmingly foreign subsidiaries
        // which can never be rows because the dataset is German legal entities.
        label: s.unobserved_label || "Other companies (not sampled)",
        sizeLabel: fmtEur(s.unobserved_eur_m),
        pct: (s.unobserved_eur_m / total) * 100,
        color: segmentColor("unobserved", {}),
        kind: "unobserved",
        detailLines: [
          s.unobserved_detail
            ? s.unobserved_detail.replace("{amount}", fmtEur(s.unobserved_eur_m))
            : `${fmtEur(s.unobserved_eur_m)} ${metricLabel(s.metric)} of ${s.label} is not sampled.`,
        ],
      });
    }
    buildBar(els.bar2, segs, null);
    bar2Segs = segs;
    instPinned = null;
    els.callouts.innerHTML = "";
    els.svg.innerHTML = "";
    els.blurb2.innerHTML = "";
    els.blurb2.appendChild(ancestorLine(s.label, s.blurb));
    els.rung2.classList.toggle("focal", b2.source === "real");
    els.rung2.classList.toggle("dulled", b2.source !== "real");
  }

  // ---- ancestor (rung 0 / rung 1) hover-preview delegation ---------------
  // A short debounce on "leave" tolerates the mouse briefly crossing the
  // gap between two stacked bars without the preview flickering off.
  let ancestorLeaveTimer = null;
  let ancestorHoverFrame = null;

  function handleAncestorHover(depth, e) {
    if (!supportsHoverPreview) return;
    if (performance.now() < suppressHoverUntil) return;
    const el = e.target.closest(".segment");
    if (!el || el.dataset.realIndex === undefined) return;
    // Hover-preview only ever fires for the current *focal* bar -- a
    // dulled ancestor (something already committed past) never previews
    // anything on hover anymore, so it can't override real content.
    // It's still clickable for real navigation (including unclick).
    if (depth === 0 && topIndex !== null) return;
    if (depth === 1) {
      const b1 = resolveBar1();
      if (!b1 || b1.source !== "real" || subIndex !== null) return;
    }
    clearTimeout(ancestorLeaveTimer);
    const idx = Number(el.dataset.realIndex);
    if (hover && hover.depth === depth && hover.index === idx) return;
    hover = { depth, index: idx };
    // Deferred to next frame: rebuilding the just-entered segment's own
    // DOM synchronously here would replace it mid-click, so a click
    // landing in this same tick (mousemove-then-click, which is how
    // every click starts) would fire on an element that's about to be
    // discarded and silently miss its own listener. Committing state
    // (above) is instant; only the visible rebuild waits a frame, which
    // lets a same-tick click's own synchronous render win first.
    if (ancestorHoverFrame) cancelAnimationFrame(ancestorHoverFrame);
    ancestorHoverFrame = requestAnimationFrame(() => {
      ancestorHoverFrame = null;
      renderAll();
    });
  }
  function handleAncestorLeave(depth) {
    clearTimeout(ancestorLeaveTimer);
    ancestorLeaveTimer = setTimeout(() => {
      if (hover && hover.depth === depth) {
        hover = null;
        renderAll();
      }
    }, 120);
  }

  // ---- rung-3 single-institution hover/pin --------------------------------
  // Hovering always shows a live preview. Leaving reverts to whatever is
  // pinned (via click), or clears entirely if nothing is pinned -- there's
  // no more "shows the biggest by default."
  function handleInstHover(e) {
    if (!supportsHoverPreview) return;
    const el = e.target.closest(".segment");
    if (!el) return;
    const seg = bar2Segs.find((s) => s.key === el.dataset.key);
    if (!seg) return;
    highlightBar2(seg.key);
    renderInstDetail(seg.detailLines, seg.url, seg.urlLabel);
    drawSingleLine(seg.key);
  }
  function handleInstLeave() {
    if (instPinned) {
      const seg = bar2Segs.find((s) => s.key === instPinned);
      if (seg) {
        highlightBar2(seg.key);
        renderInstDetail(seg.detailLines, seg.url, seg.urlLabel);
        drawSingleLine(seg.key);
        return;
      }
    }
    highlightBar2(null);
    clearInstDetail();
  }
  function highlightBar2(key) {
    [...els.bar2.children].forEach((el) => {
      el.classList.toggle("bright", key !== null && el.dataset.key === key);
      el.classList.toggle("dim", key !== null && el.dataset.key !== key);
    });
  }
  // Every path that changes the callout block's height has to re-run the
  // ratchet, and until 2026-09-21 this one -- the busiest of them -- did not.
  // Emptying #callouts drops it back to its 20px floor, which on a 680px
  // column is up to 150px of document height disappearing on a single
  // mouse-out. The document gets shorter, the browser clamps scrollTop, and
  // the whole page slides under a stationary cursor onto a different segment,
  // which renders a different-height box, which moves it again. Growing is
  // harmless; shrinking is the entire bug, and growMinHeight() exists to stop
  // exactly this -- it was just never wired to the rung-2 hover path, which
  // bypasses renderAll().
  function clearInstDetail() {
    els.callouts.innerHTML = "";
    els.svg.innerHTML = "";
    growMinHeight();
  }
  function renderInstDetail(lines, url, urlLabel) {
    els.callouts.innerHTML = "";
    const box = document.createElement("div");
    box.className = "callout callout-single";
    lines.forEach((l) => {
      const d = document.createElement("div");
      d.textContent = l;
      box.appendChild(d);
    });
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "source-link";
      a.textContent = urlLabel || "Source ↗";
      box.appendChild(a);
    }
    els.callouts.appendChild(box);
    // Before the caller's drawSingleLine(): the box sits at the top of
    // #callouts, so raising the container's floor cannot move it, and the
    // leader line still measures against a settled layout.
    growMinHeight();
  }

  // ---- leader line (rung 3 only now) --------------------------------------
  function svgSetup() {
    const stageRect = els.stage2.getBoundingClientRect();
    els.svg.setAttribute("width", stageRect.width);
    els.svg.setAttribute("height", stageRect.height);
    els.svg.style.width = stageRect.width + "px";
    els.svg.style.height = stageRect.height + "px";
    return stageRect;
  }
  function drawSingleLine(key) {
    const el = [...els.bar2.children].find((c) => c.dataset.key === key);
    els.svg.innerHTML = "";
    if (!el || window.innerWidth < 560) return;
    const rect = el.getBoundingClientRect();
    const stageRect = svgSetup();
    const x1 = rect.left + rect.width / 2 - stageRect.left;
    const y1 = rect.bottom - stageRect.top;
    const box = els.callouts.querySelector(".callout-single");
    if (!box) return;
    const bRect = box.getBoundingClientRect();
    const x2 = bRect.left + 12 - stageRect.left;
    const y2 = bRect.top - stageRect.top;
    els.svg.appendChild(CFG.drawLine(x1, y1, x2, y2));
  }
  function drawInstLine() {
    if (els.rung2.hidden || !instPinned) return;
    drawSingleLine(instPinned);
  }

  // ---- navigation ----------------------------------------------------------
  function goHome() {
    // In a one-category view "home" is that category's sub-groups, not an
    // empty top bar -- same reasoning as resetSelection().
    const home = homeTopIndex();
    if (topIndex === home && subIndex === null) return;
    topIndex = home;
    subIndex = null;
    hover = null;
    commitRender();
  }

  function updateCrumbs() {
    els.crumbs.innerHTML = "";
    const t = currentTop();
    const s = currentSub();
    const parts = [{ text: "GERMANY", onClick: goHome }];
    if (t) parts.push({ text: t.label, onClick: () => { subIndex = null; hover = null; commitRender(); } });
    if (s) parts.push({ text: s.label, onClick: null });

    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      const span = document.createElement("span");
      span.textContent = part.text;
      if (!isLast) {
        span.className = "crumb-link";
        span.addEventListener("click", part.onClick);
      }
      els.crumbs.appendChild(span);
      if (!isLast) {
        const sep = document.createElement("span");
        sep.className = "crumb-sep";
        sep.textContent = " › ";
        els.crumbs.appendChild(sep);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
