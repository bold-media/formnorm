// import { RichTextBlockType } from '@payload-types'
import React, { Fragment } from 'react'
import { RichTextBlock } from './components/RichTextBlock'
import { Block } from 'payload'

// type Block = RichTextBlockType
//   | AccordionBlock
//   | CallToActionBlock
//   | ContentBlock
//   | DownloadsBlock
//   | FeaturesBlock
//   | StepsBlock
//   | TariffsBlock
//   | RecentPostsBlock

export const Blocks = ({ blocks }: { blocks?: Array<Block> | null }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {/* {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'richText':
            return <RichTextBlock key={block.id ?? index} {...(block as RichTextBlockType)} />
            case 'callToAction':
              return <CallToAction key={block.id ?? index} {...(block as CallToActionBlock)} />
            case 'accordion':
              return <Accordion key={block.id ?? index} {...(block as AccordionBlock)} />
            case 'recent-posts':
              return <RecentPosts key={block.id ?? index} {...(block as RecentPostsBlock)} />
            case 'downloads':
              return <Downloads key={block.id ?? index} {...(block as DownloadsBlock)} />
            case 'features':
              return <Features key={block.id ?? index} {...(block as FeaturesBlock)} />
            case 'tariffs':
              return <Tariffs key={block.id ?? index} {...(block as TariffsBlock)} />
            case 'steps':
              return <Steps key={block.id ?? index} {...(block as StepsBlock)} />
            case 'content':
              return <Content key={block.id ?? index} {...(block as ContentBlock)} />
          default:
            return null
        }
      })} */}
    </Fragment>
  )
}
