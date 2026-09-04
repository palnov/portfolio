# Portfolio + Payload CMS

Payload подключён к существующему портфолио без переделки интерфейса. `src/app/(frontend)/page.tsx` сохраняет те же HTML-классы, порядок секций, CSS и клиентские сценарии, что и текущая главная. `src/lib/portfolioDefaults.ts` — аварийный fallback: сайт продолжает выглядеть и работать как сейчас, даже если база временно недоступна.

## Что редактируется в админке

- `/admin` — тексты главной, hero, бегущая строка, услуги, этапы, контакты и подписи предпросмотра (`Site settings` → `Контент главной`);
- коллекция `Projects` — добавление, удаление, порядок, категория, обложка, подписи и ссылка на живой сайт проекта;
- коллекция `Media` — изображения с автоматическими размерами для карточек и предпросмотра.

Изображения, скопированные в `public/portfolio-assets`, используются как исходные fallback-обложки. После первого запуска `npm run seed` они импортируются в Media, поэтому их можно заменить из админки.

## Локальный запуск

```bash
cp .env.example .env
# укажите DATABASE_URL и PAYLOAD_SECRET
npm install
npm run dev
```

Откройте `http://localhost:3000/`, админка — `http://localhost:3000/admin`. При первом входе Payload предложит создать пользователя. Для наполнения исходными данными выполните `npm run seed` после запуска PostgreSQL.

Проверка production-сборки:

```bash
npm run build
npm run start -- -p 3000
```

## Деплой в Coolify

Рекомендуемый вариант — создать в Coolify ресурс **Docker Compose** из этой папки. Compose-файл поднимает приложение и PostgreSQL 16; задайте в Variables:

```text
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=<длинный пароль>
POSTGRES_DB=portfolio
PAYLOAD_SECRET=<длинная случайная строка>
DATABASE_URL=postgres://portfolio:<пароль>@postgres:5432/portfolio
```

Приложение слушает порт `3000`. В Coolify укажите домен с `https://` — reverse proxy и сертификат Let’s Encrypt будут настроены автоматически. Для медиа добавьте persistent volume `/app/media`; отдельно включите регулярные бэкапы PostgreSQL и этого volume. Бэкап самого Coolify не заменяет бэкап данных приложения.

Схема PostgreSQL версионируется в `src/migrations` и применяется Payload при старте production-контейнера.

После первого деплоя один раз выполните в контейнере приложения:

```bash
npm run seed
```

Команда не перезаписывает уже существующие карточки и настройки; для намеренного повторного импорта исходного контента используйте `npm run seed -- --force`.

Дальше публикация обновлений — обычный push в подключённую ветку GitHub; Coolify может запускать деплой автоматически.

## Внешние сайты проектов

В `Projects → URL сайта проекта` указывайте полный HTTPS-адрес предпросмотра. Для кейсов из этого репозитория используйте общий сервер с путями вроде `https://palnov.ru/cases/aura/` или `https://palnov.ru/cases/bakery/`; внешний сайт на поддомене тоже поддерживается. Ссылка попадёт в предпросмотр внутри iframe и в кнопку «открыть отдельно».

Чтобы предпросмотр открылся внутри окна, сайт проекта не должен отдавать `X-Frame-Options: DENY` или запрещающий `Content-Security-Policy`; при необходимости разрешите в `frame-ancestors` домен портфолио.

## Граница миграции

Миграция завершена: корневой статический entrypoint (`index.html`, `styles.css`, `app.js` и его портрет) архивирован локально и удалён из репозитория. Рабочей главной страницей остаётся CMS-версия в `cms/`; её fallback хранится в `src/lib/portfolioDefaults.ts`, поэтому при проблеме с PostgreSQL контент и внешний вид сохраняются.

Полезные официальные разделы: [Payload — deployment](https://payloadcms.com/docs/production/deployment), [Payload — collections](https://payloadcms.com/docs/configuration/collections), [Coolify — applications](https://coolify.io/docs/applications/index), [Coolify — persistent storage](https://coolify.io/docs/knowledge-base/persistent-storage).
