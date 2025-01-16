import { PriceBlockType } from '@payload-types'
import React from 'react'

export const PriceBlock = (props: PriceBlockType) => {
  const { price, text } = props
  return (
    <div className="not-prose w-full flex flex-col gap-4">
      <h3 className="font-bold text-2xl sm:text-3xl text-zinc-900">{price}</h3>
      <hr className="border-t-[0.225rem] rounded-lg border-zinc-900" />
      <p
        className="font-medium uppercase tracking-normal leading-7 text-zinc-600"
        dangerouslySetInnerHTML={{ __html: text || '' }}
      />
    </div>
  )
}
