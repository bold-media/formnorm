import { cn } from '@/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { ComponentPropsWithRef } from 'react'

export const Breadcrumb = (
  props: ComponentPropsWithRef<'nav'> & { separator?: React.ReactNode },
) => <nav aria-label="цепочка навигации" {...props} />
Breadcrumb.displayName = 'Breadcrumb'

export const BreadcrumbList = ({ className, ...props }: ComponentPropsWithRef<'ol'>) => (
  <ol
    className={cn(
      [
        'flex flex-wrap items-center ',
        'break-words text-sm text-muted-foreground',
        'gap-1.5 sm:gap-2.5',
      ],
      className,
    )}
    {...props}
  />
)
BreadcrumbList.displayName = 'BreadcrumbList'

export const BreadcrumbItem = ({ className, ...props }: ComponentPropsWithRef<'li'>) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: ComponentPropsWithRef<'a'> & { asChild?: boolean; href: string }) => {
  const Comp = asChild ? Slot : Link
  return <Comp className={cn('transition-colors hover:text-foreground', className)} {...props} />
}
BreadcrumbLink.displayName = 'BreadcrumbLink'

export const BreadcrumbPage = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentPropsWithRef<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbsSeparator'

const BreadcrumbEllipsis = ({ className, ...props }: ComponentPropsWithRef<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Ещё</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'
