(function () {
  var root = document.documentElement, $ = function (id) { return document.getElementById(id); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Contour form: concentric faceted outlines, drawn in one staggered moment
  var svg = $('contour');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg', N = 15, K = 11,
        sh = [1, .82, .95, .7, 1.02, .78, .93, .74, 1, .85, .9];
    for (var i = 0; i < N; i++) {
      var f = 1 - (i / N) * .92, pts = [];
      for (var k = 0; k < K; k++) {
        var a = (k / K) * Math.PI * 2 - .4,
            r = 170 * f * (1 - (1 - sh[k]) * (1 - (i / N) * .6));
        pts.push((Math.cos(a) * r + i * 1.5).toFixed(1) + ',' + (Math.sin(a) * r * .92 - i).toFixed(1));
      }
      var p = document.createElementNS(NS, 'polygon');
      p.setAttribute('points', pts.join(' '));
      p.setAttribute('pathLength', '1');
      p.style.setProperty('--d', (i * 70) + 'ms');
      svg.appendChild(p);
    }
  }

  // Theme: Paper / Night
  $('theme').addEventListener('click', function () {
    var t = root.dataset.theme === 'night' ? 'paper' : 'night';
    root.dataset.theme = t;
    try { localStorage.setItem('analogi-theme', t); } catch (e) {}
  });

  // Overlay menu
  var ov = $('overlay'), openBtn = $('menuBtn'), closeBtn = $('closeBtn');
  function setMenu(open) {
    ov.classList.toggle('open', open);
    ov.setAttribute('aria-hidden', !open);
    openBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : openBtn).focus({ preventScroll: true });
  }
  openBtn.addEventListener('click', function () { setMenu(true); });
  closeBtn.addEventListener('click', function () { setMenu(false); });
  ov.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) setMenu(false); });

  // Reveal on scroll (once)
  var rv = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || reduce) { rv.forEach(function (n) { n.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    rv.forEach(function (n, i) { n.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(n); });
  }

  // Page number in the rail follows the section in view
  var no = $('pageno');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) no.textContent = e.target.dataset.n; });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('[data-n]').forEach(function (s) { so.observe(s); });
  }
})();
