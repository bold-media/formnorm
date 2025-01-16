import { PageHero } from '@payload-types'
import React from 'react'
import { RichText } from '../RichText'

const DefaultHero = (props: NonNullable<PageHero['default']>) => {
  const { richText } = props
  return <RichText data={richText} container="default" />
}

export default DefaultHero
