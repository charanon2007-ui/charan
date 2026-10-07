/**
 * CHARAN B R - PORTFOLIO INTERACTIVITY
 * Features:
 * - Theme detection via prefers-color-scheme & manual day/night toggle
 * - Vertical HUD navigation rail scroll-spy
 * - Ambient cyber particle canvas animation
 * - Mobile drawer navigation
 * - Contact transmission feedback
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. THEME DETECTION & TOGGLE (NIGHT / DAY MODE)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const savedTheme = localStorage.getItem('charan_theme_mode');
  const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    if (theme) {
      htmlRoot.setAttribute('data-theme', theme);
    } else {
      htmlRoot.removeAttribute('data-theme');
    }
    updateThemeToggleUI(theme || (mediaDark.matches ? 'dark' : 'light'));
  }

  function updateThemeToggleUI(activeTheme) {
    if (!themeToggleBtn) return;
    const isDark = activeTheme === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', isDark ? 'false' : 'true');
    themeToggleBtn.setAttribute(
      'title',
      isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
    );
  }

  // Initial load
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Automatically detect system preference
    applyTheme(null);
  }

  // Manual Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || (mediaDark.matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', next);
      localStorage.setItem('charan_theme_mode', next);
      updateThemeToggleUI(next);
    });
  }

  // Watch system changes if user hasn't set manual preference
  mediaDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('charan_theme_mode')) {
      applyTheme(null);
    }
  });

  // --------------------------------------------------------------------------
  // 2. VERTICAL HUD RAIL SCROLL-SPY & PROGRESS
  // --------------------------------------------------------------------------
  const railDots = document.querySelectorAll('.rail-dot');
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && railDots.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');

          // Update vertical rail dots
          railDots.forEach((dot) => {
            if (dot.getAttribute('data-section') === currentId) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });

          // Update header navigation links
          mainNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 3. AMBIENT CYBER PARTICLE CANVAS
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(width > 768 ? 45 : 20, 60);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedY = -(Math.random() * 0.4 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }

      draw() {
        const isLight = htmlRoot.getAttribute('data-theme') === 'light' || 
          (!htmlRoot.getAttribute('data-theme') && !mediaDark.matches);

        ctx.fillStyle = isLight
          ? `rgba(79, 70, 229, ${this.alpha * 0.4})`
          : `rgba(0, 245, 212, ${this.alpha * 0.6})`;

        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), Math.floor(this.size), Math.floor(this.size));
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('nav-open');
    });

    document.querySelectorAll('.primary-nav .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. CONTACT TRANSMISSION FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');

      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        if (formStatus) {
          formStatus.textContent = '[ERROR: Missing required fields (Name & Email)]';
          formStatus.style.color = '#f72585';
        }
        return;
      }

      if (formStatus) {
        formStatus.textContent = `[SUCCESS: Payload received from ${nameInput.value.trim()}. Transmission dispatched to Charan B R.]`;
        formStatus.className = 'form-status-feedback success';
      }

      contactForm.reset();

      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = '';
        }
      }, 6000);
    });
  }

  // --------------------------------------------------------------------------
  // 6. DYNAMIC COPYRIGHT YEAR
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
