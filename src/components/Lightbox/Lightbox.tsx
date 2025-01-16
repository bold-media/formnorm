import Image from 'next/image'
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
  Slide,
  SlideImage,
  RenderSlideProps,
} from 'yet-another-react-lightbox'

interface Media {
  id?: string
  url?: string
  alt?: string
  width?: number
  height?: number
}

interface PrimaryHeroProps {
  prefix?: string
  suffix?: string
  cover?: Media
  images?: Media[]
}

interface NextImageSlideProps {
  slide: SlideImage // Changed from Slide to SlideImage
  offset: number
  rect: {
    width: number
    height: number
  }
}

export const NextImageSlide = ({ slide, rect }: RenderSlideProps<SlideImage>) => {
  // Remove the cover check since it's not part of SlideImage type
  const width = Math.round(
    Math.min(rect.width, (rect.height / (slide.height || 1080)) * (slide.width || 1920)),
  )

  const height = Math.round(
    Math.min(rect.height, (rect.width / (slide.width || 1920)) * (slide.height || 1080)),
  )

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        fill
        alt={slide.alt || ''}
        src={slide.src}
        loading="eager"
        draggable={false}
        className="object-contain"
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
      />
    </div>
  )
}
