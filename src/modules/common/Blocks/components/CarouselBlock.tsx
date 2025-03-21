'use client'
import React, { ComponentPropsWithRef, useState } from 'react'
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/Carousel'
import { CarouselBlockType } from '@payload-types'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { AspectRatio } from '@/components/AspectRatio'
import Lightbox, { SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

export const CarouselBlock = (props: CarouselBlockType & ComponentPropsWithRef<'div'>) => {
  const { images, className, settings } = props
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  // Создаем массив для Lightbox
  const slides: SlideImage[] =
    images?.map((image) => ({
      src: typeof image === 'object' && image?.url ? image?.url : '',
      alt: (typeof image === 'object' && image?.alt) || '',
      width: typeof image === 'object' && image?.width ? image?.width : 1920,
      height: (typeof image === 'object' && image?.height) || 1080,
    })) || []

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className={cn('not-prose w-full relative', className)}>
      <BaseCarousel
        setApi={setApi}
        loop={Boolean(settings?.enableLoop)}
        opts={{
          dragFree: false,
          containScroll: 'trimSnaps',
          align: 'center',
          breakpoints: {
            '(min-width: 768px)': {
              align: 'center',
            },
          },
        }}
      >
        <CarouselContent className="gap-20 ">
          {images &&
            Array.isArray(images) &&
            images?.map((image, index) => {
              if (typeof image === 'object' && image?.url) {
                return (
                  <CarouselItem
                    key={image?.id}
                    className="basis-full relative cursor-zoom-in"
                    onClick={() => {
                      setImageIndex(index)
                      setOpen(true)
                    }}
                  >
                    <AspectRatio ratio={3 / 2}>
                      <Image
                        src={image?.url}
                        alt={image?.alt}
                        className={cn('object-cover select-none rounded-sm', {
                          'object-cover': settings?.mainImageFormat === 'cover',
                          'object-contain': settings?.mainImageFormat === 'contain',
                        })}
                        draggable={false}
                        fill
                      />
                    </AspectRatio>
                  </CarouselItem>
                )
              } else {
                return null
              }
            })}
        </CarouselContent>

        {settings?.enableDots && images && Array.isArray(images) && images?.length > 0 && (
          <div className="flex justify-center space-x-2 mt-4">
            {images.map((image, index) =>
              image && typeof image === 'object' && image.url ? (
                <button
                  key={image.id}
                  onClick={() => {
                    api?.scrollTo(index)
                    setCurrent(index)
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    current === index ? 'bg-zinc-900' : 'bg-zinc-300',
                  )}
                  aria-label={`Перейти к слайду ${index + 1}`}
                >
                  <span className="sr-only">{`Перейти к слайду ${index + 1}`}</span>
                </button>
              ) : null,
            )}
          </div>
        )}

        {settings?.enableThumbnails && images && Array.isArray(images) && images?.length > 0 && (
          <div className="flex justify-start space-x-1 pt-2">
            {images.map((image, index) =>
              image && typeof image === 'object' && image.url ? (
                <button
                  key={image.id}
                  onClick={() => {
                    api?.scrollTo(index)
                    setCurrent(index)
                  }}
                  className={cn(
                    'transition-transform border-1 overflow-hidden',
                    current === index ? 'border-zinc-100' : 'border-transparent',
                  )}
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={image.url}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      className={cn(
                        'w-full h-full select-none object-center',
                        {
                          cover: 'object-cover',
                          contain: 'object-contain',
                        }[settings.format ?? 'cover'],
                      )}
                      width={64}
                      height={64}
                    />
                  </div>
                </button>
              ) : null,
            )}
          </div>
        )}

        {settings?.enableArrows && (
          <>
            <CarouselPrevious absolute={true} />
            <CarouselNext absolute={true} />
          </>
        )}
      </BaseCarousel>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={imageIndex}
        slides={slides}
        render={{
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
        controller={{ closeOnBackdropClick: true }}
        plugins={[Zoom]}
      />
    </div>
  )
}
