// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Vite exposes files from /public at the site root, while a page opened with a
// double click must address that directory explicitly.
const assetPath = path => {
    const cleanPath = path.replace(/^\.\//, "");
    return window.location.protocol === "file:"
        ? `./public/${cleanPath}`
        : `./${cleanPath}`;
};

// -------------------------------------------------------------
// 1. Scrollytelling Setup (102 Frames Canvas Player)
// -------------------------------------------------------------

const canvas = document.getElementById("scrollytelling-canvas");
const context = canvas.getContext("2d");

const frameCount = 102;
const currentFrame = index => (
    assetPath(`scrollytelling/hero_frame_${(index + 1).toString().padStart(3, '0')}.webp`)
);

// Preload Images
const images = [];
const sequence = {
    frame: 0
};

// Track loaded image count
let loadedImagesCount = 0;

function preloadImages() {
    return new Promise((resolve) => {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = () => {
                loadedImagesCount++;
                if (loadedImagesCount === frameCount) {
                    resolve();
                }
            };
            img.onerror = () => {
                loadedImagesCount++;
                if (loadedImagesCount === frameCount) {
                    resolve();
                }
            };
            img.src = currentFrame(i);
            images.push(img);
        }
    });
}

// Render logic: scale to cover canvas (aspect-ratio cover)
function renderFrame(img) {
    if (!img) return;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    
    if (imgWidth === 0 || imgHeight === 0) return;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
    } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// Update canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    if (images[sequence.frame]) {
        renderFrame(images[sequence.frame]);
    }
}

// Load frames and launch animations
preloadImages().then(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    renderFrame(images[0]);

    // GSAP ScrollTrigger to tie scroll to frames
    gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#hero-scrollytelling",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: render => {
                const currentFrameIndex = Math.round(sequence.frame);
                if (images[currentFrameIndex]) {
                    renderFrame(images[currentFrameIndex]);
                }
                updateSlides(currentFrameIndex);
            }
        }
    });
});

// -------------------------------------------------------------
// 2. Storytelling Slides Fading Logic
// -------------------------------------------------------------

const slides = document.querySelectorAll(".story-slide");
const scrollIndicator = document.getElementById("scroll-indicator");

function updateSlides(frameIndex) {
    let activeIndex = 0;
    
    if (frameIndex < 25) {
        activeIndex = 0;
    } else if (frameIndex >= 25 && frameIndex < 50) {
        activeIndex = 1;
    } else if (frameIndex >= 50 && frameIndex < 75) {
        activeIndex = 2;
    } else {
        activeIndex = 3;
    }

    slides.forEach((slide, index) => {
        if (index === activeIndex) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
    });

    if (frameIndex > 5) {
        scrollIndicator.style.opacity = "0";
    } else {
        scrollIndicator.style.opacity = "1";
    }
}

// -------------------------------------------------------------
// 3. Header Dynamics (Background transition on scroll)
// -------------------------------------------------------------

const header = document.getElementById("header");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// -------------------------------------------------------------
// 4. Responsive Mobile Navigation (Burger)
// -------------------------------------------------------------

const burger = document.getElementById("burger-menu");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

burger.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-active");
    burger.classList.toggle("burger-active");
    
    if (navMenu.classList.contains("mobile-active")) {
        gsap.fromTo(".nav-link", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }
        );
    }
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("mobile-active");
        burger.classList.remove("burger-active");
    });
});

// Append styling for active mobile burger navigation dynamically
const styleEl = document.createElement("style");
styleEl.textContent = `
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background: #121214;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            z-index: 999;
            transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border-left: 1px solid rgba(197, 168, 128, 0.2);
        }
        .nav.mobile-active {
            right: 0;
        }
        .nav-link {
            font-size: 1.2rem;
        }
        .burger-active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        .burger-active span:nth-child(2) {
            opacity: 0;
        }
        .burger-active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(styleEl);

// -------------------------------------------------------------
// 5. Portfolio Expanded Projects Database & Pop-up Modal
// -------------------------------------------------------------

const projectsData = [
    {
        title: "Пентхаус «Materia Grand»",
        category: "Пентхаус • Современная классика",
        area: "180 м²",
        duration: "7 месяцев",
        desc: "Проект сочетает классические каноны симметрии и передовые технологии отделки. В оформлении использован широкоформатный натуральный мрамор Calacatta, декоративные панели из алькантары с латунными вставками и скрытые плинтусы теневого профиля. Особое внимание уделено скрытым системам вентиляции и бесшовному переходу климатических зон.",
        images: ["./project_1.png", "./detail_1.png", "./detail_2.png", "./detail_3.png"],
        blueprint: `
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50,50 L 350,50 L 350,250 L 50,250 Z" class="blueprint-wall" />
                <path d="M 170,50 L 170,160 L 220,160 L 220,250" class="blueprint-wall" />
                <path d="M 50,150 L 170,150" class="blueprint-wall" />
                <path d="M 220,130 L 350,130" class="blueprint-wall" />
                <path d="M 170,120 A 30,30 0 0,1 140,150" class="blueprint-door" />
                <path d="M 220,180 A 30,30 0 0,1 250,210" class="blueprint-door" />
                <line x1="50" y1="35" x2="350" y2="35" class="blueprint-line" />
                <text x="200" y="30" class="blueprint-text" text-anchor="middle">14.20 м</text>
                <line x1="35" y1="50" x2="35" y2="250" class="blueprint-line" />
                <text x="25" y="150" class="blueprint-text" text-anchor="middle" transform="rotate(-90 25 150)">9.80 м</text>
                <text x="110" y="100" class="blueprint-text" text-anchor="middle">ГОСТИНАЯ</text>
                <text x="110" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ</text>
                <text x="280" y="90" class="blueprint-text" text-anchor="middle">КУХНЯ</text>
                <text x="280" y="190" class="blueprint-text" text-anchor="middle">ХОЛЛ</text>
            </svg>
        `
    },
    {
        title: "Апартаменты «Obsidian»",
        category: "Апартаменты • Минимализм",
        area: "145 м²",
        duration: "6 месяцев",
        desc: "Строгий архитектурный минимализм с обилием темных фактур. Стены обшиты шпонированными панелями американского ореха радиального распила. Смонтирован теневой потолочный профиль с глубокими встроенными магнитными треками. Все двери выполнены со скрытым коробом высотой 2.8 метра под потолок.",
        images: ["./project_2.png", "./detail_2.png", "./detail_3.png", "./detail_1.png"],
        blueprint: `
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40,40 L 360,40 L 360,260 L 40,260 Z" class="blueprint-wall" />
                <path d="M 150,40 L 150,260" class="blueprint-wall" />
                <path d="M 150,150 L 360,150" class="blueprint-wall" />
                <path d="M 150,100 A 25,25 0 0,1 125,125" class="blueprint-door" />
                <path d="M 250,150 A 25,25 0 0,1 275,175" class="blueprint-door" />
                <line x1="40" y1="25" x2="360" y2="25" class="blueprint-line" />
                <text x="200" y="20" class="blueprint-text" text-anchor="middle">12.80 м</text>
                <text x="95" y="145" class="blueprint-text" text-anchor="middle">МАСТЕР-СПАЛЬНЯ</text>
                <text x="250" y="95" class="blueprint-text" text-anchor="middle">КАБИНЕТ</text>
                <text x="250" y="210" class="blueprint-text" text-anchor="middle">СТУДИЯ</text>
            </svg>
        `
    },
    {
        title: "Резиденция «Cote d'Azur»",
        category: "Резиденция • Неоклассика",
        area: "220 м²",
        duration: "9 месяцев",
        desc: "Аристократичный интерьер в приглушенных пастельных тонах. Полы украшены модульным дубовым паркетом художественной укладки. Стены декорированы авторской лепниной из натурального гипса по индивидуальным эскизам архитектора. Зона столовой дополнена раздвижными стеклянными перегородками в тонких латунных профилях.",
        images: ["./project_3.png", "./detail_3.png", "./detail_1.png", "./detail_2.png"],
        blueprint: `
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 60,60 L 340,60 L 340,240 L 60,240 Z" class="blueprint-wall" />
                <path d="M 200,60 L 200,240" class="blueprint-wall" />
                <path d="M 60,150 L 200,150" class="blueprint-wall" />
                <path d="M 200,150 L 340,150" class="blueprint-wall" />
                <path d="M 200,110 A 30,30 0 0,1 170,140" class="blueprint-door" />
                <path d="M 200,190 A 30,30 0 0,1 230,220" class="blueprint-door" />
                <text x="130" y="110" class="blueprint-text" text-anchor="middle">СТОЛОВАЯ</text>
                <text x="130" y="200" class="blueprint-text" text-anchor="middle">КУХНЯ</text>
                <text x="270" y="110" class="blueprint-text" text-anchor="middle">ГОСТИНАЯ</text>
                <text x="270" y="200" class="blueprint-text" text-anchor="middle">ТЕРРАСА</text>
            </svg>
        `
    },
    {
        title: "Вилла «Symmetry»",
        category: "Вилла • High-Tech",
        area: "350 м²",
        duration: "12 месяцев",
        desc: "Высокотехнологичный загородный проект с панорамным остеклением Sky-Frame. Стены облицованы панелями из натурального архитектурного бетона, отшлифованного вручную, и стабилизированным мхом со скрытой подсветкой. Интегрирована полностью автоматизированная система центрального увлажнения воздуха и аудио-мультирум.",
        images: ["./project_4.png", "./detail_1.png", "./detail_3.png", "./detail_2.png"],
        blueprint: `
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50,50 L 350,50 L 350,250 L 50,250 Z" class="blueprint-wall" />
                <path d="M 120,50 L 120,250" class="blueprint-wall" />
                <path d="M 120,130 L 350,130" class="blueprint-wall" />
                <path d="M 240,130 L 240,250" class="blueprint-wall" />
                <path d="M 120,90 A 25,25 0 0,1 95,115" class="blueprint-door" />
                <text x="85" y="150" class="blueprint-text" text-anchor="middle" transform="rotate(-90 85 150)">SPA-ЗОНА</text>
                <text x="235" y="95" class="blueprint-text" text-anchor="middle">ХОЛЛ / АТРИУМ</text>
                <text x="180" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ 1</text>
                <text x="300" y="200" class="blueprint-text" text-anchor="middle">СПАЛЬНЯ 2</text>
            </svg>
        `
    },
    {
        title: "Лофт «Industrial Chic»",
        category: "Лофт • Премиум Индустриальный",
        area: "160 м²",
        duration: "8 месяцев",
        desc: "Аутентичный лофт в историческом здании мануфактуры. Стены из старинного очищенного клинкерного кирпича сочетаются с полированными наливными полами тераццо. Все инженерные сети — вентиляционные короба, разводка электрики в медных трубах — спроектированы как самостоятельные декоративные элементы интерьера.",
        images: ["./project_5.png", "./detail_3.png", "./detail_2.png", "./detail_1.png"],
        blueprint: `
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40,40 L 360,40 L 360,260 L 40,260 Z" class="blueprint-wall" />
                <path d="M 40,140 L 200,140 L 200,260" class="blueprint-wall" />
                <circle cx="100" cy="90" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <circle cx="300" cy="90" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <circle cx="300" cy="190" r="8" fill="none" stroke="var(--text-secondary)" stroke-width="2" />
                <path d="M 200,170 A 25,25 0 0,1 225,195" class="blueprint-door" />
                <text x="120" y="205" class="blueprint-text" text-anchor="middle">ГАРДЕРОБНАЯ</text>
                <text x="210" y="90" class="blueprint-text" text-anchor="middle">СВОБОДНАЯ ЗОНА (OPEN SPACE)</text>
            </svg>
        `
    }
];

// Modal elements selector
const modal = document.getElementById("project-modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeBtn = document.getElementById("modal-close-btn");
const slidesContainer = document.getElementById("modal-slides-container");
const counterEl = document.getElementById("modal-slider-counter");

const mTitle = document.getElementById("modal-project-title");
const mCat = document.getElementById("modal-project-cat");
const mDesc = document.getElementById("modal-project-desc");
const mArea = document.getElementById("modal-meta-area");
const mDur = document.getElementById("modal-meta-duration");
const mBlueprint = document.getElementById("modal-blueprint-svg");

const prevBtn = document.getElementById("modal-prev-btn");
const nextBtn = document.getElementById("modal-next-btn");

let currentProjectIndex = 0;
let currentSlideIndex = 0;
let projectImages = [];

function openModal(index) {
    const data = projectsData[index];
    if (!data) return;

    currentProjectIndex = index;
    currentSlideIndex = 0;
    projectImages = data.images.map(assetPath);

    // Set text elements
    mTitle.textContent = data.title;
    mCat.textContent = data.category;
    mDesc.textContent = data.desc;
    mArea.textContent = data.area;
    mDur.textContent = data.duration;
    mBlueprint.innerHTML = data.blueprint;

    // Load images inside slider
    slidesContainer.innerHTML = projectImages.map(src => 
        `<img src="${src}" alt="Деталь проекта" class="modal-slide-img" />`
    ).join("");

    updateSlider();

    // Fade in modal using GSAP
    modal.classList.add("active");
    gsap.fromTo(modal.querySelector(".modal-content"), 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
}

function closeModal() {
    gsap.to(modal.querySelector(".modal-content"), {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
            modal.classList.remove("active");
        }
    });
}

function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    counterEl.textContent = `${currentSlideIndex + 1} / ${projectImages.length}`;
}

// Bind project cards
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-project"), 10);
        openModal(id);
    });
});

// Close button interactions
closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

// Slide switching handlers
prevBtn.addEventListener("click", () => {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlider();
    } else {
        currentSlideIndex = projectImages.length - 1;
        updateSlider();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentSlideIndex < projectImages.length - 1) {
        currentSlideIndex++;
        updateSlider();
    } else {
        currentSlideIndex = 0;
        updateSlider();
    }
});

// -------------------------------------------------------------
// 6. GSAP Reveal Animations for Philosophy Card Content
// -------------------------------------------------------------

// Reveal philosophy cards on scroll by adding .revealed class via ScrollTrigger
document.querySelectorAll(".ph-card").forEach((card, index) => {
    ScrollTrigger.create({
        trigger: ".philosophy",
        start: "top 80%",
        onEnter: () => {
            setTimeout(() => {
                card.classList.add("revealed");
            }, index * 180); // Beautiful fluid stagger
        },
        once: true
    });
});

// Timeline elements fade-in
gsap.from(".timeline-item", {
    scrollTrigger: {
        trigger: ".process",
        start: "top 75%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    x: (index) => index % 2 === 0 ? -60 : 60,
    stagger: 0.3,
    duration: 1.2,
    ease: "power3.out"
});

// Portfolio fade-in
gsap.from(".project-card", {
    scrollTrigger: {
        trigger: ".portfolio",
        start: "top 75%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 60,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
});

// Force ScrollTrigger calculations to run after the page is fully loaded to prevent layout-shift bugs (e.g. staggered steps / ladder grid values)
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
