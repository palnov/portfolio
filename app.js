const qs = (selector, context = document) => context.querySelector(selector);
const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

const header = qs('#site-header');
const menuToggle = qs('#menu-toggle');
const mainNav = qs('#main-nav');

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.classList.toggle('is-open');
  mainNav?.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

qsa('.main-nav a').forEach(link => link.addEventListener('click', () => {
  menuToggle?.classList.remove('is-open');
  mainNav?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const cursorGlow = qs('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .14 })
  : null;

qsa('.reveal').forEach(element => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('visible');
});

const filterButtons = qsa('.filter-button');
const projectCards = qsa('.project-card');
const emptyState = qs('#projects-empty');

filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });

  let visibleCount = 0;
  projectCards.forEach(card => {
    const visible = filter === 'all' || card.dataset.segment === filter;
    card.classList.toggle('is-hidden', !visible);
    if (visible) visibleCount += 1;
  });
  emptyState?.classList.toggle('is-visible', visibleCount === 0);
}));

const serviceRows = qsa('.service-row');
serviceRows.forEach(row => row.addEventListener('click', () => {
  serviceRows.forEach(item => {
    const active = item === row;
    item.classList.toggle('is-open', active);
    item.setAttribute('aria-expanded', String(active));
  });
}));

const previewModal = qs('#preview-modal');
const previewFrame = qs('#preview-frame');
const previewLoader = qs('#frame-loader');
const previewTitle = qs('#preview-title');
const previewKind = qs('#preview-kind');
const previewTags = qs('#preview-tags');
const previewUrl = qs('#preview-url');
const previewExternal = qs('#preview-external');

const closePreview = () => {
  if (!previewModal) return;
  previewModal.classList.remove('is-open');
  previewModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (previewFrame) {
    previewFrame.classList.remove('is-loaded');
    previewFrame.src = 'about:blank';
  }
};

const openPreview = card => {
  if (!previewModal || !previewFrame) return;
  const url = card.dataset.url || '';
  const title = card.dataset.title || 'Проект';
  const kind = card.dataset.kind || 'live preview';
  const tags = card.dataset.tags || '—';

  previewTitle.textContent = title;
  previewKind.textContent = kind;
  previewTags.textContent = tags;
  previewUrl.textContent = url;
  previewExternal.href = url;
  previewLoader?.classList.remove('is-hidden');
  previewFrame.classList.remove('is-loaded');
  previewFrame.src = url;
  previewModal.classList.add('is-open');
  previewModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

projectCards.forEach(card => {
  qs('.project-open', card)?.addEventListener('click', () => openPreview(card));
});

previewFrame?.addEventListener('load', () => {
  previewFrame.classList.add('is-loaded');
  previewLoader?.classList.add('is-hidden');
});

qsa('[data-close-preview]').forEach(element => element.addEventListener('click', closePreview));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && previewModal?.classList.contains('is-open')) closePreview();
});

const contactForm = qs('#contact-form');
const formStatus = qs('#form-status');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  formStatus?.classList.add('is-visible');
  const submit = qs('.form-submit', contactForm);
  if (submit) {
    submit.innerHTML = 'Задача принята <span>✓</span>';
    submit.style.background = '#1b1b16';
    submit.style.color = '#f3efe8';
  }
});

const yearTarget = qs('[data-year]');
if (yearTarget) yearTarget.textContent = new Date().getFullYear();
