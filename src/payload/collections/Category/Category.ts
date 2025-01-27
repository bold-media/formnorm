import { slug } from '@/payload/fields/slug'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { CollectionConfig } from 'payload'
import { revalidateCategory, revalidateCategoryDelete } from './hooks/revalidateCategory'

export const Category: CollectionConfig = {
  slug: 'category',
  labels: {
    singular: {
      en: 'Category',
      ru: 'Категория',
    },
    plural: {
      en: 'Categories',
      ru: 'Категории',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateCategoryDelete],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: {
        en: en.common.name.title.singular,
        ru: ru.common.name.title.singular,
      },
      type: 'text',
    },
    slug('name'),
  ],
}
