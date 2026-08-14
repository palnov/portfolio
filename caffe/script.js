const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

document.querySelector('.menu-btn')?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const id = link.getAttribute('href');
  if (!id || id === '#') return;
  event.preventDefault();
  nav.classList.remove('open');
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
}));

const cart = [];
const drawer = document.querySelector('.cart-drawer');
const backdrop = document.querySelector('.cart-backdrop');
const toast = document.querySelector('.toast');
const cartCounts = document.querySelectorAll('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total b');

function showToast() {
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}
function renderCart() {
  const total = cart.reduce((sum, item) => sum + Number(item.price.replace(/\s/g, '')), 0);
  cartCounts.forEach((counter) => { counter.textContent = cart.length; });
  cartTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Пока здесь тихо.<br>Добавь что-нибудь вкусное.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-item"><div><p>${item.name}</p><small>${item.price} ₽</small></div><button type="button" data-remove="${index}" aria-label="Удалить ${item.name}">Удалить</button></div>`).join('');
  cartItems.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
function toggleCart(isOpen) {
  drawer.classList.toggle('open', isOpen);
  backdrop.classList.toggle('open', isOpen);
}
document.querySelector('.cart-trigger')?.addEventListener('click', () => toggleCart(true));
document.querySelector('.cart-close')?.addEventListener('click', () => toggleCart(false));
backdrop?.addEventListener('click', () => toggleCart(false));
document.querySelectorAll('.quick-add').forEach((button) => button.addEventListener('click', () => {
  cart.push({ name: button.dataset.name, price: button.dataset.price });
  renderCart(); showToast();
}));
document.querySelector('.checkout')?.addEventListener('click', () => { if (cart.length) { showToast(); toast.firstChild.textContent = 'Заказ почти готов '; } });

document.querySelectorAll('.shop-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.shop-tab').forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  const filter = tab.dataset.filter;
  document.querySelectorAll('.product-card').forEach((card) => { card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none'; });
}));

renderCart();
