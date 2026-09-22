---
title: "Size of German financial assets by sector"
date: 2026-09-13
tags: ["Germany", "banks", "insurers", "asset managers", "pensions"]
author: ["Corey Garriott"]
description: "An interactive, drill-down look at the size of the German financial system by sector, sourced from audited annual reports and official sector statistics."
summary: "Explore German banks, insurers, asset managers, and pension institutions by size -- click down from the whole system to a single company's own filing."
cover:
    image: "cover.png"
    alt: "Stylized drill-down bar chart of German banks, asset managers, insurers, and pension institutions, funneling into a breakdown of bank sub-groups."
    relative: true
editPost:
    URL: "../"
    Text: "Corey's artifacts"
showToc: false
disableAnchoredHeadings: false
---

<link rel="stylesheet" href="style.css">
<style>
.post-footer .post-tags { display: none; }
#gfa-app {
  --bg: var(--theme);
  --text: var(--primary);
  --heading: var(--primary);
  --muted: var(--secondary);
  --font-display: "Segoe UI", -apple-system, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --bar-track: var(--entry);
  --bar-radius: 14px;
  --bar-shadow: 0 16px 48px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05);
  --seg-label: #ffffff;
  --callout-bg: var(--entry);
  --callout-border: var(--border);
  /* The container has to sit ABOVE the page, not level with it. Mapping the
     track to var(--theme) made it exactly the page colour, so the bubble
     vanished and the tabs read as two free-floating words -- the same mistake
     the standalone page made with a near-black track on a near-black page.
     --entry is PaperMod's raised-surface colour and is what card backgrounds
     use, so it reads as a control in both light and dark. */
  --toggle-track: var(--entry);
  --toggle-border: var(--border);
  --toggle-text: var(--secondary);
  --toggle-active-bg: var(--primary);
  --toggle-active-text: var(--theme);
}
#gfa-app h1 { font-weight: 700; }
</style>

<div id="gfa-app">
  <div class="wrap">
    <div class="header-row">
      <div class="header-text">
        <h1 id="page-title">Click on a segment to explore</h1>
        <p class="subtitle" id="page-subtitle">What financial institutions hold on their own balance sheets.</p>
      </div>
      <div class="view-toggles">
        <div class="view-toggle" id="measure-toggle" role="tablist" aria-label="Measure"></div>
        <div class="view-toggle" id="basis-toggle" role="tablist" aria-label="Basis"></div>
      </div>
    </div>
    <div id="crumbs"></div>
    <div id="hierarchy">
      <div class="rung-slot" id="rung-0">
        <div class="bar-wrap"><div class="bar" id="bar-0"></div></div>
      </div>
      <div class="rung-slot" id="rung-1" hidden>
        <p class="ancestor-line" id="blurb-1"></p>
        <div class="bar-wrap"><div class="bar" id="bar-1"></div></div>
      </div>
      <div class="rung-slot" id="rung-2" hidden>
        <p class="ancestor-line" id="blurb-2"></p>
        <div class="bar-wrap">
          <div class="bar" id="bar-2"></div>
          <svg id="lines"></svg>
        </div>
        <div id="callouts"></div>
      </div>
    </div>
  </div>
</div>

<script>
  window.VIZ_CONFIG = {
    topOrder: "size",
    subOrder: "size",
    colorMode: "perLevel",
    // Each By-group category reuses its By-sector counterpart's hue, so
    // switching basis reads as the same data recut rather than a different
    // chart. topColor() falls back to 220 for anything unmapped.
    topHue: {
      banks: 210, insurers: 35, "pension-institutions": 265,
      // The under-management sector view is three ownership classes, not one
      // "Asset Managers" bar (DECISIONS.md Round 27). Each reuses the hue of
      // the sector that owns it, per the convention above.
      "bank-owned-am": 210, "insurer-owned-am": 35, "independent-am": 165,
      "monoline-banks": 210, "monoline-insurers": 35, "monoline-pensions": 265,
      conglomerates: 285,
      "monoline-banks-aum": 210, "monoline-insurers-aum": 35,
      "conglomerates-aum": 285, "independent-managers": 165,
    },
    levelHueSeed: [0, 195, 20],
    unobservedColor: "hsl(220 10% 22%)",

    drawLine(x1, y1, x2, y2) {
      const ns = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(ns, "path");
      const dy = (y2 - y1) * 0.6;
      path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "url(#gfa-gradline)");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("opacity", "0.85");
      return path;
    },
  };
</script>
<svg width="0" height="0" style="position:absolute">
  <defs>
    <linearGradient id="gfa-gradline" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7dd3fc" />
      <stop offset="1" stop-color="#c4b5fd" />
    </linearGradient>
  </defs>
</svg>
<script src="engine.js"></script>
