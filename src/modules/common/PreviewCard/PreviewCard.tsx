import { AspectRatio } from '@/components/AspectRatio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Icon } from '@/components/Icon'
import { Post } from '@payload-types'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import React from 'react'
import type { DataTypeMap, PreviewCardProps } from './types'

export const PreviewCard = <T extends keyof DataTypeMap>({ data, type }: PreviewCardProps<T>) => {
  if (typeof data !== 'object') {
    throw new Error('PreviewCard did not receive data.')
  }

  const isPost = (data: any): data is Post => type === 'post' && data !== null
  const isProject = (data: any): boolean => type === 'project' && data !== null
  console.log(data)

  const date =
    isPost(data) && data?.publishedAt
      ? new Intl.DateTimeFormat('ru', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(data.publishedAt))
      : null

  return (
    <NextLink href={`/${type}/${data?.slug}`} className="no-underline">
      <Card
        className={`group border-none rounded-sm shadow-none bg-zinc-100/50 hover:bg-background-light/100 transition-colors duration-300 overflow-hidden ${
          isProject(data) ? 'flex-col sm:flex md:flex-col' : 'flex flex-col'
        }`}
      >
        <div className={isProject(data) ? 'w-full sm:w-1/2 md:w-full' : ''}>
          <AspectRatio ratio={isProject(data) ? 1.54 / 1 : 4 / 3}>
            {data?.cover &&
            typeof data?.cover === 'object' &&
            typeof data?.cover?.url === 'string' ? (
              <Image
                src={data?.cover.url}
                alt={data?.cover?.alt}
                fill={true}
                className="not-prose object-cover object-center"
                draggable={false}
              />
            ) : (
              <div className="bg-gradient-to-br from-background-light/80 to-background-light/10 h-full w-full flex items-center justify-center">
                <Icon size="xl" className="opacity-80 stroke-1 size-12">
                  <ImageIcon />
                </Icon>
              </div>
            )}
          </AspectRatio>
        </div>

        <div
          className={
            isProject(data) ? 'w-full sm:w-1/2 sm:flex sm:flex-col sm:justify-center md:w-full' : ''
          }
        >
          <CardHeader className={isProject(data) ? 'px-8 pb-0 pt-0' : 'p-6 pb-2'}>
            <CardTitle
              className={
                isProject(data)
                  ? 'font-semibold uppercase line-clamp-2 tracking-normal text-base sm:text-lg md:text-xl mt-6'
                  : 'text-base sm:text-lg md:text-xl font-semibold line-clamp-2 tracking-normal'
              }
            >
              {data?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className={isProject(data) ? 'text-base p-8 pt-0' : 'px-6 pb-4 pt-0'}>
            <p
              className={
                isProject(data)
                  ? 'line-clamp-3 text-base font-light text-zinc-500 leading-6 my-0'
                  : 'line-clamp-3 text-sm font-light leading-5 pb-2'
              }
            >
              {data?.excerpt}
            </p>
            {type === 'post' && date && (
              <time
                dateTime={date}
                className="text-xs font-semibold text-zinc-400 tracking-[0.094rem] mx-auto"
              >
                {date}
              </time>
            )}
          </CardContent>
        </div>
      </Card>
    </NextLink>
  )
}
