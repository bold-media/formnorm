import { AspectRatio } from '@/components/AspectRatio'
import { ImageBlockType } from '@payload-types'
import Image from 'next/image'
import React from 'react'

export const ImageBlock = (props: ImageBlockType) => {
  const { image } = props

  if (!image || typeof image !== 'object' || !image?.url) return null
  return (
    <div className="not-prose w-full relative">
      <AspectRatio ratio={Number(image.width) / Number(image.height)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill={true}
          draggable={false}
          className="select-none object-contain object-center"
        />
      </AspectRatio>
    </div>
  )
}
