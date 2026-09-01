/* CNT -- the landing page only. Loaded after cnt.js.
 *
 * One feature: the quick-start carousel, rotating a handful of famous crux
 * verses. Kept out of cnt.js so the reading pages do not carry code for an
 * element they never render, mirroring how landing.css is split from cnt.css.
 */
(function () {
  'use strict';

  var INTERVAL = 3000;

  var carousel = document.getElementById('quickstart');
  if (!carousel) { return; }

  var items = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-item'));
  if (items.length < 2) { return; }

  /* Rotation IS the feature, so reduced motion stops it outright rather than
     shortening it. The first verse stays put and every other stays reachable
     by tab, since they remain real links in the DOM. */
  var still = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dots = document.createElement('span');
  dots.className = 'carousel-dots';
  items.forEach(function (item, n) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show verse ' + (n + 1) + ' of ' + items.length);
    b.addEventListener('click', function () { go(n); halt(); });
    dots.appendChild(b);
  });
  carousel.parentNode.appendChild(dots);
  var dotList = Array.prototype.slice.call(dots.children);

  var current = 0;
  var timer = null;
  var stopped = false;

  function go(n) {
    items[current].classList.remove('is-active');
    items[current].classList.add('is-leaving');
    current = (n + items.length) % items.length;
    items[current].classList.remove('is-leaving');
    items[current].classList.add('is-active');
    dotList.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
  }

  function start() {
    if (still || stopped || timer) { return; }
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  /* Clicking a dot ends the rotation for good, rather than restarting the
     timer. The reader has just said "show me this one", and sliding it away
     three seconds later would take that back. It also gives the line a real
     stop control, which auto-updating content is supposed to have
     (WCAG 2.2.2) -- pausing on hover alone never helps a reader who is not
     holding a pointer over it. */
  function halt() { stopped = true; stop(); }

  dotList[0].classList.add('is-active');

  /* Pause while it is being read or reached for. Text that slides away
     mid-sentence is irritating, and a link that moves as the cursor arrives is
     worse -- and WCAG 2.2.2 wants auto-updating content pausable regardless. */
  var zone = carousel.parentNode;
  zone.addEventListener('mouseenter', stop);
  zone.addEventListener('mouseleave', start);
  zone.addEventListener('focusin', stop);
  zone.addEventListener('focusout', start);

  /* A background tab should not keep cycling; it wastes work and the reader
     returns to a verse that has moved on without them. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  start();
})();
