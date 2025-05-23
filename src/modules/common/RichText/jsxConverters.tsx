import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { LinkJSXConverter } from './converters/LinkJSXConverter'
import { internalDocToHref } from '@/utils/internalDocToHref'
import {
  AccordionBlockType,
  ArchiveBlockType,
  ButtonBlockType,
  CalloutBlockType,
  CardDownloadBlockType,
  CardLinkBlockType,
  CarouselBlockType,
  CarouselFullBlockType,
  ContactInfoBlockType,
  ContainerBlockType,
  DoubleFormBlockType,
  EmbedBlockType,
  GeographyBlockType,
  GridBlockType,
  ImageBlockType,
  PartnerBlockType,
  PriceBlockType,
  ProjectsBlockType,
  TableBlockType,
} from '@payload-types'
import { AccordionBlock } from '../Blocks/components/AccordionBlock'
import { CalloutBlock } from '../Blocks/components/CalloutBlock'
import { GridBlock } from '../Blocks/components/GridBlock'
import { EmbedBlock } from '../Blocks/components/EmbedBlock'
import { CardDownloadBlock } from '../Blocks/components/CardDownloadBlock'
import { CardLinkBlock } from '../Blocks/components/CardLinkBlock'
import { CarouselBlock } from '../Blocks/components/CarouselBlock'
import { CarouselFullBlock } from '../Blocks/components/CarouselFullBlock'
import { ContactInfoBlock } from '../Blocks/components/ContactInfoBlock'
import { ImageBlock } from '../Blocks/components/ImageBlock'
import { PartnerBlock } from '../Blocks/components/PartnerBlock'
import { PriceBlock } from '../Blocks/components/PriceBlock'
import { ProjectsBlock } from '../Blocks/components/ProjectsBlock'
import { ButtonBlock } from '../Blocks/components/ButtonBlock'
import { MutedTextJSXConverter } from './converters/MutedTextJSXConverter'
import { SerializedMutedTextNode } from '@/payload/fields/lexical/features/MutedText/feature.node'
import { DoubleFormBlock } from '../Blocks/components/DoubleFormBlock'
import { ArchiveBlock } from '../Blocks/components/ArchiveBlock'
import { GeographyBlock } from '../Blocks/components/GeographyBlock'
import { TableBlock } from '../Blocks/components/TableBlock'
import { ContainerBlock } from '../Blocks/components/ContainerBlock'
import { SingleFormBlock } from '../Blocks/components/SingleFormBlock'
import { SingleFormBlockType } from '@payload-types'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<AccordionBlockType>
  | SerializedBlockNode<ArchiveBlockType>
  | SerializedBlockNode<ButtonBlockType>
  | SerializedBlockNode<CalloutBlockType>
  | SerializedBlockNode<CardDownloadBlockType>
  | SerializedBlockNode<CardLinkBlockType>
  | SerializedBlockNode<CarouselBlockType>
  | SerializedBlockNode<CarouselFullBlockType>
  | SerializedBlockNode<ContactInfoBlockType>
  | SerializedBlockNode<ContainerBlockType>
  | SerializedBlockNode<DoubleFormBlockType>
  | SerializedBlockNode<EmbedBlockType>
  | SerializedBlockNode<GeographyBlockType>
  | SerializedBlockNode<GridBlockType>
  | SerializedBlockNode<ImageBlockType>
  | SerializedBlockNode<PartnerBlockType>
  | SerializedBlockNode<PriceBlockType>
  | SerializedBlockNode<ProjectsBlockType>
  | SerializedBlockNode<TableBlockType>
  | SerializedMutedTextNode

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...MutedTextJSXConverter,
  blocks: {
    accordion: ({ node }) => <AccordionBlock {...node.fields} />,
    archive: ({ node }) => <ArchiveBlock {...node.fields} />,
    button: ({ node }) => <ButtonBlock {...node.fields} />,
    callout: ({ node }) => <CalloutBlock {...node.fields} />,
    cardDownload: ({ node }) => <CardDownloadBlock {...node.fields} />,
    cardLink: ({ node }) => <CardLinkBlock {...node.fields} />,
    carousel: ({ node }) => <CarouselBlock {...node.fields} />,
    carouselFull: ({ node }) => <CarouselFullBlock {...node.fields} />,
    contactInfo: ({ node }) => <ContactInfoBlock {...node.fields} />,
    container: ({ node }) => <ContainerBlock {...node.fields} />,
    doubleForm: ({ node }) => <DoubleFormBlock {...node.fields} />,
    singleForm: ({ node }: { node: { fields: SingleFormBlockType } }) => (
      <SingleFormBlock {...node.fields} />
    ),
    embed: ({ node }) => <EmbedBlock {...node.fields} />,
    geography: ({ node }) => <GeographyBlock {...node.fields} />,
    grid: ({ node }) => <GridBlock {...node.fields} />,
    image: ({ node }) => <ImageBlock {...node.fields} />,
    partner: ({ node }) => <PartnerBlock {...node.fields} />,
    price: ({ node }) => <PriceBlock {...node.fields} />,
    projects: ({ node }) => <ProjectsBlock {...node.fields} />,
    table: ({ node }) => <TableBlock {...node.fields} />,
  },
})
