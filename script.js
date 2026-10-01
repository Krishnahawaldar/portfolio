/* ===========================================
   PORTFOLIO — SCRIPT.JS
   Handles: particles, navbar, typing effect,
   counter animation, scroll reveals, tabs,
   form validation, mobile menu
  =========================================== */
'use strict';

/* ============================================
   1. PARTICLE BACKGROUND
   ============================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const PARTICLE_COUNT = 70;
  const colors = ['hsla(264,80%,62%,', 'hsla(185,90%,55%,', 'hsla(312,75%,62%,'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colorBase = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      colorBase,
    };
  }

  function initParticleArray() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + p.alpha + ')';
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(264,80%,62%,${0.1 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize();
  initParticleArray();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initParticleArray();
    draw();
  }, { passive: true });
})();


/* ============================================
   2. NAVBAR — scroll + active link + mobile
   ============================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mob-link');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Active link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 90) currentId = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  updateActiveLink();
})();


/* ============================================
   3. TYPING EFFECT
   ============================================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'stunning UIs ✨',
    'scalable APIs 🔗',
    'mobile apps 📱',
    'fast websites 🚀',
    'AI integrations 🤖',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pausing = false;

  function type() {
    const word = words[wordIdx];
    const current = word.substring(0, charIdx);
    el.textContent = current;

    if (!deleting && charIdx < word.length) {
      charIdx++;
      setTimeout(type, 85);
    } else if (!deleting && charIdx === word.length) {
      if (!pausing) {
        pausing = true;
        setTimeout(() => { pausing = false; deleting = true; type(); }, 1800);
      }
    } else if (deleting && charIdx > 0) {
      charIdx--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(type, 300);
    }
  }

  setTimeout(type, 600);
})();


/* ============================================
   4. COUNTER ANIMATION (Hero stats)
   ============================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let started = false;

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = 20;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.5 });

  obs.observe(heroSection);
})();


/* ============================================
   5. SCROLL REVEAL
   ============================================ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // For skill bars — trigger fill animation
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--target')
            || getComputedStyle(bar).getPropertyValue('--target');
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    obs.observe(el);
  });
})();


/* ============================================
   6. SKILL TABS
   ============================================ */
(function initSkillTabs() {
  const tabs = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger skill bar animations for newly visible panel
        panel.querySelectorAll('.skill-card').forEach(card => {
          card.classList.add('visible');
        });
      }
    });
  });
})();


/* ============================================
   7. CONTACT FORM VALIDATION
   ============================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');
  const successMsg = document.getElementById('form-success');

  const fields = [
    { id: 'input-name', errorId: 'error-name', label: 'Full name', validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    { id: 'input-email', errorId: 'error-email', label: 'Email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    { id: 'input-subject', errorId: 'error-subject', label: 'Subject', validate: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.' },
    { id: 'input-message', errorId: 'error-message', label: 'Message', validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  ];

  function showError(field, msg) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.errorId);
    if (msg) {
      input.classList.add('error');
      error.textContent = msg;
    } else {
      input.classList.remove('error');
      error.textContent = '';
    }
    return !msg;
  }

  // Live validation on blur
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;
    input.addEventListener('blur', () => {
      showError(field, field.validate(input.value));
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        showError(field, field.validate(input.value));
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    successMsg.style.display = 'none';

    // Validate all fields
    let valid = true;
    fields.forEach(field => {
      const input = document.getElementById(field.id);
      const ok = showError(field, field.validate(input ? input.value : ''));
      if (!ok) valid = false;
    });

    if (!valid) return;

    // Simulate sending
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
      successMsg.style.display = 'block';
      form.reset();
    }, 1800);
  });
})();


/* ============================================
   8. FOOTER YEAR
   ============================================ */
(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ============================================
   9. SMOOTH ACTIVE SECTION HIGHLIGHT
   ============================================ */
(function initSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();
