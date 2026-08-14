/**
 * Dental Clinic — Интерактивный эффект маски "До/После" (Версия V2 - Полноэкранный фон)
 * Реализация плавного перемещения маски на основе линейной интерполяции (LERP)
 */

document.addEventListener('DOMContentLoaded', () => {
  const visual = document.getElementById('interactive-hero-visual'); // Это вся секция .hero--v2

  // Если элемент не найден, выходим
  if (!visual) return;

  // Координаты цели (куда должен прийти центр маски)
  let targetX = 0;
  let targetY = 0;
  
  // Текущие координаты маски (сглаженные значения)
  let currentX = 0;
  let currentY = 0;
  
  // Прозрачность/размер маски (целевая и текущая)
  let targetOpacity = 0;
  let currentOpacity = 0;
  
  // Инициализация координат по центру фонового контейнера
  function initCenter() {
    const bgContainer = visual.querySelector('.hero__bg-container');
    if (bgContainer) {
      const rect = bgContainer.getBoundingClientRect();
      targetX = rect.width > 0 ? rect.width / 2 : window.innerWidth / 2;
      targetY = rect.height > 0 ? rect.height / 2 : window.innerHeight / 2;
    } else {
      const rect = visual.getBoundingClientRect();
      targetX = rect.width > 0 ? rect.width / 2 : window.innerWidth / 2;
      targetY = rect.height > 0 ? rect.height / 2 : window.innerHeight / 2;
    }
    currentX = targetX;
    currentY = targetY;
  }
  
  initCenter();

  window.addEventListener('resize', () => {
    // При изменении размеров перерасчитываем центр при необходимости
    const rect = visual.getBoundingClientRect();
    const bgContainer = visual.querySelector('.hero__bg-container');
    if (currentOpacity === 0) {
      if (bgContainer) {
        const bgRect = bgContainer.getBoundingClientRect();
        targetX = bgRect.width / 2;
        targetY = bgRect.height / 2;
      } else {
        targetX = rect.width / 2;
        targetY = rect.height / 2;
      }
    }
  });

  // Получение координат относительно фонового контейнера с учетом сдвига
  function updateCoordinates(clientX, clientY) {
    const rect = visual.getBoundingClientRect();
    const bgContainer = visual.querySelector('.hero__bg-container');
    let shiftX = 0;
    let shiftY = 0;
    
    if (bgContainer) {
      const bgRect = bgContainer.getBoundingClientRect();
      shiftX = bgRect.left - rect.left;
      shiftY = bgRect.top - rect.top;
    }
    
    // Рассчитываем координаты курсора/пальца внутри контейнера .hero__bg-container
    let x = clientX - rect.left - shiftX;
    let y = clientY - rect.top - shiftY;
    
    // Ограничиваем координаты границами фонового контейнера (с запасом для скрытия линзы)
    if (bgContainer) {
      const bgRect = bgContainer.getBoundingClientRect();
      x = Math.max(-rect.width, Math.min(x, bgRect.width + rect.width));
      y = Math.max(0, Math.min(y, bgRect.height));
    } else {
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
    }
    
    targetX = x;
    targetY = y;
  }

  /* ==========================================================================
     Обработчики событий мыши (Десктоп)
     ========================================================================== */
  
  visual.addEventListener('mouseenter', (e) => {
    targetOpacity = 1;
    updateCoordinates(e.clientX, e.clientY);
    
    // Мягко сбрасываем текущую координату с учетом сдвига контейнера
    const rect = visual.getBoundingClientRect();
    const bgContainer = visual.querySelector('.hero__bg-container');
    let shiftX = 0;
    let shiftY = 0;
    if (bgContainer) {
      const bgRect = bgContainer.getBoundingClientRect();
      shiftX = bgRect.left - rect.left;
      shiftY = bgRect.top - rect.top;
    }
    currentX = e.clientX - rect.left - shiftX;
    currentY = e.clientY - rect.top - shiftY;
  });

  visual.addEventListener('mousemove', (e) => {
    targetOpacity = 1;
    updateCoordinates(e.clientX, e.clientY);
  });

  visual.addEventListener('mouseleave', () => {
    targetOpacity = 0;
  });

  /* ==========================================================================
     Обработчики событий тача (Мобильные устройства)
     ========================================================================== */
  
  visual.addEventListener('touchstart', (e) => {
    targetOpacity = 1;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateCoordinates(touch.clientX, touch.clientY);
      
      // Сразу переносим маску в точку касания, чтобы не было задержки
      currentX = targetX;
      currentY = targetY;
    }
  }, { passive: true });

  visual.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateCoordinates(touch.clientX, touch.clientY);
    }
    
    // Отменяем стандартное поведение прокрутки страницы, только когда пользователь водит по экрану
    if (e.cancelable) {
      e.preventDefault();
    }
  }, { passive: false });

  visual.addEventListener('touchend', () => {
    targetOpacity = 0;
  });

  /* ==========================================================================
     Анимационный цикл LERP (линейная интерполяция)
     ========================================================================== */
  
  function renderLoop() {
    const easingFactor = 0.15; // Коэффициент сглаживания
    
    // Плавное приближение текущих координат к целевым
    currentX += (targetX - currentX) * easingFactor;
    currentY += (targetY - currentY) * easingFactor;
    
    // Плавное появление/исчезновение
    currentOpacity += (targetOpacity - currentOpacity) * easingFactor;

    // Округление значений для плавности рендеринга
    const roundedX = currentX.toFixed(1);
    const roundedY = currentY.toFixed(1);
    const roundedOpacity = currentOpacity.toFixed(3);

    // Запись значений в CSS-переменные
    visual.style.setProperty('--x', `${roundedX}px`);
    visual.style.setProperty('--y', `${roundedY}px`);
    visual.style.setProperty('--mask-opacity', roundedOpacity);

    // Следующий кадр
    requestAnimationFrame(renderLoop);
  }

  // Запуск анимационного цикла
  requestAnimationFrame(renderLoop);

  /* ==========================================================================
     Плавный скролл по якорным ссылкам
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ==========================================================================
     Логика аккордеона FAQ
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq__question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq__answer');
      const isActive = item.classList.contains('is-active');

      // Закрываем все открытые вкладки (аккордеонный стиль)
      document.querySelectorAll('.faq__item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-active')) {
          otherItem.classList.remove('is-active');
          otherItem.querySelector('.faq__answer').style.maxHeight = null;
          otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Открываем/закрываем текущую
      if (isActive) {
        item.classList.remove('is-active');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     Валидация формы записи и показ модального окна
     ========================================================================== */
  const form = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      const nameInput = document.getElementById('user-name');
      const phoneInput = document.getElementById('user-phone');
      const agreeCheckbox = document.getElementById('user-agree');
      
      // Сброс старых ошибок
      document.querySelectorAll('.form-group').forEach(group => {
         group.classList.remove('has-error');
      });
      
      // Валидация имени
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }
      
      // Валидация телефона (простой паттерн: минимум 10 цифр)
      const phonePattern = /^[+\d\s() -]{10,20}$/;
      if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value.trim())) {
        phoneInput.parentElement.classList.add('has-error');
        isValid = false;
      }
      
      // Валидация чекбокса
      if (!agreeCheckbox.checked) {
        agreeCheckbox.closest('.form-group').classList.add('has-error');
        isValid = false;
      }
      
      if (isValid) {
        // Показываем модальное окно успешной записи
        if (successModal) {
          successModal.classList.add('is-open');
          successModal.setAttribute('aria-hidden', 'false');
        }
        form.reset();
      }
    });
  }

  // Закрытие модального окна
  function closeModal() {
    if (successModal) {
      successModal.classList.remove('is-open');
      successModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
  
  // Закрытие по клику на оверлей
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }
});
