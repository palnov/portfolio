/* AURA PREMIUM FURNITURE - GLOBAL APP SCRIPT V2 */

// 1. PRODUCT DATABASE (Premium Furniture Collection)
const PRODUCTS = [
  {
    id: 'sofa-aura',
    title: 'Диван Aura Modular',
    category: 'sofas',
    categoryName: 'Диваны',
    price: 249000,
    tag: 'NEW',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'Букле / Массив ели',
      dimensions: '280 x 105 x 75 см',
      style: 'Минимализм',
      warranty: '5 лет'
    },
    colors: [
      { name: 'Слоновая кость', hex: '#FDFBF7' },
      { name: 'Угольный серый', hex: '#3E4042' },
      { name: 'Песочный букле', hex: '#D2C3B2' }
    ],
    description: 'Aura Modular — это шедевр современного минималистичного дизайна. Выполненный из премиальной фактурной ткани букле, этот диван предлагает бескомпромиссный комфорт благодаря гибридному наполнению из высокоэластичной пены и натурального пуха.'
  },
  {
    id: 'chair-luna',
    title: 'Кресло Luna Accent',
    category: 'chairs',
    categoryName: 'Кресла',
    price: 89000,
    tag: 'HIT',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'Американский орех / Лён',
      dimensions: '82 x 88 x 80 см',
      style: 'Скандинавский',
      warranty: '3 года'
    },
    colors: [
      { name: 'Натуральный лён', hex: '#EAE5D9' },
      { name: 'Шоколадный велюр', hex: '#4B3621' }
    ],
    description: 'Индивидуальное кресло Luna сочетает в себе изящный каркас из массива американского ореха ручной полировки и глубокую посадку, обитую натуральным плотным льном.'
  },
  {
    id: 'table-zen',
    title: 'Стол Обеденный Zen Oak',
    category: 'tables',
    categoryName: 'Столы',
    price: 159000,
    tag: 'SALE',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'Массив темного дуба / Латунь',
      dimensions: '220 x 100 x 76 см',
      style: 'Лофт-премиум',
      warranty: '10 лет'
    },
    colors: [
      { name: 'Мореный дуб', hex: '#2C221E' },
      { name: 'Натуральный дуб', hex: '#B59E7C' }
    ],
    description: 'Монументальный обеденный стол Zen Oak изготовлен из цельноламельного массива дуба радиального распила. Геометрические вставки из полированной латуни на стыках подчеркивают архитектонику изделия.'
  },
  {
    id: 'cabinet-tess',
    title: 'Комод Tess Sideboard',
    category: 'cabinets',
    categoryName: 'Шкафы',
    price: 179000,
    tag: 'HIT',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'МДФ / Натуральный шпон ясеня',
      dimensions: '180 x 45 x 72 см',
      style: 'Mid-century',
      warranty: '5 лет'
    },
    colors: [
      { name: 'Черный ясень', hex: '#1C1C1D' },
      { name: 'Золотистый орех', hex: '#8C6239' }
    ],
    description: 'Элегантный сайдборд с уникальной текстурой шпона ясеня, уложенной вручную в геометрический паттерн «шеврон». Петли с доводчиками Blum гарантируют бесшумный ход дверок.'
  },
  {
    id: 'bed-somnus',
    title: 'Кровать Somnus Velvet',
    category: 'beds',
    categoryName: 'Кровати',
    price: 199000,
    tag: 'NEW',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'Бархат / Металл',
      dimensions: '200 x 220 x 115 см',
      style: 'Арт-деко',
      warranty: '5 лет'
    },
    colors: [
      { name: 'Пыльно-розовый', hex: '#C0A0A0' },
      { name: 'Изумрудный бархат', hex: '#0F3B2E' },
      { name: 'Королевский серый', hex: '#777B7E' }
    ],
    description: 'Высокое мягкое изголовье кровати Somnus с глубокой каретной стяжкой Капитоне выполнено из износостойкого матового бархата премиум-сегмента. В комплекте ортопедическое основание.'
  },
  {
    id: 'lamp-solis',
    title: 'Торшер Solis Brass',
    category: 'lighting',
    categoryName: 'Свет',
    price: 39000,
    tag: 'NEW',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    attributes: {
      material: 'Латунь / Итальянский мрамор',
      dimensions: '45 x 45 x 175 см',
      style: 'Модерн',
      warranty: '2 года'
    },
    colors: [
      { name: 'Матовая латунь', hex: '#D4AF37' },
      { name: 'Хром / Черный мрамор', hex: '#1C1C1C' }
    ],
    description: 'Дизайнерский торшер Solis создает мягкое, рассеянное свечение, идеальное для вечернего отдыха. Тяжелое основание из натурального каррарского мрамора обеспечивает устойчивость конструкции.'
  }
];

// Helper to format prices
function formatPrice(number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(number);
}

// 2. SHOPPING CART SYSTEM
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, quantity = 1, options = {}) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => 
    item.id === productId && 
    JSON.stringify(item.options) === JSON.stringify(options)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity,
      options: options
    });
  }

  saveCart();
  openCartDrawer();
  showToast(`«${product.title}» добавлен в корзину`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQuantity(index, newQty) {
  if (newQty <= 0) {
    removeFromCart(index);
  } else {
    cart[index].quantity = newQty;
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// 3. CART UI & DRAWER RENDER
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalVal = document.getElementById('cartTotalVal');
const cartBadge = document.getElementById('cartBadge');
const cartTriggerBtn = document.getElementById('cartTriggerBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');

function updateCartUI() {
  const count = getCartCount();
  
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  const badgeInButton = document.querySelector('.header-actions #cartBadge');
  if (badgeInButton) {
    badgeInButton.textContent = count;
    badgeInButton.style.display = count > 0 ? 'flex' : 'none';
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5e6063" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p class="cart-empty-text" style="font-family: var(--font-body); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);">Ваша корзина пуста</p>
        <a href="catalog.html" class="btn-primary" style="padding: 0.75rem 1.6rem; font-size: 0.8rem; letter-spacing: 0.05em;">В каталог</a>
      </div>
    `;
    if (cartTotalVal) cartTotalVal.textContent = formatPrice(0);
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
  } else {
    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          ${item.options.color ? `<div class="cart-item-meta">Цвет: ${item.options.color}</div>` : ''}
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="quantity-btn dec-btn" data-index="${index}">-</button>
              <span class="quantity-val">${item.quantity}</span>
              <button class="quantity-btn inc-btn" data-index="${index}">+</button>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
            <button class="cart-item-remove" data-index="${index}" aria-label="Удалить из корзины">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (cartTotalVal) cartTotalVal.textContent = formatPrice(getCartTotal());
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'inline-flex';
  }
}

function openCartDrawer() {
  if (cartDrawer) cartDrawer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  if (cartDrawer) cartDrawer.classList.remove('active');
  document.body.style.overflow = '';
}

// 4. HEADER INTERACTIVITY
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (header) {
    if (scrollTop > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    if (scrollTop > 300) {
      if (scrollTop > lastScrollTop) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// 5. TOAST NOTIFICATIONS
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '2rem';
    toastContainer.style.right = '2rem';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.5rem';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.backgroundColor = 'var(--bg-secondary)';
  toast.style.border = '1px solid var(--border-color-active)';
  toast.style.color = 'var(--text-primary)';
  toast.style.padding = '0.9rem 1.5rem';
  toast.style.borderRadius = '6px';
  toast.style.fontFamily = 'var(--font-body)';
  toast.style.fontWeight = '500';
  toast.style.fontSize = '0.85rem';
  toast.style.textTransform = 'uppercase';
  toast.style.letterSpacing = '0.05em';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
  toast.style.transform = 'translateY(20px)';
  toast.style.opacity = '0';
  toast.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s';
  toast.textContent = message;

  toastContainer.appendChild(toast);
  toast.offsetHeight; // Force reflow

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 6. QUICK CALL / CALLBACK MODAL SYSTEM
function openCallbackModal() {
  const modal = document.getElementById('callbackModal');
  if (modal) modal.classList.add('active');
}

function closeCallbackModal() {
  const modal = document.getElementById('callbackModal');
  if (modal) modal.classList.remove('active');
}

// 7. EVENT LISTENERS BINDINGS (WITH BUG FIXES)
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  if (cartTriggerBtn) {
    cartTriggerBtn.addEventListener('click', openCartDrawer);
  }
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  document.addEventListener('click', (e) => {
    if (cartDrawer && cartDrawer.classList.contains('active') && 
        !cartDrawer.contains(e.target) && 
        cartTriggerBtn && !cartTriggerBtn.contains(e.target) &&
        !e.target.closest('.buy-now-btn') &&
        !e.target.closest('.quantity-btn') &&
        !e.target.closest('.cart-item-remove')) {
      closeCartDrawer();
    }
  });

  // Quantity controls and remove inside cart drawer - BUG FIX INTEGRATED HERE
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      let target = e.target;
      
      // Look up target button in case child SVG/path was clicked
      const decBtn = target.closest('.dec-btn');
      const incBtn = target.closest('.inc-btn');
      const removeBtn = target.closest('.cart-item-remove');

      if (decBtn) {
        const idx = parseInt(decBtn.dataset.index);
        updateQuantity(idx, cart[idx].quantity - 1);
      } else if (incBtn) {
        const idx = parseInt(incBtn.dataset.index);
        updateQuantity(idx, cart[idx].quantity + 1);
      } else if (removeBtn) {
        const idx = parseInt(removeBtn.dataset.index);
        removeFromCart(idx);
      }
    });
  }

  const callButtons = document.querySelectorAll('.call-request-btn');
  callButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCallbackModal();
  }));

  const closeModals = document.querySelectorAll('.modal-close');
  closeModals.forEach(btn => btn.addEventListener('click', () => {
    closeCallbackModal();
    const quickBuyModal = document.getElementById('quickBuyModal');
    if (quickBuyModal) quickBuyModal.classList.remove('active');
  }));

  const callbackForm = document.getElementById('callbackForm');
  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = callbackForm.querySelector('input[type="tel"]').value;
      const nameInput = callbackForm.querySelector('input[type="text"]').value;
      
      closeCallbackModal();
      showToast(`Спасибо, ${nameInput}! Мы перезвоним вам в течение 5 минут.`);
      callbackForm.reset();
    });
  }

  const quickBuyForm = document.getElementById('quickBuyForm');
  if (quickBuyForm) {
    quickBuyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('qbPhone').value;
      const quickBuyModal = document.getElementById('quickBuyModal');
      if (quickBuyModal) quickBuyModal.classList.remove('active');

      showToast(`Заказ оформлен! Свяжемся по телефону: ${phone}.`);
      quickBuyForm.reset();
    });
  }
});

// Expose APIs
window.PRODUCTS = PRODUCTS;
window.formatPrice = formatPrice;
window.cart = cart;
window.addToCart = addToCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showToast = showToast;
window.openCallbackModal = openCallbackModal;
