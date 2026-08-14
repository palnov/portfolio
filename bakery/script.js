document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $('#site-header');
  const menuToggle = $('#menu-toggle');
  const mainNav = $('#main-nav');

  const setHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMobileMenu = () => {
    menuToggle.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('is-open');
    mainNav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.main-nav a').forEach((link) => link.addEventListener('click', closeMobileMenu));

  const toast = $('#toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3100);
  };

  $$('.action-toast').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('wish-button')) {
        const liked = button.classList.toggle('is-liked');
        button.querySelector('span').textContent = liked ? '♥' : '♡';
        showToast(liked ? 'Добавили в избранное' : 'Убрали из избранного');
        return;
      }
      showToast(button.dataset.toast || 'Скоро расскажем об этом подробнее');
    });
  });

  const cart = [];
  const cartDrawer = $('#cart-drawer');
  const cartBackdrop = $('#cart-backdrop');
  const cartItems = $('#cart-items');
  const cartEmpty = $('#cart-empty');
  const cartFooter = $('#cart-footer');
  const cartCount = $('#cart-count');
  const cartTitleCount = $('#cart-title-count');
  const cartTotal = $('#cart-total');

  const formatPrice = (price) => `${Number(price).toLocaleString('ru-RU')} ₽`;

  const openCart = () => {
    document.body.classList.add('cart-is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  };
  const closeCart = () => {
    document.body.classList.remove('cart-is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  };

  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  $('#cart-empty-link').addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
      closeMobileMenu();
    }
  });

  const renderCart = () => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = itemCount;
    cartTitleCount.textContent = `(${itemCount})`;
    cartTotal.textContent = formatPrice(total);
    cartEmpty.hidden = cart.length > 0;
    cartFooter.classList.toggle('is-disabled', cart.length === 0);

    cartItems.innerHTML = cart.map((item) => `
      <article class="cart-item" data-cart-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${formatPrice(item.price)} · за штуку</p>
          <div class="cart-item-controls">
            <button class="quantity-button" type="button" data-cart-action="decrease" aria-label="Уменьшить количество">−</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-button" type="button" data-cart-action="increase" aria-label="Увеличить количество">+</button>
          </div>
        </div>
        <strong class="cart-item-price">${formatPrice(item.price * item.quantity)}</strong>
      </article>
    `).join('');
  };

  const addToCart = (card) => {
    const item = {
      id: card.dataset.productId,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      quantity: 1,
    };
    const existing = cart.find((cartItem) => cartItem.id === item.id);
    if (existing) existing.quantity += 1;
    else cart.push(item);
    renderCart();
    showToast(`${item.name} добавили в корзину`);
  };

  $$('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.closest('.product-card')));
  });

  cartItems.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) return;
    const itemElement = actionButton.closest('[data-cart-id]');
    const item = cart.find((cartItem) => cartItem.id === itemElement.dataset.cartId);
    if (!item) return;
    if (actionButton.dataset.cartAction === 'increase') item.quantity += 1;
    if (actionButton.dataset.cartAction === 'decrease') item.quantity -= 1;
    if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
    renderCart();
  });

  $('#checkout').addEventListener('click', () => {
    if (!cart.length) return;
    closeCart();
    showToast('Заявку приняли — скоро свяжемся для подтверждения заказа');
    cart.splice(0, cart.length);
    renderCart();
  });

  const filterTabs = $$('.filter-tab');
  const productCards = $$('.product-card');
  const catalogCount = $('#catalog-count');
  const filterLabels = { all: '04 позиции', bread: '01 позиция', pastry: '01 позиция', sweet: '02 позиции' };
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      filterTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      productCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
      catalogCount.textContent = `${filterLabels[filter]} · доступны сегодня`;
    });
  });

  $('#newsletter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button');
    button.innerHTML = 'Вы в списке <span aria-hidden="true">✓</span>';
    event.currentTarget.reset();
    showToast('Готово — первое письмо уже греется в печи');
    window.setTimeout(() => { button.innerHTML = 'Подписаться <span aria-hidden="true">↗</span>'; }, 4200);
  });

  renderCart();
});
