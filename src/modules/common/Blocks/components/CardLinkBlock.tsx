import { AspectRatio } from '@/components/AspectRatio'
import { getLinkProps } from '@/utils/getLinkProps'
import { CardLinkBlockType } from '@payload-types'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const CardLinkBlock = (props: CardLinkBlockType) => {
  const { image, link } = props
  return (
    <Link
      {...getLinkProps(link)}
      className="not-prose block flex-col items-center justify-end group"
    >
      <div className="px-8 sm:px-10">
        {image && typeof image === 'object' && image?.url && (
          <AspectRatio
            ratio={1 / 1}
            className={
              'relative w-full mx-auto will-change-transform transition-opacity opacity-90 group-hover:opacity-100'
            }
          >
            <Image
              src={image?.url}
              fill={true}
              alt={image?.alt}
              className="object-contain object-center w-full select-none"
              draggable={false}
            />
          </AspectRatio>
        )}
      </div>

      <p className="text-center leading-tight font-semibold">
        <span dangerouslySetInnerHTML={{ __html: link?.label }} />
        <MoveRight className="inline size-4 mx-2 transform transition-transform duration-200 group-hover:translate-x-1" />
      </p>
    </Link>
  )
}
