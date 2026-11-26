/* MS Barbero — interactions & motion design */
(() => {
  'use strict';
  const C = window.MS_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const extIcon = '<svg aria-hidden="true"><use href="#i-ext"/></svg>';

  /* =========================================================
     1. CONFIG → PAGE (rien n'est affiché si le champ est vide)
     ========================================================= */
  const booking = C.bookingUrl || 'https://msbarbero.easyweek.be/';
  $$('.js-book').forEach((a) => { a.href = booking; a.target = '_blank'; a.rel = 'noopener'; });
  $$('.js-insta').forEach((a) => {
    if (C.instagram) a.href = C.instagram;
    else { const box = a.closest('li, p'); if (box) box.hidden = true; }
  });
  $$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const ad = C.address || {};
  const cityLine = [ad.postalCode, ad.city].filter(Boolean).join(' ');
  if (ad.street || cityLine) {
    $('[data-field="address"]').hidden = false;
    $('.js-address').innerHTML = [ad.street, cityLine].filter(Boolean).map(esc).join('<br>');
    if (C.mapsUrl) { $('.js-maps').href = C.mapsUrl; $('.js-maps-wrap').hidden = false; }
  }
  if (ad.city) { const c = $('.js-city'); c.textContent = ad.city; c.hidden = false; }

  if (Array.isArray(C.hours) && C.hours.length) {
    $('[data-field="hours"]').hidden = false;
    $('.js-hours').innerHTML = C.hours.map((h) => `<li><span>${esc(h.days || '')}</span><span>${esc(h.time || '')}</span></li>`).join('');
  }

  const toTel = (p) => { let d = String(p).replace(/[^\d+]/g, ''); if (d.startsWith('0')) d = '+32' + d.slice(1); return d; };
  const contact = [];
  if (C.phone) contact.push(`<a class="lnk" href="tel:${esc(toTel(C.phone))}">${esc(C.phone)}</a>`);
  if (C.whatsapp) contact.push(`<a class="lnk" href="https://wa.me/${esc(String(C.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp ${extIcon}</a>`);
  if (contact.length) { $('[data-field="contact"]').hidden = false; $('.js-contact').innerHTML = contact.join('<br>'); }

  const socials = $('.js-socials');
  [['TikTok', C.tiktok], ['Facebook', C.facebook]].forEach(([label, url]) => {
    if (url) socials.insertAdjacentHTML('beforeend', `<br><a class="lnk" href="${esc(url)}" target="_blank" rel="noopener">${label} ${extIcon}</a>`);
  });

  const prices = C.prices || {};
  $$('.svc').forEach((li) => {
    const amount = $('.amount', li);
    const price = prices[li.dataset.svc];
    amount.innerHTML = price ? esc(price) : '<span class="price-label">Réserver</span>';
  });

  const L = C.legal || {};
  if (L.company && L.bce) {
    $('.js-legal-li').hidden = false;
    const rows = [['Éditeur', L.company], ['N° d\'entreprise (BCE)', L.bce], ['TVA', L.vat], ['Siège', L.address || [ad.street, cityLine].filter(Boolean).join(', ')], ['Contact', L.email]];
    $('.js-legal').innerHTML = rows.filter((r) => r[1]).map((r) => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('');
    const dlg = $('#legal');
    $('.js-legal-open').addEventListener('click', () => (dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '')));
  }

  // Données structurées pour Google (fiche locale)
  try {
    const abs = (p) => new URL(p, location.href).href;
    const ld = {
      '@context': 'https://schema.org', '@type': 'HairSalon', name: C.name || 'MS Barbero',
      url: location.origin + location.pathname, image: abs('assets/img/facade.jpg'), logo: abs('assets/favicon.svg'),
      sameAs: [C.instagram, C.tiktok, C.facebook].filter(Boolean),
      potentialAction: { '@type': 'ReserveAction', target: booking }
    };
    if (ad.street || ad.city) ld.address = { '@type': 'PostalAddress', streetAddress: ad.street || undefined, postalCode: ad.postalCode || undefined, addressLocality: ad.city || undefined, addressCountry: ad.country || 'BE' };
    if (C.phone) ld.telephone = toTel(C.phone);
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  } catch (e) { /* non bloquant */ }

  /* =========================================================
     2. UI : menu, nav, bouton flottant, curseur
     ========================================================= */
  const body = document.body;
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  const fab = $('#fab');
  let lenis = null;

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
    else body.style.overflow = open ? 'hidden' : '';
    updateFab();
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900 && body.classList.contains('menu-open')) setMenu(false); });

  let lastY = window.scrollY;
  let bookInView = false;
  function updateFab() {
    const y = window.scrollY;
    const on = y > window.innerHeight * 0.85 && !bookInView && !body.classList.contains('menu-open');
    fab.classList.toggle('is-on', on);
  }
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > window.innerHeight * 0.8);
    if (!body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > 240 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
    updateFab();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { bookInView = entries[0].isIntersecting; updateFab(); }, { threshold: 0.12 }).observe($('#infos'));
  }
  onScroll();

  // Curseur anneau (souris uniquement)
  if (fine && !reduce) {
    const cur = $('#cursor');
    let mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    document.addEventListener('mouseover', (e) => { cur.classList.toggle('is-big', !!e.target.closest('[data-cursor]')); });
    (function loop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();
  }

  /* =========================================================
     3. MOTION (GSAP + ScrollTrigger + Lenis)
     ========================================================= */
  const loader = $('#loader');
  const killLoader = () => { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); };

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    killLoader();
    return; // tout reste visible, sans animation
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#main') return;
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
      else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    });
  });

  /* ---- 3a. Loader : le slash du logo coupe l'écran en deux ---- */
  const heroLines = $$('[data-line]');
  const heroBits = $$('[data-hero]');
  const heroMedia = $('#heroMedia');
  let seen = false;
  try { seen = sessionStorage.getItem('ms-seen') === '1'; sessionStorage.setItem('ms-seen', '1'); } catch (e) { /* stockage indisponible */ }

  gsap.set(heroLines, { yPercent: 115 });
  gsap.set(heroBits, { autoAlpha: 0, y: 26 });
  gsap.set(nav, { yPercent: -130 });
  gsap.set(heroMedia, { scale: 1.24 });
  if (lenis) lenis.stop();

  const intro = gsap.timeline({
    onComplete() {
      killLoader();
      gsap.set([nav, ...heroBits], { clearProps: 'transform,opacity,visibility' });
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
    }
  });

  if (loader) {
    const W = window.innerWidth, H = window.innerHeight;
    const cut = $('.loader-cut', loader);
    const len = Math.hypot(0.28 * W, H);
    const ang = Math.atan2(-H, 0.28 * W) * 180 / Math.PI;
    gsap.set(cut, { x: 0.36 * W, y: H, width: len, rotation: ang, scaleX: 0 });

    let cutAt = 0.15;
    if (!seen) {
      const mark = $('.loader-mark path', loader);
      const total = mark.getTotalLength();
      const count = $('.loader-count span', loader);
      const n = { v: 0 };
      gsap.set(mark, { strokeDasharray: total, strokeDashoffset: total, fillOpacity: 0 });
      intro
        .to(mark, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.1)
        .to(mark, { fillOpacity: 1, strokeOpacity: 0, duration: 0.5, ease: 'power1.out' }, 1.25)
        .to(n, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0'); } }, 0)
        .to(['.loader-mark', '.loader-count', '.loader-note'], { autoAlpha: 0, y: -22, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, 1.9);
      cutAt = 2.1;
    } else {
      gsap.set(['.loader-mark', '.loader-count', '.loader-note'], { autoAlpha: 0 });
    }
    intro
      .to(cut, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, cutAt)
      .addLabel('split', cutAt + 0.5)
      .to('.loader-panel.a', { xPercent: -78, yPercent: -14, duration: 1.25, ease: 'expo.inOut' }, 'split')
      .to('.loader-panel.b', { xPercent: 78, yPercent: 14, duration: 1.25, ease: 'expo.inOut' }, 'split')
      .to(cut, { autoAlpha: 0, duration: 0.3 }, 'split+=0.15');
  } else {
    intro.addLabel('split', 0);
  }
  intro
    .to(heroMedia, { scale: 1, duration: 2.4, ease: 'expo.out' }, 'split+=0.1')
    .to(heroLines, { yPercent: 0, duration: 1.25, stagger: 0.12, ease: 'expo.out' }, 'split+=0.45')
    .to(nav, { yPercent: 0, duration: 1, ease: 'expo.out' }, 'split+=0.6')
    .to(heroBits, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, 'split+=0.75');

  /* ---- 3b. Hero : parallaxe au scroll + à la souris ---- */
  gsap.to('#heroMedia img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-inner', { y: -90, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: true } });
  if (fine) {
    const qx = gsap.quickTo(heroMedia, 'x', { duration: 1.4, ease: 'power3' });
    const qy = gsap.quickTo(heroMedia, 'y', { duration: 1.4, ease: 'power3' });
    $('.hero').addEventListener('mousemove', (e) => {
      qx((e.clientX / window.innerWidth - 0.5) * -26);
      qy((e.clientY / window.innerHeight - 0.5) * -18);
    });
  }

  /* ---- 3c. Bandeau : défilement infini piloté par la vitesse de scroll ---- */
  const rows = $$('.band-row');
  const loops = rows.map((r, i) => (i === 0
    ? gsap.to(r, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 })
    : gsap.fromTo(r, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 36, repeat: -1 })));
  let dir = 1, boost = 0, ts = 1;
  ScrollTrigger.create({
    trigger: '.band', start: 'top bottom', end: 'bottom top',
    onUpdate(self) { dir = self.direction; boost = Math.min(6, Math.abs(self.getVelocity()) / 320); }
  });
  const skewTo = rows.map((r) => gsap.quickTo(r, 'skewX', { duration: 0.6, ease: 'power3' }));
  gsap.ticker.add(() => {
    boost *= 0.93;
    ts += (dir * (1 + boost) - ts) * 0.12;
    loops.forEach((l) => l.timeScale(ts));
    skewTo.forEach((q, i) => q((i ? 1 : -1) * Math.min(boost, 4) * dir * 1.6));
  });

  /* ---- 3d. Révélations diagonales (le slash du logo) ---- */
  const slashIn = (el, extra = {}) => gsap.fromTo(el, { '--p': 0 }, { '--p': 1, duration: 1.5, ease: 'expo.inOut', ...extra });
  const storyFrame = $('.story .slash-reveal');
  slashIn(storyFrame, { scrollTrigger: { trigger: storyFrame, start: 'top 82%' } });
  gsap.fromTo('.story .slash-reveal img', { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: storyFrame, start: 'top 82%' } });
  gsap.fromTo('.story .slash-reveal img', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---- 3e. Manifeste : les mots s'allument au rythme du scroll ---- */
  $$('[data-words]').forEach((p) => {
    const words = p.textContent.trim().split(' ');
    p.setAttribute('aria-label', p.textContent.trim());
    p.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`).join(' ');
    gsap.fromTo($$('.w', p), { opacity: 0.13 }, {
      opacity: 1, stagger: 0.06, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 }
    });
  });

  /* ---- 3f. Apparitions génériques ---- */
  gsap.set('[data-rise]', { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', overwrite: true })
  });

  /* ---- 3g. Galerie : défilement horizontal épinglé (desktop) ---- */
  const mm = gsap.matchMedia();
  const cards = $$('.card');
  mm.add('(min-width: 901px)', () => {
    const track = $('#galTrack');
    const bar = $('#galBar');
    const count = $('#galCount');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.gallery', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate(self) {
          bar.style.transform = `scaleX(${self.progress})`;
          count.textContent = `0${Math.min(cards.length, Math.floor(self.progress * cards.length) + 1)} / 0${cards.length}`;
        }
      }
    });
    cards.forEach((card) => {
      const fr = $('.frame', card);
      const img = $('img', fr);
      slashIn(fr, { scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 88%' } });
      gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from($('figcaption', card), { autoAlpha: 0, y: 24, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 80%' } });
    });
  });
  mm.add('(max-width: 900px)', () => {
    cards.forEach((card, i) => slashIn($('.frame', card), { delay: i * 0.12, scrollTrigger: { trigger: '#galTrack', start: 'top 80%' } }));
  });

  /* ---- 3h. Prestations : lignes qui se tracent, rangées qui montent ---- */
  const svcs = $$('.svc');
  gsap.set(svcs, { '--l': 0 });
  gsap.set(svcs.map((s) => $('a', s)), { autoAlpha: 0, y: 28 });
  ScrollTrigger.batch(svcs, {
    start: 'top 88%', once: true,
    onEnter: (els) => {
      gsap.to(els, { '--l': 1, duration: 1.2, stagger: 0.09, ease: 'expo.inOut' });
      gsap.to(els.map((s) => $('a', s)), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, delay: 0.15, ease: 'power3.out' });
    }
  });

  /* ---- 3i. Réservation : titre lettre par lettre, fond en parallaxe, sceau magnétique ---- */
  $$('[data-chars] .mask > span').forEach((line) => {
    line.innerHTML = Array.from(line.textContent).map((ch) => `<span class="ch">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
  });
  const chars = $$('[data-chars] .ch');
  gsap.set($('[data-chars]'), { attr: { 'aria-label': "Ton fauteuil t'attend." } });
  gsap.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.028, ease: 'expo.out', scrollTrigger: { trigger: '[data-chars]', start: 'top 82%' } });
  gsap.fromTo('[data-bgpar]', { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.seal', { scale: 0.4, rotate: -90, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.seal', start: 'top 92%' } });

  if (fine) {
    $$('[data-magnetic]').forEach((el) => {
      const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.35);
        qy((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('mouseleave', () => { qx(0); qy(0); });
    });
  }

  /* ---- 3j. Pied de page : le logo monte depuis la ligne ---- */
  gsap.from('[data-footmark]', { yPercent: 102, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 92%' } });

  // Recalcul une fois les polices chargées
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
