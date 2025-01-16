import { Page, PageHero } from '@payload-types'
import React from 'react'
import { PrimaryHero } from './PrimaryHero'
import DefaultHero from './DefaultHero'

export const Hero = (props: PageHero) => {
  const { type, default: defaultProps, primary: primaryProps } = props || {}

  switch (type) {
    case 'primary':
      return <PrimaryHero {...primaryProps} />
    case 'standard':
      return <DefaultHero {...defaultProps} />
    default:
      return null
  }
}
