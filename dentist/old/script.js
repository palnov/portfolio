/**
 * Dental Clinic — Интерактивный эффект маски "До/После"
 * Реализация плавного перемещения маски на основе линейной интерполяции (LERP)
 */

document.addEventListener('DOMContentLoaded', () => {
  const visual = document.getElementById('interactive-hero-visual');
  const hintText = document.querySelector('.hero__hint-text');

  // Если интерактивный элемент не найден на странице, прекращаем выполнение, чтобы избежать ошибок
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
  
  let isMobile = false;

  // Инициализация координат по центру контейнера
  function initCenter() {
    const rect = visual.getBoundingClientRect();
    targetX = rect.width > 0 ? rect.width / 2 : 290;
    targetY = rect.height > 0 ? rect.height / 2 : 217;
    currentX = targetX;
    currentY = targetY;
  }
  
  initCenter();

  // Функция для динамического определения тач-устройств и обновления текста подсказки
  function checkDeviceType() {
    isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (hintText) {
      if (isMobile) {
        hintText.textContent = 'Проведи по улыбке, чтобы увидеть состояние до лечения';
      } else {
        hintText.textContent = 'Наведи на улыбку, чтобы увидеть состояние до лечения';
      }
    }
  }
  
  checkDeviceType();
  window.addEventListener('resize', () => {
    checkDeviceType();
    // При изменении размеров перерасчитываем центр при необходимости
    const rect = visual.getBoundingClientRect();
    if (currentOpacity === 0) {
      targetX = rect.width / 2;
      targetY = rect.height / 2;
    }
  });

  // Получение координат относительно контейнера .hero__visual
  function updateCoordinates(clientX, clientY) {
    const rect = visual.getBoundingClientRect();
    
    // Рассчитываем координаты курсора/пальца внутри контейнера
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    
    // Ограничиваем координаты границами контейнера с небольшим запасом, чтобы маска не "улетала"
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    targetX = x;
    targetY = y;
  }

  /* ==========================================================================
     Обработчики событий мыши (Десктоп)
     ========================================================================== */
  
  visual.addEventListener('mouseenter', (e) => {
    targetOpacity = 1;
    updateCoordinates(e.clientX, e.clientY);
    
    // Мягко сбрасываем текущую координату к точке входа, чтобы избежать прыжков из центра
    const rect = visual.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;
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
      
      // Сразу переносим маску в точку касания, чтобы не было задержки при первом таче
      currentX = targetX;
      currentY = targetY;
    }
  }, { passive: true });

  visual.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateCoordinates(touch.clientX, touch.clientY);
    }
    
    // Отменяем стандартное поведение прокрутки страницы, только когда пользователь двигает маску
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
    // Коэффициент сглаживания (0.15 обеспечивает идеальный баланс отзывчивости и плавности)
    const easingFactor = 0.15;
    
    // Плавное приближение текущих координат к целевым
    currentX += (targetX - currentX) * easingFactor;
    currentY += (targetY - currentY) * easingFactor;
    
    // Плавное изменение прозрачности маски (появление/исчезновение)
    currentOpacity += (targetOpacity - currentOpacity) * easingFactor;

    // Округление до сотых/тысячных для оптимизации рендеринга и исключения дрожания субпикселей
    const roundedX = currentX.toFixed(1);
    const roundedY = currentY.toFixed(1);
    const roundedOpacity = currentOpacity.toFixed(3);

    // Запись значений в CSS-переменные контейнера
    visual.style.setProperty('--x', `${roundedX}px`);
    visual.style.setProperty('--y', `${roundedY}px`);
    visual.style.setProperty('--mask-opacity', roundedOpacity);

    // Продолжаем цикл анимации
    requestAnimationFrame(renderLoop);
  }

  // Запуск анимационного цикла
  requestAnimationFrame(renderLoop);
});
