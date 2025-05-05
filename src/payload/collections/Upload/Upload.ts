import { access } from '@/payload/access'
import type { CollectionConfig } from 'payload'

export const Upload: CollectionConfig = {
  slug: 'upload',
  labels: {
    singular: {
      en: 'Upload',
      ru: 'Загрузка',
    },
    plural: {
      en: 'Uploads',
      ru: 'Загрузки',
    },
  },
  admin: {
    // hidden: true,
  },
  upload: true,
  access: {
    create: () => true,
    read: access(),
    update: access(),
    delete: access(),
  },
  fields: [],
}
