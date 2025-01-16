import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { LinkJSXConverter } from './converters/LinkJSXConverter'
import { internalDocToHref } from '@/utils/internalDocToHref'
import {
  AccordionBlockType,
  ButtonBlockType,
  CalloutBlockType,
  CardLinkBlockType,
  DoubleFormBlockType,
  EmbedBlockType,
  GridBlockType,
  ImageBlockType,
  PriceBlockType,
} from '@payload-types'
import { AccordionBlock } from '../Blocks/components/AccordionBlock'
import { CalloutBlock } from '../Blocks/components/CalloutBlock'
import { GridBlock } from '../Blocks/components/GridBlock'
import { EmbedBlock } from '../Blocks/components/EmbedBlock'
import { CardLinkBlock } from '../Blocks/components/CardLinkBlock'
import { ImageBlock } from '../Blocks/components/ImageBlock'
import { PriceBlock } from '../Blocks/components/PriceBlock'
import { ButtonBlock } from '../Blocks/components/ButtonBlock'
import { MutedTextJSXConverter } from './converters/MutedTextJSXConverter'
import { SerializedMutedTextNode } from '@/payload/fields/lexical/features/MutedText/feature.node'
import { DoubleFormBlock } from '../Blocks/components/DoubleFormBlock'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<AccordionBlockType>
  | SerializedBlockNode<ButtonBlockType>
  | SerializedBlockNode<CalloutBlockType>
  | SerializedBlockNode<CardLinkBlockType>
  | SerializedBlockNode<DoubleFormBlockType>
  | SerializedBlockNode<EmbedBlockType>
  | SerializedBlockNode<GridBlockType>
  | SerializedBlockNode<ImageBlockType>
  | SerializedBlockNode<PriceBlockType>
  | SerializedMutedTextNode

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...MutedTextJSXConverter,
  blocks: {
    accordion: ({ node }) => <AccordionBlock {...node.fields} />,
    button: ({ node }) => <ButtonBlock {...node.fields} />,
    callout: ({ node }) => <CalloutBlock {...node.fields} />,
    cardLink: ({ node }) => <CardLinkBlock {...node.fields} />,
    doubleForm: ({ node }) => <DoubleFormBlock {...node.fields} />,
    embed: ({ node }) => <EmbedBlock {...node.fields} />,
    grid: ({ node }) => <GridBlock {...node.fields} />,
    image: ({ node }) => <ImageBlock {...node.fields} />,
    price: ({ node }) => <PriceBlock {...node.fields} />,
  },
})
