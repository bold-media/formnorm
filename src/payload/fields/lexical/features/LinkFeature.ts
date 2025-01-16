import { LinkFeature as PayloadLinkFeature } from '@payloadcms/richtext-lexical'

const LinkFeature = PayloadLinkFeature({
  fields: ({ defaultFields }) => {
    console.log(defaultFields)
    return [...defaultFields]
  },
})
