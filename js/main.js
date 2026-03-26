/* ══════════════════════════════════════════
   TSVC STUDIO — main.js
   ══════════════════════════════════════════ */

/* ── Nav scroll effect ── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile menu ── */
(function () {
  const burger = document.querySelector('.hamburger');
  const menu   = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
})();

/* ── Active nav link ── */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── Counter animation ── */
function animateCount(el, target, suffix) {
  const dur  = 1800;
  const step = 16;
  const inc  = target / (dur / step);
  let   val  = 0;
  const timer = setInterval(() => {
    val += inc;
    if (val >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(val).toLocaleString() + suffix;
    }
  }, step);
}
(function () {
  const section = document.querySelector('.stats');
  if (!section) return;
  let done = false;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true;
      section.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
      });
    }
  }, { threshold: 0.3 });
  io.observe(section);
})();

/* ══════════════════════════════════════════
   DATA LAYER  (localStorage)
   Keys: tsvc_portfolio | tsvc_testimonials | tsvc_services
   ══════════════════════════════════════════ */

const STORE = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
  }
};

const DEFAULT_SERVICES = [
  { id: 's1', name: 'Short-Form Content', desc: 'Viral Reels, TikToks & Shorts engineered for maximum organic reach.',     image: '' },
  { id: 's2', name: 'Long-Form Editing',  desc: 'Full-length video editing with cinematic storytelling and pacing.',        image: '' },
  { id: 's3', name: 'Social Media Mgmt',  desc: 'Strategy, scheduling & community growth across all major platforms.',      image: '' },
  { id: 's4', name: 'Brand Videos',       desc: 'Professional brand identity films that define your digital presence.',    image: '' },
  { id: 's5', name: 'Thumbnails & GFX',   desc: 'High-conversion visual assets designed to stop the scroll instantly.',    image: '' },
  { id: 's6', name: 'Strategy & Consult', desc: 'Data-driven content strategy sessions to accelerate your growth curve.',  image: '' },
];

function getServices() {
  return STORE.get('tsvc_services', DEFAULT_SERVICES);
}
function getPortfolio() {
  return STORE.get('tsvc_portfolio', []);
}
function getTestimonials() {
  return STORE.get('tsvc_testimonials', []);
}

/* ── Render: Testimonials slider ── */
(function () {
  const wrap = document.querySelector('.testimonials-list');
  if (!wrap) return;

  const data = getTestimonials();
  const section = document.querySelector('.testimonials-section');

  if (!data.length) {
    if (section) section.style.display = 'none';
    return;
  }

  const dotsEl = document.querySelector('.t-dots');
  let current  = 0;

  function render() {
    wrap.innerHTML = '';
    dotsEl && (dotsEl.innerHTML = '');

    data.forEach((t, i) => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `
        <div class="testimonial-quote-mark">"</div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">${t.name}</div>
        <div class="testimonial-role">${t.role}</div>
      `;
      wrap.appendChild(slide);

      if (dotsEl) {
        const dot = document.createElement('div');
        dot.className = 'dot t-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => go(i));
        dotsEl.appendChild(dot);
      }
    });
  }

  function go(idx) {
    const slides = wrap.querySelectorAll('.testimonial-slide');
    const dots   = dotsEl ? dotsEl.querySelectorAll('.t-dot') : [];
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[idx]?.classList.add('active');
    dots[idx]?.classList.add('active');
    current = idx;
  }

  render();

  document.querySelector('.t-prev')?.addEventListener('click', () =>
    go((current - 1 + data.length) % data.length));
  document.querySelector('.t-next')?.addEventListener('click', () =>
    go((current + 1) % data.length));

  // Auto-play every 5 s
  setInterval(() => go((current + 1) % data.length), 5000);
})();

/* ── Render: Portfolio grid ── */
(function () {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  const items = getPortfolio();
  grid.innerHTML = '';

  if (!items.length) {
    grid.innerHTML = '<div class="portfolio-empty">No items yet — add them in the admin panel.</div>';
    return;
  }

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'portfolio-item reveal';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="portfolio-overlay">
        <div>
          <h4>${item.title}</h4>
          ${item.category ? `<span>${item.category}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(el);
  });

  // Re-register reveals for dynamically added items
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Render: Services grid ── */
(function () {
  const grid = document.querySelector('.services-grid[data-dynamic]');
  if (!grid) return;

  const services = getServices();
  grid.innerHTML = '';

  services.forEach(s => {
    const el = document.createElement('div');
    el.className = 'service-card reveal';
    const mediaHTML = s.image
      ? `<img src="${s.image}" alt="${s.name}">`
      : `<div class="service-placeholder"><div class="service-placeholder-icon">▶</div></div>`;

    el.innerHTML = `
      ${mediaHTML}
      <div class="service-label">
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="service-card-border"></div>
    `;
    grid.appendChild(el);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Contact form ── */
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate success (replace with FormSubmit / EmailJS logic)
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.style.display = 'block';
    }, 1200);
  });
})();
