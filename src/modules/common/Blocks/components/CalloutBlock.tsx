import { sectionMarginVariants } from '@/styles/blockMargin'
import { typographyVariants } from '@/styles/typography'
import { cn } from '@/utils/cn'
import { CalloutBlockType } from '@payload-types'
import React from 'react'

export const CalloutBlock = (props: CalloutBlockType) => {
  const { text, settings } = props
  return (
    <section
      className={cn(typographyVariants(), sectionMarginVariants({ size: settings?.margin }))}
    >
      <div
        className={cn([
          'container font-medium leading-tight',
          'prose-p:text-zinc-900',
          'prose-p:text-[1.2rem] sm:prose-p:text-[2rem] lg:prose-p:text-[2.5rem]',
          'prose-p:text-center sm:prose-p:text-left',
          'flex flex-col items-center sm:block',
          'before:content-[""] before:block before:h-[0.125rem] before:w-36 before:bg-zinc-900 before:mb-6 sm:before:hidden',
          'after:content-[""] after:block after:h-[0.125rem] after:w-36 after:bg-zinc-900 after:mt-6 sm:after:hidden',
          'sm:pl-6 sm:border-l-4 sm:border-zinc-900',
        ])}
      >
        <p className="sm:py-4">{text}</p>
      </div>
    </section>
  )
}
