/* SkillBridge — interactions */
(() => {
  'use strict';
  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('hide'), 400);
  });
  /* ---------- YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  /* ---------- NAVBAR SCROLL + ACTIVE LINK ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const links = document.querySelectorAll('.nav__link');
  const sections = Array.from(links)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = ((y / h) * 100) + '%';
    // Active section
    const pos = y + 120;
    let current = sections[0]?.id;
    sections.forEach(s => { if (s.offsetTop <= pos) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  /* ---------- MOBILE MENU ---------- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  /* ---------- COUNT-UP ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + '+';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));
  /* ---------- BUTTON RIPPLE ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple-effect';
      const size = Math.max(r.width, r.height);
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - r.left - size / 2) + 'px';
      span.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });
  });
  /* ---------- CAROUSEL ---------- */
  const track = document.getElementById('carouselTrack');
  if (track) {
    const slides = track.children.length;
    const dotsBox = document.getElementById('dots');
    let idx = 0, timer;
    for (let i = 0; i < slides; i++) {
      const d = document.createElement('button');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => go(i));
      dotsBox.appendChild(d);
    }
    const dots = dotsBox.children;
    const go = (i) => {
      idx = (i + slides) % slides;
      track.style.transform = `translateX(-${idx * 100}%)`;
      Array.from(dots).forEach((d, j) => d.classList.toggle('active', j === idx));
      restart();
    };
    document.getElementById('prevBtn').addEventListener('click', () => go(idx - 1));
    document.getElementById('nextBtn').addEventListener('click', () => go(idx + 1));
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 5000); };
    restart();
  }
  /* ---------- CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const setError = (name, msg) => {
      const el = form.querySelector(`[data-for="${name}"]`);
      if (el) el.textContent = msg || '';
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const data = Object.fromEntries(new FormData(form));
      if (!data.name?.trim()) { setError('name', 'Please enter your name'); ok = false; } else setError('name', '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) { setError('email', 'Enter a valid email'); ok = false; } else setError('email', '');
      if (!/^[+()\d\s-]{7,}$/.test(data.phone || '')) { setError('phone', 'Enter a valid phone'); ok = false; } else setError('phone', '');
      if (!data.message?.trim() || data.message.trim().length < 10) { setError('message', 'Message must be at least 10 characters'); ok = false; } else setError('message', '');
      if (ok) {
        form.reset();
        const s = document.getElementById('formSuccess');
        s.hidden = false;
        setTimeout(() => s.hidden = true, 4000);
      }
    });
  }
  /* ---------- NEWSLETTER ---------- */
  const nl = document.getElementById('newsletter');
  nl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = nl.querySelector('input');
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
      inp.value = '';
      const btn = nl.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = '✓ Joined';
      setTimeout(() => btn.textContent = orig, 2200);
    }
  });
  /* ---------- CURSOR GLOW + PARALLAX ---------- */
  const glow = document.getElementById('cursorGlow');
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    shapes.forEach((s, i) => {
      const f = (i + 1) * 0.012;
      s.style.translate = `${(e.clientX - innerWidth / 2) * f}px ${(e.clientY - innerHeight / 2) * f}px`;
    });
  });
  /* ---------- PARALLAX ON SCROLL ---------- */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    shapes.forEach((s, i) => { s.style.transform = `translateY(${y * (0.05 + i * 0.03)}px)`; });
  }, { passive: true });
})();
