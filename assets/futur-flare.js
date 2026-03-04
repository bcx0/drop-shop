(function() {
  'use strict';

  function initParticles() {
    if (window.innerWidth < 1024) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'ff-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#7C3AED', '#06B6D4', '#A855F7', '#0891B2'];
    const COUNT = 50;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({length: COUNT}, () => new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  function initCursor() {
    if (window.innerWidth < 1024) return;
    const cursor = document.createElement('div');
    cursor.id = 'ff-cursor';
    document.body.appendChild(cursor);
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });
  }

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

  function initWatcherBadge() {
    const el = document.getElementById('ff-watchers');
    if (!el) return;
    el.textContent = Math.floor(Math.random() * 29 + 18) + ' personnes regardent ce drop';
    setInterval(() => {
      el.textContent = Math.floor(Math.random() * 29 + 18) + ' personnes regardent ce drop';
    }, 30000);
  }

  function initTapGlow() {
    document.querySelectorAll('.card-wrapper').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.classList.add('ff-tap-glow');
        setTimeout(() => this.classList.remove('ff-tap-glow'), 500);
      }, { passive: true });
    });
  }

  function initAnnouncementScroll() {
    const track = document.getElementById('ff-announcement-track');
    if (!track) return;
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  }

  function initGlitchTitles() {
    document.querySelectorAll('.ff-glitch').forEach(el => {
      el.setAttribute('data-text', el.textContent);
    });
  }

  window.addEventListener('load', function() {
    const isTouch = 'ontouchstart' in window || window.innerWidth < 1024;

    if (!isTouch) {
      initParticles();
      initCursor();
    }

    initScrollReveal();
    initWatcherBadge();
    initAnnouncementScroll();
    initGlitchTitles();
    initTapGlow();
  }, { passive: true });

})();
