import { Button } from '@/components/Button'
import { getLinkProps } from '@/utils/getLinkProps'
import { PriceBlockType } from '@payload-types'
import Link from 'next/link'
import React from 'react'

export const PriceBlock = ({ title, prices, link }: PriceBlockType) => {
  if (!prices || prices.length === 0) return null

  return (
    <div className="flex flex-col gap-6 mb-32">
      {title && <h2 className="font-bold text-4xl pb-5">{title}</h2>}

      <div className="flex flex-col sm:flex-row sm:row-span-3 gap-16 pt-2 pb-8 md:pb-20 md:pt-10">
        {prices.map((item, index) => (
          <div key={index} className="not-prose max-w-lg w-full flex flex-col gap-4">
            <h3 className="font-bold text-2xl sm:text-3xl text-zinc-900">{item.price}</h3>
            <hr className="border-t-[0.225rem] rounded-lg border-zinc-900" />
            <p
              className="font-medium uppercase tracking-normal leading-7 text-zinc-600"
              dangerouslySetInnerHTML={{ __html: item.text || '' }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start gap-6">
        <Button variant={'black'} size={'lg'} asChild>
          <Link {...getLinkProps(link)} className="w-auto font-bold">
            {link.label}
          </Link>
        </Button>
      </div>
    </div>
  )
}
