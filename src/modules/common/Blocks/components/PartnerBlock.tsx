'use client'
import { PartnerBlockType } from '@payload-types'
import React, { useEffect } from 'react'
import { RichText } from '@/modules/common/RichText'
import { AspectRatio } from '@/components/AspectRatio'
import Image from 'next/image'

export const PartnerBlock = (props: PartnerBlockType) => {
  const { image, text } = props
  if (!image || typeof image !== 'object' || !image?.url) return null

  const isLink = (link: unknown): link is { id: string | number; label: string } => {
    return typeof link === 'object' && link !== null && 'id' in link && 'label' in link
  }

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="flex flex-col sm:flex-row gap-2 md:gap-10 items-center my-4 md:my-10">
        <div className="w-56 sm:w-1/5 h-full not-prose">
          <AspectRatio ratio={16 / 9} className="overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt}
              fill={true}
              draggable={false}
              className="flex-1 select-none object-contain object-center"
            />
          </AspectRatio>
        </div>
        <RichText
          data={text}
          container={false}
          className="flex-1 text-center sm:text-left prose-h3:normal-case prose-h3:text-lg sm:prose-h3:text-xl prose-a:text-zinc-700 prose-a:underline prose-a:underline-offset-4 "
        />
      </div>
    </div>
  )
}
