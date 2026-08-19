/* AURA PREMIUM FURNITURE - GSAP INTERACTIONS V2 */

document.addEventListener('DOMContentLoaded', () => {
  // Keep the main page fully rendered for tiled full-page screenshots.
  // Scroll reveal, parallax, and Lenis can capture intermediate or hidden states.

  // 1. ACCORDION LOGIC & GSAP TRIGGER
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            otherContent.style.maxHeight = '0px';
          }
        });
        
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
        
        setTimeout(() => window.dispatchEvent(new Event('resize')), 450);
      });
    }
  });

  // Set the first accordion active on load
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    const content = firstAccordion.querySelector('.accordion-content');
    firstAccordion.classList.add('active');
    if (content) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  // 2. ROBUST SLIDER CAROUSEL FOR REVIEWS (1-by-1 slide stepping with button support)
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const nextBtn = document.querySelector('.slider-next');
  const prevBtn = document.querySelector('.slider-prev');
  let currentSlide = 0;

  if (reviewsTrack && reviewCards.length > 0) {
    const updateSlider = () => {
      // Calculate individual card width plus gap (gap is 2rem = 32px)
      const cardWidth = reviewCards[0].offsetWidth;
      const gap = 32;
      const offset = -currentSlide * (cardWidth + gap);
      
      gsap.to(reviewsTrack, {
        x: offset,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Toggle button states for premium look
      const visibleSlides = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
      const maxSlides = reviewCards.length - visibleSlides;

      if (prevBtn) {
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
      }
      if (nextBtn) {
        nextBtn.style.opacity = currentSlide >= maxSlides ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentSlide >= maxSlides ? 'none' : 'auto';
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const visibleSlides = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const maxSlides = reviewCards.length - visibleSlides;
        if (currentSlide < maxSlides) {
          currentSlide++;
          updateSlider();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateSlider();
        }
      });
    }

    // Initialize button states
    setTimeout(updateSlider, 200);

    window.addEventListener('resize', () => {
      currentSlide = 0;
      updateSlider();
    });
  }
});
