# Деплой portfolio: устройство сервера и правила для агентов

Этот файл — рабочая инструкция для агентов, которые меняют портфолио, CMS или
проекты в разделе кейсов. Перед изменениями, связанными с публикацией, нужно
прочитать его целиком. Локальные реквизиты SSH лежат в
.server-access.local.md; этот файл намеренно исключён из Git.

## 1. Архитектура production

Исходный код хранится в GitHub-репозитории palnov/portfolio. Основная ветка —
main. Один production-сервер работает под управлением Coolify 4.1.2 в Docker.
Внешний reverse proxy — coolify-proxy на базе Traefik; он занимает порты 80 и
443, выпускает TLS-сертификаты Let's Encrypt и направляет домены в контейнеры.

На сервере сейчас два независимых ресурса Coolify:

| Ресурс | Coolify ID / UUID | Публичный адрес | Назначение |
| --- | --- | --- | --- |
| portfolio-cms | 2 / l8x5ydcgdmrop96ylyh04aa3 | https://palnov.ru | Next.js + Payload CMS и публичная главная |
| portfolio-cases | 3 / v12tdvejykks1bto9cc8i8jh | https://palnov.ru/cases | Статические проекты в Nginx |

UUID и имена контейнеров генерирует Coolify. После пересоздания ресурса UUID
может измениться, поэтому перед ручной командой его нужно проверить в Coolify
или через Application::find(<id>).

### Главная и CMS

- Репозиторий: palnov/portfolio, ветка main.
- Build pack: Dockerfile.
- Base directory: /cms.
- Dockerfile внутри base directory: /Dockerfile.
- Контейнер слушает порт 3000.
- Coolify домен: https://palnov.ru, health check включён на /.
- Админка Payload: https://palnov.ru/admin.
- Продакшен-переменные DATABASE_URL, PAYLOAD_SECRET и параметры PostgreSQL
  задаются в Coolify, а не в Git.
- Медиа хранятся в постоянном Docker volume, смонтированном в /app/media.
- PostgreSQL 16 работает отдельным Coolify-managed контейнером с постоянным
  volume для /var/lib/postgresql/data.

cms/docker-compose.yml остаётся воспроизводимой локальной/альтернативной
схемой. Фактический production-ресурс сейчас настроен в Coolify как приложение
на Dockerfile, поэтому изменения в compose-файле сами по себе production не
меняют.

### Сервер кейсов

- Репозиторий: palnov/portfolio, ветка main.
- Build pack: Dockerfile.
- Base directory: /.
- Dockerfile: /cases/Dockerfile.
- Контейнер слушает порт 80.
- Coolify направляет Host(palnov.ru) + PathPrefix(/cases) в этот контейнер.
- Внутри контейнера Nginx использует /usr/share/nginx/html и переписывает
  /cases/<slug>/... в /<slug>/....
- В конфиге есть GET /healthz, но health check в текущем Coolify-ресурсе
  отключён. Endpoint нужен для ручной проверки и для возможного включения
  health check позже.

Кейсы — это статический образ. В него попадают только файлы, перечисленные в
cases/Dockerfile; наличие папки в репозитории само по себе не публикует её.

## 2. Обычный процесс деплоя

1. Определить, какой ресурс меняется: главная/CMS (cms/) или кейсы
   (cases/Dockerfile, исходная папка проекта).
2. Работать только с нужными файлами и не включать в коммит чужие изменения.
   Перед коммитом проверить:

   ~~~bash
   git status --short
   git diff --check
   git diff --stat
   ~~~

3. Для CMS выполнить подходящие проверки из cms/:

   ~~~bash
   npm run lint
   npm run build
   ~~~

   Полный npm test запускается только если менялись сценарии, формы или
   серверная логика и локальное окружение действительно готово.
4. Для статического кейса проверить относительные пути к CSS, JS, изображениям
   и шрифтам. Минимум — открыть проект через путь с префиксом
   /cases/<slug>/, а не через локальный корень /.
5. Создать понятный коммит и отправить его в main, когда публикация разрешена:

   ~~~bash
   git add <только-нужные-файлы>
   git commit -m "Короткое описание изменения"
   git push origin main
   ~~~

6. Coolify обычно запускает деплой после push в подключённую ветку. Push не
   считается успешным деплоем: нужно дождаться статуса finished у конкретного
   deployment и проверить публичный URL.
7. Если webhook не сработал или deployment не появился, использовать ручную
   постановку в очередь через SSH. Команды ниже не создают новый ресурс и не
   трогают данные.

Для portfolio-cases (ID 3):

~~~bash
docker exec coolify php artisan tinker --execute="\$app=App\\Models\\Application::find(3); \$id=(new Visus\\Cuid2\\Cuid2)->toString(); dump(queue_application_deployment(application:\$app,deployment_uuid:\$id,force_rebuild:false,pull_request_id:0,is_webhook:true,is_api:true,no_questions_asked:true));"
~~~

Для portfolio-cms используется та же команда с Application::find(2).
Ответ должен содержать status => "queued" и новый deployment_uuid.

Проверка очереди по UUID:

~~~bash
docker exec coolify php artisan tinker --execute="dump(App\\Models\\ApplicationDeploymentQueue::where('deployment_uuid','<DEPLOYMENT_UUID>')->first()?->only(['deployment_uuid','status','commit','updated_at']));"
~~~

Ожидаемый итоговый статус — finished, а commit должен совпасть с отправленным
коммитом. Если статус failed, сначала нужно прочитать логи сборки в Coolify и
только потом менять код или повторять деплой.

## 3. Проверка после публикации

### CMS

~~~bash
curl.exe -fsSIL --max-time 20 https://palnov.ru/
curl.exe -fsSIL --max-time 20 https://palnov.ru/admin
~~~

Главная должна вернуть 200, а в админке должен открываться экран Payload
login. Если контент из базы временно недоступен, публичная страница использует
fallback из cms/src/lib/portfolioDefaults.ts.

### Кейсы

Всегда проверять страницу со слэшем в конце и хотя бы один CSS/JS-ресурс:

~~~bash
curl.exe -fsSIL --max-time 20 https://palnov.ru/cases/<slug>/
curl.exe -fsSIL --max-time 20 https://palnov.ru/cases/<slug>/styles.css
curl.exe -fsSIL --max-time 20 https://palnov.ru/cases/<slug>/app.js
~~~

Для существующих кейсов ожидается 200. У CSS должен быть Content-Type:
text/css, у JS — text/javascript или application/javascript. Если HTML
открывается как голый текст, первым делом проверять именно ответы CSS/JS и
порядок location в cases/nginx.conf.

В cases/nginx.conf блок location ^~ /cases/ намеренно имеет приоритет над
regex-блоком для *.html, *.css и *.js: сначала снимается префикс /cases, затем
ищется файл. Нельзя возвращать его к обычному location /cases/, иначе regex
перехватит ассеты и снова отдаст 404.

HTML, CSS и JS кейсов сейчас получают Cache-Control: no-cache, no-store...,
чтобы новая сборка не застревала в браузерном кэше. Не добавлять долгий кэш
для этих файлов без отдельной проверки.

## 4. Правила публикации проектов в портфолио

### Добавление нового кейса

Для нового slug <slug> нужно выполнить все шаги:

1. Положить исходники проекта в отдельную папку в корне репозитория либо
   подготовить отдельный статический build output.
2. Добавить соответствующий COPY в cases/Dockerfile, чтобы папка попала в
   Nginx image. Для готовой сборки копировать dist/build, а не исходники, если
   проект не является чистой статикой.
3. Добавить slug и источник в таблицу cases/README.md.
4. Добавить проект в CMS через Projects либо обновить fallback в
   cms/src/lib/portfolioDefaults.ts, если он должен работать без базы.
5. Указать полный preview URL со слэшем:
   https://palnov.ru/cases/<slug>/.
6. Если проект должен корректно редиректить URL без завершающего слэша,
   добавить slug в список разрешённых маршрутов в cases/nginx.conf.
7. После сборки проверить HTML, CSS, JS и изображения именно под
   /cases/<slug>/.

### Пути и структура статического проекта

- Главный файл должен быть index.html в корне публикуемой папки.
- Ссылки на локальные ассеты должны быть относительными: ./styles.css,
  assets/app.js, images/hero.webp.
- Нельзя оставлять root-absolute ссылки вроде /assets/app.js: на публичном
  сайте они уйдут в https://palnov.ru/assets/..., то есть за пределы
  /cases/<slug>/.
- Если сторонняя сборка генерирует root-absolute пути, исправить их настройкой
  base/publicPath либо точечным sed в cases/Dockerfile, как сделано для
  renavation/dist.
- Не подключать dev server, localhost или файл из рабочего компьютера.
- Все обязательные файлы должны копироваться в образ. Внешние CDN допустимы,
  но preview должен работать без локального dev server.

### Iframe и безопасность кейсов

Кейсы открываются из портфолио в iframe. Не добавлять X-Frame-Options: DENY и
CSP, запрещающую https://palnov.ru в frame-ancestors. Общий Nginx уже задаёт
разрешённый frame-ancestors и X-Content-Type-Options; сохранять эти заголовки
при изменении конфига.

## 5. Что нельзя делать

- Не коммитить .server-access.local.md, .env, PAYLOAD_SECRET, DATABASE_URL,
  пароли PostgreSQL, webhook secrets или дампы базы.
- Не выводить секреты через docker inspect, printenv, логи или сообщения
  агенту. Для диагностики проверять только имена переменных и статусы.
- Не выполнять docker compose down -v, docker system prune, удаление
  Coolify-ресурса или удаление volume ради исправления обычного deploy issue.
  Это может удалить медиа и PostgreSQL.
- Не делать git reset --hard, force-push в main и ручные правки production
  контейнеров вместо изменения репозитория.
- Не менять домен, base directory, порты, persistent volumes или Coolify
  application ID без явной причины и фиксации изменения в этой документации.
- Не считать открытие HTML достаточной проверкой: для кейса обязательны CSS/JS
  200 и проверка в браузере.

## 6. Быстрая диагностика

| Симптом | Первые проверки |
| --- | --- |
| Главная старая после push | статус deployment, commit в очереди, response headers и новый HTML |
| Кейс без стилей | styles.css/app.js под /cases/<slug>/, затем location ^~ /cases/ |
| 404 только у ассетов | относительные пути и наличие файла в cases/Dockerfile |
| Preview не открывается в iframe | X-Frame-Options, CSP frame-ancestors, HTTPS URL и завершающий слэш |
| CMS не собирается | cms/Dockerfile, lockfile, npm run lint, npm run build, логи Coolify |
| CMS открывается, но нет контента | доступность PostgreSQL, DATABASE_URL, миграции и fallback |

При аварии сначала сохранить commit hash, deployment UUID и логи, затем
откатить приложение в Coolify на последний рабочий commit либо сделать
обычный git revert и новый деплой. Базу и persistent volumes при таком
откате не удалять.
