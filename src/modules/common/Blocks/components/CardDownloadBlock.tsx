import { getLinkProps } from '@/utils/getLinkProps'
import { CardDownloadBlockType } from '@payload-types'
import PdfIcon from '@/assets/pdf-icon.svg'
import NextLink from 'next/link'
import React from 'react'

export const CardDownloadBlock = (props: CardDownloadBlockType) => {
  const { link } = props
  return (
    <NextLink
      {...getLinkProps(link)}
      className="block bg-white rounded cursor-pointer transition-shadow duration-200 shadow-lg no-underline hover:shadow-xl 
        aspect-[18/9] sm:aspect-[3/2] 
        w-full max-w-[600px] mx-0 
       sm:h-full"
    >
      <div className="flex flex-col justify-between h-full p-8">
        <div>
          <div className="rounded-sm">
            <PdfIcon className="w-16 h-16" />
          </div>
        </div>

        <div className="text-left font-semibold text-base sm:text-lg md:text-xl lg:text-xl uppercase flex items-center ">
          <span dangerouslySetInnerHTML={{ __html: link?.label }} className="text-zinc-900" />
        </div>
      </div>
    </NextLink>
  )
}
