import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { access, accessField } from '@/payload/access'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'

export const User: CollectionConfig = {
  slug: 'user',
  labels: {
    singular: {
      en: 'User',
      ru: 'Пользователь',
    },
    plural: {
      en: 'Users',
      ru: 'Пользователи',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: {
      en: 'Admin',
      ru: 'Админ',
    },
  },
  auth: true,
  access: {
    read: () => true,
    update: access({ query: (args) => ({ id: { equals: args.req?.user?.id } }) }),
    delete: access(),
  },
  fields: [
    {
      name: 'roles',
      label: {
        en: 'Roles',
        ru: 'Роли',
      },
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      hooks: {
        beforeValidate: [ensureFirstUserIsAdmin],
      },
      access: {
        read: accessField({ condition: ({ id, req }) => id === req?.user?.id }),
        update: accessField(),
      },
      options: [
        {
          label: {
            en: 'Admin',
            ru: 'Админ',
          },
          value: 'admin',
        },
        {
          label: {
            en: 'Editor',
            ru: 'Редактор',
          },
          value: 'editor',
        },
      ],
    },
    {
      name: 'name',
      label: {
        en: en.common.name.person.singular,
        ru: ru.common.name.person.singular,
      },
      type: 'text',
      required: false,
    },
    {
      name: 'job',
      label: {
        en: 'Job',
        ru: 'Должность',
      },
      type: 'text',
      required: false,
    },
    {
      name: 'picture',
      label: {
        en: en.common.image.singular,
        ru: ru.common.image.singular,
      },
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
