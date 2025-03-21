'use client'

import { AspectRatio } from '@/components/AspectRatio'
import { cn } from '@/utils/cn'
import { ImageBlockType } from '@payload-types'
import Image from 'next/image'
import React, { ComponentPropsWithRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

export const ImageBlock = (props: ImageBlockType & ComponentPropsWithRef<'div'>) => {
  const { image, aspectRatio, scale, format, lightbox, alignment } = props
  const [open, setOpen] = useState(false)

  if (!image || typeof image !== 'object' || !image?.url) return null

  return (
    <div className="not-prose w-full">
      <div
        className={cn('relative', {
          'ml-0': alignment === 'left',
          'mx-auto': alignment === 'center',
          'ml-auto': alignment === 'right',
        })}
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
            onClick={() => {
              if (!lightbox) {
                return
              } else {
                setOpen(true)
              }
            }}
            className={cn(
              'select-none object-center',
              {
                cover: 'object-cover',
                contain: 'object-contain',
              }[format ?? 'cover'],
              {
                'cursor-zoom-in': lightbox,
              },
            )}
          />
        </AspectRatio>
        {lightbox && typeof image === 'object' && (
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: image.url, alt: image.alt }]}
            controller={{ closeOnBackdropClick: true }}
            plugins={[Zoom]}
            toolbar={{ buttons: ['close'] }}
            carousel={{ finite: true }}
            render={{
              buttonPrev: () => null,
              buttonNext: () => null,
              slide: ({ slide }) => (
                <div className="w-full h-full relative">
                  <Image
                    src={slide.src || ''}
                    alt={slide.alt || 'Image'}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-sm"
                  />
                </div>
              ),
            }}
          />
        )}
      </div>
    </div>
  )
}
