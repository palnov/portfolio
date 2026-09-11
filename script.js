/* Set the exact public profile/service URL here when supplied. No backend required. */
const KWORK_URL = 'https://kwork.ru/';

const projects = [
  {title:'MATERIA Interiors', slug:'renovation', image:'materia', category:'business', kind:'ИНТЕРЬЕРЫ / ЛЕНДИНГ', detail:'Архитектурная подача · scrollytelling · заявка'},
  {title:'AURA Furniture', slug:'aura', image:'aura', category:'business', kind:'E-COMMERCE', detail:'Мебельный каталог · визуальный язык · корзина'},
  {title:'BURO Coffee', slug:'buro', image:'coffee', category:'lifestyle', kind:'БРЕНД / МАГАЗИН', detail:'Спешелти-кофе · магазин · атмосфера'},
  {title:'ВЕРЕСК Glamping', slug:'glamping', image:'glamping', category:'lifestyle', kind:'ОТДЫХ / БРОНИРОВАНИЕ', detail:'Загородный отдых · контент · бронирование'},
  {title:'AION — верните себе время', slug:'aion', category:'services', kind:'AI / АВТОМАТИЗАЦИЯ', detail:'Продуктовая концепция · интерактивные сценарии'},
  {title:'ЖК «Солнечный Парк»', slug:'residence', image:'residence', category:'business', kind:'НЕДВИЖИМОСТЬ', detail:'Презентация жилого комплекса · планировки · заявки'},
  {title:'Тёплая корка', slug:'bakery', image:'bakery', category:'lifestyle', kind:'ПЕКАРНЯ / КАТАЛОГ', detail:'Локальный бренд · каталог · заказ'},
  {title:'БРЕВДОМ', slug:'brewdom', image:'brewdom', category:'business', kind:'СТРОИТЕЛЬСТВО', detail:'Деревянные дома · каталог · лидогенерация'},
  {title:'Dental Clinic', slug:'dentist', image:'dentist', category:'services', kind:'МЕДИЦИНА / УСЛУГИ', detail:'Стоматология · доверие · запись'},
  {title:'Detailing Studio', slug:'detailing', image:'detailing', category:'services', kind:'АВТО / СЕРВИС', detail:'Детейлинг · до и после · запись'},
  {title:'WILDLINE — выйти за карту', slug:'adventure', image:'adventure', category:'concept', kind:'ВИЗУАЛЬНЫЙ КОНЦЕПТ', detail:'Путешествия · арт-дирекшн · настроение'},
  {title:'Право на новый этап', slug:'bfl', image:'bfl', category:'services', kind:'ЮРИДИЧЕСКИЕ УСЛУГИ', detail:'Понятный маршрут · доверие · заявка'},
];

const grid = document.querySelector('#project-grid');
const moreButton = document.querySelector('#show-more');
let activeFilter = 'all';
let expanded = false;

const cards = projects.map((project, index) => {
  const card = document.createElement('a');
  card.className = `project-card project-theme-${project.slug}`;
  card.href = `https://palnov.ru/cases/${project.slug}/`;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.dataset.category = project.category;
  const visual = project.image
    ? `<div class="project-frame"><img src="assets/${project.slug === 'aura' ? 'aura-screen' : project.image}.webp" alt="${project.title} — обложка проекта" width="1200" height="810" loading="lazy"></div>`
    : '<div class="aion-orbit" aria-hidden="true"></div><strong>AION</strong><span>ВРЕМЯ ДЛЯ ВАЖНОГО</span>';
  card.innerHTML = `<div class="project-image ${project.image ? '' : 'project-aion'}"><div class="project-stage-top mono"><span>${project.kind}</span><span>/${String(index + 2).padStart(2, '0')}</span></div>${visual}<span class="project-stage-caption mono">${project.title.split(' — ')[0]}</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-meta"><div><h3>${project.title}</h3><p>${project.detail}</p></div><span class="project-visit mono">СМОТРЕТЬ ↗</span></div>`;
  grid.append(card);
  return card;
});

function updateProjects() {
  let shown = 0;
  const matches = projects.filter(project => activeFilter === 'all' || project.category === activeFilter);
  cards.forEach((card, index) => {
    const match = activeFilter === 'all' || projects[index].category === activeFilter;
    card.hidden = !match || (!expanded && shown >= 6);
    if (match) shown++;
  });
  const featuredVisible = activeFilter === 'all' || activeFilter === 'business';
  document.querySelector('.featured').hidden = !featuredVisible;
  const count = matches.length + Number(featuredVisible);
  const suffix = count === 1 ? 'ПРОЕКТ' : count < 5 ? 'ПРОЕКТА' : 'ПРОЕКТОВ';
  document.querySelector('#project-count').textContent = `${count} ${suffix}`;
  moreButton.hidden = matches.length <= 6;
  moreButton.innerHTML = expanded ? 'Свернуть проекты <span aria-hidden="true">↑</span>' : `Ещё ${matches.length - 6} проектов <span aria-hidden="true">↓</span>`;
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    expanded = false;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    updateProjects();
  });
});
moreButton.addEventListener('click', () => {
  expanded = !expanded;
  updateProjects();
  if (expanded) cards.find((card, index) => index >= 6 && !card.hidden)?.focus({preventScroll:true});
  else document.querySelector('.work-toolbar').scrollIntoView({block:'start'});
});
updateProjects();

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('waiting'); observer.unobserve(entry.target); }
  }), {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('waiting'); observer.observe(element); });
}

const bench = document.querySelector('.workbench');
bench.addEventListener('pointermove', event => {
  if (motionPreference.matches || event.pointerType !== 'mouse') return;
  const rect = bench.getBoundingClientRect();
  bench.style.setProperty('--mx', `${(event.clientX - rect.left - rect.width / 2) / 28}px`);
  bench.style.setProperty('--my', `${(event.clientY - rect.top - rect.height / 2) / 32}px`);
});
bench.addEventListener('pointerleave', () => {
  bench.style.setProperty('--mx','0px');
  bench.style.setProperty('--my','0px');
});

const demoScenarios = [
  ['Запишемся на встречу 📅', 'Время выбрано → запись в календаре.\nНапоминание придёт в Telegram.'],
  ['Покажем товары 🛍', 'Каталог → заказ → уведомление.\nВсё в одном Mini App.'],
  ['Уберём рутину ✨', 'Заявка → CRM → уведомление.\nГотово. Можно заняться важным.'],
];
let demoIndex = 0;
document.querySelector('.bot-demo').addEventListener('click', () => {
  const [answer, result] = demoScenarios[demoIndex++ % demoScenarios.length];
  document.querySelector('#bot-answer').textContent = answer;
  document.querySelector('#bot-result').textContent = result;
});

document.querySelectorAll('.kwork-link').forEach(link => { link.href = KWORK_URL; });
document.querySelector('#year').textContent = new Date().getFullYear();

const dialog = document.querySelector('#brief-dialog');
const briefType = document.querySelector('#brief-type');
const briefText = document.querySelector('#brief-text');
const copyStatus = document.querySelector('#copy-status');
document.querySelector('#brief-open').addEventListener('click', () => dialog.showModal());
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
} });
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { briefType.value = link.dataset.service; }));
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const text = `Привет, Александр! Нужен ${briefType.value.toLowerCase()}.\n\n${briefText.value.trim() || 'Хочу обсудить идею, подход и стоимость. Какие детали нужны для оценки?'}`;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Скопировано! Вставьте сообщение в переписку на Kwork.';
  } catch {
    briefText.value = text;
    briefText.focus();
    briefText.select();
    copyStatus.textContent = 'Текст выделен. Скопируйте его вручную и отправьте на Kwork.';
  }
});
