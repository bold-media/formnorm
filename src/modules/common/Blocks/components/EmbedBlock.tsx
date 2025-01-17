import { AspectRatio } from '@/components/AspectRatio'
import { EmbedBlockType } from '@payload-types'
import React from 'react'

export const EmbedBlock = (props: EmbedBlockType) => {
  const { code, landscapeVideo } = props

  if (!code) return null

  if (landscapeVideo) {
    return (
      <AspectRatio ratio={16 / 9} className="w-full">
        <div
          dangerouslySetInnerHTML={{ __html: code }}
          className="h-full w-full"
          suppressHydrationWarning={true}
        />
      </AspectRatio>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning={true} />
}
