/* AURA PREMIUM FURNITURE - GSAP & LENIS ANIMATIONS V2 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INITIALIZE LENIS SMOOTH SCROLLING
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.9,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  // 2. HERO INTRO ANIMATION (PREMIUM LINE SLIDE-UP FADE)
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta-btn');
  const heroVisual = document.querySelector('.hero-visual-wrapper');

  if (heroTitle) {
    // Instead of cutting letters, we split by lines or animate the whole element with a sleek, cinematic mask & slide up
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate badge
    tl.fromTo('.hero-visual-wrapper .badge', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.2 }
    );

    // Animate title: gorgeous mask-reveal and elegant slide up
    tl.fromTo(heroTitle,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
      '-=0.9'
    );

    if (heroSubtitle) {
      tl.fromTo(heroSubtitle, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=1.1'
      );
    }

    if (heroCta) {
      tl.fromTo(heroCta, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
        '-=0.9'
      );
    }

    if (heroVisual) {
      tl.fromTo(heroVisual,
        { scale: 1.06 },
        { scale: 1, duration: 2.2, ease: 'power2.out' },
        '-=2.0'
      );
    }
  }

  // 3. PARALLAX EFFECT FOR HERO
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // 4. ANIMATED SECTION TITLES (GSAP ScrollTrigger)
  const sectionHeaders = document.querySelectorAll('.section-header-anim');
  sectionHeaders.forEach(header => {
    const title = header.querySelector('h2');
    const desc = header.querySelector('p');
    const badge = header.querySelector('.badge');
    const divider = header.querySelector('.luxury-divider');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    if (badge) {
      tl.fromTo(badge, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
    }
    if (title) {
      tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');
    }
    if (divider) {
      tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5');
    }
    if (desc) {
      tl.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    }
  });

  // 5. STAGGERED FADE-IN FOR PRODUCT CARDS & PLATES
  const grids = document.querySelectorAll('.stagger-grid-anim');
  grids.forEach(grid => {
    const items = grid.children;
    
    gsap.fromTo(items, 
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.1, 
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 6. ACCORDION LOGIC & GSAP TRIGGER
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
        
        setTimeout(() => lenis.resize(), 450);
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

  // 7. ROBUST SLIDER CAROUSEL FOR REVIEWS (1-by-1 slide stepping with button support)
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
