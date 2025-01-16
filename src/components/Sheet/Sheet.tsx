'use client'

import React, { ComponentPropsWithRef } from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { MotionProps } from 'motion/react'

import { cn } from '@/utils/cn'

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

const overlayAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
}

type BaseOverlayProps = {
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

const BaseOverlay = ({ className, ...props }: BaseOverlayProps) => (
  <div
    className={cn('fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-[2px]', className)}
    {...props}
  />
)

const MotionOverlay = motion.create(BaseOverlay)

export const SheetOverlay = ({
  className,
  ...props
}: Omit<ComponentPropsWithRef<typeof SheetPrimitive.Overlay>, keyof MotionProps>) => (
  <SheetPrimitive.Overlay {...props}>
    <MotionOverlay className={className} {...overlayAnimation} />
  </SheetPrimitive.Overlay>
)

const sheetVariants = cva(
  [
    'fixed z-50 gap-4 bg-background p-6 shadow-lg',
    'will-change-transform backface-visibility-hidden',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b',
        bottom: 'inset-x-0 bottom-0 border-t',
        left: 'inset-y-0 left-0 h-full w-full border-r xs:w-3/4 sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-full border-l xs:w-3/4 sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  },
)

const getMotionVariants = (side: 'top' | 'bottom' | 'left' | 'right') => {
  return {
    initial:
      side === 'top' || side === 'bottom'
        ? { y: side === 'top' ? '-100%' : '100%' }
        : { x: side === 'left' ? '-100%' : '100%' },
    animate: { x: 0, y: 0 },
    exit:
      side === 'top' || side === 'bottom'
        ? { y: side === 'top' ? '-100%' : '100%', transition: { duration: 0.15 } }
        : { x: side === 'left' ? '-100%' : '100%', transition: { duration: 0.15 } },
    transition: { ease: 'easeInOut', duration: 0.4 },
  }
}

interface SheetContentProps
  extends Omit<ComponentPropsWithRef<typeof SheetPrimitive.Content>, keyof MotionProps>,
    VariantProps<typeof sheetVariants>,
    React.PropsWithChildren {
  open: boolean
}

type BaseContentProps = {
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  children?: React.ReactNode

  ref?: React.Ref<HTMLDivElement>
}

const BaseContent = ({ side = 'left', className, children, ...props }: BaseContentProps) => (
  <div className={cn(sheetVariants({ side }), className)} {...props}>
    <SheetPrimitive.Close className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none disabled:pointer-events-none">
      <X className="h-6 w-6" />
      <span className="sr-only">Close</span>
    </SheetPrimitive.Close>
    {children}
  </div>
)

const MotionContent = motion.create(BaseContent)

export const SheetContent = ({
  side = 'left',
  className,
  children,
  open,
  ...props
}: SheetContentProps) => {
  const motionVariants = getMotionVariants(side || 'left')

  return (
    <SheetPortal forceMount>
      <AnimatePresence mode="wait">
        {open && (
          <>
            <SheetOverlay key="overlay" />
            <SheetPrimitive.Content asChild key="content">
              <MotionContent
                side={side || 'left'}
                className={className}
                {...motionVariants}
                {...props}
              >
                {children}
              </MotionContent>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

export const SheetHeader = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

export const SheetFooter = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
  <div
    className={cn('flex flex-col-reverse md:flex-row md:justify-end sm:space-x-2', className)}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'

export const SheetTitle = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
)
SheetTitle.displayName = SheetPrimitive.Title.displayName

export const SheetDescription = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof SheetPrimitive.Description>) => (
  <SheetPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)
SheetDescription.displayName = SheetPrimitive.Description.displayName
