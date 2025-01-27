import { Block } from 'payload'

export const ArchiveBlock: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlockType',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: {
            en: 'Project',
            ru: 'Project',
          },
          value: 'project',
        },
      ],
    },
  ],
}
