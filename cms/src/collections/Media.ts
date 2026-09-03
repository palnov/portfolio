import type { Access, CollectionConfig } from 'payload'

const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    adminThumbnail: 'card',
    focalPoint: true,
    imageSizes: [
      { name: 'card', width: 1400, height: 1000, position: 'centre' },
      { name: 'preview', width: 2400, height: 1600, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
}
