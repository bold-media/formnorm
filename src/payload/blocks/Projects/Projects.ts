import { link } from '@/payload/fields/link'
import { Block } from 'payload'

export const ProjectsBlock: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlockType',
  labels: {
    singular: {
      en: 'Projects',
      ru: 'Проекты',
    },
    plural: {
      en: 'Projects',
      ru: 'Проекты',
    },
  },
  fields: [
    {
      name: 'count',
      type: 'number',
      label: {
        en: 'Number of projects',
        ru: 'Количество проектов',
      },
    },
    link({
      appearances: false,
    }),
  ],
}
