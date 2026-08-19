document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins if loaded
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Mobile Nav Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Modal Open/Close Base Logic (GSAP animated)
  const modals = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close');

  function openModal(id) {
    const targetModal = document.getElementById(id);
    if (targetModal) {
      targetModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock background scroll
      
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(targetModal);
        gsap.killTweensOf(targetModal.querySelector('.modal-box'));
        
        gsap.set(targetModal, { opacity: 0 });
        gsap.set(targetModal.querySelector('.modal-box'), { scale: 0.8, y: 50, opacity: 0 });
        
        gsap.to(targetModal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(targetModal.querySelector('.modal-box'), { 
          scale: 1, 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          delay: 0.1,
          ease: 'back.out(1.7)' 
        });
      } else {
        targetModal.classList.add('active');
      }
    }
  }

  function closeModal(modal) {
    document.body.style.overflow = ''; // Unlock background scroll
    if (typeof gsap !== 'undefined') {
      gsap.to(modal.querySelector('.modal-box'), { 
        scale: 0.8, 
        y: 30, 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.in' 
      });
      gsap.to(modal, { 
        opacity: 0, 
        duration: 0.3, 
        delay: 0.1, 
        onComplete: () => {
          modal.style.display = 'none';
        }
      });
    } else {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 400);
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      closeModal(parentModal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Activities Tab Switcher (GSAP Fading)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(pane => {
        if (pane.classList.contains('active')) {
          if (typeof gsap !== 'undefined') {
            gsap.to(pane, { 
              opacity: 0, 
              y: -15, 
              duration: 0.25, 
              onComplete: () => {
                pane.classList.remove('active');
                pane.style.display = 'none';
                showAndAnimateTab(tabTarget);
              }
            });
          } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
            showAndAnimateTab(tabTarget);
          }
        }
      });
    });
  });

  function showAndAnimateTab(id) {
    const pane = document.getElementById(id);
    if (!pane) return;

    pane.style.display = 'grid';
    pane.classList.add('active');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(pane, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
      // Stagger items inside the pane
      const cards = pane.querySelectorAll('.activity-card');
      gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
      );
    }
  }

  // Accordion Toggle (Smooth GSAP Height Expansions)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other accordions with GSAP
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          const otherContent = otherItem.querySelector('.accordion-content');
          otherItem.classList.remove('active');
          if (typeof gsap !== 'undefined') {
            gsap.to(otherContent, { height: 0, duration: 0.4, ease: 'power2.out' });
          }
        }
      });

      if (!isActive) {
        item.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.set(content, { height: 'auto' });
          gsap.from(content, { height: 0, duration: 0.4, ease: 'power2.out' });
        }
      } else {
        item.classList.remove('active');
        if (typeof gsap !== 'undefined') {
          gsap.to(content, { height: 0, duration: 0.4, ease: 'power2.out' });
        }
      }
    });
  });

  // FAQ Tab Form Switcher
  const faqSwitchBtns = document.querySelectorAll('.faq-switch-btn');
  const faqPanes = document.querySelectorAll('.faq-pane');

  faqSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const paneTarget = btn.getAttribute('data-faq-pane');

      faqSwitchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      faqPanes.forEach(pane => {
        pane.classList.remove('active');
        pane.style.opacity = 0;
      });

      const activePane = document.getElementById(paneTarget);
      if (activePane) {
        activePane.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(activePane, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        } else {
          activePane.style.opacity = 1;
        }
      }
    });
  });

  // Premium Booking Modal Calculator Logic
  const checkinInput = document.getElementById('booking-checkin');
  const checkoutInput = document.getElementById('booking-checkout');
  const guestsInput = document.getElementById('booking-guests');
  const tubCheckbox = document.getElementById('booking-tub');

  const calcNights = document.getElementById('calc-nights');
  const calcBasePrice = document.getElementById('calc-base-price');
  const calcExtraGuests = document.getElementById('calc-extra-guests');
  const calcTubPrice = document.getElementById('calc-tub-price');
  const calcTotalPrice = document.getElementById('calc-total-price');

  // Today Date Helper
  const today = new Date().toISOString().split('T')[0];
  if (checkinInput && checkoutInput) {
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', today);

    checkinInput.addEventListener('change', () => {
      checkoutInput.setAttribute('min', checkinInput.value);
      calculateBookingPrice();
    });
    checkoutInput.addEventListener('change', calculateBookingPrice);
    guestsInput.addEventListener('input', calculateBookingPrice);
    tubCheckbox.addEventListener('change', calculateBookingPrice);

    // Click controls for Custom Guests Spinner Buttons (▲/▼)
    const btnUp = document.getElementById('btn-guests-up');
    const btnDown = document.getElementById('btn-guests-down');

    if (btnUp && btnDown) {
      btnUp.addEventListener('click', () => {
        let val = parseInt(guestsInput.value) || 4;
        if (val < 6) { // Max 6 guests limit
          guestsInput.value = val + 1;
          calculateBookingPrice();
        }
      });

      btnDown.addEventListener('click', () => {
        let val = parseInt(guestsInput.value) || 4;
        if (val > 1) { // Min 1 guest limit
          guestsInput.value = val - 1;
          calculateBookingPrice();
        }
      });
    }
  }

  function calculateBookingPrice() {
    if (!checkinInput.value || !checkoutInput.value) return;

    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    const diffTime = checkout - checkin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      calcNights.innerText = '0 ночей';
      calcTotalPrice.innerText = '0 ₽';
      return;
    }

    calcNights.innerText = `${diffDays} ночей`;

    // Pricing Rule Engine
    let totalBase = 0;
    let tempDate = new Date(checkin);

    for (let i = 0; i < diffDays; i++) {
      const dayOfWeek = tempDate.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday, 6 = Saturday
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        totalBase += 10000; // Weekend
      } else if (dayOfWeek === 0) {
        totalBase += 9000; // Sunday
      } else {
        totalBase += 8000; // Mon-Thu
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    calcBasePrice.innerText = `${totalBase.toLocaleString('ru-RU')} ₽`;

    // Extra Guests Calculation (+500 RUB per night for each guest above 4)
    const totalGuests = parseInt(guestsInput.value) || 4;
    let extraGuestsCost = 0;
    if (totalGuests > 4) {
      extraGuestsCost = (totalGuests - 4) * 500 * diffDays;
    }
    calcExtraGuests.innerText = `${extraGuestsCost.toLocaleString('ru-RU')} ₽`;

    // Hot tub selection (+3500 RUB flat rate per setup)
    const hotTubCost = tubCheckbox.checked ? 3500 : 0;
    calcTubPrice.innerText = `${hotTubCost.toLocaleString('ru-RU')} ₽`;

    const grandTotal = totalBase + extraGuestsCost + hotTubCost;
    calcTotalPrice.innerText = `${grandTotal.toLocaleString('ru-RU')} ₽`;
  }

  // Interactive Form Submissions
  const interactiveForms = document.querySelectorAll('form');
  interactiveForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Отправка...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = 'Успешно отправлено!';
        submitBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)';
        submitBtn.style.color = '#fff';
        
        // Show rich popup notification
        showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в течение 10 минут.');

        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          
          // If in modal, close modal
          const openModalParent = form.closest('.modal-overlay');
          if (openModalParent) {
            closeModal(openModalParent);
          }
        }, 2000);
      }, 1500);
    });
  });

  // Custom premium Toast Notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'glass-panel';
    notification.style.position = 'fixed';
    notification.style.bottom = '30px';
    notification.style.right = '30px';
    notification.style.padding = '20px 30px';
    notification.style.color = '#fff';
    notification.style.borderLeft = '4px solid #f4c264';
    notification.style.zIndex = '3000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.innerHTML = `<h5 style="color:#f4c264; margin-bottom:5px; text-transform:uppercase; letter-spacing:1px;">Вереск</h5><p style="font-size:0.9rem;">${message}</p>`;

    document.body.appendChild(notification);

    if (typeof gsap !== 'undefined') {
      gsap.to(notification, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      gsap.to(notification, { 
        opacity: 0, 
        y: 20, 
        duration: 0.5, 
        delay: 4.5, 
        onComplete: () => notification.remove() 
      });
    } else {
      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
      }, 100);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 500);
      }, 5000);
    }
  }

  // Deliberately avoid scroll-triggered opacity/transform reveals here. A
  // full-page screenshot extension scrolls and stitches the document in
  // several quick passes, so animation state would otherwise be captured in
  // the middle of a transition. The page stays fully rendered while the
  // interactive GSAP effects above continue to work.
});
