export type MediaValue =
  | {
      url?: string | null
      sizes?: Record<string, { url?: string | null } | null> | null
    }
  | number
  | null
  | undefined

export type ProjectRecord = {
  id?: string | number
  title: string
  slug: string
  category: 'business' | 'services' | 'lifestyle' | 'concept'
  kind: string
  tags: string
  cover?: MediaValue
  fallbackCover?: string
  visualMode?: 'image' | 'orb'
  orbLabel?: string
  coverClassName?: string
  overlayLineOne?: string
  overlayLineTwo?: string
  alt?: string
  previewUrl: string
  sortOrder: number
  cardVariant?: 'default' | 'wide'
  published?: boolean
}

export type PortfolioSettings = {
  site: {
    title: string
    description: string
    brandName: string
    brandTagline: string
    brandAriaLabel: string
    navProjects: string
    navServices: string
    navProcess: string
    navContact: string
    headerCta: string
    location: string
    telegramLabel: string
    emailLabel: string
    backToTopLabel: string
    telegramUrl: string
    emailUrl: string
  }
  hero: {
    year: string
    status: string
    eyebrow: string
    titleLineOne: string
    titleEmphasis: string
    titleLineTwo: string
    titleDot: string
    lead: string
    primaryCta: string
    secondaryCta: string
    portrait?: MediaValue
    portraitFallback: string
    portraitAlt: string
    portraitCaptionLabel: string
    portraitCaptionLineOne: string
    portraitCaptionLineTwo: string
    badgeOne: string
    badgeTwo: string
    badgeThree: string
    coordinate: string
    index: string
    scrollLabel: string
    metrics: Array<{ value: string; label: string }>
  }
  marquee: { items: Array<{ label: string }> }
  portfolio: {
    sectionLabel: string
    headingLineOne: string
    headingEmphasis: string
    sideCopy: string
    liveLabel: string
    emptyText: string
    projectsCountSuffix: string
    directionsCountSuffix: string
    approachLabel: string
    footerLink: string
  }
  filters: {
    all: string
    business: string
    services: string
    lifestyle: string
    concept: string
  }
  services: {
    sectionLabel: string
    headingLineOne: string
    headingEmphasis: string
    lead: string
    tags: Array<{ label: string }>
    items: Array<{ title: string; description: string }>
    note: string
  }
  process: {
    sectionLabel: string
    headingLineOne: string
    headingEmphasis: string
    lead: string
    photo?: MediaValue
    photoFallback: string
    photoAlt: string
    stampLineOne: string
    stampEmphasis: string
    stampLineTwo: string
    photoIndex: string
    kicker: string
    titleLineOne: string
    titleEmphasis: string
    copy: string
    steps: Array<{ title: string; description: string }>
  }
  contact: {
    sectionLabel: string
    headingLineOne: string
    headingLineTwo: string
    headingEmphasis: string
    lead: string
    responseLabel: string
    nameLabel: string
    namePlaceholder: string
    contactLabel: string
    contactPlaceholder: string
    typeLabel: string
    typeOptions: Array<{ label: string }>
    messageLabel: string
    messagePlaceholder: string
    submitLabel: string
    statusText: string
  }
  preview: {
    defaultKind: string
    defaultTitle: string
    defaultTags: string
    loaderText: string
    browserLabel: string
    frameTitle: string
    externalLabel: string
    hint: string
    closeLabel: string
  }
}

export const defaultSettings: PortfolioSettings = {
  site: {
    title: 'Александр — сайты, которые двигают бизнес',
    description:
      'Александр — сайты и digital-системы для бизнеса: от продающего лендинга до автоматизаций, Telegram-ботов и AI-консультантов.',
    brandName: 'ALEXANDER',
    brandTagline: 'web · systems · ai',
    brandAriaLabel: 'Александр — на главную',
    navProjects: 'Проекты',
    navServices: 'Что делаю',
    navProcess: 'Подход',
    navContact: 'Контакты',
    headerCta: 'Есть задача',
    location: 'Саратов · работаю удалённо',
    telegramLabel: 'Telegram',
    emailLabel: 'Email',
    backToTopLabel: '↑ наверх',
    telegramUrl: '#contact',
    emailUrl: '#contact',
  },
  hero: {
    year: 'портфолио / 2026',
    status: 'беру 1–2 проекта в месяц',
    eyebrow: 'Александр · сайты и digital-системы',
    titleLineOne: 'Сайты,',
    titleEmphasis: 'которые',
    titleLineTwo: 'двигают бизнес',
    titleDot: '.',
    lead: 'Собираю сильную подачу, понятный путь к заявке и нужные инструменты вокруг неё, чтобы сайт был не витриной, а частью продаж.',
    primaryCta: 'Смотреть проекты',
    secondaryCta: 'Обсудить задачу',
    portraitFallback: '/portfolio-assets/alexander.jpg',
    portraitAlt: 'Александр — автор проектов',
    portraitCaptionLabel: 'создаю',
    portraitCaptionLineOne: 'смысл',
    portraitCaptionLineTwo: 'в движении',
    badgeOne: 'AI',
    badgeTwo: 'DESIGN',
    badgeThree: 'CODE',
    coordinate: '51°32′ N / 46°02′ E',
    index: 'A / 01',
    scrollLabel: 'scroll to explore',
    metrics: [
      { value: '10+', label: 'готовых\nпроектов' },
      { value: '3–14', label: 'дней до\nпервого релиза' },
      { value: '∞', label: 'идей вокруг\nвашей задачи' },
    ],
  },
  marquee: {
    items: [
      { label: 'лендинги' },
      { label: 'сайты услуг' },
      { label: 'e-commerce' },
      { label: 'AI-инструменты' },
      { label: 'автоматизации' },
    ],
  },
  portfolio: {
    sectionLabel: '01 / ПОРТФОЛИО',
    headingLineOne: 'Проекты, которые',
    headingEmphasis: 'уже работают.',
    sideCopy: 'Здесь можно не только посмотреть на картинку. Откройте любой кейс: каждый сайт загружается прямо внутри портфолио.',
    liveLabel: 'live previews',
    emptyText: 'В этой категории пока нет проектов.',
    projectsCountSuffix: 'проектов',
    directionsCountSuffix: 'направлений',
    approachLabel: 'один подход',
    footerLink: 'Нужен сайт под вашу нишу?',
  },
  filters: {
    all: 'Все',
    business: 'Бизнес',
    services: 'Сервисы',
    lifestyle: 'Lifestyle',
    concept: 'Эксперименты',
  },
  services: {
    sectionLabel: '02 / ЧТО ДЕЛАЮ',
    headingLineOne: 'Сайт — это',
    headingEmphasis: 'только начало.',
    lead: 'Сначала собираем понятную точку входа. Потом добавляем всё, что снимает ручную работу и помогает бизнесу не терять людей.',
    tags: [{ label: 'UX / UI' }, { label: 'WEB' }, { label: 'AI' }, { label: 'CRM' }, { label: 'NO-CODE' }],
    items: [
      { title: 'Сайт, который продаёт', description: 'Лендинг, сайт услуг или каталог с правильной драматургией и понятным CTA.' },
      { title: 'AI-консультант для сайта', description: 'Обученный на материалах вашего бизнеса ассистент, который отвечает, квалифицирует и ведёт к заявке.' },
      { title: 'Telegram-боты и автоматизации', description: 'Бот для продаж, записи, поддержки или внутренних процессов с логикой именно под вас.' },
      { title: 'CRM, CMS и лиды', description: 'Подключаю формы к CRM, собираю простую админку или персональную систему, которую легко обновлять.' },
    ],
    note: 'если можно убрать два ручных шага, уберём',
  },
  process: {
    sectionLabel: '03 / ПОДХОД',
    headingLineOne: 'Быстро — не значит',
    headingEmphasis: 'поверхностно.',
    lead: 'Современные инструменты ускоряют рутину. Время, которое они освобождают, я трачу на идею, детали и проверку того, что действительно важно для вашего бизнеса.',
    photoFallback: '/portfolio-assets/alexander.jpg',
    photoAlt: 'Александр у моря',
    stampLineOne: 'MADE WITH',
    stampEmphasis: 'curiosity',
    stampLineTwo: 'AND CARE',
    photoIndex: 'A / 2026',
    kicker: 'лично веду проект от первой идеи до запуска',
    titleLineOne: 'Собираю не просто страницу.',
    titleEmphasis: 'Собираю следующий шаг.',
    copy: 'Использую AI-инструменты как ускоритель: быстро перебираю направления, тестирую гипотезы и собираю рабочие интерфейсы. Решения, тон и ответственность остаются человеческими, моими и вашими.',
    steps: [
      { title: 'Разобраться', description: 'цели, аудитория, характер бренда' },
      { title: 'Собрать', description: 'структура, тексты, дизайн, код' },
      { title: 'Проверить', description: 'мобильный UX, формы, сценарии' },
      { title: 'Запустить', description: 'публикация и понятная передача' },
    ],
  },
  contact: {
    sectionLabel: '04 / СТАРТ',
    headingLineOne: 'Расскажите,',
    headingLineTwo: 'что нужно',
    headingEmphasis: 'сдвинуть.',
    lead: 'Опишите задачу в двух словах. Я вернусь с вопросами, идеей первого шага и честной оценкой сроков.',
    responseLabel: 'ответ в течение 1 рабочего дня',
    nameLabel: 'как к вам обращаться',
    namePlaceholder: 'Имя',
    contactLabel: 'куда ответить',
    contactPlaceholder: 'Telegram, телефон или email',
    typeLabel: 'что собираем',
    typeOptions: [
      { label: 'Новый сайт' },
      { label: 'Редизайн существующего' },
      { label: 'AI-консультант' },
      { label: 'Бот или автоматизация' },
      { label: 'CRM / CMS / интеграция' },
      { label: 'Пока хочу обсудить' },
    ],
    messageLabel: 'коротко о задаче',
    messagePlaceholder: 'Что должно измениться после запуска?',
    submitLabel: 'Отправить задачу',
    statusText: 'Спасибо! Форма работает локально; перед публикацией подключу её к вашей почте, Telegram или CRM.',
  },
  preview: {
    defaultKind: 'live preview',
    defaultTitle: 'Проект',
    defaultTags: '—',
    loaderText: 'загружаю проект',
    browserLabel: 'portfolio / preview',
    frameTitle: 'Предпросмотр проекта',
    externalLabel: 'открыть отдельно',
    hint: 'Это живой предпросмотр. Пролистайте страницу внутри окна, чтобы увидеть интерактив.',
    closeLabel: 'Закрыть превью',
  },
}

export const defaultProjects: ProjectRecord[] = [
  { title: 'ЖК «Солнечный Парк»', slug: 'residence', category: 'business', kind: 'real estate / landing', tags: 'Позиционирование · заявки · презентация', fallbackCover: '/portfolio-assets/residence.png', previewUrl: 'ЖК/index.html?rev=20260713', sortOrder: 1, cardVariant: 'wide', overlayLineOne: 'premium', overlayLineTwo: 'real estate', alt: 'ЖК «Солнечный Парк»' },
  { title: 'AURA Furniture', slug: 'aura', category: 'business', kind: 'e-commerce / catalog', tags: 'Каталог · визуальный язык · корзина', fallbackCover: '/portfolio-assets/aura.png', previewUrl: 'aura-furniture/index.html', sortOrder: 2, coverClassName: 'project-cover--aura', overlayLineOne: 'objects', overlayLineTwo: 'with soul', alt: 'AURA Furniture' },
  { title: 'BURO Coffee', slug: 'buro', category: 'lifestyle', kind: 'brand site / shop', tags: 'Бренд · магазин · атмосфера', fallbackCover: '/portfolio-assets/coffee.png', previewUrl: 'caffe/index.html', sortOrder: 3, overlayLineOne: 'specialty', overlayLineTwo: 'coffee', alt: 'BURO Coffee' },
  { title: 'Тёплая корка', slug: 'bakery', category: 'lifestyle', kind: 'bakery / e-commerce', tags: 'Каталог · заказ · локальный бренд', fallbackCover: '/portfolio-assets/bakery.png', previewUrl: 'bakery/index.html', sortOrder: 4, overlayLineOne: 'daily', overlayLineTwo: 'bread', alt: 'Тёплая корка' },
  { title: 'БРЕВДОМ', slug: 'brewdom', category: 'business', kind: 'construction / catalog', tags: 'Доверие · каталог · лидогенерация', fallbackCover: '/portfolio-assets/brewdom.jpg', previewUrl: 'brewdom/index.html?rev=20260713', sortOrder: 5, cardVariant: 'wide', overlayLineOne: 'built', overlayLineTwo: 'to last', alt: 'БРЕВДОМ' },
  { title: 'ВЕРЕСК Glamping', slug: 'glamping', category: 'lifestyle', kind: 'hospitality / booking', tags: 'Бронирование · контент · премиум', fallbackCover: '/portfolio-assets/glamping.png', previewUrl: 'glamping/index.html', sortOrder: 6, overlayLineOne: 'slow', overlayLineTwo: 'escape', alt: 'ВЕРЕСК Glamping' },
  { title: 'Dental Clinic', slug: 'dentist', category: 'services', kind: 'medical / service', tags: 'Сервис · доверие · запись', fallbackCover: '/portfolio-assets/dentist.png', previewUrl: 'dentist/index.html?rev=20260713', sortOrder: 7, overlayLineOne: 'care', overlayLineTwo: 'in detail', alt: 'Dental Clinic' },
  { title: 'AION — верните себе время', slug: 'aion', category: 'services', kind: 'ai / automation', tags: 'AI · сценарии · продукт', visualMode: 'orb', orbLabel: 'AION', previewUrl: 'awesomesite/index.html', sortOrder: 8, cardVariant: 'wide', overlayLineOne: 'time', overlayLineTwo: 'as a system', alt: 'AION' },
  { title: 'Detailing Studio', slug: 'detailing', category: 'services', kind: 'automotive / service', tags: 'Сервис · до/после · запись', fallbackCover: '/portfolio-assets/detailing.png', previewUrl: 'previews/detailing-studio.html', sortOrder: 9, overlayLineOne: 'care', overlayLineTwo: 'for motion', alt: 'Detailing Studio' },
  { title: 'WILDLINE — выйти за карту', slug: 'adventure', category: 'concept', kind: 'visual concept / landing', tags: 'Концепт · арт-дирекшн · mood', fallbackCover: '/portfolio-assets/adventure.png', previewUrl: 'previews/adventure.html', sortOrder: 10, overlayLineOne: 'find', overlayLineTwo: 'the edge', alt: 'WILDLINE' },
  { title: 'MATERIA Interiors', slug: 'renovation', category: 'business', kind: 'interiors / landing', tags: 'Премиум · scrollytelling · заявка', fallbackCover: '/portfolio-assets/materia.webp', previewUrl: 'renavation/index.html', sortOrder: 11, cardVariant: 'wide', overlayLineOne: 'crafted', overlayLineTwo: 'interiors', alt: 'MATERIA Interiors' },
  { title: 'Право на новый этап', slug: 'bfl', category: 'services', kind: 'legal / lead generation', tags: 'Маршрутизация · доверие · заявка', fallbackCover: '/portfolio-assets/bfl.png', previewUrl: 'bfl/index.html', sortOrder: 12, cardVariant: 'wide', overlayLineOne: 'clarity', overlayLineTwo: 'before contract', alt: 'Право на новый этап' },
]
