const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const menu = $(".menu-toggle"),
  nav = $("#main-nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});
$$("#main-nav a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }),
);

const questions = [
  {
    title: "Примерная сумма всех долгов",
    name: "debt",
    options: [
      "До 100 000 ₽",
      "100 000–300 000 ₽",
      "300 000–1 000 000 ₽",
      "Более 1 000 000 ₽",
      "Не знаю точно",
    ],
  },
  {
    title: "Есть ли просрочка или исполнительное производство?",
    name: "delay",
    options: [
      "Есть просрочка",
      "Есть производство у приставов",
      "Пока нет",
      "Не знаю",
    ],
  },
  {
    title: "Есть ли имущество, которое вас беспокоит?",
    name: "property",
    options: [
      "Единственное жильё",
      "Ипотечное жильё",
      "Автомобиль или доля",
      "Нет имущества",
      "Нужно уточнить",
    ],
  },
  {
    title: "Какой результат будет полезен сейчас?",
    name: "goal",
    options: [
      "Проверить судебный путь",
      "Проверить условия МФЦ",
      "Понять риски для имущества",
      "Сравнить с альтернативами",
    ],
  },
];
let step = 0;
const answers = {};
const stage = $("#quiz-stage"),
  next = $("#quiz-next"),
  back = $("#quiz-back"),
  label = $("#quiz-label"),
  progress = $("#quiz-progress"),
  status = $("#quiz-status");
function renderQuiz() {
  const q = questions[step];
  label.textContent = `Вопрос ${step + 1} из ${questions.length}`;
  progress.style.transform = `scaleX(${(step + 1) / questions.length})`;
  stage.innerHTML = `<h3>${q.title}</h3><div class="options">${q.options.map((o, i) => `<div class="option"><input type="radio" id="${q.name}-${i}" name="${q.name}" value="${o}" ${answers[q.name] === o ? "checked" : ""}><label for="${q.name}-${i}">${o}</label></div>`).join("")}</div>`;
  back.disabled = step === 0;
  next.textContent =
    step === questions.length - 1 ? "Показать ориентир" : "Продолжить";
  status.textContent = "";
}
next.addEventListener("click", () => {
  const q = questions[step],
    chosen = $(`input[name="${q.name}"]:checked`, stage);
  if (!chosen) {
    status.textContent = "Выберите один вариант, чтобы продолжить.";
    return;
  }
  answers[q.name] = chosen.value;
  if (step < questions.length - 1) {
    step++;
    renderQuiz();
  } else {
    showResult();
  }
});
back.addEventListener("click", () => {
  if (step > 0) {
    step--;
    renderQuiz();
  }
});
function showResult() {
  const mfc =
    answers.debt === "До 100 000 ₽" && answers.goal === "Проверить условия МФЦ";
  const property =
    answers.property &&
    !["Нет имущества", "Нужно уточнить"].includes(answers.property);
  const title = mfc
    ? "Ваш стартовый маршрут — проверка условий МФЦ"
    : property
      ? "Начните с защиты имущества и оценки рисков"
      : "Ваш следующий шаг — выбрать юридическую стратегию";
  stage.innerHTML = `<div class="quiz-result"><p class="eyebrow light">Ваш результат</p><h3>${title}</h3><p>Юрист проверит долги, доходы, исполнительные производства, имущество и сделки и соберёт для вас пошаговый план.</p><a class="button button-gold" href="#contact">Получить план действий</a></div>`;
  $(".quiz-controls").hidden = true;
  label.textContent = "Диагностика завершена";
  progress.style.transform = "scaleX(1)";
}
renderQuiz();

const routeData = {
  court: {
    title: "Судебная процедура",
    text: "Юридическая команда готовит документы, представляет ваши интересы и сопровождает процедуру от подачи заявления до завершения.",
    items: [
      "Состав и происхождение обязательств",
      "Имущество, доходы и недавние сделки",
      "Требования, которые могут не списываться",
      "Роль суда и финансового управляющего",
    ],
  },
  mfc: {
    title: "Внесудебная процедура через МФЦ",
    text: "Проверим условия внесудебного банкротства, подготовим список кредиторов и соберём заявление для подачи через МФЦ.",
    items: [
      "Диапазон и состав задолженности",
      "Основания завершённых производств",
      "Полнота списка кредиторов",
      "Причины возможного возврата заявления",
    ],
  },
  alternative: {
    title: "Переговоры или другой вариант",
    text: "Сравним переговоры, реструктуризацию и кредитные каникулы с процедурой банкротства и выберем решение с лучшим балансом затрат и последствий.",
    items: [
      "Временный или устойчивый характер трудностей",
      "Условия кредиторов и текущие просрочки",
      "Стоимость и последствия каждого пути",
      "Возможность решить задачу самостоятельно",
    ],
  },
};
const panel = $("#route-panel"),
  tabs = $$(".route-map button");
function setRoute(key) {
  const d = routeData[key];
  panel.innerHTML = `<div><p class="eyebrow light">Что важно знать</p><h3>${d.title}</h3><p>${d.text}</p></div><ul>${d.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  tabs.forEach((t, i) => {
    const selected = t.dataset.route === key;
    t.setAttribute("aria-selected", String(selected));
    if (selected) $(".route-map").style.setProperty("--route-index", i);
  });
  $(".route-map").style.setProperty(
    "transform-marker",
    tabs.findIndex((t) => t.dataset.route === key),
  );
}
tabs.forEach((t, i) =>
  t.addEventListener("click", () => {
    setRoute(t.dataset.route);
    $(".route-map").style.setProperty("--marker-x", `${i * 100}%`);
    $(".route-map").querySelector(":scope:before");
  }),
);
setRoute("court");

const style = document.createElement("style");
style.textContent =
  ".route-map:before{transform:translateX(var(--marker-x,0))}";
document.head.append(style);

$$(".faq-item button").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item"),
      open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    item.classList.toggle("open", !open);
  }),
);

$("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget,
    out = $("#contact-status"),
    phone = form.elements.phone,
    consent = $$(".consent input", form)[0];
  if (!phone.value.trim()) {
    out.textContent = "Укажите телефон для ответа.";
    phone.focus();
    return;
  }
  if (!consent.checked) {
    out.textContent = "Нужно согласие на обработку персональных данных.";
    consent.focus();
    return;
  }
  out.textContent = "Заявка принята. Юрист свяжется с вами в рабочее время.";
  form.reset();
});

const heroActions = $(".hero-actions");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) =>
      document.body.classList.toggle("show-mobile-cta", !entry.isIntersecting),
    { threshold: 0.1 },
  ).observe(heroActions);
}
