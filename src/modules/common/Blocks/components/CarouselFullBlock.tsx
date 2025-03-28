'use client'
import React, { ComponentPropsWithRef, useState } from 'react'
import {
  Carousel as BaseCarousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/Carousel'
import { CarouselFullBlockType, Media } from '@payload-types'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { AspectRatio } from '@/components/AspectRatio'
import Lightbox, { SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'

export const CarouselFullBlock = (props: CarouselFullBlockType & ComponentPropsWithRef<'div'>) => {
  const { images, className, settings, useTabs, tabs } = props
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [open, setOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const slides: SlideImage[] =
    images?.map((image) => ({
      src: typeof image === 'object' && image?.url ? image?.url : '',
      alt: (typeof image === 'object' && image?.alt) || '',
      width: typeof image === 'object' && image?.width ? image?.width : 1920,
      height: (typeof image === 'object' && image?.height) || 1080,
    })) || []

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const renderImage = (image: string | Media, index: number) => {
    if (typeof image === 'object' && image?.url) {
      return (
        <div
          key={image?.id}
          className="cursor-zoom-in h-full"
          onClick={() => {
            setImageIndex(index)
            setOpen(true)
          }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-full ">
              <AspectRatio
                ratio={
                  settings?.aspectRatio
                    ? {
                        video: 16 / 9,
                        square: 1 / 1,
                        fourThree: 4 / 3,
                      }[settings?.aspectRatio] || Number(image.width) / Number(image.height)
                    : Number(image.width) / Number(image.height)
                }
              >
                <Image
                  src={image?.url}
                  alt={image?.alt}
                  className="object-cover select-none "
                  draggable={false}
                  fill
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const renderCarousel = (images: (string | Media)[] | null | undefined) => {
    if (!images) return null

    return (
      <div className={cn(settings?.enableGrid ? 'hidden' : '')}>
        <BaseCarousel
          setApi={setApi}
          loop={Boolean(settings?.enableLoop)}
          opts={{
            dragFree: false,
            containScroll: 'trimSnaps',
            align: 'center',
          }}
          className="h-full"
        >
          <CarouselContent className="-ml-4 h-full">
            {images.map((image, index) => {
              if (typeof image === 'object' && image?.url) {
                return (
                  <CarouselItem
                    key={image?.id}
                    className="pl-4 basis-full md:basis-2/3 lg:basis-1/2 h-full cursor-zoom-in"
                    onClick={() => {
                      setImageIndex(index)
                      setOpen(true)
                    }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="w-full max-w-4xl">
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={image?.url}
                            alt={image?.alt}
                            className="object-contain select-none rounded-sm"
                            draggable={false}
                            fill
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </CarouselItem>
                )
              }
              return null
            })}
          </CarouselContent>
          {settings?.enableArrows && (
            <>
              <CarouselPrevious className="flex left-0 md:left-40 lg:left-80" absolute />
              <CarouselNext className="flex right-0 md:right-40 lg:right-80" absolute />
            </>
          )}
          {settings?.enableDots && images && Array.isArray(images) && images?.length > 0 && (
            <div className="flex justify-center space-x-2 mt-4 lg:mt-6">
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
        </BaseCarousel>
      </div>
    )
  }

  const renderGrid = (images: (string | Media)[] | null | undefined) => {
    if (!images || !settings?.enableGrid) return null

    return (
      <div
        className={cn(
          'grid',
          {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
          }[settings?.gridConfig?.mobileColumns ?? 1],
          {
            2: 'sm:grid-cols-2',
            3: 'sm:grid-cols-3',
          }[settings?.gridConfig?.tabletColumns ?? 2],
          {
            2: 'md:grid-cols-2',
            3: 'md:grid-cols-3',
            4: 'md:grid-cols-4',
          }[settings?.gridConfig?.desktopColumns ?? 2],
          {
            none: '',
            two: 'gap-2',
            four: 'gap-4',
            eight: 'gap-8',
          }[settings?.gridConfig?.gap ?? 'none'],
        )}
      >
        {images.map((image, index) => renderImage(image, index))}
      </div>
    )
  }

  if (useTabs && tabs && tabs.length > 0) {
    const defaultTab = tabs[0]?.label
    if (!defaultTab) return null

    return (
      <div className={cn('not-prose w-full relative full-width', className)}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-16 flex justify-center border-none bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.label}
                className="text-lg font-semibold px-6 py-2 bg-transparent hover:bg-transparent"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              {renderGrid(tab.images)}
              {renderCarousel(tab.images)}
            </TabsContent>
          ))}
        </Tabs>

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

  return (
    <div className={cn('not-prose w-full relative full-width', className)}>
      {renderGrid(images)}
      {renderCarousel(images)}

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
