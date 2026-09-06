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
const projectsMore = qs('#projects-more');
const projectsMoreLabel = qs('#projects-more-label');
const projectsMoreCount = qs('#projects-more-count');
const projectDesktopQuery = window.matchMedia('(min-width: 941px)');
const projectMobileQuery = window.matchMedia('(max-width: 720px)');
const mobileProjectLimit = 6;
let mobileProjectsExpanded = false;
const isDesktopProjectView = () => window.innerWidth >= 941;
const isMobileProjectView = () => window.innerWidth <= 720;

// Pack complete editorial groups; four remaining cards form two pairs.
const getDesktopProjectLayout = count => {
  const layout = [];
  let row = 1;
  let mirrored = false;
  while (layout.length < count) {
    const remaining = count - layout.length;
    if (remaining === 1) {
      layout.push({ columns: 12, rows: 2, column: 1, row });
    } else if (remaining === 2 || remaining === 4) {
      layout.push({ columns: 6, rows: 2, column: 1, row }, { columns: 6, rows: 2, column: 7, row });
    } else {
      layout.push(
        { columns: 7, rows: 2, column: mirrored ? 6 : 1, row },
        { columns: 5, rows: 1, column: mirrored ? 1 : 8, row },
        { columns: 5, rows: 1, column: mirrored ? 1 : 8, row: row + 1 },
      );
      mirrored = !mirrored;
    }
    row += 2;
  }
  return layout;
};

const getFilteredProjectCards = () => projectCards.filter(card => !card.classList.contains('is-hidden'));
const getDisplayedProjectCards = () => projectCards.filter(card => (
  !card.classList.contains('is-hidden') && !card.classList.contains('is-mobile-hidden')
));

const syncMobileProjectVisibility = () => {
  const filteredCards = getFilteredProjectCards();
  const shouldCollapse = isMobileProjectView() && !mobileProjectsExpanded;

  projectCards.forEach(card => {
    const index = filteredCards.indexOf(card);
    const isMobileHidden = shouldCollapse && index >= mobileProjectLimit;
    card.classList.toggle('is-mobile-hidden', isMobileHidden);
    if (!isMobileHidden && index >= 0) {
      card.classList.add('visible');
      revealObserver?.unobserve(card);
    }
  });

  const remaining = Math.max(0, filteredCards.length - mobileProjectLimit);
  if (!projectsMore) return;
  const canExpand = isMobileProjectView() && remaining > 0;
  projectsMore.hidden = !canExpand;
  projectsMore.setAttribute('aria-expanded', String(isMobileProjectView() && mobileProjectsExpanded));
  if (projectsMoreLabel) projectsMoreLabel.textContent = mobileProjectsExpanded ? 'Свернуть проекты' : 'Показать ещё';
  if (projectsMoreCount) projectsMoreCount.textContent = mobileProjectsExpanded ? '' : `+${remaining}`;
};

const syncProjectLayout = () => {
  if (!projectGrid) return;

  const visibleCards = getDisplayedProjectCards();
  const layout = isDesktopProjectView()
    ? getDesktopProjectLayout(visibleCards.length)
    : visibleCards.map(() => ({ columns: 1, rows: 1 }));

  projectGrid.classList.add('is-layout-managed');
  projectGrid.dataset.visibleCount = String(visibleCards.length);
  projectGrid.dataset.unpaired = String(visibleCards.length % 2 === 1);

  projectCards.forEach(card => {
    card.classList.toggle('is-last-visible', card === visibleCards[visibleCards.length - 1]);
    card.style.removeProperty('--project-col-span');
    card.style.removeProperty('--project-row-span');
    card.style.removeProperty('--project-column');
    card.style.removeProperty('--project-row');
  });

  visibleCards.forEach((card, index) => {
    const cardLayout = layout[index] || { columns: 1, rows: 1 };
    card.style.setProperty('--project-col-span', String(cardLayout.columns));
    card.style.setProperty('--project-row-span', String(cardLayout.rows));
    card.style.setProperty('--project-column', String(cardLayout.column || 'auto'));
    card.style.setProperty('--project-row', String(cardLayout.row || 'auto'));
  });
};

const projectMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const projectAnimations = new Set();
const stopProjectAnimations = () => {
  projectAnimations.forEach(animation => animation.cancel());
  projectAnimations.clear();
};
const animateProject = (element, frames, options) => {
  const animation = element.animate(frames, options);
  projectAnimations.add(animation);
  animation.finished.then(() => projectAnimations.delete(animation), () => projectAnimations.delete(animation));
};

filterButtons.forEach(button => button.addEventListener('click', () => {
  if (button.classList.contains('is-active')) return;
  const animate = !projectMotionQuery.matches && typeof projectGrid?.animate === 'function';
  // Read current on-screen positions before cancelling an interrupted transition.
  const before = new Map(getDisplayedProjectCards()
    .map(card => [card, card.getBoundingClientRect()]));
  const oldHeight = projectGrid?.getBoundingClientRect().height || 0;
  stopProjectAnimations();

  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  projectCards.forEach(card => {
    const visible = filter === 'all' || card.dataset.segment === filter;
    card.classList.toggle('is-hidden', !visible);
  });
  mobileProjectsExpanded = false;
  syncMobileProjectVisibility();
  syncProjectLayout();
  const filteredCards = getFilteredProjectCards();
  const visibleCards = getDisplayedProjectCards();
  emptyState?.classList.toggle('is-visible', filteredCards.length === 0);
  if (!animate) return;

  const after = visibleCards.map(card => [card, card.getBoundingClientRect()]);
  const timing = { duration: 480, easing: 'cubic-bezier(.22, 1, .36, 1)' };
  after.forEach(([card, rect], index) => {
    const previous = before.get(card);
    const from = previous
      ? { transform: `translate(${previous.left - rect.left}px, ${previous.top - rect.top}px) scale(${previous.width / rect.width}, ${previous.height / rect.height})`, opacity: 1 }
      : { transform: 'translateY(24px) scale(.97)', opacity: 0 };
    animateProject(card, [
      { ...from, transformOrigin: '0 0' },
      { transform: 'none', opacity: 1, transformOrigin: '0 0' },
    ], { ...timing, delay: previous ? 0 : Math.min(index * 35, 140), fill: 'backwards' });
  });
  animateProject(projectGrid, [
    { height: `${oldHeight}px` },
    { height: `${projectGrid.getBoundingClientRect().height}px` },
  ], timing);
}));

projectMotionQuery.addEventListener('change', stopProjectAnimations);
projectMobileQuery.addEventListener('change', () => {
  mobileProjectsExpanded = false;
  syncMobileProjectVisibility();
  syncProjectLayout();
});
window.addEventListener('resize', stopProjectAnimations, { passive: true });

projectsMore?.addEventListener('click', () => {
  mobileProjectsExpanded = !mobileProjectsExpanded;
  syncMobileProjectVisibility();
  syncProjectLayout();
  if (mobileProjectsExpanded) {
    projectsMore?.scrollIntoView({ block: 'nearest', behavior: projectMotionQuery.matches ? 'auto' : 'smooth' });
  }
});

syncMobileProjectVisibility();
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
