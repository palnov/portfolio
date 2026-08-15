/* ==========================================================================
   ЖК «Солнечный Парк Premium» — Client-Side Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Effect & Navigation Link Active State
    // ==========================================
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

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

    let lastDrawerFocus = null;

    const openDrawer = () => {
        lastDrawerFocus = document.activeElement;
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        drawerCloseBtn.focus();
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore body scroll
        if (lastDrawerFocus) lastDrawerFocus.focus();
    };

    hamburgerBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileDrawer.classList.contains('open')) {
            closeDrawer();
        }
    });


    // ==========================================
    // 3. Apartment Plan Tab Filter
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const planCards = document.querySelectorAll('.plan-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            // Add active class to clicked tab
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

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
                background: #D6A45E;
                border: 4px solid #20352D;
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(214, 164, 94, 0.6);
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // Place marker and popup
        const marker = L.marker(premiumCoords, { icon: goldIcon }).addTo(map);
        marker.bindPopup(`
            <div style="font-family: 'Manrope', sans-serif; color: #20352D; padding: 6px;">
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
    const modalDialog = callbackModal.querySelector('.modal');
    let lastModalFocus = null;

    const modalFields = [
        { input: document.getElementById('modal-name'), error: document.getElementById('modal-name-error'), message: 'Введите имя.' },
        { input: document.getElementById('modal-phone'), error: document.getElementById('modal-phone-error'), message: 'Введите телефон в формате +7 (999) 000-00-00.' }
    ];

    const validateField = ({ input, error, message }) => {
        if (!input || !error) return true;
        const valid = input.checkValidity();
        input.classList.toggle('invalid', !valid);
        error.textContent = valid ? '' : message;
        return valid;
    };

    const validateForm = (fields) => fields.map(validateField).every(Boolean);

    const openModal = (apartmentText = 'Общая консультация') => {
        lastModalFocus = document.activeElement;
        if (modalApartmentSelected) {
            modalApartmentSelected.value = apartmentText;
        }
        callbackModal.classList.add('open');
        callbackModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        window.setTimeout(() => document.getElementById('modal-name').focus(), 120);
    };

    const closeModal = () => {
        callbackModal.classList.remove('open');
        callbackModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastModalFocus) lastModalFocus.focus();
        
        // Reset modal state after transition
        setTimeout(() => {
            modalLeadForm.style.display = 'flex';
            modalSuccessMsg.classList.remove('active');
            modalLeadForm.reset();
            modalFields.forEach(({ input, error }) => {
                if (input) input.classList.remove('invalid');
                if (error) error.textContent = '';
            });
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

    modalFields.forEach(field => {
        if (field.input) field.input.addEventListener('input', () => validateField(field));
    });

    document.addEventListener('keydown', (event) => {
        if (!callbackModal.classList.contains('open')) return;
        if (event.key === 'Escape') {
            closeModal();
            return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...modalDialog.querySelectorAll('button, input, a, [tabindex]:not([tabindex="-1"])')]
            .filter(element => !element.disabled && element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
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
        const leadFields = [
            { input: document.getElementById('lead-name'), error: document.getElementById('lead-name-error'), message: 'Введите имя.' },
            { input: document.getElementById('lead-phone'), error: document.getElementById('lead-phone-error'), message: 'Введите телефон в формате +7 (999) 000-00-00.' }
        ];
        leadFields.forEach(field => {
            if (field.input) field.input.addEventListener('input', () => validateField(field));
        });
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm(leadFields)) {
                const firstInvalid = leadFields.find(field => field.input && !field.input.checkValidity());
                if (firstInvalid) firstInvalid.input.focus();
                return;
            }
            
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
            if (!validateForm(modalFields)) {
                const firstInvalid = modalFields.find(field => field.input && !field.input.checkValidity());
                if (firstInvalid) firstInvalid.input.focus();
                return;
            }

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


    // The catalogue CTA intentionally opens the same consultation flow instead of
    // injecting placeholder apartments that could be mistaken for inventory.

});
