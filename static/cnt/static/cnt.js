/* CNT -- behaviour every page needs: the theme toggle and the site map.
 * Loaded by the landing page and the reading pages alike.
 *
 * The anti-flash stamp that pairs with this lives INLINE in each template's
 * <head>; it has to run before first paint, which an external file cannot
 * guarantee. See the templates' own comment.
 */
(function () {
  'use strict';

  var THEME_KEY = 'cnt-theme';
  var root = document.documentElement;

  function effectiveTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') { return explicit; }
    /* Dark is the site default, so the only system preference that changes the
       answer is an explicit light one. */
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
      ? 'light' : 'dark';
  }

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* A native <dialog>: focus trapping, Escape, page inertness and a ::backdrop
     all come for free, and each is something a hand-rolled overlay gets wrong. */
  var mapBtn = document.getElementById('sitemap-toggle');
  var map = document.getElementById('sitemap');
  if (mapBtn && map) {
    mapBtn.addEventListener('click', function () {
      if (typeof map.showModal === 'function') { map.showModal(); }
      else { map.setAttribute('open', ''); }
    });
    map.addEventListener('click', function (e) {
      /* Clicking the backdrop closes. The dialog's own box covers its rect, so
         a hit on the element itself means the click landed outside the panel. */
      if (e.target === map) { map.close(); }
    });
    var closeBtn = map.querySelector('.sitemap-close');
    if (closeBtn) { closeBtn.addEventListener('click', function () { map.close(); }); }
  }
})();
