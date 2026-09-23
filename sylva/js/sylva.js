/* Sylva Residences: motion and interaction
   Stack mirrors the ERA Residence build: Lenis smooth scroll driving GSAP ScrollTrigger,
   attribute-driven reveals (data-reveal), layered parallax (data-parallax), one horizontal
   scroll moment (location), a real slider for the gallery, and a theme-class day/night switch.
   Unlike the reference, prefers-reduced-motion is respected throughout. */
(function () {
  'use strict';

  var d = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (!window.gsap || !window.ScrollTrigger) {
    d.classList.add('reduced-motion');
    return;
  }

  var reduced = d.classList.contains('reduced-motion');
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var NAV_H = function () { return parseFloat(getComputedStyle(d).getPropertyValue('--nav-h')) || 76; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ------------------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------------------ */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToY(y) {
    if (lenis) lenis.scrollTo(y, { duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  function scrollToEl(el) {
    var y = el.getBoundingClientRect().top + window.scrollY;
    // pinned sections sit inside a pin spacer; aim at the spacer's top
    var spacer = el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : null;
    if (spacer) y = spacer.getBoundingClientRect().top + window.scrollY;
    scrollToY(Math.max(0, y));
  }

  /* ------------------------------------------------------------------
     Hero: a scroll-craft scrub act (vendor/scrollcraft.js drives the clip,
     the pin and the caption cues). What lives here is page-specific:
       1. desktop: the full panorama closes onto the frame, driven off --sc-p
       2. the datum line, riding the clip's rising edge (the signature move)
       3. reduced motion: the poster swaps stage by stage
     ------------------------------------------------------------------ */
  var hero = $('[data-hero]');
  var frame = $('[data-hero-frame]');
  var wide = $('[data-hero-wide]');
  var scrim = $('[data-hero-scrim]');
  var poster = $('[data-hero-poster]');
  var clip = $('video[data-sc-scrub]', hero);
  var datum = $('[data-datum]');
  var datumLevel = $('[data-datum-level]');

  // Mirrors scrollcraft/builds/sylva-hero/render_clip.py. Change both together.
  var HERO_CLIP = {
    span: 4,                 // data-sc-span; clip progress = p * (span - 1) / span inside the pin
    hold: 0.13,              // clip holds on the lot while the panorama closes
    rises: [
      { from: 0.22, to: 0.40, ground: 0.92, top: 0.13 },  // structure: frame-y of ground and topmost slab
      { from: 0.42, to: 0.60, ground: 0.92, top: 0.06 }   // residence: ground and roof
    ],
    feather: 0.18,
    storeys: 15              // the development application's storey count
  };
  var NARROW = { from: 0.05, to: 0.17 };  // in act progress p; ends inside the hold
  var LOT = { w: 2000, h: 848, focusX: 1000, focusY: 600, frame0X: 500 };

  var smoothstep = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  var heroP = function () { return parseFloat(hero.style.getPropertyValue('--sc-p')) || 0; };
  var isPhone = function () { return window.innerWidth <= 860; };

  var geo = null;
  function measureHero() {
    var st = hero.querySelector('[data-sc-stage]').getBoundingClientRect();
    var fr = frame.getBoundingClientRect();
    var vw = st.width, vh = st.height;
    var r = { x: fr.left - st.left, y: fr.top - st.top, w: fr.width, h: fr.height };
    var s0 = Math.max(vw / LOT.w, vh / LOT.h);
    var x0 = clamp(vw / 2 - LOT.focusX * s0, vw - LOT.w * s0, 0);
    var y0 = clamp(vh * 0.6 - LOT.focusY * s0, vh - LOT.h * s0, 0);
    var s1 = r.h / LOT.h;                       // clip frame 0 is the full-height lot
    geo = { vw: vw, vh: vh, r: r, s0: s0, x0: x0, y0: y0, s1: s1, x1: r.x - LOT.frame0X * s1, y1: r.y };
  }

  function drawWide(p) {
    // the intro's scrim leaves with the intro (cue "0 0.07 0"), before the frame closes
    scrim.style.opacity = (1 - smoothstep(p / 0.08)).toFixed(3);
    if (!geo || isPhone()) { wide.style.visibility = 'hidden'; return; }
    var k = smoothstep((p - NARROW.from) / (NARROW.to - NARROW.from));
    if (k >= 1) { wide.style.visibility = 'hidden'; return; }
    wide.style.visibility = 'visible';
    var s = geo.s0 + (geo.s1 - geo.s0) * k;
    var x = geo.x0 + (geo.x1 - geo.x0) * k;
    var y = geo.y0 + (geo.y1 - geo.y0) * k;
    wide.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(5) + ')';
    var r = geo.r;
    var t = r.y * k, rt = (geo.vw - r.x - r.w) * k, b = (geo.vh - r.y - r.h) * k, l = r.x * k;
    // clip-path is in the element's own (pre-transform) space, so convert screen px back
    var cx = function (v) { return (v - x) / s; }, cy = function (v) { return (v - y) / s; };
    wide.style.clipPath = 'polygon(' +
      cx(l) + 'px ' + cy(t) + 'px,' + cx(geo.vw - rt) + 'px ' + cy(t) + 'px,' +
      cx(geo.vw - rt) + 'px ' + cy(geo.vh - b) + 'px,' + cx(l) + 'px ' + cy(geo.vh - b) + 'px)';
  }

  var lastLevel = -1;
  function drawDatum() {
    // Only once a real decoded frame is up: the line must sit on the actual wipe
    if (!clip || reduced || !clip.classList.contains('sc-has-clip') || !clip.duration) { datum.style.opacity = 0; return; }
    var u = clip.currentTime / clip.duration;
    var F = HERO_CLIP.feather, on = null;
    for (var i = 0; i < HERO_CLIP.rises.length; i++) {
      var R = HERO_CLIP.rises[i];
      if (u > R.from && u < R.to) { on = R; break; }
    }
    if (!on) { datum.style.opacity = 0; return; }
    var r = -F + (1 + F) * smoothstep((u - on.from) / (on.to - on.from));
    var edge = 1 - (r + F * 0.5);                  // frame-y (0 top) of the feather's midline
    var fh = frame.clientHeight;
    var fade = Math.min(1, (u - on.from) / 0.02, (on.to - u) / 0.02);
    datum.style.opacity = clamp(fade, 0, 1) * (edge < 0.02 ? 0 : 1);
    datum.style.transform = 'translate3d(0,' + (clamp(edge, 0, 1) * fh).toFixed(1) + 'px,0)';
    var level = Math.round(1 + (HERO_CLIP.storeys - 1) * clamp((on.ground - edge) / (on.ground - on.top), 0, 1));
    if (level !== lastLevel) { lastLevel = level; datumLevel.textContent = pad2(level); }
  }

  var reducedStage = -1;
  var STAGE_SRC = ['', 'img/stage-02-structure.webp', 'img/stage-03-residence.webp'];
  function drawReduced(p) {
    var i = p < 0.3 ? 0 : p < 0.55 ? 1 : 2;
    if (i === reducedStage) return;
    reducedStage = i;
    var src = i === 0 ? (isPhone() ? 'media/hero-poster-m.webp' : 'media/hero-poster.webp') : STAGE_SRC[i];
    var source = poster.parentElement.querySelector('source');
    if (source) source.srcset = src;
    poster.src = src;
  }

  function initHero() {
    measureHero();
    window.addEventListener('resize', function () { measureHero(); drawWide(heroP()); });
    if (reduced) {
      window.addEventListener('scroll', function () { drawReduced(heroP()); }, { passive: true });
      drawReduced(0);
      return;
    }
    gsap.ticker.add(function () {
      var p = heroP();
      drawWide(p);
      drawDatum();
    });
    drawWide(0);
  }

  /* ------------------------------------------------------------------
     Reveals: data-reveal="h | p | line | ctn"
     Headlines scrub slowly with scroll; body copy reveals faster, line by line.
     ------------------------------------------------------------------ */
  function initReveals() {
    if (reduced) return;
    var canSplit = !!window.SplitText;

    $$('[data-reveal="h"]').forEach(function (el) {
      if (!canSplit) return gsap.from(el, { autoAlpha: 0, y: 30, scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } });
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, {
            yPercent: 108, ease: 'none', stagger: 0.14,
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 58%', scrub: 1 }
          });
        }
      });
    });

    $$('[data-reveal="p"]').forEach(function (el) {
      if (!canSplit) return gsap.from(el, { autoAlpha: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, {
            yPercent: 100, duration: 0.9, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
        }
      });
    });

    $$('[data-reveal="line"]').forEach(function (el) {
      gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 78%', scrub: 1 } });
    });

    $$('[data-reveal="ctn"]').forEach(function (el) {
      gsap.fromTo(el, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 66%', scrub: 1 } });
    });
  }

  /* ------------------------------------------------------------------
     Parallax: data-parallax="img-in | img-out | ctn-up | ctn-down"
     ------------------------------------------------------------------ */
  function initParallax() {
    if (reduced) return;
    $$('[data-parallax]').forEach(function (el) {
      var type = el.getAttribute('data-parallax');
      var st = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };
      var img = $('img', el);
      if (type === 'img-in' && img) gsap.fromTo(img, { scale: 1.22, yPercent: -4 }, { scale: 1.1, yPercent: 4, ease: 'none', scrollTrigger: st });
      else if (type === 'img-out' && img) gsap.fromTo(img, { scale: 1.1, yPercent: -4 }, { scale: 1.22, yPercent: 4, ease: 'none', scrollTrigger: st });
      else if (type === 'ctn-up') gsap.fromTo(el, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: st });
      else if (type === 'ctn-down') gsap.fromTo(el, { y: -60 }, { y: 60, ease: 'none', scrollTrigger: st });
    });
  }

  /* ------------------------------------------------------------------
     Recurring motif: the river line, drawn differently in each section
     ------------------------------------------------------------------ */
  function prepPaths(svg) {
    var paths = $$('path', svg);
    paths.forEach(function (p) {
      p.setAttribute('pathLength', '1');
      p.style.strokeDasharray = '1';
      p.style.strokeDashoffset = reduced ? '0' : '1';
    });
    return paths;
  }

  function initMotifs() {
    $$('[data-motif]').forEach(function (svg) {
      var kind = svg.getAttribute('data-motif');
      var paths = prepPaths(svg);
      if (reduced) return;
      var section = svg.closest('section');
      if (kind === 'river') {
        gsap.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 70%', scrub: 1 } });
      } else if (kind === 'fins') {
        gsap.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: { each: 0.1, from: 'random' }, scrollTrigger: { trigger: svg, start: 'top 92%', end: 'top 55%', scrub: 1 } });
      } else if (kind === 'ripple') {
        gsap.to(paths.slice().reverse(), { strokeDashoffset: 0, ease: 'none', stagger: 0.2, scrollTrigger: { trigger: section, start: 'top 75%', end: 'center 50%', scrub: 1 } });
      }
    });
  }

  /* ------------------------------------------------------------------
     Location: the single horizontal scroll moment (desktop only)
     ------------------------------------------------------------------ */
  function initLocation() {
    var pin = $('[data-location-pin]');
    var track = $('[data-location-track]');
    var line = $('[data-location-line]');
    var stops = $$('.stop', track);
    var list = $('.location__stops', track);
    var linePaths = prepPaths(line);

    if (reduced) {
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('aria-label', 'Places near Sylva, scroll sideways');
      pin.style.overflowX = 'auto';
      list.style.setProperty('--walk', 1);
      return;
    }

    var mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', function () {
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin, start: 'top top',
          end: function () { return '+=' + dist(); },
          pin: true, scrub: 1, invalidateOnRefresh: true
        }
      });
      tl.to(track, { x: function () { return -dist(); } }, 0)
        .fromTo(linePaths, { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0);

      stops.forEach(function (stop) {
        gsap.fromTo(stop, { autoAlpha: 0.15, y: 24 }, {
          autoAlpha: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: stop, containerAnimation: tl, start: 'left 92%', end: 'left 62%', scrub: true }
        });
      });
    });
    mm.add('(max-width: 860px)', function () {
      gsap.fromTo(list, { '--walk': 0 }, { '--walk': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 65%', scrub: true } });
      stops.forEach(function (stop) {
        gsap.fromTo(stop, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: stop, start: 'top 92%', end: 'top 70%', scrub: 1 } });
      });
    });
  }

  /* ------------------------------------------------------------------
     Gallery slider: pagination, progress, counter, drag, keyboard
     ------------------------------------------------------------------ */
  function initSlider(root) {
    var viewport = $('[data-slider-viewport]', root);
    var track = $('[data-slider-track]', root);
    var slides = $$('.slider__slide', track);
    var n = slides.length;
    var cur = $('[data-slider-current]', root);
    var tot = $('[data-slider-total]', root);
    var bar = $('[data-slider-progress]', root);
    var dotsBox = $('[data-slider-dots]', root);
    var prev = $('[data-slider-prev]', root);
    var next = $('[data-slider-next]', root);
    var i = 0, x = 0;
    tot.textContent = pad2(n);

    var dots = slides.map(function (_, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show image ' + (k + 1) + ' of ' + n);
      b.addEventListener('click', function () { go(k); });
      dotsBox.appendChild(b);
      return b;
    });

    function targetX(k) { return -(slides[k].offsetLeft - slides[0].offsetLeft); }

    function go(k, instant) {
      i = clamp(k, 0, n - 1);
      x = targetX(i);
      gsap.to(track, { x: x, duration: instant || reduced ? 0 : 1.2, ease: 'expo.out', overwrite: true });
      slides.forEach(function (s, j) { s.classList.toggle('is-current', j === i); });
      dots.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
      cur.textContent = pad2(i + 1);
      bar.style.transform = 'scaleX(' + (i + 1) / n + ')';
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
    }

    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i + 1); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
    });

    // Drag / swipe
    var startX = 0, startY = 0, dx = 0, dragging = false, locked = null;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; locked = null; dx = 0;
      startX = e.clientX; startY = e.clientY;
      gsap.killTweensOf(track);
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var mx = e.clientX - startX, my = e.clientY - startY;
      if (locked === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) {
        locked = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
        if (locked === 'x') viewport.classList.add('is-dragging');
      }
      if (locked !== 'x') return;
      dx = mx;
      var edge = (i === 0 && dx > 0) || (i === n - 1 && dx < 0) ? 0.35 : 1;
      gsap.set(track, { x: x + dx * edge });
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      if (locked === 'x') {
        if (dx < -60) go(i + 1); else if (dx > 60) go(i - 1); else go(i);
      }
    }
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    window.addEventListener('resize', function () { go(i, true); });
    go(0, true);
  }

  /* ------------------------------------------------------------------
     Nav: solid after the hero, hides on scroll down, shows on scroll up
     ------------------------------------------------------------------ */
  function initNav() {
    var nav = $('[data-nav]');
    var links = $$('.nav__links a');
    var menuBtn = $('[data-menu-toggle]');
    var menu = $('[data-menu]');
    var menuOpen = false;

    ScrollTrigger.create({
      trigger: '#residence', start: function () { return 'top ' + NAV_H(); },
      onEnter: function () { nav.classList.add('is-solid'); },
      onLeaveBack: function () { nav.classList.remove('is-solid'); nav.classList.remove('is-hidden'); }
    });

    var lastDir = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        if (menuOpen || nav.contains(document.activeElement)) return;
        if (!nav.classList.contains('is-solid')) return;
        if (self.direction !== lastDir) {
          lastDir = self.direction;
          nav.classList.toggle('is-hidden', self.direction === 1);
        }
      }
    });
    nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });

    links.forEach(function (a) {
      var target = $(a.getAttribute('href'));
      if (!target) return;
      ScrollTrigger.create({
        trigger: target.closest('.pin-spacer') || target, start: 'top 50%', end: 'bottom 50%',
        onToggle: function (self) { if (self.isActive) links.forEach(function (l) { l.setAttribute('aria-current', l === a ? 'true' : 'false'); }); }
      });
    });

    function setMenu(open) {
      menuOpen = open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        menu.hidden = false;
        nav.classList.remove('is-hidden');
        if (lenis) lenis.stop();
        d.style.overflow = 'hidden';
        if (!reduced) gsap.fromTo($$('a', menu), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' });
        var first = $('a', menu); if (first) first.focus();
      } else {
        menu.hidden = true;
        if (lenis) lenis.start();
        d.style.overflow = '';
      }
    }
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
    });

    // In-page anchors go through the smooth scroller
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      if (id === '#top') scrollToY(0); else scrollToEl(target);
      history.replaceState(null, '', id);
      // move focus for keyboard and screen reader users without a second jump
      if (target.tabIndex < 0) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------------
     Day / night: a real theme class, cascaded through the page tokens
     ------------------------------------------------------------------ */
  function initTheme() {
    var btn = $('[data-theme-toggle]');
    var label = $('[data-theme-label]');
    var meta = $('meta[name="theme-color"]');

    function apply(t, persist) {
      d.setAttribute('data-theme', t);
      var night = t === 'night';
      btn.setAttribute('aria-pressed', night ? 'true' : 'false');
      btn.setAttribute('aria-label', night ? 'Switch to day theme' : 'Switch to night theme');
      label.textContent = night ? 'Night' : 'Day';
      if (meta) meta.setAttribute('content', night ? '#182018' : '#F8F8F6');
      // Swap photography where a night render exists (data-src-night). None supplied yet.
      $$('[data-src-night]').forEach(function (img) {
        img.src = night ? img.getAttribute('data-src-night') : img.getAttribute('data-src-day');
      });
      if (persist) { try { localStorage.setItem('sylva-theme', t); } catch (e) {} }
    }
    apply(d.getAttribute('data-theme') === 'night' ? 'night' : 'day', false);
    btn.addEventListener('click', function () {
      apply(d.getAttribute('data-theme') === 'night' ? 'day' : 'night', true);
    });
  }

  /* ------------------------------------------------------------------
     Register form: validation, loading, success and error states
     ------------------------------------------------------------------ */
  function initForm() {
    var form = $('[data-form]');
    if (!form) return;
    var status = $('[data-form-status]', form);
    var attempted = false;

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
      phone: function (v) {
        if (!v.trim()) return '';
        var digits = v.replace(/\D/g, '');
        return /^[+\d\s()-]+$/.test(v.trim()) && digits.length >= 8 && digits.length <= 15 ? '' : 'Please check this number, or leave it blank.';
      },
      consent: function (_, el) { return el.checked ? '' : 'Please confirm we can contact you.'; }
    };

    function check(name) {
      var el = form.elements[name];
      var msg = rules[name](el.value || '', el);
      var field = el.closest('.field');
      var err = $('[data-error-for="' + name + '"]', form);
      field.classList.toggle('is-invalid', !!msg);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      err.textContent = msg;
      return !msg;
    }

    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', function () { if (attempted) check(name); });
      el.addEventListener('input', function () { if (attempted) check(name); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      attempted = true;
      var ok = Object.keys(rules).map(check).every(Boolean);
      status.className = 'form__status';
      if (!ok) {
        status.textContent = 'A few details need another look.';
        status.classList.add('is-error');
        var bad = $('[aria-invalid="true"]', form);
        if (bad) bad.focus();
        return;
      }
      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        bedrooms: (form.querySelector('input[name="bedrooms"]:checked') || {}).value || 'unsure',
        project: 'Sylva Residences, 22-24 Sylvan Road, Toowong'
      };
      var first = data.name.split(/\s+/)[0];
      var endpoint = form.getAttribute('data-endpoint');

      function done(note) {
        form.classList.remove('is-loading');
        form.classList.add('is-done');
        status.classList.add('is-success');
        status.innerHTML = '';
        status.appendChild(document.createTextNode('Thank you, ' + first + '. You are on the list.'));
        var small = document.createElement('small');
        small.textContent = note;
        status.appendChild(small);
        status.setAttribute('tabindex', '-1');
        status.focus();
      }

      if (!endpoint) {
        // Proof-of-concept build: no sales inbox is connected, so say so plainly.
        done('Preview build: this form is not connected to a sales inbox yet, so your details were not sent anywhere.');
        return;
      }

      form.classList.add('is-loading');
      status.textContent = 'Sending your details.';
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          done('We will be in touch as floor plans and pricing are released.');
        })
        .catch(function () {
          form.classList.remove('is-loading');
          status.textContent = 'Something went wrong sending your details. Please try again in a moment.';
          status.classList.add('is-error');
        });
    });
  }

  /* ------------------------------------------------------------------
     Preloader: wordmark reveal tied to actual hero image loading
     ------------------------------------------------------------------ */
  function runPreloader() {
    var pre = $('.preloader');
    return new Promise(function (resolve) {
      if (reduced || !pre) { if (pre) pre.remove(); resolve(); return; }

      var countEl = $('[data-count]', pre);
      var bar = $('.preloader__bar span', pre);
      var letters = $$('.preloader__word span', pre);
      var mark = $('.preloader__mark', pre);
      var items = [isPhone() ? poster : wide];
      var total = items.length + 1, loaded = 0, shown = 0, finished = false;

      if (lenis) lenis.stop();
      d.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      gsap.from(letters, { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'power3.out', delay: 0.1 });
      gsap.from(mark, { autoAlpha: 0, y: 12, duration: 1, ease: 'power2.out' });

      function tick() { loaded = Math.min(total, loaded + 1); }
      items.forEach(function (img) {
        if (img.complete && img.naturalWidth) tick();
        else { img.addEventListener('load', tick, { once: true }); img.addEventListener('error', tick, { once: true }); }
      });
      Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(function (r) { setTimeout(r, 2500); })]).then(tick);
      var hardStop = setTimeout(function () { loaded = total; }, 7000);

      function frameTick() {
        var target = loaded / total;
        shown += (target - shown) * 0.08;
        if (target === 1 && shown > 0.995) shown = 1;
        countEl.textContent = Math.round(shown * 100);
        bar.style.transform = 'scaleX(' + shown + ')';
        if (shown === 1 && !finished) {
          finished = true;
          clearTimeout(hardStop);
          gsap.ticker.remove(frameTick);
          exit();
        }
      }
      gsap.ticker.add(frameTick);

      function exit() {
        gsap.timeline({
          onComplete: function () {
            pre.remove();
            d.style.overflow = '';
            if (lenis) lenis.start();
            resolve();
          }
        })
          .to(letters, { yPercent: -110, duration: 0.7, stagger: 0.04, ease: 'power3.in' }, 0.15)
          .to([mark, $('.preloader__meta', pre), $('.preloader__bar', pre)], { autoAlpha: 0, duration: 0.5 }, 0.15)
          .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 0.6)
          .from('.hero__intro > *', { y: 30, duration: 1, stagger: 0.1, ease: 'power3.out' }, 1.1);
      }
    });
  }

  /* ------------------------------------------------------------------
     Boot. Pinned sections are created first, top to bottom, so every
     later trigger measures against the right pin spacing.
     ------------------------------------------------------------------ */
  initTheme();
  if (reduced) {
    // No panorama and no intro under reduced motion, so the first caption greets instead
    var firstCap = $('.hero__cap');
    if (firstCap) firstCap.setAttribute('data-sc-cue', '0 0.34 0');
  }
  if (window.ScrollCraft) ScrollCraft.mount(document.body);
  initHero();
  initLocation();
  initReveals();
  initParallax();
  initMotifs();
  $$('[data-slider]').forEach(initSlider);
  initNav();
  initForm();

  var refreshTimer;
  function queueRefresh() { clearTimeout(refreshTimer); refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 150); }
  if (document.fonts) {
    document.fonts.ready.then(queueRefresh);
    document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', queueRefresh);
  }
  window.addEventListener('load', queueRefresh);

  runPreloader().then(function () {
    ScrollTrigger.refresh();
    if (location.hash && location.hash.length > 1) {
      var t = $(location.hash);
      if (t) setTimeout(function () { scrollToEl(t); }, 60);
    }
  });
})();
