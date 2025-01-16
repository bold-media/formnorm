'use client'

import React, { ComponentPropsWithRef } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ArrowUpRight, X } from 'lucide-react'
import { cn } from '@/utils/cn'
export const Accordion = AccordionPrimitive.Root

export const AccordionItem = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />
)
AccordionItem.displayName = 'AccordionItem'

export const AccordionTrigger = ({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex my-4 sm:my-6 leading-tight">
    <AccordionPrimitive.Trigger
      className={cn(
        'group flex flex-1 items-start justify-between font-semibold transition-all text-left [&[data-state=open]>div>svg]:-rotate-90 text-[1.2rem] sm:text-[1.5rem] !my-0',
        className,
      )}
      {...props}
    >
      {children}
      <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full group-hover:bg-gray-100 transition-colors">
        <X className="h-6 w-6 sm:h-8 sm:w-8 stroke-1 shrink-0 text-muted-foreground transition-transform duration-200 -rotate-45" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)
AccordionTrigger.displayName = 'AccordionTrigger'

export const AccordionContent = ({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-6', className)}>{children}</div>
  </AccordionPrimitive.Content>
)
AccordionContent.displayName = 'AccordionContent'
