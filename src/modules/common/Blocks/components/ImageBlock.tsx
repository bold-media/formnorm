import { AspectRatio } from '@/components/AspectRatio'
import { cn } from '@/utils/cn'
import { ImageBlockType } from '@payload-types'
import Image from 'next/image'
import React from 'react'

export const ImageBlock = (props: ImageBlockType) => {
  const { image, aspectRatio, scale, alignment } = props

  if (!image || typeof image !== 'object' || !image?.url) return null

  return (
    <div
      className={cn(
        'not-prose relative flex',
        alignment === 'left' && 'justify-start items-center',
        alignment === 'centered' && 'justify-center items-center',
        alignment === 'right' && 'justify-end items-center',
      )}
      style={{
        width: `${scale}%`,
      }}
    >
      <AspectRatio
        ratio={
          aspectRatio
            ? {
                video: 16 / 9,
                square: 1 / 1,
                fourThree: 4 / 3,
              }[aspectRatio] || Number(image.width) / Number(image.height)
            : Number(image.width) / Number(image.height)
        }
      >
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
