import type { Access, CollectionConfig } from 'payload'

const isAuthenticated: Access = ({ req }) => Boolean(req.user)

const validatePreviewUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return 'Укажите URL проекта.'

  const trimmed = value.trim()

  // During the migration the existing local previews remain valid. Once a
  // project is deployed separately, replace this with its https subdomain.
  if (/^(?:\/|\.\.?\/|[\w\u0400-\u04ff.-]+\/)/u.test(trimmed)) return true

  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Используйте ссылку с http:// или https://.'
    }
  } catch {
    return 'Укажите корректную ссылку на сайт проекта.'
  }

  return true
}

const validateSlug = (value: unknown) => {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value.trim())) {
    return 'Используйте латиницу, цифры и дефисы, например detailing-studio.'
  }

  return true
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'published', 'sortOrder', 'updatedAt'],
    description: 'Карточки проектов, которые выводятся в портфолио.',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  defaultSort: 'sortOrder',
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название проекта',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Системный slug',
      validate: validateSlug,
      admin: {
        description: 'Латиница, дефисы и цифры. Используется для CSS-класса карточки.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Раздел фильтра',
      options: [
        { label: 'Бизнес', value: 'business' },
        { label: 'Сервисы', value: 'services' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Эксперименты', value: 'concept' },
      ],
    },
    {
      name: 'kind',
      type: 'text',
      required: true,
      label: 'Тип проекта',
      admin: { description: 'Например: e-commerce / catalog' },
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Теги в предпросмотре',
      admin: { description: 'Разделяйте теги символом ·' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
      admin: { description: 'Изображение карточки. Можно заменить в любой момент.' },
    },
    {
      name: 'coverClassName',
      type: 'text',
      label: 'Класс кадрирования',
      admin: { description: 'Необязательно. Например: project-cover--aura' },
    },
    {
      name: 'fallbackCover',
      type: 'text',
      label: 'Резервный путь к обложке',
      admin: {
        description: 'Используется до загрузки CMS-обложки или для миграции старых карточек.',
      },
    },
    {
      name: 'visualMode',
      type: 'select',
      required: true,
      defaultValue: 'image',
      label: 'Тип визуала',
      options: [
        { label: 'Изображение', value: 'image' },
        { label: 'Графический orb', value: 'orb' },
      ],
    },
    {
      name: 'orbLabel',
      type: 'text',
      label: 'Текст orb',
      admin: { condition: (_, siblingData) => siblingData?.visualMode === 'orb' },
    },
    {
      name: 'overlayLineOne',
      type: 'text',
      label: 'Подпись на обложке — строка 1',
    },
    {
      name: 'overlayLineTwo',
      type: 'text',
      label: 'Подпись на обложке — строка 2',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt обложки',
    },
    {
      name: 'previewUrl',
      type: 'text',
      required: true,
      label: 'URL сайта проекта',
      validate: validatePreviewUrl,
      admin: {
        description: 'Ссылка на поддомен проекта, например https://project.example.ru. На время миграции допустим локальный путь.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Порядок',
      admin: { description: 'Меньшее число — выше в портфолио.' },
    },
    {
      name: 'cardVariant',
      type: 'select',
      required: true,
      defaultValue: 'default',
      label: 'Размер карточки',
      options: [
        { label: 'Обычная', value: 'default' },
        { label: 'Широкая', value: 'wide' },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Показывать в портфолио',
    },
  ],
}
