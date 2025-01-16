import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link'

import { deepMerge } from '@/utils/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
  linkOverrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = ({
  appearances,
  overrides = {},
  linkOverrides = {},
} = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    label: {
      en: 'Links',
      ru: 'Ссылки',
    },
    labels: {
      singular: {
        en: 'Link',
        ru: 'Ссылка',
      },
      plural: {
        en: 'Links',
        ru: 'Ссылки',
      },
    },
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    fields: [link({ appearances, overrides: linkOverrides })],
  }

  return deepMerge(generatedLinkGroup, overrides)
}
