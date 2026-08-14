/* AURA PREMIUM FURNITURE - CATALOG FILTER & RENDER ENGINE */

document.addEventListener('DOMContentLoaded', () => {
  const catalogGrid = document.getElementById('catalogGrid');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const searchInput = document.getElementById('searchInput');
  const likesCountBadge = document.getElementById('likesCountBadge');

  let activeCategory = 'all';
  let searchQuery = '';
  let likedProducts = JSON.parse(localStorage.getItem('aura_likes')) || [];

  // Expose likedProducts for debugging/external hooks
  window.likedProducts = likedProducts;

  // Initialize likes badge
  updateLikesBadge();

  // Render products
  function renderCatalog() {
    if (!catalogGrid) return;

    // Filter products
    const filtered = window.PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; color: var(--text-muted);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p style="font-size: 1.1rem; font-family: var(--font-headings); font-weight: 600;">Ничего не найдено</p>
          <p style="font-size: 0.9rem; margin-top: 0.25rem;">Попробуйте изменить параметры поиска или фильтр</p>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = filtered.map(product => {
      const isLiked = likedProducts.includes(product.id);
      return `
        <div class="product-card" data-product-id="${product.id}">
          <span class="card-tag">${product.tag}</span>
          <button class="card-like-btn ${isLiked ? 'active' : ''}" data-id="${product.id}" aria-label="Добавить в избранное">
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <div class="product-img-wrapper">
            <a href="product.html?id=${product.id}">
              <img class="product-img" src="${product.image}" alt="${product.title}" loading="lazy">
            </a>
          </div>
          
          <div class="product-info">
            <div class="product-meta">
              <span class="meta-pill">${product.attributes.material.split('/')[0].trim()}</span>
              <span class="meta-pill">★ ${product.rating.toFixed(1)}</span>
            </div>
            
            <h3 class="product-title">
              <a href="product.html?id=${product.id}">${product.title}</a>
            </h3>
            
            <div class="product-price-row">
              <div class="price-container">
                <span class="price-label">Цена</span>
                <span class="price-value">${window.formatPrice(product.price)}</span>
              </div>
              <button class="buy-now-btn quick-buy-trigger" data-id="${product.id}">
                Купить в 1 клик
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Trigger slight entry animation for new items if GSAP is available
    if (window.gsap) {
      window.gsap.fromTo(catalogGrid.children, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
      );
    }

    // Attach card event listeners
    attachCardEvents();
  }

  function attachCardEvents() {
    // Like button toggle
    const likeButtons = catalogGrid.querySelectorAll('.card-like-btn');
    likeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        
        if (likedProducts.includes(id)) {
          likedProducts = likedProducts.filter(item => item !== id);
          btn.classList.remove('active');
          window.showToast('Удалено из избранного');
        } else {
          likedProducts.push(id);
          btn.classList.add('active');
          window.showToast('Добавлено в избранное');
        }
        
        localStorage.setItem('aura_likes', JSON.stringify(likedProducts));
        updateLikesBadge();
      });
    });

    // Quick Buy button modal triggers
    const quickBuyBtns = catalogGrid.querySelectorAll('.quick-buy-trigger');
    quickBuyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        openQuickBuy(id);
      });
    });
  }

  // Opens the quick buy popup modal
  function openQuickBuy(productId) {
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickBuyModal');
    if (!modal) return;

    document.getElementById('qbProductTitle').textContent = product.title;
    document.getElementById('qbProductPrice').textContent = window.formatPrice(product.price);
    document.getElementById('qbProductImg').src = product.image;
    document.getElementById('qbProductId').value = product.id;

    modal.classList.add('active');
  }

  function updateLikesBadge() {
    if (!likesCountBadge) return;
    const count = likedProducts.length;
    likesCountBadge.textContent = count;
    likesCountBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Search input binding
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Tabs navigation bindings
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderCatalog();
    });
  });

  // Initial render
  renderCatalog();
});
