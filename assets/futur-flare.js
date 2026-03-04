/* ============================================
   FUTUR FLARE — BRAND JS — BRUTAL EDITION
   ============================================ */

(function() {
  'use strict';

  // ============ CUSTOM CURSOR ============
  function initCursor() {
    if (window.innerWidth < 1024) return;
    
    const cursor = document.createElement('div');
    cursor.id = 'ff-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = 'a, button, .card-wrapper, .btn';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ============ PARTICLE CANVAS ============
  function initParticles() {
    if (window.innerWidth < 768) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'ff-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#7C3AED', '#06B6D4', '#A855F7', '#0891B2'];
    const COUNT = 60;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.life = Math.random() * 200 + 100;
        this.age = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        if (this.age > this.life || 
            this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrame = requestAnimationFrame(animate);
    }
    animate();
  }

  // ============ SCROLL REVEAL ============
  function initScrollReveal() {
    const els = document.querySelectorAll('.ff-reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => observer.observe(el));
  }

  // ============ FOMO WATCHER BADGE ============
  function initWatcherBadge() {
    const el = document.getElementById('ff-watchers');
    if (!el) return;

    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    el.textContent = getRandom(18, 47) + ' personnes regardent ce drop';

    setInterval(() => {
      const num = getRandom(18, 47);
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = num + ' personnes regardent ce drop';
        el.style.opacity = '1';
        el.style.transition = 'opacity 0.5s ease';
      }, 300);
    }, 30000);
  }

  // ============ TAP GLOW MOBILE ============
  function initTapGlow() {
    document.querySelectorAll('.card-wrapper').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.classList.add('ff-tap-glow');
        setTimeout(() => this.classList.remove('ff-tap-glow'), 500);
      }, { passive: true });
    });
  }

  // ============ STICKY ATC MOBILE ============
  function initStickyATC() {
    if (window.innerWidth > 768) return;
    
    const productForm = document.querySelector('.product-form');
    const originalATC = document.querySelector('.product-form__submit');
    const productTitle = document.querySelector('.product__title');
    
    if (!productForm || !originalATC) return;

    const stickyBar = document.createElement('div');
    stickyBar.id = 'ff-sticky-atc';
    stickyBar.innerHTML = `
      <span class="ff-atc-title">${productTitle ? productTitle.textContent.trim() : 'Ajouter au panier'}</span>
      <button class="ff-atc-btn">⚡ AJOUTER AU PANIER</button>
    `;
    document.body.appendChild(stickyBar);

    stickyBar.querySelector('.ff-atc-btn').addEventListener('click', () => {
      originalATC.click();
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }, { threshold: 0.5 });

    observer.observe(originalATC);
  }

  // ============ ANNOUNCEMENT SCROLL ============
  function initAnnouncementScroll() {
    const track = document.getElementById('ff-announcement-track');
    if (!track) return;
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  }

  // ============ GLITCH TITLES ============
  function initGlitchTitles() {
    document.querySelectorAll('.ff-glitch').forEach(el => {
      el.setAttribute('data-text', el.textContent);
    });
  }

  // ============ INIT ALL ============
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initWatcherBadge();
    initAnnouncementScroll();
    initGlitchTitles();

    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    if (!isMobile) {
      initParticles();
      initCursor();
      initStickyATC();
    } else {
      initTapGlow();
      const canvas = document.getElementById('ff-canvas');
      if (canvas) canvas.remove();
    }
  });

})();
