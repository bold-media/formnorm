'use client'
import React, { useCallback, useRef, useState } from 'react'
import Logo from '@/assets/logo.svg'
import Link from 'next/link'
import { type Settings } from '@payload-types'
import { getLinkProps } from '@/utils/getLinkProps'
import { cn } from '@/utils/cn'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/Sheet'
import { MenuIcon } from 'lucide-react'
import { useResizeObserver } from '@react-hookz/web'

interface Props {
  links?: NonNullable<NonNullable<Settings['navigation']>['header']>['links']
  className?: string
}

export const Header = ({ links, className }: Props) => {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const isActiveLink = useCallback(
    (href: string) => {
      const cleanPathname = pathname.replace(/\/$/, '')
      const cleanHref = href.replace(/\/$/, '')
      return cleanPathname === cleanHref
    },
    [pathname],
  )

  useResizeObserver(headerRef.current, (entry) => {
    if (entry.contentRect.width >= 1024 && isOpen) {
      setIsOpen(false)
    }
  })

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed w-full h-header bg-background z-40 flex items-center justify-center pr-[--removed-body-scroll-bar-size]',
        className,
      )}
    >
      <div className="container flex justify-between items-center sm:justify-start md:justify-between">
        <Link
          href="/"
          aria-label="Вернуться на главную страницу"
          className="flex items-center h-12 sm:absolute sm:left-1/2 sm:-translate-x-1/2 md:static md:translate-x-0"
        >
          <Logo className="w-44 md:w-52 fill-zinc-950" />
        </Link>
        {links && Array.isArray(links) && (
          <nav className="hidden uppercase gap-8 md:flex">
            {links?.map(({ id, link }) => {
              const linkProps = getLinkProps(link)
              return (
                <Link
                  key={id}
                  {...linkProps}
                  className={cn(
                    'h-12 flex items-center text-[0.75rem] font-semibold relative',
                    isActiveLink(linkProps?.href)
                      ? 'text-muted-foreground'
                      : cn(
                          'text-zinc-950',
                          'after:absolute after:left-0 after:right-0 after:top-[50%] after:mt-[0.2rem] after:h-[0.063rem] after:bg-zinc-950',
                          'after:opacity-0 after:transform after:transition-all after:duration-150',
                          'hover:after:opacity-100 hover:after:translate-y-[0.2rem]',
                        ),
                  )}
                >
                  {link?.label}
                </Link>
              )
            })}
          </nav>
        )}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="md:hidden"
            aria-label="Открыть меню навигации"
            aria-controls="mobile-nav"
          >
            <MenuIcon className="size-7" />
          </SheetTrigger>
          <SheetContent open={isOpen}>
            <SheetHeader>
              <SheetTitle className="sr-only">Главное меню</SheetTitle>
            </SheetHeader>
            {links && Array.isArray(links) && (
              <nav className="flex flex-col items-start uppercase gap-0">
                {links?.map(({ id, link }) => {
                  const linkProps = getLinkProps(link)
                  return (
                    <SheetClose key={id} asChild>
                      <Link
                        {...linkProps}
                        className={cn(
                          'h-12 flex items-center text-[0.75rem] font-semibold relative',
                          isActiveLink(linkProps?.href)
                            ? 'text-muted-foreground'
                            : cn(
                                'text-zinc-950',
                                'after:absolute after:left-0 after:right-0 after:top-[50%] after:mt-[0.2rem] after:h-[0.063rem] after:bg-zinc-950',
                                'after:opacity-0 after:transform after:transition-all after:duration-150',
                                'hover:after:opacity-100 hover:after:translate-y-[0.2rem]',
                              ),
                        )}
                      >
                        {link?.label}
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
