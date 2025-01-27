'use client'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

import { cn } from '@/utils/cn'
import { Button } from '@/components/Button'
import React, {
  ComponentPropsWithRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

export type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  loop?: boolean
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  opts?: CarouselOptions
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export const useCarousel = () => {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel /> component.')
  }

  return context
}

export const Carousel = ({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  loop = false,
  className,
  children,
  ...props
}: Omit<ComponentPropsWithRef<'div'>, keyof CarouselProps> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      loop,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  useEffect(() => {
    if (!api || !setApi) return

    setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return

    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        loop,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}
Carousel.displayName = 'Carousel'

type CarouselContentProps = ComponentPropsWithRef<'div'> & {
  gap?: 'default' | 'small'
}

export const CarouselContent = ({ className, gap = 'default', ...props }: CarouselContentProps) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? gap === 'small'
              ? '-ml-3'
              : '-ml-4'
            : gap === 'small'
              ? '-mt-3 flex-col'
              : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  )
}
CarouselContent.displayName = 'CarouselContent'

export const CarouselItem = ({ className, gap = 'default', ...props }: CarouselContentProps) => {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal'
          ? gap === 'small'
            ? 'pl-3'
            : 'pl-4'
          : gap === 'small'
            ? 'pt-3'
            : 'pt-4',
        className,
      )}
      {...props}
    />
  )
}
CarouselItem.displayName = 'CarouselItem'

type CarouselControlProps = ComponentPropsWithRef<typeof Button> & {
  absolute?: boolean
}

export const CarouselPrevious = ({
  className,
  variant = 'outline',
  size = 'icon',
  absolute = false,
  ...props
}: CarouselControlProps) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn('h-10 w-10 rounded-full border-brand-tertiary', !absolute && className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronsLeft className="h-6 w-6 text-brand-tertiary" />
      <span className="sr-only">Предыдущее изображение</span>
    </Button>
  )

  if (!absolute) return button

  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 left-4 z-10',
        orientation === 'vertical' && 'rotate-90 top-4 left-1/2 -translate-x-1/2',
        className,
      )}
    >
      {button}
    </div>
  )
}

export const CarouselNext = ({
  className,
  variant = 'outline',
  size = 'icon',
  absolute = false,
  ...props
}: CarouselControlProps) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn('h-10 w-10 rounded-full border-brand-tertiary', !absolute && className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronsRight className="h-6 w-6 text-brand-tertiary" />
      <span className="sr-only">Следующее изображение</span>
    </Button>
  )

  if (!absolute) return button

  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 right-4 z-10',
        orientation === 'vertical' && 'rotate-90 bottom-4 left-1/2 -translate-x-1/2',
        className,
      )}
    >
      {button}
    </div>
  )
}

export const CarouselControls = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
  <div className={cn('flex items-center justify-center py-4 gap-3', className)} {...props} />
)
