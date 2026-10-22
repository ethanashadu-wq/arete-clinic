(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Site settings (phone, Apps Script endpoint), written by build.mjs from site.config.json
  const CFG = window.ARETE || {};

  // Fail-safe: never leave the visitor stuck behind the loading screen
  let lenis = null;
  function failOpen() {
    document.querySelector('.loader')?.remove();
    document.body.classList.remove('is-loading');
    document.querySelectorAll('.hero__media, .surgeon__img').forEach((el) => (el.style.clipPath = 'none'));
    document.querySelectorAll('.hero__media img, .surgeon__img img').forEach((img) => (img.style.transform = 'none'));
    try { lenis?.start(); } catch {}
  }
  if (!window.gsap || !window.ScrollTrigger) { console.warn('Animation scripts did not load; showing the page without animations.'); failOpen(); return; }
  const safety = setTimeout(failOpen, 6000);
  // Hidden start states and the scroll lock only apply once the animation code is really running
  document.documentElement.classList.add('anim');
  document.body.classList.add('is-loading');
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------- i18n ---------- */
  const fr = {
    'brand.sub': 'Chirurgie faciale',
    'nav.philosophy': 'Philosophie', 'nav.results': 'Résultats', 'nav.services': 'Services',
    'nav.surgeon': 'Chirurgien', 'nav.process': 'Parcours', 'nav.virtual': 'Consultation virtuelle',
    'cta.book': 'Prendre rendez-vous', 'cta.results': 'Voir les résultats',
    'hero.eyebrow': 'Clinique de chirurgie du nez (rhinoplastie)',
    'hero.title': 'Un nez qui <em>appartient</em> à votre visage.',
    'hero.lede': 'Nous remodelons le nez pour un résultat naturel, tout en préservant la respiration. Tout commence par une heure d’échange avec le chirurgien, en personne ou par vidéo.',
    'hero.scroll': 'Défiler pour découvrir', 'hero.where': 'Consultations en clinique &amp; virtuelles',
    'statement.eyebrow': 'L’approche Arête',
    'statement.text': 'Nous ne dessinons pas des nez. Nous dessinons l’équilibre : l’harmonie discrète entre profil, proportions et souffle qui fait qu’un visage se ressemble, en mieux.',
    'statement.link': 'Rencontrer le chirurgien',
    'phil.eyebrow': 'Notre philosophie', 'phil.title': 'Là où l’anatomie rencontre l’<em>intuition</em>.',
    'phil.p1.t': 'La science', 'phil.p1.d': 'Chaque plan commence par la structure de votre nez et la qualité de votre respiration. Un nez joli qui respire mal n’est pas un bon résultat.',
    'phil.p2.t': 'L’art', 'phil.p2.d': 'Vient ensuite le regard. Nous étudions ensemble votre profil, vos sourcils et votre menton, pour que le changement paraisse évident plutôt que visible.',
    'phil.p3.t': 'La retenue', 'phil.p3.d': 'Savoir ce qu’il ne faut pas changer compte autant que ce qu’il faut affiner. Vos origines et votre caractère restent intacts.',
    'stat.years': 'Années de pratique', 'stat.cases': 'Interventions réalisées', 'stat.one': 'Chirurgien, du début à la fin',
    'res.eyebrow': 'Résultats', 'res.title': 'Avant <em>&amp;</em> après',
    'res.lede': 'Faites glisser sur chaque photo pour comparer. Chaque résultat est différent, chaque plan est fait pour une seule personne.',
    'res.before': 'Avant', 'res.after': 'Après', 'res.m1': '12 mois après la chirurgie', 'res.m2': '9 mois après la chirurgie', 'res.m3': '18 mois après la chirurgie',
    'res.note': 'Ce sont des photos d’exemple, pas de vrais patients. Chaque visage est différent : les résultats varient d’une personne à l’autre.',
    'lead.eyebrow': 'Prendre rendez-vous', 'lead.title': 'Tout commence par une <em>conversation</em>.',
    'lead.lede': 'Remplissez le formulaire, cela prend environ une minute. Nous vous appelons dans un délai d’un jour ouvrable pour trouver un moment qui vous convient.',
    'f.name': 'Nom complet', 'f.phone': 'Téléphone', 'f.email': 'Courriel', 'f.when': 'Quand souhaitez-vous être opéré(e) ?',
    'f.t1': 'D’ici 3 mois', 'f.t2': 'Dans 3 à 6 mois', 'f.t3': 'Dans 6 à 12 mois', 'f.t4': 'Je m’informe pour l’instant',
    'f.consent': 'J’accepte d’être contacté(e) par Arête au sujet de ma demande. Mes coordonnées ne seront jamais partagées.',
    'shop.eyebrow': 'Soins post-opératoires', 'shop.title': 'Bien <em>récupérer</em>.', 'shop.hint': 'Faites glisser · Demandez-nous en consultation',
    'shop.new': 'Nouveau', 'shop.best': 'Meilleure vente', 'shop.kit': 'Coffret',
    'shop.1': 'Sérum réparateur', 'shop.2': 'Crème barrière', 'shop.3': 'Gel cicatrisant au silicone', 'shop.4': 'SPF 50 minéral', 'shop.5': 'Patchs yeux rafraîchissants',
    'shop.6': 'Masque de nuit en soie', 'shop.7': 'Brume saline', 'shop.8': 'Comprimés d’arnica', 'shop.9': 'Coffret réparateur nuit',
    'cta.call': 'Appelez-nous', 'lead.hours': 'Lun–ven, 9 h à 18 h',
    'tab.call': 'Être rappelé(e)', 'tab.book': 'Prendre rendez-vous', 'f.submitB': 'Confirmer le rendez-vous',
    'f.submit': 'Être rappelé(e)', 'f.submitV': 'Réserver un appel vidéo', 'f.where': 'Ville &amp; pays', 'f.msg': 'Que souhaitez-vous changer ?',
    'svc.eyebrow': 'Nos services', 'svc.title': 'Nos cinq <em>traitements</em>.', 'svc.hint': 'Survolez pour découvrir',
    'svc.1.t': 'Remodeler le nez, une première fois', 'svc.1.d': 'Changer la forme ou la taille de votre nez pour la première fois, en gardant (ou en améliorant) votre respiration.',
    'svc.2.t': 'Corriger une chirurgie passée', 'svc.2.d': 'Quand une chirurgie du nez antérieure n’a pas donné le résultat voulu. On utilise souvent un peu de votre propre cartilage pour reconstruire.',
    'svc.3.t': 'Un remodelage qui respecte vos origines', 'svc.3.d': 'Des changements subtils qui gardent les traits qui vous relient à votre famille et à vos origines.',
    'svc.4.t': 'Adoucir sans chirurgie', 'svc.4.d': 'Des injections pour masquer une bosse ou relever la pointe. Environ 15 minutes, vie normale le jour même. Dure environ un an.',
    'svc.5.t': 'Respiration &amp; menton', 'svc.5.d': 'Redresser l’intérieur du nez pour mieux respirer, ou équilibrer le menton. Seul ou avec un remodelage du nez.',
    'doc.eyebrow': 'Votre chirurgien',
    'doc.p1': 'Le Dr Morel est un chirurgien plasticien qui opère uniquement le visage, et surtout le nez. Après sa formation chirurgicale, il a passé une année de plus à apprendre uniquement la chirurgie du nez.',
    'doc.p2': 'Vous le voyez à chaque visite. Il planifie votre chirurgie et réalise toute l’opération lui-même.',
    'doc.c1': 'Spécialiste certifié en chirurgie plastique du visage', 'doc.c2': 'Une année de formation de plus en chirurgie du nez', 'doc.c3': 'Enseigne aux chirurgiens dans une faculté de médecine', 'doc.since': 'Depuis 2014',
    'doc.cta': 'Réserver avec le Dr Morel',
    'proc.eyebrow': 'Du premier échange au résultat final', 'proc.title': 'Ce qui se passe, <em>étape par étape</em>.', 'proc.hint': 'Continuez à défiler pour parcourir les 7 étapes',
    'p1.t': 'Consultation', 'p1.d': 'Une heure sans hâte avec le Dr Morel pour parler de vos objectifs, examiner votre nez et évaluer votre respiration.',
    'p2.t': 'Photos &amp; planification', 'p2.d': 'Nous prenons des photos et vous montrons un aperçu à l’ordinateur, pour convenir d’un résultat réaliste avant toute décision.',
    'p3.t': 'Bilan avant la chirurgie', 'p3.d': 'Un dernier contrôle de santé et un plan écrit simple pour le jour de la chirurgie et les semaines suivantes.',
    'p4.t': 'Le jour de la chirurgie', 'p4.d': 'Deux à trois heures, endormi(e), dans un centre chirurgical agréé. La plupart des gens rentrent le jour même.',
    'p5.t': 'La première semaine', 'p5.d': 'Le petit plâtre de protection est retiré au 7e jour. Vous pouvez nous joindre jour et nuit pour toute question.',
    'p6.t': 'Récupération', 'p6.d': 'L’essentiel de l’enflure disparaît en un mois. De courts rendez-vous vérifient que tout guérit bien.',
    'p7.t': 'Suivi pendant un an', 'p7.d': 'Rendez-vous à 3, 6 et 12 mois. La pointe du nez peut prendre une année pour trouver sa forme finale.',
    'v.eyebrow': 'De l’extérieur de la ville', 'v.title': 'Consultez de <em>partout</em>.',
    'v.lede': 'Beaucoup de nos patients voyagent pour nous voir. Votre première consultation peut se faire par vidéo : vous ne vous déplacez qu’une fois certain(e).',
    'v.s1': 'Envoyez quelques photos via notre formulaire sécurisé', 'v.s2': 'Rencontrez le Dr Morel lors d’un appel vidéo privé', 'v.s3': 'Planifiez votre séjour et votre récupération avec notre coordonnatrice',
    'v.formTitle': 'Demander une consultation virtuelle', 'v.formLede': 'Nous répondons dans un délai d’un jour ouvrable.',
    'hero.reassure': 'Nous répondons dans un délai d’un jour ouvrable. Sans engagement.',
    'res.pill': 'Photos d’exemple', 'f.choose': 'Choisissez', 'svc.hint': 'Survolez une ligne pour en savoir plus · Cliquez pour réserver',
    'foot.legal': 'Ce site donne des informations générales, pas des conseils médicaux. Toute chirurgie comporte des risques. Votre chirurgien vous les expliquera lors de la consultation.',
    'foot.title': 'Votre visage, <em>affiné</em>.', 'foot.visit': 'Nous visiter', 'foot.contact': 'Contact', 'foot.explore': 'Explorer', 'foot.follow': 'Suivre',
    'nav.home': 'Accueil', 'nav.treatments': 'Traitements', 'nav.consult': 'Consultation',
    'rev.eyebrow': 'Avis Google', 'rev.title': 'Avec leurs <em>mots</em>.', 'rev.count': 'sur 127 avis Google',
    'foot.rights': 'Tous les noms, coordonnées et images sont fictifs.', 'foot.privacy': 'Politique de confidentialité'
  };
  const ui = {
    en: { sending: 'Sending…', sent: 'Thank you. We’ll be in touch within one business day.', invalid: 'Please fill in the boxes marked in red, then try again.', failed: 'Sorry, that didn’t go through. Please try again or call us on {phone}.' },
    fr: { sending: 'Envoi…', sent: 'Merci. Nous vous contacterons d’ici un jour ouvrable.', invalid: 'Veuillez remplir les cases en rouge, puis réessayer.', failed: 'Désolé, l’envoi a échoué. Réessayez ou appelez-nous au {phone}.' }
  };
  const en = {};
  document.querySelectorAll('[data-i18n]').forEach((el) => { en[el.dataset.i18n] ??= el.innerHTML; });
  let lang = 'en';
  function labelSteps() {
    document.querySelectorAll('.step__label').forEach((el, i) => { el.textContent = (lang === 'fr' ? 'Étape ' : 'Step ') + (i + 1) + ' / 7'; });
  }
  labelSteps();

  function setLang(next) {
    lang = next;
    const dict = next === 'fr' ? fr : en;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const html = dict[el.dataset.i18n] ?? en[el.dataset.i18n];
      if (html == null) return;
      el.innerHTML = html;
      delete el.dataset.split;
      if (el.classList.contains('split')) splitWords(el);
    });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
    labelSteps();
    document.dispatchEvent(new Event('langchange'));
    try { localStorage.setItem('arete-lang', next); } catch {}
    ScrollTrigger.refresh();
  }
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- Split text (keeps <em> and <br>) ---------- */
  function splitWords(el) {
    if (el.dataset.split) return el.querySelectorAll('.wi');
    el.dataset.split = '1';
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return el.querySelectorAll('.wi');
  }

  /* ---------- Smooth scroll ---------- */
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  // Links to a section of this page scroll smoothly; links to other pages load normally.
  // "#book" means the consultation form with the "Book an appointment" side open.
  const pagePath = (p) => p.replace(/index\.html$/, '');
  function scrollToHash(hash, smooth = true) {
    if (hash === '#book') { if (tabs[1]) showTab(tabs[1]); hash = '#consult'; }
    const target = hash === '#top' ? 0 : document.querySelector(hash);
    if (target == null) return false;
    const offset = hash === '#top' ? 0 : -40;
    if (lenis) lenis.scrollTo(target, smooth ? { offset, duration: 1.6 } : { offset, immediate: true, force: true });
    else window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + offset, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    return true;
  }
  function jumpToHash() {
    if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash, false));
  }
  document.querySelectorAll('a[href*="#"]').forEach((a) => {
    const url = new URL(a.getAttribute('href'), location.href);
    if (!url.hash || url.origin !== location.origin || pagePath(url.pathname) !== pagePath(location.pathname)) return;
    a.addEventListener('click', (e) => {
      closeMenu();
      if (!scrollToHash(url.hash)) return;
      e.preventDefault();
      history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
    });
  });

  /* ---------- Header hide/show ---------- */
  const header = document.querySelector('.header');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile "Book" bar: show after the hero, hide while a form is on screen */
  const bookBar = document.querySelector('.mobile-book');
  const formsOnScreen = new Set();
  const updateBar = () => bookBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6 && formsOnScreen.size === 0 && !document.body.classList.contains('menu-open'));
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.isIntersecting ? formsOnScreen.add(en.target) : formsOnScreen.delete(en.target));
    updateBar();
  });
  document.querySelectorAll('#consult, #virtual .virtual__form, .footer').forEach((el) => barObserver.observe(el));
  window.addEventListener('scroll', updateBar, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  function openMenu() {
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-hidden', 'false');
    lenis?.stop();
    gsap.set(menu, { visibility: 'visible' });
    gsap.to(menu, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' });
    gsap.fromTo('.mobile-menu > a > span, .mobile-menu__foot', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.35 });
  }
  function closeMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true');
    lenis?.start();
    gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
  }
  burger.addEventListener('click', () => document.body.classList.contains('menu-open') ? closeMenu() : openMenu());
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Cursor ---------- */
  if (finePointer && !reduce) {
    const cursor = document.querySelector('.cursor');
    const label = cursor.querySelector('span');
    const dx = gsap.quickTo('.cursor__dot', 'x', { duration: 0.1 }), dy = gsap.quickTo('.cursor__dot', 'y', { duration: 0.1 });
    const rx = gsap.quickTo('.cursor__ring', 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo('.cursor__ring', 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', (e) => { cursor.classList.add('is-active'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.querySelectorAll('a, button, .check').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => { label.textContent = lang === 'fr' ? 'Glisser' : el.dataset.cursor; cursor.classList.add('has-label'); });
      el.addEventListener('pointerleave', () => cursor.classList.remove('has-label'));
    });

    /* Magnetic buttons */
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const mx = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const my = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* ---------- Before / after ---------- */
  document.querySelectorAll('.case__frame').forEach((frame) => {
    const range = frame.querySelector('.case__range');
    const set = (v) => { frame.style.setProperty('--pos', v + '%'); range.value = v; };
    range.addEventListener('input', () => set(range.value));
    if (finePointer) {
      frame.addEventListener('pointermove', (e) => {
        if (e.buttons) return;
        const r = frame.getBoundingClientRect();
        set(Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))));
      });
    }
    if (!reduce) {
      const s = { v: 50 };
      gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 75%', once: true } })
        .to(s, { v: 18, duration: 0.9, ease: 'power3.inOut', onUpdate: () => set(Math.round(s.v)) })
        .to(s, { v: 50, duration: 1.1, ease: 'power3.inOut', onUpdate: () => set(Math.round(s.v)) });
    }
  });

  /* ---------- Forms: sent to the Apps Script endpoint, which saves the lead, texts and emails the clinic ---------- */
  async function sendForm(form) {
    const data = Object.fromEntries(new FormData(form));
    Object.assign(data, { kind: form.dataset.kind || 'enquiry', page: location.pathname, lang });
    // Demo mode until an endpoint is set in site.config.json: nothing leaves the browser
    if (!CFG.endpoint) { await new Promise((r) => setTimeout(r, 900)); return true; }
    const res = await fetch(CFG.endpoint, { method: 'POST', body: new URLSearchParams(data) });
    return (await res.json()).ok === true;
  }
  document.querySelectorAll('.js-form').forEach((form) => {
    const status = form.querySelector('.form__status');
    const btnLabel = form.querySelector('.btn-label');
    const submit = form.querySelector('button[type=submit]');
    form.insertAdjacentHTML('afterbegin', '<label class="hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off" /></label>');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      if (!form.checkValidity()) {
        form.querySelectorAll(':invalid').forEach((el) => { if (el.matches('input, select, textarea')) (el.closest('.field') || el.closest('.check') || el.closest('.cal')).classList.add('is-invalid'); });
        form.querySelector(':invalid:not(form)')?.focus();
        status.textContent = ui[lang].invalid;
        return;
      }
      const original = btnLabel.innerHTML;
      btnLabel.textContent = ui[lang].sending;
      submit.disabled = true;
      const sent = form.bookedMessage?.() ?? ui[lang].sent;
      let ok = false;
      try { ok = await sendForm(form); } catch (err) { console.error(err); }
      status.textContent = ok ? sent : ui[lang].failed.replace('{phone}', CFG.phoneDisplay || '');
      btnLabel.innerHTML = original;
      submit.disabled = false;
      if (ok) {
        form.querySelectorAll('select').forEach((sel) => (sel.selectedIndex = 0));
        form.reset();
      }
    });
  });

  /* ---------- Consult: call back / book an appointment tabs ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role=tab]')];
  function showTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    ScrollTrigger.refresh();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showTab(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      showTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
    });
  });

  /* ---------- Booking calendar (demo availability: wire to your booking system) ---------- */
  const book = document.querySelector('.js-book');
  if (book) {
    const calGrid = book.querySelector('.cal__grid');
    const calPrev = book.querySelector('.cal__prev');
    const calNext = book.querySelector('.cal__next');
    const calSlots = book.querySelector('.cal__slots');
    const calPick = book.querySelector('.cal__pick');
    const calToday = new Date(); calToday.setHours(0, 0, 0, 0);
    const cy = calToday.getFullYear(), cm = calToday.getMonth();
    // Simulated fully-booked dates and appointment times
    const booked = [new Date(cy, cm, 8), new Date(cy, cm, 9), new Date(cy, cm, 15), new Date(cy, cm, 22), new Date(cy, cm + 1, 5), new Date(cy, cm + 1, 12)].map((d) => d.toDateString());
    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const takenSlot = (d, i) => (d.getDate() * 7 + i * 3) % 5 === 0;
    const calMonths = 3;
    let calView = 0;
    let picked = null;
    const loc = () => (lang === 'fr' ? 'fr-FR' : 'en-GB');
    const fmtDay = (d) => d.toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' });
    const isBooked = (d) => booked.includes(d.toDateString());
    const isOff = (d) => d < calToday || d.getDay() === 0 || d.getDay() === 6 || isBooked(d);

    function renderCal() {
      const first = new Date(cy, cm + calView, 1);
      book.querySelector('.cal__month').textContent = first.toLocaleDateString(loc(), { month: 'long', year: 'numeric' });
      calPrev.disabled = calView === 0;
      calNext.disabled = calView === calMonths;
      // 1 Jan 2024 was a Monday, so these are Mon–Sun
      let html = [...Array(7)].map((_, i) => `<span class="cal__dow" aria-hidden="true">${new Date(2024, 0, 1 + i).toLocaleDateString(loc(), { weekday: 'short' }).slice(0, 3)}</span>`).join('');
      html += '<span></span>'.repeat((first.getDay() + 6) % 7);
      const days = new Date(cy, cm + calView + 1, 0).getDate();
      for (let n = 1; n <= days; n++) {
        const d = new Date(cy, cm + calView, n);
        const full = isBooked(d) && d >= calToday;
        const cls = 'cal__day' + (d.getTime() === calToday.getTime() ? ' is-today' : '') + (full ? ' is-booked' : '');
        const label = fmtDay(d) + (full ? (lang === 'fr' ? ', complet' : ', fully booked') : '');
        html += `<button type="button" class="${cls}" data-day="${n}" aria-label="${label}" aria-pressed="${picked?.getTime() === d.getTime()}"${isOff(d) ? ' disabled' : ''}>${n}</button>`;
      }
      calGrid.innerHTML = html;
      renderSlots();
    }
    function renderSlots() {
      calSlots.hidden = !picked;
      const keep = calSlots.querySelector('input:checked')?.value;
      calSlots.innerHTML = picked ? times.map((t, i) => {
        const taken = takenSlot(picked, i);
        return `<label class="slot"><input type="radio" name="time" value="${t}" required${taken ? ' disabled' : ''}${keep === t && !taken ? ' checked' : ''} /><span>${t}</span></label>`;
      }).join('') : '';
      renderNote();
    }
    function renderNote() {
      const fr = lang === 'fr';
      const time = calSlots.querySelector('input:checked')?.value;
      book.querySelector('.cal__note').innerHTML = picked
        ? `${fr ? 'Rendez-vous :' : 'Appointment:'} <strong>${fmtDay(picked)}${time ? ' · ' + time : ''}</strong>${time ? '' : (fr ? ' · choisissez une heure' : ' · now choose a time')}`
        : (fr ? 'Du lundi au vendredi · les dates grisées sont complètes.' : 'Weekdays only · Greyed-out dates are fully booked.');
      calPick.value = picked ? [picked.getFullYear(), String(picked.getMonth() + 1).padStart(2, '0'), String(picked.getDate()).padStart(2, '0')].join('-') : '';
    }

    calGrid.addEventListener('click', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day || day.disabled) return;
      picked = new Date(cy, cm + calView, +day.dataset.day);
      calSlots.innerHTML = '';
      book.querySelector('.cal').classList.remove('is-invalid');
      renderCal();
      if (e.detail === 0) calGrid.querySelector(`[data-day="${day.dataset.day}"]`).focus();
    });
    calSlots.addEventListener('change', () => { book.querySelector('.cal').classList.remove('is-invalid'); renderNote(); });
    calPrev.addEventListener('click', () => { calView--; renderCal(); });
    calNext.addEventListener('click', () => { calView++; renderCal(); });
    book.addEventListener('reset', () => { picked = null; calView = 0; setTimeout(renderCal); });
    document.addEventListener('langchange', renderCal);
    book.bookedMessage = () => {
      const time = calSlots.querySelector('input:checked')?.value;
      return lang === 'fr'
        ? `Réservé pour le ${fmtDay(picked)} à ${time}. Vous recevrez une confirmation par courriel.`
        : `Booked for ${fmtDay(picked)} at ${time}. We'll email you a confirmation shortly.`;
    };
    renderCal();
  }

  /* ---------- Coverflow carousels: aftercare products and Google reviews ---------- */
  if (window.Swiper) {
    document.querySelectorAll('.coverflow').forEach((el) => {
      const section = el.closest('section');
      new Swiper(el, {
        effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', loop: true,
        speed: reduce ? 0 : 600,
        coverflowEffect: { rotate: 30, stretch: 0, depth: 120, modifier: 1, slideShadows: false },
        pagination: { el: section.querySelector('.cf-dots'), clickable: true },
        navigation: { prevEl: section.querySelector('.cf-prev'), nextEl: section.querySelector('.cf-next') },
        keyboard: { enabled: true, onlyInViewport: true },
      });
    });
  }

  /* ---------- Services: one photo shown through all five rows ---------- */
  const svcList = document.querySelector('.svc-list');
  const svcRows = svcList ? [...svcList.querySelectorAll('.svc')] : [];
  const svcImg = new Image();
  let svcShift = 0;
  function paintSvc() {
    if (!svcList || !svcImg.naturalWidth) return;
    const W = svcList.offsetWidth, H = svcList.offsetHeight + 120;
    const k = Math.max(W / svcImg.naturalWidth, H / svcImg.naturalHeight);
    const iw = svcImg.naturalWidth * k, ih = svcImg.naturalHeight * k;
    const x = (W - iw) / 2, y = (H - ih) / 2 - 60 + svcShift;
    svcRows.forEach((row) => {
      row.style.backgroundImage = `url(${svcImg.src})`;
      row.style.backgroundSize = `${iw}px ${ih}px`;
      row.style.backgroundPosition = `${x - row.offsetLeft}px ${y - row.offsetTop}px`;
    });
  }
  if (svcList) {
    svcImg.onload = paintSvc;
    svcImg.src = 'img/svc-surgery.jpg';
    new ResizeObserver(paintSvc).observe(svcList);
  }

  /* ---------- Photos from Google Drive: a file named "hero.jpg" in the Drive folder replaces img/hero.jpg ---------- */
  function applyDriveImages(map) {
    document.querySelectorAll('img[data-slot]').forEach((img) => {
      const url = map[img.dataset.slot];
      if (url && img.getAttribute('src') !== url) img.src = url;
    });
    if (svcList && map['svc-surgery']) svcImg.src = map['svc-surgery'];
  }
  if (CFG.endpoint) {
    try { applyDriveImages(JSON.parse(localStorage.getItem('arete-drive') || '{}')); } catch {}
    fetch(CFG.endpoint + '?action=images')
      .then((r) => r.json())
      .then((j) => {
        if (!j.images) return;
        applyDriveImages(j.images);
        try { localStorage.setItem('arete-drive', JSON.stringify(j.images)); } catch {}
      })
      .catch((err) => console.warn('Drive photos unavailable', err));
  }

  /* ---------- Process line: weaves between the step cards, with a loop in each gap ---------- */
  function buildProcessLine(track) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('process-line');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    svg.appendChild(path);
    track.prepend(svg);
    const state = { p: 0, len: 0 };
    const draw = () => { path.style.strokeDashoffset = state.len * (1 - state.p); };
    function layout() {
      const steps = [...track.querySelectorAll('.step')];
      if (steps.length < 2) return;
      const W = track.scrollWidth, H = track.scrollHeight;
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      // u runs along the row (or column on phones), v across it
      const row = getComputedStyle(track).flexDirection !== 'column';
      const span = (el) => (row ? [el.offsetLeft, el.offsetLeft + el.offsetWidth] : [el.offsetTop, el.offsetTop + el.offsetHeight]);
      const mid = row ? steps[0].offsetTop + steps[0].offsetHeight / 2 : steps[0].offsetLeft + steps[0].offsetWidth / 2;
      const gaps = steps.slice(1).map((el, i) => (span(steps[i])[1] + span(el)[0]) / 2);
      const r = Math.min(46, (span(steps[1])[0] - span(steps[0])[1]) * 0.38);
      const amp = row ? 70 : 40;
      const knots = [span(steps[0])[0] + 20, ...gaps, span(steps.at(-1))[1] - 20];
      const pts = [];
      for (let k = 0; k < knots.length - 1; k++) {
        const a = knots[k], b = knots[k + 1], side = k % 2 ? 1 : -1;
        // a gentle wave behind the card...
        for (let u = a; u < b; u += 6) pts.push([u, mid + side * amp * Math.sin((Math.PI * (u - a)) / (b - a))]);
        // ...then a loop in the gap before the next card
        if (k < knots.length - 2) {
          for (let t = 0; t <= Math.PI * 2 + 0.01; t += Math.PI / 24) pts.push([b + r * Math.sin(t) + 0.25 * r * (1 - Math.cos(t)), mid - 1.15 * r * (1 - Math.cos(t))]);
        }
      }
      pts.push([knots.at(-1), mid]);
      path.setAttribute('d', 'M' + pts.map(([u, v]) => (row ? [u, v] : [v, u]).map((n) => n.toFixed(1)).join(' ')).join('L'));
      state.len = path.getTotalLength();
      path.style.strokeDasharray = state.len;
      draw();
    }
    layout();
    new ResizeObserver(layout).observe(track);
    return { state, draw };
  }

  /* ---------- Counters ---------- */
  function runCounters() {
    document.querySelectorAll('.count').forEach((el) => {
      const to = +el.dataset.to;
      if (reduce) { el.textContent = to.toLocaleString('en-US'); return; }
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 2.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); }
      });
    });
  }

  /* ---------- Text reveal block: a block wipes in, the line appears, the block wipes out ---------- */
  function revealBlock(el, { color = 'var(--bronze)', duration = 0.75, stagger = 0.15 } = {}) {
    const split = SplitText.create(el, { type: 'lines', linesClass: 'rb-line', lineThreshold: 0.1 });
    const blocks = split.lines.map((line) => {
      const wrap = document.createElement('div');
      wrap.className = 'rb-wrap';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
      const block = document.createElement('div');
      block.className = 'rb-wipe';
      block.style.background = color;
      wrap.appendChild(block);
      return block;
    });
    gsap.set(split.lines, { opacity: 0 });
    gsap.set(blocks, { scaleX: 0, transformOrigin: 'left center' });
    // Revert once done so the heading reflows normally on resize
    const tl = gsap.timeline({ paused: true, onComplete: () => split.revert() });
    split.lines.forEach((line, i) => {
      const at = i * stagger;
      tl.to(blocks[i], { scaleX: 1, duration, ease: 'power4.inOut' }, at)
        .set(line, { opacity: 1 }, at + duration)
        .set(blocks[i], { transformOrigin: 'right center' }, at + duration)
        .to(blocks[i], { scaleX: 0, duration, ease: 'power4.inOut' }, at + duration);
    });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tl.play() });
  }

  /* ---------- Intro + scroll animations ---------- */
  function heroIn() {
    const tl = gsap.timeline();
    const title = document.querySelector('.hero-title');
    if (!title) return tl.from('.header', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity' });
    const heroWords = splitWords(title);
    const r = innerWidth <= 900 ? '200px 200px 4px 4px' : '300px 300px 4px 4px';
    tl.fromTo('.hero__media', { clipPath: `inset(100% 0% 0% 0% round ${r})` }, { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.6, ease: 'expo.inOut' }, 0)
      .to('.hero__media img', { scale: 1.06, duration: 2.2, ease: 'expo.out' }, 0.2)
      .from(heroWords, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.06 }, 0.5)
      .from('.hero-fade', { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.8)
      .from('.header', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.9);
    return tl;
  }

  function scrollAnimations() {
    // Section headings: a bronze block wipes across each line (hero is done in heroIn)
    document.querySelectorAll('.split:not(.hero-title)').forEach((el) => revealBlock(el));

    // Statement: words light up as you scroll
    const scrub = document.querySelector('.scrub-text');
    if (scrub) {
      gsap.to(splitWords(scrub), {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: scrub, start: 'top 80%', end: 'bottom 50%', scrub: true }
      });
    }

    // Generic fade-ups
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 48, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Parallax images
    gsap.utils.toArray('[data-speed]').forEach((img) => {
      gsap.fromTo(img, { yPercent: 0 }, {
        yPercent: +img.dataset.speed, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Hero image drifts as you leave
    if (document.querySelector('.hero')) gsap.to('.hero__media img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Clip reveals
    gsap.utils.toArray('.img-reveal').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    if (document.querySelector('.surgeon__img')) gsap.timeline({ scrollTrigger: { trigger: '.surgeon__img', start: 'top 80%', once: true } })
      .fromTo('.surgeon__img', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
      .to('.surgeon__img img', { scale: 1, duration: 2, ease: 'expo.out' }, 0.2);

    // Marquee: constant drift, speeds up and reverses with scroll direction
    const track = document.querySelector('.marquee__track');
    if (track) {
      const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
          gsap.to(loop, { timeScale: (self.direction === -1 ? -1 : 1) * Math.max(1, Math.abs(v)), duration: 0.4, overwrite: true });
        }
      });
    }

    // Process: horizontal scroll on desktop; the line draws itself as you go
    const pTrack = document.querySelector('.process__track');
    if (pTrack) {
      const line = buildProcessLine(pTrack);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const dist = () => pTrack.scrollWidth - window.innerWidth;
        const st = { trigger: '.process', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true };
        gsap.to(pTrack, { x: () => -dist(), ease: 'none', scrollTrigger: { ...st, pin: '.process__pin' } });
        gsap.to(line.state, { p: 1, ease: 'none', onUpdate: line.draw, scrollTrigger: st });
      });
      mm.add('(max-width: 900px)', () => {
        gsap.utils.toArray('.step').forEach((s) => gsap.from(s, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } }));
        gsap.to(line.state, { p: 1, ease: 'none', onUpdate: line.draw, scrollTrigger: { trigger: pTrack, start: 'top 75%', end: 'bottom 65%', scrub: 0.6 } });
      });
    }

    // Services: rows rise in one by one, the photo drifts slowly inside them
    if (svcList) {
      gsap.from('.svc', { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.svc-list', start: 'top 85%', once: true } });
      ScrollTrigger.create({
        trigger: '.svc-list', start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => { svcShift = (0.5 - self.progress) * 120; paintSvc(); }
      });
    }

    // Important sections (data-slow): the wheel moves the page more slowly while they're on screen
    if (lenis) {
      const speed = { m: 1 };
      const ease = (m) => gsap.to(speed, { m, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: () => { lenis.virtualScroll.options.wheelMultiplier = speed.m; } });
      gsap.utils.toArray('[data-slow]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: (self) => ease(self.isActive ? 0.45 : 1) }));
    }

    // Footer wordmark rises letter by letter
    gsap.from('.footer__word span', {
      yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true }
    });

    runCounters();
  }

  /* ---------- Preloader ---------- */
  function start() {
    let saved = null;
    try { saved = localStorage.getItem('arete-lang'); } catch {}
    if (saved === 'fr') setLang('fr');
    const seen = document.documentElement.classList.contains('seen');
    try { sessionStorage.setItem('arete-seen', '1'); } catch {}

    if (reduce) {
      clearTimeout(safety);
      document.querySelector('.loader')?.remove();
      document.body.classList.remove('is-loading');
      gsap.set('.hero__media', { clipPath: 'none' });
      gsap.set('.hero__media img', { scale: 1 });
      gsap.set('.surgeon__img', { clipPath: 'none' });
      gsap.set('.surgeon__img img', { scale: 1 });
      document.querySelectorAll('.scrub-text .wi').forEach((w) => (w.style.opacity = 1));
      runCounters();
      jumpToHash();
      return;
    }
    if (seen) {
      clearTimeout(safety);
      document.querySelector('.loader')?.remove();
      document.body.classList.remove('is-loading');
      lenis?.start();
      heroIn();
      scrollAnimations();
      ScrollTrigger.refresh();
      jumpToHash();
      return;
    }
    const count = document.querySelector('.loader__count');
    const c = { v: 0 };
    gsap.timeline()
      .to('.loader__word span', { y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 })
      .to(c, { v: 100, duration: 0.9, ease: 'power2.inOut', onUpdate: () => (count.textContent = String(Math.round(c.v)).padStart(3, '0')) }, 0)
      .to('.loader__line', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to('.loader__word span', { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.03 }, 0.9)
      .to('.loader', { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 1.1)
      .add(() => {
        clearTimeout(safety);
        document.body.classList.remove('is-loading');
        document.querySelector('.loader')?.remove();
        lenis?.start();
      })
      .add(heroIn(), 1.25)
      .add(() => { scrollAnimations(); ScrollTrigger.refresh(); jumpToHash(); }, 1.3);
  }

  // Start once fonts are ready (max 1.2s) instead of waiting for every photo
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    try { start(); } catch (err) { console.error(err); failOpen(); }
  };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]).then(go);
  addEventListener('load', () => ScrollTrigger.refresh());
})();
