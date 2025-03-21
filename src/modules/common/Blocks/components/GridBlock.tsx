import { cn } from '@/utils/cn'
import { GridBlockType } from '@payload-types'
import React from 'react'
import { RichText } from '../../RichText'
import { sectionMarginVariants } from '@/styles/blockMargin'
import { cva } from 'class-variance-authority'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'

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
    verticalAlign: {
      none: '',
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end',
    },
  },
  defaultVariants: {
    gap: 'md',
    mobile: '1',
    tablet: '2',
    desktop: '3',
    verticalAlign: 'none',
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

type GridItem = {
  content?: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  } | null
  settings?: {
    horizontalAlign?: ('none' | 'left' | 'center' | 'right') | null
    verticalAlign?: ('none' | 'top' | 'center' | 'bottom') | null
  }
  id?: string | null
}

export const GridBlock = (props: GridBlockType) => {
  const { items, tabs, settings, useTabs } = props

  const renderGridItems = (items: GridItem[]) => {
    return items?.map((item) => (
      <div
        key={item.id}
        className={cn(
          gridItemVariants({
            horizontalAlign: item?.settings?.horizontalAlign || 'none',
            verticalAlign: item?.settings?.verticalAlign || 'none',
          }),
          'flex',
        )}
      >
        <RichText data={item.content} wrapperClassName="w-full " />
      </div>
    ))
  }

  if (useTabs && tabs && tabs.length > 0) {
    const defaultTab = tabs[0]?.label
    if (!defaultTab) return null

    return (
      <section className={cn(sectionMarginVariants({ size: settings?.margin }))}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-16 flex justify-center border-none bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.label}
                className="text-lg font-semibold px-6 py-2 bg-transparent hover:bg-transparent"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              <div
                className={cn(
                  gridVariants({
                    gap: settings?.gap,
                    mobile: settings?.columns?.mobile,
                    tablet: settings?.columns?.tablet,
                    desktop: settings?.columns?.desktop,
                    mobileFullWidth: settings?.fullWidth?.mobile,
                    tabletFullWidth: settings?.fullWidth?.tablet,
                    desktopFullWidth: settings?.fullWidth?.desktop,
                    verticalAlign: settings?.verticalAlign,
                  }),
                )}
              >
                {tab.items && renderGridItems(tab.items)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    )
  }

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
          verticalAlign: settings?.verticalAlign,
        }),
        sectionMarginVariants({ size: settings?.margin }),
      )}
    >
      {items && renderGridItems(items)}
    </section>
  )
}
