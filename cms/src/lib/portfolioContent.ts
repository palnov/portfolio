import { getPayload } from 'payload'

import config from '@/payload.config'

import { defaultProjects, defaultSettings, type MediaValue, type PortfolioSettings, type ProjectRecord } from './portfolioDefaults'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const mergeDefaults = <T>(defaults: T, value: unknown): T => {
  if (value === undefined || value === null) return defaults
  if (Array.isArray(defaults)) return (Array.isArray(value) && value.length ? value : defaults) as T
  if (!isRecord(defaults) || !isRecord(value)) return value as T

  const result: Record<string, unknown> = { ...defaults }
  Object.keys(defaults).forEach((key) => {
    result[key] = mergeDefaults((defaults as Record<string, unknown>)[key], value[key])
  })
  Object.keys(value).forEach((key) => {
    if (!(key in result)) result[key] = value[key]
  })
  return result as T
}

const normalizeProject = (value: unknown, index: number): ProjectRecord => {
  const incoming = isRecord(value) ? value : {}
  const fallback = defaultProjects.find((project) => project.slug === incoming.slug) ?? defaultProjects[index]
  return mergeDefaults(fallback, incoming)
}

export const mediaUrl = (media: MediaValue, fallback: string) => {
  if (isRecord(media)) {
    const sizes = media.sizes
    if (isRecord(sizes)) {
      const card = sizes.card
      if (isRecord(card) && typeof card.url === 'string' && card.url) return card.url
    }
    if (typeof media.url === 'string' && media.url) return media.url
  }
  return fallback
}

const fallbackContent = () => ({ settings: defaultSettings, projects: defaultProjects })

export async function getPortfolioContent() {
  // The static fallback keeps the site renderable before the first Coolify
  // deployment has a database connection, and preserves the current design
  // during the migration.
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('<password>')) {
    return fallbackContent()
  }

  try {
    const payload = await getPayload({ config })
    const [global, projects] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      payload.find({
        collection: 'projects',
        depth: 1,
        limit: 100,
        sort: 'sortOrder',
        where: { published: { equals: true } },
      }),
    ])

    const docs = projects.docs.map((project, index) => normalizeProject(project, index))
    const hasStoredContent = Object.prototype.hasOwnProperty.call(global, 'id') || projects.totalDocs > 0
    return {
      settings: mergeDefaults<PortfolioSettings>(defaultSettings, global),
      // Use defaults only before the first seed. Once Payload has content,
      // an intentionally empty published list must stay empty.
      projects: hasStoredContent ? docs : defaultProjects,
    }
  } catch (error) {
    console.warn('Payload content is unavailable; using the static portfolio fallback.', error)
    return fallbackContent()
  }
}
