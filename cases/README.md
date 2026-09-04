# Portfolio cases server

This is a small static Nginx image for the case previews used by the Payload
portfolio. It is built from the repository root and keeps the existing project
files unchanged.

## Coolify settings

- Source: `palnov/portfolio`, branch `main`
- Build pack: Dockerfile
- Base directory: `/`
- Dockerfile location: `/cases/Dockerfile`
- Container port: `80`
- Healthcheck path: `/healthz`
- Domain: `https://palnov.ru/cases`

Coolify's path route may strip `/cases` before proxying. The Nginx config
supports both stripped and unstripped requests, so the public URLs stay:

```
https://palnov.ru/cases/aura/
https://palnov.ru/cases/bakery/
https://palnov.ru/cases/buro/
```

After deployment, Payload project preview URLs should use the public paths
above (with a trailing slash). The existing frontend and project files are not
rewritten by this image.

## Mapping

| Portfolio slug | Public case path | Source |
| --- | --- | --- |
| `residence` | `/cases/residence/` | `ЖК/` |
| `aura` | `/cases/aura/` | `aura-furniture/` |
| `buro` | `/cases/buro/` | `caffe/` |
| `bakery` | `/cases/bakery/` | `bakery/` |
| `brewdom` | `/cases/brewdom/` | `brewdom/` |
| `glamping` | `/cases/glamping/` | `glamping/` |
| `dentist` | `/cases/dentist/` | `dentist/` |
| `aion` | `/cases/aion/` | `awesomesite/` |
| `detailing` | `/cases/detailing/` | `previews/detailing-studio.html` |
| `adventure` | `/cases/adventure/` | `previews/adventure.html` |
| `renovation` | `/cases/renovation/` | `renavation/dist/` |
| `bfl` | `/cases/bfl/` | `bfl/` |
