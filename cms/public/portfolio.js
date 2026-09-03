const qs = (selector, context = document) => context.querySelector(selector);
const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

const header = qs('#site-header');
const menuToggle = qs('#menu-toggle');
const mainNav = qs('#main-nav');
const pageMain = qs('main');
const mobileNavQuery = window.matchMedia('(max-width: 720px)');

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

const syncMobileNavAvailability = () => {
  if (!mainNav || !menuToggle) return;
  const isOpen = menuToggle.classList.contains('is-open');
  if (mobileNavQuery.matches) {
    mainNav.toggleAttribute('inert', !isOpen);
    mainNav.setAttribute('aria-hidden', String(!isOpen));
  } else {
    mainNav.removeAttribute('inert');
    mainNav.removeAttribute('aria-hidden');
  }
};

const setMenuOpen = isOpen => {
  menuToggle?.classList.toggle('is-open', isOpen);
  mainNav?.classList.toggle('is-open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('menu-open', isOpen);
  syncMobileNavAvailability();
};

menuToggle?.addEventListener('click', () => {
  setMenuOpen(!menuToggle.classList.contains('is-open'));
});

qsa('.main-nav a').forEach(link => link.addEventListener('click', () => {
  setMenuOpen(false);
}));

mobileNavQuery.addEventListener('change', () => {
  setMenuOpen(false);
});
syncMobileNavAvailability();

const cursorGlow = qs('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let cursorFrame = 0;
  let cursorX = -220;
  let cursorY = -220;
  window.addEventListener('pointermove', event => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      cursorGlow.style.setProperty('--cursor-x', `${cursorX}px`);
      cursorGlow.style.setProperty('--cursor-y', `${cursorY}px`);
      cursorFrame = 0;
    });
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

// Keep the marquee long enough to cover the widest viewport and move by one
// exact content group. This prevents a blank tail or a jump when the loop
// restarts, even after fonts load or the viewport is resized.
const marquee = qs('.marquee');
const marqueeTrack = qs('.marquee-track', marquee);
const marqueeSeed = qs('.marquee-group', marqueeTrack);
if (marquee && marqueeTrack && marqueeSeed) {
  const syncMarquee = () => {
    const groupWidth = marqueeSeed.getBoundingClientRect().width;
    if (!groupWidth) return;

    const groupsNeeded = Math.max(3, Math.ceil(marquee.clientWidth / groupWidth) + 2);
    while (marqueeTrack.children.length < groupsNeeded) {
      const clone = marqueeSeed.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.append(clone);
    }

    marqueeTrack.style.setProperty('--marquee-end-x', `-${groupWidth}px`);
  };

  syncMarquee();
  document.fonts?.ready.then(syncMarquee);
  if ('ResizeObserver' in window) new ResizeObserver(syncMarquee).observe(marquee);
  else window.addEventListener('resize', syncMarquee, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      marqueeTrack.classList.toggle('is-paused', !entry.isIntersecting);
    }).observe(marquee);
  }
}

const filterButtons = qsa('.filter-button');
const projectCards = qsa('.project-card');
const projectGrid = qs('#projects-grid');
const emptyState = qs('#projects-empty');
const projectDesktopQuery = window.matchMedia('(min-width: 941px)');

// The original bento used nth-child spans. Once a filter hid a card, those
// spans still belonged to the old positions and left holes in the grid. Build
// a fresh, packed layout from the visible set instead.
const legacyPortfolioLayout = [
  { columns: 2, rows: 2 },
  { columns: 1, rows: 1 },
  { columns: 1, rows: 1 },
  { columns: 2, rows: 1 },
  { columns: 2, rows: 2 },
  { columns: 1, rows: 1 },
  { columns: 1, rows: 1 },
  { columns: 2, rows: 1 },
  { columns: 1, rows: 1 },
  { columns: 1, rows: 1 },
  { columns: 2, rows: 2 },
  { columns: 2, rows: 1 },
];

const getDesktopProjectLayout = count => {
  if (count === 12) return legacyPortfolioLayout;
  if (count === 0) return [];
  if (count === 1) return [{ columns: 4, rows: 2 }];
  if (count === 2) return [{ columns: 2, rows: 2 }, { columns: 2, rows: 2 }];
  if (count === 3) return [{ columns: 2, rows: 2 }, { columns: 2, rows: 1 }, { columns: 2, rows: 1 }];

  const layout = [{ columns: 2, rows: 2 }];
  const lastCardIsFullWidth = count % 2 === 0;
  for (let index = 1; index < count; index += 1) {
    const isLast = index === count - 1;
    layout.push({ columns: lastCardIsFullWidth && isLast ? 4 : 2, rows: 1 });
  }
  return layout;
};

const syncProjectLayout = () => {
  if (!projectGrid) return;

  const visibleCards = projectCards.filter(card => !card.classList.contains('is-hidden'));
  const layout = projectDesktopQuery.matches
    ? getDesktopProjectLayout(visibleCards.length)
    : visibleCards.map(() => ({ columns: 1, rows: 1 }));

  projectGrid.classList.add('is-layout-managed');
  projectGrid.dataset.visibleCount = String(visibleCards.length);

  projectCards.forEach(card => {
    card.style.removeProperty('--project-col-span');
    card.style.removeProperty('--project-row-span');
  });

  visibleCards.forEach((card, index) => {
    const cardLayout = layout[index] || { columns: 1, rows: 1 };
    card.style.setProperty('--project-col-span', String(cardLayout.columns));
    card.style.setProperty('--project-row-span', String(cardLayout.rows));
  });
};

filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  let visibleCount = 0;
  projectCards.forEach(card => {
    const visible = filter === 'all' || card.dataset.segment === filter;
    card.classList.toggle('is-hidden', !visible);
    if (visible) visibleCount += 1;
  });
  syncProjectLayout();
  emptyState?.classList.toggle('is-visible', visibleCount === 0);
}));

syncProjectLayout();
if (projectDesktopQuery.addEventListener) projectDesktopQuery.addEventListener('change', syncProjectLayout);
else projectDesktopQuery.addListener(syncProjectLayout);

const serviceRows = qsa('.service-row');
serviceRows.forEach(row => row.addEventListener('click', () => {
  serviceRows.forEach(item => {
    const active = item === row;
    item.classList.toggle('is-open', active);
    item.setAttribute('aria-expanded', String(active));
    qs('.service-copy small', item)?.setAttribute('aria-hidden', String(!active));
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
const previewDialog = qs('.preview-dialog', previewModal);
const previewClose = qs('.preview-close', previewModal);
let previewTrigger = null;

const getPreviewFocusables = () => qsa('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])', previewModal)
  .filter(element => element.getClientRects().length > 0);

const closePreview = () => {
  if (!previewModal) return;
  previewModal.classList.remove('is-open');
  previewModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  header?.removeAttribute('inert');
  pageMain?.removeAttribute('inert');
  if (previewFrame) {
    previewFrame.classList.remove('is-loaded');
    previewFrame.src = 'about:blank';
  }
  previewTrigger?.focus();
  previewTrigger = null;
};

const openPreview = card => {
  if (!previewModal || !previewFrame) return;
  const url = card.dataset.url || '';
  const title = card.dataset.title || 'Проект';
  const kind = card.dataset.kind || 'live preview';
  const tags = card.dataset.tags || '—';

  previewTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

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
  header?.setAttribute('inert', '');
  pageMain?.setAttribute('inert', '');
  requestAnimationFrame(() => (previewClose || previewDialog)?.focus());
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
  if (event.key === 'Escape' && previewModal?.classList.contains('is-open')) {
    closePreview();
    return;
  }
  if (event.key === 'Escape' && menuToggle?.classList.contains('is-open')) {
    setMenuOpen(false);
    menuToggle.focus();
    return;
  }
  if (event.key !== 'Tab' || !previewModal?.classList.contains('is-open')) return;

  const focusables = getPreviewFocusables();
  if (!focusables.length) {
    event.preventDefault();
    previewDialog?.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && (document.activeElement === first || !previewModal.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !previewModal.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
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
