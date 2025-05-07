import { AspectRatio } from '@/components/AspectRatio'
import { EmbedBlockType } from '@payload-types'
import React from 'react'

export const EmbedBlock = (props: EmbedBlockType) => {
  const { code, landscapeVideo } = props

  if (!code) return null

  // Check if the code contains a YouTube iframe
  const isYouTube = code.includes('youtube.com/embed')

  if (landscapeVideo || isYouTube) {
    return (
      <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] max-w-none overflow-hidden">
        <div className="md:aspect-[32/9] aspect-[2/1] h-[50vh] md:h-auto">
          <div
            dangerouslySetInnerHTML={{ __html: code }}
            className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0 [&>iframe]:rounded-none [&>iframe]:shadow-none [&>iframe]:scale-[1.3] md:[&>iframe]:scale-[2] [&>iframe]:touch-none [&>iframe]:pointer-events-none"
            suppressHydrationWarning={true}
          />
        </div>
      </div>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning={true} />
}
