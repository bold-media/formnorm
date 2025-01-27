import React from 'react'
import Logo from '@/assets/logo.svg'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { Settings } from '@payload-types'
import { getLinkProps } from '@/utils/getLinkProps'

interface Props {
  className?: string
  data?: {
    links?: NonNullable<NonNullable<Settings['navigation']>['footer']>['links']
    copyText?: NonNullable<NonNullable<Settings['navigation']>['footer']>['copyText']
    legalLinks?: NonNullable<NonNullable<Settings['navigation']>['footer']>['legalLinks']
  }
}

export const Footer = ({ className, data }: Props) => {
  return (
    <footer className={cn('mt-auto ', className)}>
      <div className="full-width bg-zinc-900">
        <div className=" container flex flex-col sm:items-center md:flex-row md:justify-between md:items-start gap-6 py-12">
          <Link href="/">
            <Logo className="w-44 md:w-52 text-zinc-50" />
          </Link>
          <div className="flex flex-col gap-6 sm:items-center md:items-end md:gap-4">
            {data?.links && Array.isArray(data?.links) && (
              <nav className="flex flex-wrap gap-4">
                {data?.links?.map(({ id, link }) => (
                  <Link
                    key={id}
                    {...getLinkProps(link)}
                    className="text-zinc-300 hover:text-zinc-50 transition-colors uppercase font-semibold text-[0.875rem] leading-none"
                  >
                    {link?.label}
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex gap-x-2 gap-y-0 sm:gap-x-4 sm:gap-y-2 flex-wrap md:items-end">
              {data?.copyText && (
                <div className="text-[0.75rem] xs:text-[0.875rem] whitespace-nowrap text-zinc-400">
                  {data?.copyText}
                </div>
              )}

              {Array.isArray(data?.legalLinks) &&
                data?.legalLinks?.map(({ id, link }) => (
                  <Link
                    key={id}
                    {...getLinkProps(link)}
                    className="text-[0.75rem] xs:text-[0.875rem] transition-colors text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
                  >
                    {link?.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="full-width bg-zinc-950 py-4">
        <div className="container flex items-center justify-center">
          <div className="text-zinc-400 text-sm uppercase font-medium">
            Разработка{' '}
            <a
              href="https://boldmedia.ru"
              target={'_blank'}
              rel="noopener noreferrer"
              className={cn(
                'text-zinc-400 hover:text-zinc-200 relative',
                'after:absolute after:left-0 after:right-0 after:top-[50%] after:mt-[0.2rem] after:h-[0.063rem] after:bg-zinc-200',
                'after:opacity-0 after:transform after:transition-all after:duration-150',
                'hover:after:opacity-100 hover:after:translate-y-[0.3rem]',
              )}
            >
              Boldmedia
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
