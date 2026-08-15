/**
 * Brewdom Frontend Application Code
 * Handles Interactive Filters, Dynamic Page Routing, Price Configurations, Quiz, Map & FAQs.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Identify current page context
  const isProjectPage = window.location.pathname.includes("project.html");
  
  if (isProjectPage) {
    initProjectPage();
  } else {
    initLandingPage();
  }

  initCommonFeatures();
  refreshIconLibrary();
});

function refreshIconLibrary() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({
      attrs: {
        "stroke-width": 1.6,
        "aria-hidden": "true"
      }
    });
  }
}

// Common UI Elements & Interactions
function initCommonFeatures() {
  // Sticky Header scroll styling
  const header = document.getElementById("main-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Mobile menu for the portfolio iframe and narrow devices.
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("menu-is-open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
}

// ----------------------------------------------------
// LANDING PAGE CONTROLLER
// ----------------------------------------------------
let activeCategory = "all";

function initLandingPage() {
  renderCatalog();
  setupCatalogFilters();
  setupHotspots();
}

// Render dynamic catalog items
function renderCatalog() {
  const grid = document.getElementById("catalog-projects-grid");
  const emptyState = document.getElementById("catalog-empty-state");
  if (!grid) return;

  // Retrieve filter values
  const areaMin = parseFloat(document.getElementById("area-min").value) || 0;
  const areaMax = parseFloat(document.getElementById("area-max").value) || 999;
  const priceMin = (parseFloat(document.getElementById("price-min").value) || 0) * 1000000;
  const priceMax = (parseFloat(document.getElementById("price-max").value) || 999) * 1000000;
  const storeys = document.getElementById("filter-storeys-select").value;

  // Apply filters
  const filtered = PROJECTS_DATA.filter(p => {
    const matchesCategory = (activeCategory === "all" || p.type === activeCategory);
    const matchesArea = (p.area >= areaMin && p.area <= areaMax);
    const matchesPrice = (p.basePrice >= priceMin && p.basePrice <= priceMax);
    const matchesStoreys = (storeys === "all" || p.storeys === storeys);

    return matchesCategory && matchesArea && matchesPrice && matchesStoreys;
  });

  // Render cards
  grid.innerHTML = "";
  if (filtered.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "block";
  } else {
    grid.style.display = "grid";
    emptyState.style.display = "none";

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.id = `project-card-${p.id}`;

      const formattedPrice = formatCurrency(p.basePrice);
      const formattedOldPrice = formatCurrency(p.oldPrice);

      card.innerHTML = `
        <div class="card-img-container">
          <img src="${p.images[0]}" alt="${p.title}">
          <span class="card-badge">${p.type === 'house' ? 'Дом из бруса' : 'Баня под ключ'}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.shortDescription}</p>
          <div class="card-specs">
            <div class="spec-item">
              <span class="spec-val">${p.area} м²</span>
              <span class="spec-lbl">Площадь</span>
            </div>
            <div class="spec-item">
              <span class="spec-val">${p.size}</span>
              <span class="spec-lbl">Размер</span>
            </div>
            <div class="spec-item">
              <span class="spec-val">${p.storeys}</span>
              <span class="spec-lbl">Этажи</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="price-container">
              <span class="old-price">${formattedOldPrice}</span>
              <span class="current-price">${formattedPrice}</span>
            </div>
            <a href="project.html?id=${p.id}" class="btn btn-secondary btn-sm" style="padding: 10px 18px; font-size: 0.85rem;" id="btn-more-${p.id}">Подробнее &rarr;</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

// Listen to filter elements
function setupCatalogFilters() {
  const categoryTags = document.querySelectorAll(".category-tag");
  categoryTags.forEach(tag => {
    tag.addEventListener("click", (e) => {
      categoryTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      activeCategory = tag.getAttribute("data-type");
      renderCatalog();
    });
  });

  const inputs = [
    document.getElementById("area-min"),
    document.getElementById("area-max"),
    document.getElementById("price-min"),
    document.getElementById("price-max"),
    document.getElementById("filter-storeys-select")
  ];

  inputs.forEach(input => {
    if (input) {
      input.addEventListener("input", renderCatalog);
      input.addEventListener("change", renderCatalog);
    }
  });
}

function resetFilters() {
  document.getElementById("area-min").value = 30;
  document.getElementById("area-max").value = 200;
  document.getElementById("price-min").value = 0.5;
  document.getElementById("price-max").value = 7.0;
  document.getElementById("filter-storeys-select").value = "all";
  
  const categoryTags = document.querySelectorAll(".category-tag");
  categoryTags.forEach(t => t.classList.remove("active"));
  document.getElementById("tag-all-categories").classList.add("active");
  activeCategory = "all";

  renderCatalog();
}

// Quality Hotspots details logic
const HOTSPOTS_DATA = {
  1: {
    title: "1. Энергоэффективная кровля",
    text: "Монтаж кровельного пирога по ГОСТу с использованием ветро-влагозащитной мембраны Ondutiss, базальтового утеплителя Rockwool 200 мм и вентиляционного зазора."
  },
  2: {
    title: "2. Соединение венцов в «теплый угол»",
    text: "Шип и паз выпиливаются с прецизионной точностью на немецком оборудовании. Полностью защищает от сквозняков и теплопотерь в зимние месяцы."
  },
  3: {
    title: "3. Прочная нижняя обвязка",
    text: "Двойной обвязочный венец из бруса 150x200 мм, обработанный защитным составом, закрепленный на фундаменте через гидроизоляционную подложку."
  }
};

function showHotspotInfo(id) {
  const title = document.getElementById("hotspot-info-title");
  const text = document.getElementById("hotspot-info-text");
  const panel = document.getElementById("hotspot-info-panel");

  if (title && text && panel) {
    title.innerText = HOTSPOTS_DATA[id].title;
    text.innerText = HOTSPOTS_DATA[id].text;
    panel.animate(
      [
        { opacity: 0.55, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }
}

function setupHotspots() {
  // Hover pulse stop or quick initialization if any
}

// FAQ Accordion toggles
function toggleFaq(id) {
  const item = document.getElementById(`faq-item-${id}`);
  if (!item) return;

  const content = item.querySelector(".faq-content");
  const isOpen = item.classList.contains("active");

  // Close other FAQs
  document.querySelectorAll(".faq-item").forEach(el => {
    el.classList.remove("active");
    el.querySelector(".faq-content").style.maxHeight = "0";
  });

  if (!isOpen) {
    item.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// ----------------------------------------------------
// PROJECT CONFIGURATOR PAGE CONTROLLER
// ----------------------------------------------------
let currentProject = null;
let selectedConfig = {
  timber: 0,
  foundation: 0,
  roof: 0
};
let currentSlideIndex = 0;

function initProjectPage() {
  // Retrieve ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id") || "db-01";
  
  currentProject = PROJECTS_DATA.find(p => p.id === id);
  if (!currentProject) {
    // Redirect if project doesn't exist
    window.location.href = "index.html";
    return;
  }

  renderProjectDetails();
  calculateConfigPrice();
}

function renderProjectDetails() {
  // Title & breadcrumb
  document.getElementById("breadcrumb-current").innerText = currentProject.title;
  document.getElementById("project-main-title").innerText = currentProject.title;
  document.getElementById("project-short-desc").innerText = currentProject.shortDescription;
  document.getElementById("project-type-badge").innerText = currentProject.type === 'house' ? 'Дом из бруса' : 'Баня под ключ';

  // Specs
  document.getElementById("spec-val-area").innerText = `${currentProject.area} м²`;
  document.getElementById("spec-val-size").innerText = `${currentProject.size} м`;
  document.getElementById("spec-val-storeys").innerText = currentProject.storeys;
  document.getElementById("spec-val-rooms").innerText = currentProject.rooms;
  document.getElementById("spec-val-bathrooms").innerText = currentProject.bathrooms;
  document.getElementById("spec-val-buildtime").innerText = `${currentProject.buildTime} дней`;

  // Dynamic Image slider & thumbnails
  const slider = document.getElementById("detail-gallery-slider");
  const thumbsContainer = document.getElementById("detail-gallery-thumbs");
  
  // Clear layout except navigation buttons
  const navBtns = slider.querySelectorAll(".slider-nav");
  slider.innerHTML = "";
  navBtns.forEach(btn => slider.appendChild(btn));
  thumbsContainer.innerHTML = "";

  currentProject.images.forEach((imgUrl, index) => {
    // Slider item
    const imgEl = document.createElement("img");
    imgEl.src = imgUrl;
    imgEl.alt = `${currentProject.title} фото ${index + 1}`;
    imgEl.style.display = index === 0 ? "block" : "none";
    imgEl.className = "gallery-slide-img";
    slider.appendChild(imgEl);

    // Thumbnail
    const thumb = document.createElement("div");
    thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${imgUrl}" alt="эскиз">`;
    thumb.addEventListener("click", () => setSlide(index));
    thumbsContainer.appendChild(thumb);
  });

  // Configurator Options
  renderOptionsGroup("timber", currentProject.options.timber);
  renderOptionsGroup("foundation", currentProject.options.foundation);
  renderOptionsGroup("roof", currentProject.options.roof);
}

function renderOptionsGroup(groupName, items) {
  const container = document.getElementById(`options-${groupName}-container`);
  if (!container) return;

  container.innerHTML = "";
  items.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = `config-option ${index === 0 ? 'active' : ''}`;
    itemEl.setAttribute("data-group", groupName);
    itemEl.setAttribute("data-index", index);

    const priceText = item.price === 0 ? "Входит в стоимость" : `+ ${formatCurrency(item.price)}`;

    itemEl.innerHTML = `
      <div class="option-left">
        <div class="option-radio"></div>
        <div class="option-details">
          <span class="option-name">${item.name}</span>
          <span class="option-desc">${item.desc}</span>
        </div>
      </div>
      <div class="option-price">${priceText}</div>
    `;

    itemEl.addEventListener("click", () => {
      // Toggle active states
      const groupOptions = container.querySelectorAll(".config-option");
      groupOptions.forEach(opt => opt.classList.remove("active"));
      itemEl.classList.add("active");

      // Update configuration data
      selectedConfig[groupName] = index;
      calculateConfigPrice();
    });

    container.appendChild(itemEl);
  });
}

function calculateConfigPrice() {
  if (!currentProject) return;

  const base = currentProject.basePrice;
  const timberAdd = currentProject.options.timber[selectedConfig.timber].price;
  const foundationAdd = currentProject.options.foundation[selectedConfig.foundation].price;
  const roofAdd = currentProject.options.roof[selectedConfig.roof].price;

  const total = base + timberAdd + foundationAdd + roofAdd;
  const oldTotal = currentProject.oldPrice + timberAdd + foundationAdd + roofAdd;

  // Number roll animations on price output
  const priceVal = document.getElementById("config-price-total");
  const priceOld = document.getElementById("config-price-old");
  const priceSqm = document.getElementById("config-price-sqm");

  if (priceVal) priceVal.innerText = formatCurrency(total);
  if (priceOld) priceOld.innerText = formatCurrency(oldTotal);
  if (priceSqm) {
    const sqmPrice = Math.round(total / currentProject.area);
    priceSqm.innerText = `от ${sqmPrice.toLocaleString('ru-RU')} ₽ / м²`;
  }
}

// Slider Gallery Navigations
function setSlide(index) {
  currentSlideIndex = index;
  const slideImgs = document.querySelectorAll(".gallery-slide-img");
  const thumbs = document.querySelectorAll(".gallery-thumb");

  slideImgs.forEach((img, i) => {
    img.style.display = i === index ? "block" : "none";
  });

  thumbs.forEach((t, i) => {
    if (i === index) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });
}

function nextSlide() {
  if (!currentProject) return;
  let next = currentSlideIndex + 1;
  if (next >= currentProject.images.length) next = 0;
  setSlide(next);
}

function prevSlide() {
  if (!currentProject) return;
  let prev = currentSlideIndex - 1;
  if (prev < 0) prev = currentProject.images.length - 1;
  setSlide(prev);
}

// Delivery Estimator Calculation
function calculateDeliveryCost() {
  const dist = parseFloat(document.getElementById("delivery-distance").value) || 0;
  const costVal = document.getElementById("delivery-cost-value");
  const costSub = document.getElementById("delivery-cost-subtext");

  if (!costVal || !costSub) return;

  if (dist <= 50) {
    costVal.innerText = "Бесплатно";
    costVal.style.color = "var(--color-primary)";
    costSub.innerText = "До 50 км от МКАД доставка осуществляется за счет компании!";
  } else {
    // 60 rubles per km after the initial 50 km free zone
    const extraDist = dist - 50;
    const cost = extraDist * 60;
    costVal.innerText = `+ ${cost.toLocaleString('ru-RU')} ₽`;
    costVal.style.color = "var(--color-dark)";
    costSub.innerText = `Расчет: ${extraDist} км превышения х 60 ₽/км.`;
  }
}

// Share project feature
function shareProject() {
  const tempInput = document.createElement("input");
  tempInput.value = window.location.href;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  showSuccessAlert("Ссылка скопирована!", "Отправьте её друзьям или родственникам.");
}

// Download estimate simulation
function downloadEstimate() {
  showSuccessAlert("Смета формируется!", "Файл PDF с полной сметой будет сохранен автоматически в течение 5 секунд.");
}

// ----------------------------------------------------
// MODALS AND FORM SUBMISSIONS CONTROLLERS
// ----------------------------------------------------
let quizStep = 1;
let quizAnswers = {
  step1: "",
  step2: "",
  step3: ""
};

// Quiz Functions
function openQuizModal() {
  document.getElementById("quiz-modal").classList.add("active");
  setQuizStep(1);
}

function closeQuizModal() {
  document.getElementById("quiz-modal").classList.remove("active");
}

function setQuizStep(step) {
  quizStep = step;
  
  // Manage visibility
  document.querySelectorAll(".quiz-step").forEach(el => {
    el.classList.remove("active");
    if (parseInt(el.getAttribute("data-step")) === step) {
      el.classList.add("active");
    }
  });

  // Indicator
  const pct = step * 25;
  document.getElementById("quiz-progress-indicator").style.width = `${pct}%`;

  // Nav buttons styling
  const prevBtn = document.getElementById("quiz-prev-btn");
  const nextBtn = document.getElementById("quiz-next-btn");
  const submitBtn = document.getElementById("quiz-submit-btn");

  if (step === 1) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  if (step === 4) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  }
}

function selectQuizOption(stepNum, val) {
  quizAnswers[`step${stepNum}`] = val;
  
  // Stylize options select states
  const stepContainer = document.querySelector(`.quiz-step[data-step="${stepNum}"]`);
  const options = stepContainer.querySelectorAll(".quiz-option");
  options.forEach(opt => {
    if (opt.innerText === val || opt.textContent.includes(val)) {
      opt.classList.add("selected");
    } else {
      opt.classList.remove("selected");
    }
  });

  // Auto proceed next step with slight organic delay
  setTimeout(() => {
    nextQuizStep();
  }, 350);
}

function nextQuizStep() {
  if (quizStep < 4) {
    setQuizStep(quizStep + 1);
  }
}

function prevQuizStep() {
  if (quizStep > 1) {
    setQuizStep(quizStep - 1);
  }
}

// Callback modals
function openCallbackModal() {
  document.getElementById("callback-modal").classList.add("active");
}

function closeCallbackModal() {
  document.getElementById("callback-modal").classList.remove("remove");
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
}

function openEstimateModal() {
  const callbackTitle = document.getElementById("modal-callback-title");
  if (callbackTitle) {
    callbackTitle.innerText = "Расчет своего проекта";
  }
  openCallbackModal();
}

// Form Submission handlers with clean success callbacks
function handleFormSubmit(e, formId) {
  e.preventDefault();

  // Highlight form or hide modal
  if (formId === 'quiz-form') {
    closeQuizModal();
  } else if (formId === 'modal-callback-form') {
    closeCallbackModal();
  }

  // Clear elements
  const form = document.getElementById(formId);
  if (form) form.reset();

  showSuccessAlert("Заявка успешно принята!", "Наш менеджер свяжется с вами по указанному номеру телефона.");
}

function handleConfigSubmit(e) {
  e.preventDefault();
  showSuccessAlert("Конфигурация отправлена!", "Мы подготовим детальный расчет на основе выбранных параметров и перезвоним вам.");
}

function showSuccessAlert(title, text) {
  const alertEl = document.getElementById("success-notification");
  if (!alertEl) return;

  const h4 = alertEl.querySelector("h4");
  const p = alertEl.querySelector("p");

  h4.innerText = title;
  p.innerText = text;

  alertEl.style.display = "flex";
  alertEl.style.opacity = "0";
  setTimeout(() => {
    alertEl.style.opacity = "1";
    alertEl.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    alertEl.style.transform = "translateY(20px)";
    alertEl.style.opacity = "0";
    setTimeout(() => {
      alertEl.style.display = "none";
    }, 400);
  }, 4000);
}

// Helper: Formatter currency
function formatCurrency(num) {
  return num.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
