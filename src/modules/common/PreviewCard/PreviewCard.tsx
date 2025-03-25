'use client'
import { AspectRatio } from '@/components/AspectRatio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Icon } from '@/components/Icon'
import { Post, Project } from '@payload-types'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import type { DataTypeMap, PreviewCardProps } from './types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/Tooltip/Tooltip'

export const PreviewCard = <T extends keyof DataTypeMap>({ data, type }: PreviewCardProps<T>) => {
  if (typeof data !== 'object') {
    throw new Error('PreviewCard did not receive data.')
  }
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    if (titleRef.current) {
      setIsTruncated(titleRef.current.scrollHeight > titleRef.current.clientHeight)
    }
  }, [data?.title])

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }
  const isPost = (data: any): data is Post => type === 'post' && data !== null
  const isProject = (data: any): data is Project => type === 'project' && data !== null

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
        className={`group border-none rounded-sm shadow-none bg-zinc-100/50 hover:bg-background-light/100 transition-colors duration-300 overflow-hidden h-full ${
          isProject(data) ? 'flex flex-col sm:flex-row md:flex-col' : 'flex flex-col'
        }`}
      >
        <div className={isProject(data) ? 'w-full sm:w-1/2 md:w-full' : ''}>
          <AspectRatio ratio={isProject(data) ? 1.54 / 1 : 4 / 3}>
            {isProject(data) &&
            data.cardCover &&
            typeof data.cardCover === 'object' &&
            typeof data.cardCover.url === 'string' ? (
              <Image
                src={data.cardCover.url}
                alt={data.cardCover.alt}
                fill={true}
                className="not-prose object-cover object-center"
                draggable={false}
              />
            ) : data?.cover &&
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
            isProject(data)
              ? 'w-full sm:w-1/2 sm:flex sm:flex-col sm:justify-start md:w-full flex-1'
              : 'flex-1'
          }
        >
          <CardHeader className={isProject(data) ? 'px-8 pb-0 pt-0' : 'p-6 pb-2'}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle
                    ref={titleRef}
                    className={
                      isProject(data)
                        ? 'not-prose font-semibold uppercase line-clamp-2 tracking-normal text-xl mt-6 pb-2'
                        : isPost(data)
                        ? 'text-base sm:text-lg md:text-xl font-semibold line-clamp-2 tracking-normal'
                        : 'text-lg md:text-xl font-semibold line-clamp-3 tracking-normal uppercase'
                    }
                  >
                    {(type === 'service' || type === 'term') && data && 'cardTitle' in data
                      ? data.cardTitle
                      : data?.title}
                  </CardTitle>
                </TooltipTrigger>

                {isTruncated && (
                  <TooltipContent className="text-left max-w-80">
                    <p>{data?.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className={isProject(data) ? 'text-base p-8 pt-0' : 'px-6 pb-4 pt-0'}>
            <p
              className={
                isProject(data)
                  ? 'line-clamp-3 text-base font-light text-zinc-500 leading-[1.5] overflow-hidden text-ellipsis my-0'
                  : 'line-clamp-3 text-sm font-light text-zinc-500 leading-[1.5] overflow-hidden text-ellipsis pb-2'
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
