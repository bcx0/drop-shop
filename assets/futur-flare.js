document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initWatchersBadge();
  initStickyAtc();
  initAnnouncementScroll();
});

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.ff-reveal');

  if (!revealElements.length || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initWatchersBadge() {
  const watchersElement = document.getElementById('ff-watchers');

  if (!watchersElement) return;

  const updateWatchers = () => {
    const count = randomInt(18, 47);
    watchersElement.textContent = `${count} personnes regardent ce drop`;
  };

  updateWatchers();
  window.setInterval(updateWatchers, 30000);
}

function initStickyAtc() {
  const productForm = document.querySelector('.product-form');
  const originalSubmit = document.querySelector('.product-form__submit');

  if (!productForm || !originalSubmit) return;

  const productTitle = document.querySelector('.product__title');
  const stickyBar = document.createElement('div');
  const titleNode = document.createElement('div');
  const actionButton = document.createElement('button');

  stickyBar.className = 'ff-sticky-atc';
  titleNode.className = 'ff-sticky-atc__title';
  titleNode.textContent = productTitle ? productTitle.textContent.trim() : '';

  actionButton.className = 'btn-primary ff-sticky-atc__button';
  actionButton.type = 'button';
  actionButton.textContent = 'AJOUTER AU PANIER';
  actionButton.addEventListener('click', () => {
    originalSubmit.click();
  });

  stickyBar.append(titleNode, actionButton);
  document.body.appendChild(stickyBar);

  const syncVisibility = () => {
    const isMobile = window.innerWidth < 768;
    const submitRect = originalSubmit.getBoundingClientRect();
    const passedOriginalButton = submitRect.bottom < 0;

    stickyBar.style.display = isMobile && passedOriginalButton ? 'flex' : 'none';
  };

  syncVisibility();
  window.addEventListener('scroll', syncVisibility, { passive: true });
  window.addEventListener('resize', syncVisibility);
}

function initAnnouncementScroll() {
  const track = document.getElementById('ff-announcement-track');

  if (!track || !track.children.length) return;

  Array.from(track.children).forEach((child) => {
    track.appendChild(child.cloneNode(true));
  });

  track.classList.add('ff-scrolling');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
