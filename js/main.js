/* ══════════════════════════════════════════
   TSVC STUDIO — main.js
   ══════════════════════════════════════════ */

/* ── Nav scroll ── */
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
    if (href === page || (page === '' && href === 'index.html'))
      a.classList.add('active');
  });
})();

/* ── Scroll reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── Counter animation ── */
function animateCount(el, target, suffix) {
  const dur = 1800, step = 16;
  const inc  = target / (dur / step);
  let   val  = 0;
  const timer = setInterval(() => {
    val += inc;
    if (val >= target) { el.textContent = target.toLocaleString() + suffix; clearInterval(timer); }
    else el.textContent = Math.floor(val).toLocaleString() + suffix;
  }, step);
}
(function () {
  const section = document.querySelector('.stats');
  if (!section) return;
  let done = false;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true;
      section.querySelectorAll('[data-count]').forEach(el =>
        animateCount(el, parseInt(el.dataset.count), el.dataset.suffix || ''));
    }
  }, { threshold: 0.3 });
  io.observe(section);
})();

/* ══════════════════════════════════════════
   DATA LAYER
   ══════════════════════════════════════════ */
const STORE = {
  get: (k, fb = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } },
  set: (k, v)         => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
};

const DEFAULT_SERVICES = [
  { id: 's1', name: 'Short-Form Content', desc: 'Viral Reels, TikToks & Shorts engineered for maximum organic reach.',    image: '' },
  { id: 's2', name: 'Long-Form Editing',  desc: 'Full-length video editing with cinematic storytelling and pacing.',       image: '' },
  { id: 's3', name: 'Social Media Mgmt',  desc: 'Strategy, scheduling & community growth across all major platforms.',     image: '' },
  { id: 's4', name: 'Brand Videos',       desc: 'Professional brand identity films that define your digital presence.',   image: '' },
  { id: 's5', name: 'Thumbnails & GFX',   desc: 'High-conversion visual assets designed to stop the scroll instantly.',   image: '' },
  { id: 's6', name: 'Strategy & Consult', desc: 'Data-driven content strategy sessions to accelerate your growth curve.', image: '' },
];

function getServices()     { return STORE.get('tsvc_services', DEFAULT_SERVICES); }
function getPortfolio()    { return STORE.get('tsvc_portfolio', []); }
function getTestimonials() { return STORE.get('tsvc_testimonials', []); }

/* ══════════════════════════════════════════
   TESTIMONIALS — unified text + video slider
   ══════════════════════════════════════════ */
(function () {
  const listEl    = document.querySelector('.testimonials-list');
  const dotsEl    = document.querySelector('.t-dots');
  const section   = document.querySelector('.testimonials-section');
  const typeTabs  = document.querySelectorAll('.t-type-btn');
  if (!listEl) return;

  const allData = getTestimonials();
  if (!allData.length) { if (section) section.style.display = 'none'; return; }

  let currentFilter = 'all'; // 'all' | 'text' | 'video'
  let current = 0;
  let autoTimer = null;

  /* ── Build embed URL from any YouTube / Vimeo link ── */
  function buildEmbedUrl(url) {
    if (!url) return null;
    // YouTube: watch, youtu.be, shorts
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
    // Vimeo
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0&color=cc1111`;
    return null;
  }

  /* ── Check if a testimonial is a video type ── */
  function isVideo(t) { return !!(t.videoUrl || t.videoEmbed); }

  /* ── Get filtered list ── */
  function filtered() {
    if (currentFilter === 'text')  return allData.filter(t => !isVideo(t));
    if (currentFilter === 'video') return allData.filter(t => isVideo(t));
    return allData;
  }

  /* ── Render slide HTML ── */
  function buildSlideHTML(t) {
    if (isVideo(t)) {
      const embedUrl = buildEmbedUrl(t.videoUrl);
      let videoHTML  = '';

      if (embedUrl) {
        // YouTube / Vimeo embed
        videoHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
      } else if (t.videoUrl && !embedUrl) {
        // Direct video file (mp4, webm, etc.)
        videoHTML = `<video controls preload="metadata" playsinline>
          <source src="${t.videoUrl}" type="video/mp4">
          Your browser does not support video playback.
        </video>`;
      } else if (t.videoEmbed) {
        // base64 uploaded video
        videoHTML = `<video controls preload="metadata" playsinline>
          <source src="${t.videoEmbed}">
        </video>`;
      }

      return `
        <div class="testimonial-video-wrap">${videoHTML}</div>
        <div class="testimonial-video-meta">
          <div class="testimonial-video-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="2,1 9,5 2,9"/></svg>
            Video Review
          </div>
          <div>
            <div class="testimonial-author">${t.name}</div>
            ${t.role ? `<div class="testimonial-role">${t.role}</div>` : ''}
          </div>
        </div>
        ${t.text ? `<p class="testimonial-text" style="margin-top:1.2rem;font-size:0.92rem;">"${t.text}"</p>` : ''}
      `;
    } else {
      return `
        <div class="testimonial-quote-mark">"</div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">${t.name}</div>
        ${t.role ? `<div class="testimonial-role">${t.role}</div>` : ''}
      `;
    }
  }

  /* ── Full render ── */
  function render() {
    const data = filtered();
    listEl.innerHTML = '';
    if (dotsEl) dotsEl.innerHTML = '';
    current = 0;
    clearInterval(autoTimer);

    if (!data.length) {
      listEl.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:3rem 0;font-size:0.9rem;">No testimonials in this category yet.</p>';
      return;
    }

    data.forEach((t, i) => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = buildSlideHTML(t);
      listEl.appendChild(slide);

      if (dotsEl) {
        const dot = document.createElement('div');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => go(i));
        dotsEl.appendChild(dot);
      }
    });

    // Only auto-play for text testimonials
    if (currentFilter !== 'video') {
      autoTimer = setInterval(() => go((current + 1) % data.length), 5500);
    }
  }

  /* ── Navigate ── */
  function go(idx) {
    const slides = listEl.querySelectorAll('.testimonial-slide');
    const dots   = dotsEl ? dotsEl.querySelectorAll('.t-dot') : [];
    const data   = filtered();

    // Pause any playing video in the leaving slide
    const activeSlide = listEl.querySelector('.testimonial-slide.active');
    if (activeSlide) {
      const vid = activeSlide.querySelector('video');
      if (vid) vid.pause();
      const iframe = activeSlide.querySelector('iframe');
      if (iframe) iframe.src = iframe.src; // reset embed
    }

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[idx]?.classList.add('active');
    dots[idx]?.classList.add('active');
    current = idx;
  }

  /* ── Tab filter ── */
  typeTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      typeTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.type;
      render();
    });
  });

  /* ── Prev / Next buttons ── */
  document.querySelector('.t-prev')?.addEventListener('click', () => go((current - 1 + filtered().length) % filtered().length));
  document.querySelector('.t-next')?.addEventListener('click', () => go((current + 1) % filtered().length));

  /* ── Show/hide type tabs based on what exists ── */
  const hasText  = allData.some(t => !isVideo(t));
  const hasVideo = allData.some(t => isVideo(t));
  const typeTabsWrap = document.querySelector('.testimonial-type-tabs');
  if (typeTabsWrap) {
    // Only show tabs if both types exist
    typeTabsWrap.style.display = (hasText && hasVideo) ? 'flex' : 'none';
  }

  render();
})();

/* ── Services grid ── */
(function () {
  const grid = document.querySelector('.services-grid[data-dynamic]');
  if (!grid) return;
  const services = getServices();
  grid.innerHTML = '';
  services.forEach(s => {
    const el = document.createElement('div');
    el.className = 'service-card reveal';
    el.innerHTML = `
      ${s.image ? `<img src="${s.image}" alt="${s.name}">` : `<div class="service-placeholder"><div class="service-placeholder-icon">▶</div></div>`}
      <div class="service-label"><h3>${s.name}</h3><p>${s.desc}</p></div>
      <div class="service-card-border"></div>
    `;
    grid.appendChild(el);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Portfolio grid ── */
(function () {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;
  const items = getPortfolio();
  grid.innerHTML = '';
  if (!items.length) { grid.innerHTML = '<div class="portfolio-empty">No items yet — add them in the admin panel.</div>'; return; }
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'portfolio-item reveal';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="portfolio-overlay">
        <div><h4>${item.title}</h4>${item.category ? `<span>${item.category}</span>` : ''}</div>
      </div>
    `;
    grid.appendChild(el);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Contact form ── */
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      const s = document.querySelector('.form-success');
      if (s) s.style.display = 'block';
    }, 1200);
  });
})();
