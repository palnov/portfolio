/* ==========================================================================
   ЖК «Солнечный Парк Premium» — Client-Side Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Effect & Navigation Link Active State
    // ==========================================
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    const handleScrollSpy = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleScrollSpy();
        handleBackToTopVisibility();
    });

    // Run once at start
    handleHeaderScroll();
    handleScrollSpy();


    // ==========================================
    // 2. Mobile Navigation Drawer Toggle
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = ''; // Restore body scroll
    };

    hamburgerBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    // ==========================================
    // 3. Apartment Plan Tab Filter
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const planCards = document.querySelectorAll('.plan-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');

            const filterType = btn.getAttribute('data-type');

            planCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterType === 'all') {
                    card.style.display = 'flex';
                } else if (category === filterType) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ==========================================
    // 4. Consultation Budget Slider
    // ==========================================
    const budgetSlider = document.getElementById('lead-budget');
    const budgetDisplay = document.getElementById('range-val-display');

    if (budgetSlider && budgetDisplay) {
        budgetSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            budgetDisplay.textContent = `от ${val} млн. ₽`;
        });
    }


    // ==========================================
    // 5. Interactive Leaflet Map Setup with Premium Dark Theme
    // ==========================================
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Initialize map centered near a premium location in Moscow (e.g. Khamovniki/Frunzenskaya)
        const premiumCoords = [55.7272, 37.5812]; 
        const map = L.map('map', {
            center: premiumCoords,
            zoom: 15,
            scrollWheelZoom: false // Prevent annoying scroll zooming
        });

        // Use custom OSM tiles (will be dark-themed via CSS invert/hue-rotate rules)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Custom premium marker icon
        const goldIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="
                width: 24px; 
                height: 24px; 
                background: #F3F988; 
                border: 4px solid #210D36; 
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(243, 249, 136, 0.6);
                animation: pulse-marker 2s infinite;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // Add CSS keyframes dynamically for marker pulsing
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            @keyframes pulse-marker {
                0% { box-shadow: 0 0 0 0 rgba(243, 249, 136, 0.7); }
                70% { box-shadow: 0 0 0 12px rgba(243, 249, 136, 0); }
                100% { box-shadow: 0 0 0 0 rgba(243, 249, 136, 0); }
            }
        `;
        document.head.appendChild(styleSheet);

        // Place marker and popup
        const marker = L.marker(premiumCoords, { icon: goldIcon }).addTo(map);
        marker.bindPopup(`
            <div style="font-family: 'Manrope', sans-serif; color: #210D36; padding: 6px;">
                <h4 style="margin: 0 0 4px 0; font-weight: 800; font-size: 1rem;">Солнечный Парк Premium</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #555;">Офис продаж и стройплощадка</p>
            </div>
        `).openPopup();
    }


    // ==========================================
    // 6. Interactive Modals Management
    // ==========================================
    const callbackModal = document.getElementById('callback-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const callModalBtns = document.querySelectorAll('.call-modal-btn');
    const openBookingBtns = document.querySelectorAll('.open-booking-btn');
    const modalApartmentSelected = document.getElementById('modal-apartment-selected');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const modalLeadForm = document.getElementById('modal-lead-form');
    const modalSuccessMsg = document.getElementById('modal-success-msg');

    const openModal = (apartmentText = 'Общая консультация') => {
        if (modalApartmentSelected) {
            modalApartmentSelected.value = apartmentText;
        }
        callbackModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        callbackModal.classList.remove('open');
        document.body.style.overflow = '';
        
        // Reset modal state after transition
        setTimeout(() => {
            modalLeadForm.style.display = 'flex';
            modalSuccessMsg.classList.remove('active');
            modalLeadForm.reset();
        }, 400);
    };

    callModalBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal('Заказ обратного звонка'));
    });

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const apartment = e.target.getAttribute('data-apartment') || 'Квартира в ЖК';
            openModal(`Запрос планировки: ${apartment}`);
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    closeSuccessBtn.addEventListener('click', closeModal);

    // Close on click outside modal content
    callbackModal.addEventListener('click', (e) => {
        if (e.target === callbackModal) {
            closeModal();
        }
    });


    // ==========================================
    // 7. Lead Forms Processing (Mock Action)
    // ==========================================
    
    // Main Form
    const leadForm = document.getElementById('lead-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (leadForm && formSuccess) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather lead info factually
            const name = document.getElementById('lead-name').value;
            const phone = document.getElementById('lead-phone').value;
            const budget = document.getElementById('lead-budget').value;
            
            console.log('Lead registered:', { name, phone, budget });

            // Display success window
            formSuccess.classList.add('active');
        });

        resetFormBtn.addEventListener('click', () => {
            formSuccess.classList.remove('active');
            leadForm.reset();
            if (budgetSlider) budgetSlider.value = 15;
            if (budgetDisplay) budgetDisplay.textContent = 'от 15 млн. ₽';
        });
    }

    // Modal Form
    if (modalLeadForm && modalSuccessMsg) {
        modalLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modal-name').value;
            const phone = document.getElementById('modal-phone').value;
            const context = modalApartmentSelected.value;

            console.log('Modal Lead registered:', { name, phone, context });

            // Switch view inside modal
            modalLeadForm.style.display = 'none';
            modalSuccessMsg.classList.add('active');
        });
    }


    // ==========================================
    // 8. Back to Top Button Logic
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top-btn');

    const handleBackToTopVisibility = () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================
    // 9. Extra Plans Loader Mock-up
    // ==========================================
    const morePlansBtn = document.getElementById('more-plans-btn');
    const plansGrid = document.getElementById('plans-grid');

    if (morePlansBtn && plansGrid) {
        morePlansBtn.addEventListener('click', () => {
            // Let's dynamically add a few premium apartments to wow the user!
            const extraApartments = [
                {
                    category: 'studio',
                    type: 'Студия',
                    title: 'Студия с дизайнерской мебелью',
                    area: '26.8 м²',
                    floor: '11 из 16',
                    price: 'от 8 610 400 ₽'
                },
                {
                    category: '1room',
                    type: '1-комнатная квартира',
                    title: 'Просторная однушка с гардеробной',
                    area: '42.5 м²',
                    floor: '5 из 16',
                    price: 'от 11 900 000 ₽'
                },
                {
                    category: '3room',
                    type: '3-комнатная квартира',
                    title: 'Пентхаус с видовой террасой на реку',
                    area: '112.4 м²',
                    floor: '16 из 16',
                    price: 'от 38 450 000 ₽'
                }
            ];

            extraApartments.forEach(apt => {
                const card = document.createElement('div');
                card.className = 'plan-card';
                card.setAttribute('data-category', apt.category);
                
                // SVG according to type
                let svgContent = '';
                if (apt.category === 'studio') {
                    svgContent = `
                        <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" stroke-width="2"/>
                        <line x1="10" y1="100" x2="110" y2="100" stroke="currentColor" stroke-width="2"/>
                        <line x1="110" y1="10" x2="110" y2="100" stroke="currentColor" stroke-width="2"/>
                        <rect x="10" y="10" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
                        <text x="40" y="45" font-size="10" text-anchor="middle" fill="currentColor">Санузел</text>
                        <text x="60" y="140" font-size="12" font-weight="bold" fill="currentColor">Студия-люкс</text>
                    `;
                } else if (apt.category === '1room') {
                    svgContent = `
                        <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" stroke-width="2"/>
                        <line x1="90" y1="10" x2="90" y2="190" stroke="currentColor" stroke-width="2"/>
                        <line x1="90" y1="90" x2="190" y2="90" stroke="currentColor" stroke-width="2"/>
                        <rect x="10" y="10" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/>
                        <text x="50" y="100" font-size="12" font-weight="bold" fill="currentColor">Спальня</text>
                        <text x="140" y="50" font-size="12" font-weight="bold" fill="currentColor">Кухня</text>
                    `;
                } else {
                    svgContent = `
                        <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" stroke-width="2"/>
                        <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="2"/>
                        <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="2"/>
                        <text x="50" y="50" font-size="11" font-weight="bold" fill="currentColor">Спальня</text>
                        <text x="150" y="50" font-size="11" font-weight="bold" fill="currentColor">Терраса</text>
                        <text x="50" y="150" font-size="11" font-weight="bold" fill="currentColor">Гостиная</text>
                        <text x="150" y="150" font-size="11" font-weight="bold" fill="currentColor">Кухня</text>
                    `;
                }

                card.innerHTML = `
                    <div class="plan-img-wrapper">
                        <svg class="plan-svg" viewBox="0 0 200 200">
                            ${svgContent}
                        </svg>
                    </div>
                    <div class="plan-info">
                        <span class="plan-type">${apt.type}</span>
                        <h3>${apt.title}</h3>
                        <div class="plan-specs">
                            <div><span class="spec-label">Площадь:</span> <span class="spec-val">${apt.area}</span></div>
                            <div><span class="spec-label">Этаж:</span> <span class="spec-val">${apt.floor}</span></div>
                        </div>
                        <div class="plan-price">${apt.price}</div>
                        <button class="btn btn-primary w-full open-booking-btn" data-apartment="${apt.title}">Узнать подробнее</button>
                    </div>
                `;

                plansGrid.appendChild(card);
                
                // Attach event listener to new booking button!
                card.querySelector('.open-booking-btn').addEventListener('click', (e) => {
                    openModal(`Запрос планировки: ${apt.title}`);
                });
            });

            // Hide the load button or disable it
            morePlansBtn.textContent = 'Все планировки загружены';
            morePlansBtn.disabled = true;
            morePlansBtn.style.opacity = '0.6';
            morePlansBtn.style.cursor = 'default';
        });
    }

});
