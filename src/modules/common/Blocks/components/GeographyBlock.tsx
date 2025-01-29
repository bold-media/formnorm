import React from 'react'
import { RichText } from '@/modules/common/RichText'

import { GeographyBlockType } from '@payload-types'

export const GeographyBlock = (props: GeographyBlockType) => {
  const { textRight, textLeft, enableBorder } = props

  return (
    <div className="w-full my-14 ">
      <div
        className={`flex flex-col sm:flex-row ${
          enableBorder ? 'md:border border-zinc-200 md:p-8' : ''
        } md:items-center relative`}
      >
        <div className="w-full sm:w-1/2 md:w-2/3">
          <RichText
            data={textLeft}
            container={false}
            className="prose-h2:font-semibold sm:prose-h2:font-semibold md:prose-h2:font-bold prose-h2:text-xl sm:prose-h2:text-xl lg:prose-h2:text-[2.5rem] prose-h2:leading-10 md:prose-h2:leading-[3.7rem] "
          />
        </div>
        {enableBorder && <div className="w-px h-48 bg-zinc-200 mx-8 hidden sm:block" />}

        <div className="w-full sm:w-1/2 md:w-1/3 flex md:items-center md:justify-center pt-8 sm:pt-0 ">
          <RichText
            data={textRight}
            container={false}
            className="md:text-center prose-h2:font-semibold sm:prose-h2:font-semibold md:prose-h2:font-bold prose-h2:text-base sm:prose-h2:text-base prose-p:font-normal"
          />
        </div>
      </div>
    </div>
  )
}
