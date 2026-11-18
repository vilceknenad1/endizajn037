/* EN-DIZAJN — home page behaviour (port of the canvas logic, no dependencies) */
(function () {
  'use strict';
  var root = document.querySelector('[data-root]'); if (!root) return;
  var win = window, doc = document;
  var mq = function (q) { try { return win.matchMedia(q); } catch (e) { return { matches: false }; } };
  var rm = mq('(prefers-reduced-motion: reduce)');
  var hdr = root.querySelector('[data-hdr]'), burger = root.querySelector('[data-burger]'), panel = root.querySelector('[data-panel]');
  var cur = root.querySelector('[data-cur]'), banner = root.querySelector('[data-banner]');

  /* Sequence A: hero load, gated on first image decoded + fonts, capped at 1200ms; skipped on repeat views */
  var skip = false;
  try { skip = sessionStorage.getItem('en-hero') === '1'; sessionStorage.setItem('en-hero', '1'); } catch (e) {}
  root.classList.add('js');
  if (skip) root.classList.add('is-skip'); else root.classList.add('jsh');
  var heroImg = root.querySelector('.hero2 img');
  var dec = heroImg && heroImg.decode ? heroImg.decode().catch(function () {}) : Promise.resolve();
  var fonts = doc.fonts && doc.fonts.ready ? doc.fonts.ready.catch(function () {}) : Promise.resolve();
  var done = false;
  function go() { if (done) return; done = true; requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); }); }
  Promise.all([dec, fonts]).then(go); setTimeout(go, 1200);

  /* Sequence B: reveal groups fire once at their trigger offset (92% on narrow screens) */
  var groups = Array.prototype.slice.call(root.querySelectorAll('[data-off]'));
  var narrow = root.clientWidth <= 991;
  if (!('IntersectionObserver' in win)) groups.forEach(function (g) { g.classList.add('is-in'); });
  else {
    groups.forEach(function (g) {
      var off = narrow ? 92 : (Number(g.getAttribute('data-off')) || 85);
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -' + (100 - off) + '% 0px' });
      io.observe(g);
    });
    if (mq('(hover: none)').matches) {
      var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-active', e.isIntersecting); }); }, { rootMargin: '-30% 0px -30% 0px' });
      root.querySelectorAll('.card').forEach(function (c) { cio.observe(c); });
    }
  }

  /* M16 header hide/show + theme over dark sections, M19 banner parallax */
  var lastY = win.scrollY || 0, menuOpen = false, ticking = false;
  var darks = root.querySelectorAll('[data-theme="dark"]');
  var parallaxOK = !narrow && !rm.matches && mq('(pointer: fine)').matches && !mq('(prefers-reduced-data: reduce)').matches;
  function onScroll() {
    ticking = false;
    var y = win.scrollY || 0, d = y - lastY;
    var hidden = hdr.classList.contains('is-hidden');
    if (Math.abs(d) > 4) { hidden = d > 0 && y > 80; lastY = y; }
    if (y < 80 || menuOpen || rm.matches || hdr.contains(doc.activeElement)) hidden = false;
    hdr.classList.toggle('is-hidden', hidden);
    hdr.classList.toggle('is-scrolled', y > 80);
    var onDark = false;
    for (var i = 0; i < darks.length; i++) { var r = darks[i].getBoundingClientRect(); if (r.top <= 42 && r.bottom > 42) { onDark = true; break; } }
    hdr.classList.toggle('on-dark', onDark && !menuOpen);
    groups.forEach(function (g) { if (!g.classList.contains('is-in') && g.getBoundingClientRect().bottom < 0) g.classList.add('is-in'); });
    if (parallaxOK && banner) {
      var sec = banner.parentNode.getBoundingClientRect(), vh = win.innerHeight;
      if (sec.bottom > 0 && sec.top < vh) { var p = (vh - sec.top) / (vh + sec.height); banner.style.transform = 'translate3d(0,' + (-8 + 16 * p).toFixed(2) + '%,0)'; }
    }
  }
  win.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  hdr.addEventListener('focusin', function () { hdr.classList.remove('is-hidden'); });
  onScroll();

  /* M21 mobile menu: aria-expanded, focus trap, Esc, scroll lock */
  function setMenu(open) {
    menuOpen = open;
    panel.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.body.style.overflow = open ? 'hidden' : '';
    hdr.classList.remove('is-hidden'); onScroll();
    if (open) setTimeout(function () { var f = panel.querySelector('a'); if (f) f.focus(); }, 60); else burger.focus();
  }
  if (burger && panel) {
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    panel.querySelectorAll('[data-close]').forEach(function (a) { a.addEventListener('click', function () { if (menuOpen) setMenu(false); }); });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
      if (e.key === 'Tab') {
        var f = panel.querySelectorAll('a'), first = f[0], last = f[f.length - 1], a = doc.activeElement;
        if ((e.shiftKey && a === first) || (!e.shiftKey && a === last)) { e.preventDefault(); burger.focus(); }
      }
    });
  }

  /* M13 keyboard: arrow keys move between Instagram tiles */
  var strip = root.querySelector('[data-strip]');
  if (strip) strip.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var tiles = Array.prototype.slice.call(strip.querySelectorAll('.tl')), i = tiles.indexOf(doc.activeElement); if (i < 0) return;
    e.preventDefault(); tiles[(i + (e.key === 'ArrowRight' ? 1 : tiles.length - 1)) % tiles.length].focus();
  });

  /* Newsletter (stub) */
  var form = root.querySelector('[data-news]');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = root.querySelector('#nl-status'), email = form.querySelector('[name="email"]').value.trim();
    var consent = root.querySelector('[name="consent"]').checked;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { st.className = 'nstatus err'; st.textContent = 'Unesite ispravnu email adresu.'; return; }
    if (!consent) { st.className = 'nstatus err'; st.textContent = 'Potrebna je vaša saglasnost sa politikom privatnosti.'; return; }
    /* TODO: [[PLACEHOLDER: newsletter servis]] — send to the provider here */
    st.className = 'nstatus ok'; st.textContent = 'Hvala! Prijava je primljena.'; form.reset();
  });

  /* M22 cursor follower (fine pointer only, not with reduced motion) */
  if (cur && mq('(pointer: fine)').matches && !rm.matches) {
    root.classList.add('has-cur');
    var x = -100, y = -100, cx = -100, cy = -100, raf;
    doc.addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    doc.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-cursor],input,textarea,select') : null;
      var big = false, off = false;
      if (t) { if (t.matches('input,textarea,select')) off = true; else { big = true; cur.firstElementChild.textContent = t.getAttribute('data-cursor') || 'Pogledaj'; } }
      cur.classList.toggle('is-big', big); cur.classList.toggle('is-off', off);
    });
    (function loop() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)'; raf = requestAnimationFrame(loop); })();
    if (rm.addEventListener) rm.addEventListener('change', function () { if (rm.matches) { cancelAnimationFrame(raf); root.classList.remove('has-cur'); } });
  }
})();
