/* CNT -- behaviour for the reading pages: verse, chapter, and any future
 * pericope page. Loaded after cnt.js, which owns the theme toggle and the
 * site map that every page shares.
 *
 * Four independent pieces, each in its own IIFE: arrow-key navigation, the
 * apparatus select sizing, the jumped-to-endnote outline, the reading-mode
 * toggle, and the sense tip.
 */
(function () {
  // Left/Right arrow keys mirror the nav-dock's prev/next buttons
  // (data-nav="prev"/"next" -- absent entirely when the button is
  // disabled, e.g. no prev at the first drafted verse of the first
  // drafted chapter, so the querySelector below just finds nothing and
  // silently no-ops). Identical to chapter.html.jinja's copy of this
  // handler, where the same two keys step chapter to chapter.
  //
  // THE UP BUTTON IS DELIBERATELY NOT BOUND TO A KEY. It was bound to
  // ArrowUp briefly, and that cost the reader vertical scrolling -- the
  // thing an arrow key is most expected to do on a page of text. The
  // horizontal arrows are free because the page never scrolls sideways;
  // the vertical ones are not, and stay with the browser.
  //
  // Skipped with any modifier held (so Cmd/Alt+Arrow browser-history
  // shortcuts and shift-selection still work normally) and skipped
  // whenever focus is on a form control -- most importantly the
  // Book/Chapter/Verse <select>s just above, where arrow keys are how
  // you move between options and must not also navigate the page.
  var NAV_KEYS = { ArrowLeft: 'prev', ArrowRight: 'next' };
  document.addEventListener('keydown', function (e) {
    var which = NAV_KEYS[e.key];
    if (!which) { return; }
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) { return; }
    var active = document.activeElement;
    if (active) {
      var tag = active.tagName;
      if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA' || active.isContentEditable) {
        return;
      }
    }
    var link = document.querySelector('[data-nav="' + which + '"]');
    if (link) {
      e.preventDefault();
      window.location.href = link.getAttribute('href');
    }
  });
})();

(function () {
  // A native <select>'s closed-state box sizes to its widest OPTION, not
  // its current value -- e.g. the book select would stay as wide as
  // "2 Thessalonians" even while showing "Matthew". Measured against a
  // hidden span mirroring the select's own computed font, so the box
  // instead tracks whichever option is actually selected right now.
  var measurer = document.createElement('span');
  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.whiteSpace = 'pre';
  document.body.appendChild(measurer);

  function resizeApparatusSelect(select) {
    var cs = getComputedStyle(select);
    measurer.style.fontFamily = cs.fontFamily;
    measurer.style.fontSize = cs.fontSize;
    measurer.style.fontWeight = cs.fontWeight;
    measurer.style.fontStyle = cs.fontStyle;
    measurer.style.letterSpacing = cs.letterSpacing;
    measurer.style.textTransform = cs.textTransform;
    var opt = select.options[select.selectedIndex];
    measurer.textContent = opt ? opt.textContent : '';
    var padding = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    select.style.width = (measurer.offsetWidth + padding + 2) + 'px';
  }

  function resizeAllApparatusSelects() {
    document.querySelectorAll('.apparatus-select').forEach(function (select) {
      resizeApparatusSelect(select);
    });
  }

  // TWO passes, and both are needed. The measurement reads the select's
  // COMPUTED font, so whatever font is actually in force when it runs is
  // what the width ends up fitting -- and the stylesheet requests Cardo
  // from Google Fonts with `display=swap`, which renders the fallback
  // (Times New Roman) first and swaps the real face in later. A single
  // pass at parse time therefore sizes every box to fallback metrics on a
  // cold load and never corrects itself; the boxes end up a few px off
  // for the rest of the session, and more than a few if a bigger font
  // change lands on them.
  //
  // So: size once immediately, because the alternative -- waiting -- is
  // worse (until the first pass runs, a <select> is as wide as its widest
  // option, which is the whole bug this code exists to fix, and the book
  // select would visibly jump in from "2 Thessalonians" width). Then size
  // again once the real faces have loaded. `document.fonts` is guarded
  // because the second pass is a correction, not a requirement.
  resizeAllApparatusSelects();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(resizeAllApparatusSelects);
  }

  document.querySelectorAll('.apparatus-select').forEach(function (select) {
    select.addEventListener('change', function () { resizeApparatusSelect(select); });
  });
})();

(function () {
  // Explicit JS-managed box (see .jumped in the stylesheet), not :target --
  // gives full, predictable control over exactly when it appears and
  // disappears, independent of any browser-specific :target/focus quirks.
  // Also self-clears after a hold + fade, rather than sitting there
  // until the reader clicks something else -- see the two timers below.
  var FADE_DELAY_MS = 1500;
  var FADE_DURATION_MS = 500; // must match .jumped's CSS transition time
  var fadeTimer = null;
  var removeTimer = null;

  function clearJumped() {
    if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
    if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
    document.querySelectorAll('.jumped').forEach(function (el) {
      el.classList.remove('jumped', 'jumped-fade');
    });
  }
  document.querySelectorAll('.flagword, .note-ref, .endnote-num, .endnote-word, .endnote-back').forEach(function (link) {
    link.addEventListener('click', function () {
      clearJumped();
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') { return; }
      var target = document.getElementById(href.slice(1));
      if (!target) { return; }
      target.classList.add('jumped');
      // Following an #id link makes the browser move keyboard focus onto
      // the target (per the HTML "scroll to the fragment" steps), which
      // paints its own separate a:focus-visible outline underneath ours,
      // identical in appearance -- invisible while .jumped is solid, but
      // exposed the instant .jumped fades, looking like the box "comes
      // back." Deferred one tick so it runs after that native focus step
      // (which happens right after this click handler, not during it).
      setTimeout(function () {
        if (document.activeElement === target) { target.blur(); }
      }, 0);
      fadeTimer = setTimeout(function () {
        target.classList.add('jumped-fade');
        removeTimer = setTimeout(function () {
          target.classList.remove('jumped', 'jumped-fade');
        }, FADE_DURATION_MS);
      }, FADE_DELAY_MS);
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.flagword, .note-ref, .endnote-num, .endnote-word, .endnote-back')) { return; }
    clearJumped();
  });
})();

(function () {
  var STORAGE_KEY = 'cnt-toggle-mode';
  var buttons = document.querySelectorAll('.toggle-dock button[data-mode]');
  // Only .flagword (the English translation's inline words) responds to the
  // toggle -- .greek-word (in the Greek block) always shows Greek, by design;
  // it's colored only to visually link it to its English counterpart.
  var words = document.querySelectorAll('.flagword');

  function applyMode(mode) {
    words.forEach(function (w) {
      var text = w.getAttribute('data-' + mode);
      if (text) { w.textContent = text; }
    });
    buttons.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { applyMode(b.getAttribute('data-mode')); });
  });

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved) { applyMode(saved); }

})();

/* Sense tip. One shared element, moved to whichever flagged word is hovered.
   It is created here rather than emitted per word so the reading-mode toggle,
   which rewrites flagged words via textContent, cannot destroy it. */
(function () {
  var words = document.querySelectorAll('[data-senses]');
  if (!words.length) { return; }

  var tip = document.createElement('div');
  tip.className = 'sense-tip';
  tip.hidden = true;
  tip.innerHTML = '<div class="sense-tip-head">'
    + '<span class="sense-tip-lemma"></span></div>'
    + '<div class="sense-tip-senses"></div>'
    + '<div class="sense-tip-credit">Berean &middot; KJV &middot; Koine</div>';
  document.body.appendChild(tip);

  var lemmaEl = tip.querySelector('.sense-tip-lemma');
  var sensesEl = tip.querySelector('.sense-tip-senses');
  var active = null;

  function hide() {
    active = null;
    tip.classList.remove('is-visible');
    tip.hidden = true;
  }

  function show(word) {
    var senses = word.getAttribute('data-senses');
    if (!senses) { return; }
    active = word;
    lemmaEl.textContent = word.getAttribute('data-greek') || '';
    sensesEl.textContent = senses;

    tip.hidden = false;
    /* Measure before placing: the width is content-dependent, and the tip has
       to know its own size to stay inside the window. */
    var box = word.getBoundingClientRect();
    var size = tip.getBoundingClientRect();
    var margin = 8;

    var left = window.scrollX + box.left + (box.width - size.width) / 2;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - size.width - margin;
    left = Math.max(window.scrollX + margin, Math.min(left, maxLeft));

    /* Above the word by default, so it never covers the line being read;
       below only when there is no room above. */
    var top = window.scrollY + box.top - size.height - margin;
    if (box.top - size.height - margin < 0) {
      top = window.scrollY + box.bottom + margin;
    }

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.classList.add('is-visible');
  }

  for (var i = 0; i < words.length; i++) {
    words[i].addEventListener('mouseenter', function (e) { show(e.currentTarget); });
    words[i].addEventListener('mouseleave', hide);
    /* Keyboard reaches these: they are already links to their endnote. */
    words[i].addEventListener('focus', function (e) { show(e.currentTarget); });
    words[i].addEventListener('blur', hide);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) { hide(); }
  });
  /* A tip positioned in page coordinates would drift away from its word on
     scroll, so it is dismissed instead of chased. */
  window.addEventListener('scroll', function () { if (active) { hide(); } }, true);
})();

/* Click a verse's text on a chapter page to open that verse's own page. The
   guard lets a flagged word and its endnote mark keep their own click target,
   which is the endnote, not this verse. Paired with the .vspan:hover rule in
   reading.css -- the underline is the only cue this is clickable, so the two
   must ship together. No-ops on a verse page, which emits no .vspan. */
(function () {
  document.querySelectorAll('.vspan').forEach(function (span) {
    span.addEventListener('click', function (e) {
      if (e.target.closest('.flagword, .note-ref')) { return; }
      var href = span.getAttribute('data-href');
      if (href) { window.location.href = href; }
    });
  });
})();
