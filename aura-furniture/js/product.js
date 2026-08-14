/* AURA PREMIUM FURNITURE - DYNAMIC PRODUCT DETAILS PAGE SCRIPT */

document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL query
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || 'sofa-aura'; // fallback to first sofa

  const product = window.PRODUCTS.find(p => p.id === productId);

  if (!product) {
    // If product not found, redirect to catalog
    window.location.href = 'catalog.html';
    return;
  }

  // Populate basic text fields
  const titleEl = document.getElementById('prodTitle');
  const priceEl = document.getElementById('prodPrice');
  const descEl = document.getElementById('prodDesc');
  const imgEl = document.getElementById('prodImg');
  const ratingEl = document.getElementById('prodRating');
  const tagEl = document.getElementById('prodTag');
  const categoryEl = document.getElementById('prodCategoryName');

  if (titleEl) titleEl.textContent = product.title;
  if (priceEl) priceEl.textContent = window.formatPrice(product.price);
  if (descEl) descEl.textContent = product.description;
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.title;
  }
  if (ratingEl) ratingEl.textContent = `★ ${product.rating.toFixed(1)}`;
  if (tagEl) {
    tagEl.textContent = product.tag;
    tagEl.className = `card-tag`; // keep layout uniform
  }
  if (categoryEl) {
    categoryEl.textContent = product.categoryName;
    categoryEl.href = `catalog.html`; // link back to catalog under category
  }

  // Render specifications / attributes table
  const specListEl = document.getElementById('prodSpecList');
  if (specListEl) {
    specListEl.innerHTML = Object.entries(product.attributes).map(([key, value]) => {
      let label = '';
      switch (key) {
        case 'material': label = 'Материал'; break;
        case 'dimensions': label = 'Габариты'; break;
        case 'style': label = 'Стиль'; break;
        case 'warranty': label = 'Гарантия'; break;
        default: label = key;
      }
      return `
        <div class="spec-row" style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
          <span class="spec-label" style="color: var(--text-secondary); font-weight: 500;">${label}</span>
          <span class="spec-value" style="color: var(--text-primary); font-weight: 600;">${value}</span>
        </div>
      `;
    }).join('');
  }

  // Render color option picker
  const colorPickerEl = document.getElementById('prodColorPicker');
  let selectedColor = product.colors[0]?.name || '';

  if (colorPickerEl && product.colors.length > 0) {
    colorPickerEl.innerHTML = `
      <span class="form-label" style="margin-bottom: 0.5rem; display: block;">Выберите цвет отделки:</span>
      <div class="color-options-wrap" style="display: flex; gap: 1rem; align-items: center;">
        ${product.colors.map((color, idx) => `
          <button class="color-dot-btn ${idx === 0 ? 'active' : ''}" 
                  data-color-name="${color.name}" 
                  style="width: 36px; height: 36px; border-radius: 50%; background-color: ${color.hex}; border: 2px solid ${idx === 0 ? 'var(--accent)' : 'transparent'}; cursor: pointer; transition: transform 0.2s, border-color 0.2s; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);"
                  title="${color.name}"></button>
        `).join('')}
        <span class="active-color-name" style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); margin-left: 0.5rem;">${selectedColor}</span>
      </div>
    `;

    // Dynamic selection controls
    const dots = colorPickerEl.querySelectorAll('.color-dot-btn');
    const colorLabel = colorPickerEl.querySelector('.active-color-name');

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.style.borderColor = 'transparent');
        dot.style.borderColor = 'var(--accent)';
        selectedColor = dot.dataset.colorName;
        if (colorLabel) colorLabel.textContent = selectedColor;
      });
    });
  }

  // Quantity Incrementor Actions
  const qtyValEl = document.getElementById('prodQtyVal');
  const qtyDecBtn = document.getElementById('prodQtyDec');
  const qtyIncBtn = document.getElementById('prodQtyInc');
  let qty = 1;

  if (qtyValEl && qtyDecBtn && qtyIncBtn) {
    qtyDecBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyValEl.textContent = qty;
      }
    });

    qtyIncBtn.addEventListener('click', () => {
      qty++;
      qtyValEl.textContent = qty;
    });
  }

  // Add to cart click
  const addToCartBtn = document.getElementById('prodAddToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      window.addToCart(product.id, qty, {
        color: selectedColor
      });
    });
  }

  // Quick order click
  const prodQuickBuyBtn = document.getElementById('prodQuickBuyBtn');
  if (prodQuickBuyBtn) {
    prodQuickBuyBtn.addEventListener('click', () => {
      const modal = document.getElementById('quickBuyModal');
      if (modal) {
        document.getElementById('qbProductTitle').textContent = product.title;
        document.getElementById('qbProductPrice').textContent = window.formatPrice(product.price * qty);
        document.getElementById('qbProductImg').src = product.image;
        document.getElementById('qbProductId').value = product.id;
        modal.classList.add('active');
      }
    });
  }

  // Render related products (recommendations)
  const relatedGridEl = document.getElementById('relatedGrid');
  if (relatedGridEl) {
    const related = window.PRODUCTS
      .filter(p => p.id !== product.id)
      .slice(0, 3); // Grab 3 related items

    relatedGridEl.innerHTML = related.map(p => `
      <div class="product-card">
        <span class="card-tag">${p.tag}</span>
        <div class="product-img-wrapper">
          <a href="product.html?id=${p.id}">
            <img class="product-img" src="${p.image}" alt="${p.title}" loading="lazy">
          </a>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="meta-pill">${p.attributes.material.split('/')[0].trim()}</span>
            <span class="meta-pill">★ ${p.rating.toFixed(1)}</span>
          </div>
          <h3 class="product-title">
            <a href="product.html?id=${p.id}">${p.title}</a>
          </h3>
          <div class="product-price-row">
            <div class="price-container">
              <span class="price-label">Цена</span>
              <span class="price-value">${window.formatPrice(p.price)}</span>
            </div>
            <a href="product.html?id=${p.id}" class="buy-now-btn" style="background-color: transparent; border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.6rem 1.2rem;">
              Смотреть
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }
});
