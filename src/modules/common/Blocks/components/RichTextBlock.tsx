// import { RichTextBlockType } from '@payload-types'
import { RichText } from '@/modules/common/RichText'
import React from 'react'

/**
 * deprecated
 */
export const RichTextBlock = (props: any) => {
  const { data, settings } = props
  return <RichText data={data} container={settings?.container} tag={settings?.tag} />
}
