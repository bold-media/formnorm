import { AccordionBlock } from '@/payload/blocks/Accordion'
import { ArchiveBlock } from '@/payload/blocks/Archive'
import { ButtonBlock } from '@/payload/blocks/Button'
import { CalloutBlock } from '@/payload/blocks/Callout'
import { CardDownload } from '@/payload/blocks/CardDownload'
import { CardLink } from '@/payload/blocks/CardLink/CardLink'
import { CarouselBlock } from '@/payload/blocks/Carousel'
import { CarouselFullBlock } from '@/payload/blocks/CarouselFull'
import { ContactInfoBlock } from '@/payload/blocks/ContactInfo'
import { DoubleFormBlock } from '@/payload/blocks/DoubleForm'
import { EmbedBlock } from '@/payload/blocks/Embed'
import { GeographyBlock } from '@/payload/blocks/Geography'
import { GridBlock } from '@/payload/blocks/Grid'
import { ImageBlock } from '@/payload/blocks/Image'
import { PartnerBlock } from '@/payload/blocks/Partner'
import { PriceBlock } from '@/payload/blocks/Price'
import { ProjectsBlock } from '@/payload/blocks/Projects'
import { TableBlock } from '@/payload/blocks/Table'
import { Block } from 'payload'

export const Blocks = {
  accordion: AccordionBlock,
  archive: ArchiveBlock,
  button: ButtonBlock,
  cardDownload: CardDownload,
  cardLink: CardLink,
  callout: CalloutBlock,
  carousel: CarouselBlock,
  carouselFull: CarouselFullBlock,
  contactInfo: ContactInfoBlock,
  doubleForm: DoubleFormBlock,
  embed: EmbedBlock,
  geography: GeographyBlock,
  grid: GridBlock,
  image: ImageBlock,
  partner: PartnerBlock,
  price: PriceBlock,
  projects: ProjectsBlock,
  table: TableBlock,
} satisfies Record<string, Block>

export type BlockKey = keyof typeof Blocks
