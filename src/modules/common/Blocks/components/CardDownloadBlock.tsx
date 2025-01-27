import { getLinkProps } from '@/utils/getLinkProps'
import { CardDownloadBlockType } from '@payload-types'
import PdfIcon from '@/assets/pdf-icon.svg'
import Link from 'next/link'
import React from 'react'

export const CardDownloadBlock = (props: CardDownloadBlockType) => {
  const { link } = props
  return (
    <Link
      {...getLinkProps(link)}
      className="block bg-white rounded cursor-pointer transition-shadow duration-200 shadow-lg no-underline hover:shadow-xl aspect-[18/9] sm:aspect-[4/3] w-full "
    >
      <div className="flex flex-col justify-between h-full p-8">
        <div>
          <div className="rounded-lg">
            <PdfIcon className="w-16 h-16" />
          </div>
        </div>

        <div className="text-left font-semibold text-xl uppercase flex items-center">
          <span dangerouslySetInnerHTML={{ __html: link?.label }} />
        </div>
      </div>
    </Link>
  )
}
