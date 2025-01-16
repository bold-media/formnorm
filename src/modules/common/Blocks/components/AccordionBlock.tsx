import { RichText } from '@/modules/common/RichText'
import { type AccordionBlockType } from '@payload-types'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion as BaseAccordion,
} from '@/components/Accordion'
import React from 'react'

export const AccordionBlock = (props: AccordionBlockType) => {
  const { items } = props

  return (
    <BaseAccordion type="single" collapsible>
      {items &&
        Array.isArray(items) &&
        items?.length > 0 &&
        items?.map(
          (item) =>
            item?.id && (
              <AccordionItem key={item.id} value={item.id} className="transition-all duration-300">
                <AccordionTrigger className="group">
                  <div className="relative flex items-center w-full">{item?.title}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="transition-opacity duration-200">
                    <RichText
                      data={item?.content}
                      // className="text-slate-100 text-left max-w-[71.875rem] ml-0"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ),
        )}
    </BaseAccordion>
  )
}

AccordionBlock.displayName = 'AccordionBlock'
