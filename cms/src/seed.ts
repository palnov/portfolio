import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import 'dotenv/config'
import { getPayload } from 'payload'

import config from './payload.config'
import { defaultProjects, defaultSettings } from './lib/portfolioDefaults'
import type { Project } from './payload-types'

const seedDir = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(seedDir, '../public')

const localMediaPath = (fallback?: string) => {
  if (!fallback?.startsWith('/portfolio-assets/')) return undefined
  const filePath = path.resolve(publicDir, fallback.slice(1))
  return fs.existsSync(filePath) ? filePath : undefined
}

const findMedia = async (payload: Awaited<ReturnType<typeof getPayload>>, filename: string) => {
  const result = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  return result.docs[0]
}

const ensureMedia = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  alt: string,
  fallback?: string,
) => {
  const filePath = localMediaPath(fallback)
  if (!filePath) return undefined

  const filename = path.basename(filePath)
  const existing = await findMedia(payload, filename)
  if (existing) return existing.id

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath,
  })
  return created.id
}

const run = async () => {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('<password>')) {
    throw new Error('DATABASE_URL не настроен. Укажите рабочую PostgreSQL-ссылку перед seed.')
  }

  const payload = await getPayload({ config })
  const force = process.argv.includes('--force')
  const heroPortrait = await ensureMedia(payload, defaultSettings.hero.portraitAlt, defaultSettings.hero.portraitFallback)
  const processPhoto = await ensureMedia(payload, defaultSettings.process.photoAlt, defaultSettings.process.photoFallback)

  const { portrait: _portrait, ...heroDefaults } = defaultSettings.hero
  const { photo: _photo, ...processDefaults } = defaultSettings.process

  const currentGlobal = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const globalExists = Object.prototype.hasOwnProperty.call(currentGlobal, 'id')
  if (force || !globalExists) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...defaultSettings,
        hero: { ...heroDefaults, ...(heroPortrait ? { portrait: heroPortrait } : {}) },
        process: { ...processDefaults, ...(processPhoto ? { photo: processPhoto } : {}) },
      },
    })
  }

  for (const project of defaultProjects) {
    const cover = await ensureMedia(payload, project.alt || project.title, project.fallbackCover)
    const { cover: _cover, id: _id, ...projectDefaults } = project
    const data: Omit<Project, 'id' | 'updatedAt' | 'createdAt'> = {
      ...projectDefaults,
      visualMode: project.visualMode ?? 'image',
      cardVariant: project.cardVariant ?? 'default',
      ...(cover ? { cover } : {}),
    }
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })

    if (existing.docs[0] && force) {
      await payload.update({ collection: 'projects', id: existing.docs[0].id, data })
    } else if (!existing.docs[0]) {
      await payload.create({ collection: 'projects', data })
    }
  }

  await payload.destroy()
  console.log(`Seed complete: ${defaultProjects.length} projects and site settings.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
