import { cn } from '@/utils/cn'
import { GridBlockType } from '@payload-types'
import React from 'react'
import { RichText } from '../../RichText'
import { sectionMarginVariants } from '@/styles/blockMargin'
import { cva } from 'class-variance-authority'

const gridVariants = cva('grid', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-8',
      xl: 'gap-16',
    },
    mobile: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-2',
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '6': 'grid-cols-6',
      '12': 'grid-cols-12',
    },
    tablet: {
      '1': 'sm:grid-cols-1',
      '2': 'sm:grid-cols-2',
      '3': 'sm:grid-cols-3',
      '4': 'sm:grid-cols-4',
      '6': 'sm:grid-cols-6',
      '12': 'sm:grid-cols-12',
    },
    desktop: {
      '1': 'lg:grid-cols-1',
      '2': 'lg:grid-cols-2',
      '3': 'lg:grid-cols-3',
      '4': 'lg:grid-cols-4',
      '6': 'lg:grid-cols-6',
      '12': 'lg:grid-cols-12',
    },
    mobileFullWidth: {
      true: 'full-width',
      false: 'reset-full-width',
    },
    tabletFullWidth: {
      true: 'md:full-width',
      false: 'reset-full-width',
    },
    desktopFullWidth: {
      true: 'lg:full-width',
      false: 'reset-full-width',
    },
  },
  defaultVariants: {
    gap: 'md',
    mobile: '1',
    tablet: '2',
    desktop: '3',
  },
})

const gridItemVariants = cva('', {
  variants: {
    horizontalAlign: {
      none: '',
      left: 'justify-self-start',
      center: 'justify-self-center',
      right: 'justify-self-end',
    },
    verticalAlign: {
      none: '',
      top: 'self-start',
      center: 'self-center',
      bottom: 'self-end',
    },
  },
  defaultVariants: {
    horizontalAlign: 'none',
    verticalAlign: 'none',
  },
})

export const GridBlock = (props: GridBlockType) => {
  const { items, settings } = props
  return (
    <section
      className={cn(
        gridVariants({
          gap: settings?.gap,
          mobile: settings?.columns?.mobile,
          tablet: settings?.columns?.tablet,
          desktop: settings?.columns?.desktop,
          mobileFullWidth: settings?.fullWidth?.mobile,
          tabletFullWidth: settings?.fullWidth?.tablet,
          desktopFullWidth: settings?.fullWidth?.desktop,
        }),
        sectionMarginVariants({ size: settings?.margin }),
      )}
    >
      {items &&
        Array.isArray(items) &&
        items?.length > 0 &&
        items?.map((item) => (
          <div
            key={item.id}
            className={cn(
              gridItemVariants({
                horizontalAlign: item?.settings?.horizontalAlign || 'center', // Добавлено центрирование по умолчанию
                verticalAlign: item?.settings?.verticalAlign || 'center', // Добавлено центрирование по умолчанию
              }),
              'flex', // Убедимся, что flex применяется для центрирования
            )}
          >
            <RichText
              data={item.content}
              wrapperClassName="w-full" // Убедитесь, что контент занимает всю ширину
            />
          </div>
        ))}
    </section>
  )
}
