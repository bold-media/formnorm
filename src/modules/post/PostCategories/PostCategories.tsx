import { Button } from '@/components/Button'
import { cn } from '@/utils/cn'
import { Category } from '@payload-types'
import Link from 'next/link'
import React from 'react'

type Props = {
  categories: Array<Category>
  activeSlug?: string
}

export const PostCategories = ({ categories, activeSlug = 'all' }: Props) => {
  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap justify-center mb-12">
      <Button
        asChild
        variant={activeSlug === 'all' ? 'default' : 'outline'}
        size={'sm'}
        className={cn('rounded-3xl font-normal text-xs sm:text-sm md:text-base', {
          'border border-transparent': activeSlug === 'all',
        })}
      >
        <Link href="/blog" className="no-underline">
          Все
        </Link>
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={activeSlug === category.slug ? 'default' : 'outline'}
          size={'sm'}
          className={cn('rounded-3xl font-normal text-xs sm:text-sm md:text-base', {
            'border border-transparent': activeSlug === category.slug,
          })}
          asChild
        >
          <Link href={`/blog/${category.slug}`} className="no-underline">
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  )
}
