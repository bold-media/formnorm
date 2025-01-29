'use client'

import { AspectRatio } from '@/components/AspectRatio'
import { NextImageSlide } from '@/components/Lightbox'
import { PageHero } from '@payload-types'
import Image from 'next/image'
import React, { useState } from 'react'
import Lightbox, { SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

export const PrimaryHero = (props: NonNullable<PageHero['primary']>) => {
  const { prefix, suffix, cover, images } = props
  const [imageIndex, setImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const slides: SlideImage[] =
    images?.map((image) => ({
      src: typeof image === 'object' && image?.url ? image?.url : '',
      alt: (typeof image === 'object' && image?.alt) || '',
      width: typeof image === 'object' && image?.width ? image?.width : 1920,
      height: (typeof image === 'object' && image?.height) || 1080,
    })) || []

  return (
    <div className="container px-0">
      <div className="h-[72vh] relative sm:hidden">
        {cover && typeof cover === 'object' && typeof cover?.url === 'string' && (
          <Image
            src={cover?.url}
            alt={cover?.alt}
            fill={true}
            className="h-full object-cover object-bottom"
            draggable={false}
          />
        )}
        <h1 className="absolute left-0 top-16 font-semibold uppercase flex flex-col items-start space-y-4 max-w-[90%] min-w-[85%]">
          {/* Prefix Section */}
          <div className="bg-zinc-50 text-muted-foreground tracking-[0.125rem] pr-4 pl-14 text-[1.375rem] leading-[1.1] py-3 ">
            {prefix}
          </div>

          {/* Suffix Section */}
          <div className="font-bold bg-zinc-50 pr-4 pl-14 text-[2.5rem] leading-[1.1] py-4">
            {suffix}
          </div>
        </h1>
      </div>

      <div className="hidden sm:block">
        <AspectRatio ratio={2 / 0.9}>
          {cover && typeof cover === 'object' && typeof cover?.url === 'string' && (
            <Image
              src={cover?.url}
              alt={cover?.alt}
              fill={true}
              className="object-cover object-bottom"
              draggable={false}
            />
          )}
          <h1 className="absolute left-0 top-16 font-semibold uppercase flex flex-col items-start space-y-8 max-w-[85%]">
            {/* Prefix Section */}
            <div className="bg-zinc-50 text-muted-foreground tracking-[0.125rem] px-4 text-[1.5rem] lg:text-[2.25rem] leading-[1] py-3">
              {prefix}
            </div>

            {/* Suffix Section */}
            <div className="font-bold bg-zinc-50 px-4 text-[2.25rem] lg:text-[3rem] leading-[0.9] py-4">
              {suffix}
            </div>
          </h1>
        </AspectRatio>
      </div>
      {images && Array.isArray(images) && images?.length > 0 && (
        <div className="relative w-full mt-4 hidden md:block">
          <div className="flex gap-4">
            {images?.map(
              (image, index) =>
                typeof image === 'object' &&
                typeof image?.url === 'string' && (
                  <button
                    key={image?.id}
                    className="relative h-64 basis-1/3 cursor-zoom-in"
                    onClick={() => {
                      setImageIndex(index)
                      setOpen(true)
                    }}
                  >
                    <Image
                      src={image?.url}
                      alt={image?.alt}
                      fill={true}
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </button>
                ),
            )}
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              index={imageIndex}
              slides={slides}
              render={{ slide: NextImageSlide }}
              controller={{ closeOnBackdropClick: true }}
              plugins={[Zoom]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
