'use client'

import { AspectRatio } from '@/components/AspectRatio'
import { NextImageSlide } from '@/components/Lightbox'
import { Project } from '@payload-types'
import Image from 'next/image'
import React, { useState } from 'react'
import Lightbox, { SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import ServiceIcon from '@/assets/photo.svg'
import ArrowDown from '@/assets/arrow-down.svg'

export const ProjectHero = (props: { project: Project }) => {
  const { project } = props
  const [imageIndex, setImageIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const slides: SlideImage[] = [project?.description?.planOne, project?.description?.planTwo]
    .filter(Boolean)
    .map((image) => ({
      src: typeof image === 'object' && image?.url ? image?.url : '',
      alt: (typeof image === 'object' && image?.alt) || '',
      width: typeof image === 'object' && image?.width ? image?.width : 1920,
      height: (typeof image === 'object' && image?.height) || 1080,
    }))

  return (
    <div className="container px-0 md:px-4 md:py-9">
      <div className="h-[72vh] relative md:hidden mb-16">
        {project?.cover &&
          typeof project?.cover === 'object' &&
          typeof project?.cover?.url === 'string' && (
            <div className="relative h-full w-full">
              <Image
                src={project?.cover?.url}
                alt={project?.cover?.alt}
                fill={true}
                className="h-full object-cover object-bottom"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
            </div>
          )}

        <h1 className="absolute left-0 top-96 font-semibold uppercase flex flex-col items-start space-y-4 max-w-[85%]">
          {/* Suffix Section */}
          <div className="font-semibold text-zinc-50 pr-4 pl-[3rem] text-[1.625rem] leading-[1.17] py-4">
            {project?.suffix}
          </div>
          {/* Prefix Section */}
          <div className="text-zinc-50 font-light tracking-[0.125rem] pr-4 pl-14 text-xl leading-[1.1]">
            {project?.title}
          </div>
        </h1>
        <div
          className="relative flex justify-center items-center bottom-10 cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="animate-bounce">
            <div className="flex justify-center items-center">
              <ArrowDown className="w-10 h-5 text-zinc-50" style={{ fill: 'currentColor' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <AspectRatio ratio={2 / 0.9}>
          {project?.cover &&
            typeof project?.cover === 'object' &&
            typeof project?.cover?.url === 'string' && (
              <Image
                src={project?.cover?.url}
                alt={project?.cover?.alt}
                fill={true}
                className="object-cover object-bottom"
                draggable={false}
              />
            )}
          <h1 className="absolute left-0 top-16 font-semibold uppercase flex flex-col items-start space-y-8 max-w-[85%]">
            {/* Prefix Section */}
            <div className="font-bold bg-zinc-50 px-4 text-[2.25rem] lg:text-[4rem] leading-[0.9] py-4">
              {project?.title}
            </div>

            {/* Suffix Section */}
            <div className="bg-zinc-50 text-muted-foreground tracking-[0.125rem] px-4 text-[1.5rem] lg:text-[1.7rem] leading-[1] py-3">
              {project?.suffix}
            </div>
          </h1>
        </AspectRatio>
      </div>

      <div className="relative w-full hidden md:block border-x-2 border-b-2 border-zinc-100 px-5">
        <div className="flex gap-10 justify-between items-center">
          <div className="hidden md:flex items-center gap-2 basis-3/7">
            <div className="mr-4">
              <ServiceIcon className="w-40 h-40" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl uppercase font-bold">{project?.description?.title}</div>
              <div className="text-base uppercase font-semibold">
                {project?.description?.subtitle}
              </div>
              <div className="text-sm font-normal">{project?.description?.text}</div>
            </div>
          </div>
          <div className="flex basis-4/7 gap-10 justify-evenly">
            {typeof project?.description?.planOne === 'object' &&
              typeof project?.description?.planOne?.url === 'string' &&
              typeof project?.description?.planOne?.alt === 'string' && (
                <button
                  key={project?.description?.planOne?.id}
                  className="relative h-72 w-72 basis-2/7 cursor-zoom-in"
                  onClick={() => {
                    setImageIndex(0)
                    setOpen(true)
                  }}
                >
                  <Image
                    src={project?.description?.planOne?.url}
                    alt={project?.description?.planOne?.alt}
                    fill={true}
                    draggable={false}
                    className="object-contain select-none"
                  />
                </button>
              )}
            {typeof project?.description?.planTwo === 'object' &&
              typeof project?.description?.planTwo?.url === 'string' &&
              typeof project?.description?.planTwo?.alt === 'string' && (
                <button
                  key={project?.description?.planTwo?.id}
                  className="relative h-72 w-72 basis-2/7 cursor-zoom-in"
                  onClick={() => {
                    setImageIndex(1)
                    setOpen(true)
                  }}
                >
                  <Image
                    src={project?.description?.planTwo?.url}
                    alt={project?.description?.planTwo?.alt}
                    fill={true}
                    draggable={false}
                    className="object-contain select-none"
                  />
                </button>
              )}
          </div>

          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={imageIndex}
            slides={slides}
            render={{ slide: NextImageSlide }}
            controller={{ closeOnBackdropClick: true }}
            plugins={[Zoom]}
          />
        </div>
      </div>
    </div>
  )
}
