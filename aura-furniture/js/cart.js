/* AURA PREMIUM FURNITURE - CHECKOUT & ORDERING LOGIC */

document.addEventListener('DOMContentLoaded', () => {
  const checkoutItemsContainer = document.getElementById('checkoutItems');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutForm = document.getElementById('checkoutForm');
  const emptyCartState = document.getElementById('emptyCartState');
  const activeCheckoutState = document.getElementById('activeCheckoutState');

  function renderCheckoutPage() {
    const cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    if (cart.length === 0) {
      if (emptyCartState) emptyCartState.style.display = 'block';
      if (activeCheckoutState) activeCheckoutState.style.display = 'none';
      return;
    }

    if (emptyCartState) emptyCartState.style.display = 'none';
    if (activeCheckoutState) activeCheckoutState.style.display = 'grid';

    if (!checkoutItemsContainer) return;

    // Render list
    checkoutItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="checkout-item" style="display: flex; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border-color); align-items: center;">
        <div class="checkout-item-img" style="width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background-color: var(--bg-primary);">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="checkout-item-details" style="flex-grow: 1;">
          <h4 style="font-family: var(--font-headings); font-weight: 600; font-size: 1.1rem; color: var(--text-primary);">${item.title}</h4>
          ${item.options.color ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">Цвет: ${item.options.color}</p>` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
            <div class="quantity-controls" style="padding: 0.15rem 0.5rem;">
              <button class="quantity-btn ch-dec-btn" data-index="${index}">-</button>
              <span class="quantity-val">${item.quantity}</span>
              <button class="quantity-btn ch-inc-btn" data-index="${index}">+</button>
            </div>
            <span style="font-family: var(--font-headings); font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${window.formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
        <button class="cart-item-remove ch-remove-btn" data-index="${index}" style="margin-left: 1rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

    // Totals calculation
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Free shipping above 150 000 руб, else 5000 руб
    const shippingCost = subtotal >= 150000 ? 0 : 5000;
    const grandTotal = subtotal + shippingCost;

    if (checkoutSubtotal) checkoutSubtotal.textContent = window.formatPrice(subtotal);
    if (checkoutShipping) {
      checkoutShipping.textContent = shippingCost === 0 ? 'Бесплатно' : window.formatPrice(shippingCost);
      if (shippingCost === 0) checkoutShipping.style.color = 'var(--accent)';
    }
    if (checkoutTotal) checkoutTotal.textContent = window.formatPrice(grandTotal);

    // Bind event handlers inside checkout list
    attachCheckoutEvents();
  }

  function attachCheckoutEvents() {
    const cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    const decBtns = checkoutItemsContainer.querySelectorAll('.ch-dec-btn');
    const incBtns = checkoutItemsContainer.querySelectorAll('.ch-inc-btn');
    const removeBtns = checkoutItemsContainer.querySelectorAll('.ch-remove-btn');

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        updateCartQuantity(index, cart[index].quantity - 1);
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        updateCartQuantity(index, cart[index].quantity + 1);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        removeCartItem(index);
      });
    });
  }

  function updateCartQuantity(index, qty) {
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
    if (qty <= 0) {
      removeCartItem(index);
    } else {
      cart[index].quantity = qty;
      localStorage.setItem('aura_cart', JSON.stringify(cart));
      renderCheckoutPage();
      // Sync with global header basket badge
      if (window.updateCartUI) window.updateCartUI();
    }
  }

  function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    renderCheckoutPage();
    if (window.updateCartUI) window.updateCartUI();
  }

  // Handle Order Submit Form
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('chName').value;
      const phone = document.getElementById('chPhone').value;
      const email = document.getElementById('chEmail').value;
      const address = document.getElementById('chAddress').value;

      // Create checkout success display
      const activeCheckoutState = document.getElementById('activeCheckoutState');
      if (activeCheckoutState) {
        activeCheckoutState.innerHTML = `
          <div class="success-screen" style="grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background-color: rgba(247, 153, 122, 0.1); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="font-family: var(--font-headings); font-weight: 700; font-size: 2.5rem; color: var(--text-primary); margin-bottom: 1rem;">Заказ успешно оформлен!</h2>
            <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; line-height: 1.6;">
              Спасибо за ваш выбор, <strong>${name}</strong>. Наш дизайнер-консультант уже получил детали вашего заказа и свяжется с вами по номеру <strong>${phone}</strong> в течение 10 минут, чтобы согласовать доставку и варианты обивки.
            </p>
            <a href="catalog.html" class="btn-primary">Вернуться в магазин</a>
          </div>
        `;
      }

      // Empty shopping cart storage
      localStorage.removeItem('aura_cart');
      if (window.updateCartUI) window.updateCartUI();
    });
  }

  // Initial rendering triggers
  renderCheckoutPage();
});
