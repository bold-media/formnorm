import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { ContainerBlockType } from '@payload-types'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'

const containerVariants = cva('flex flex-col sm:flex-row', {
  variants: {
    verticalAlign: {
      none: '',
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-8',
      xl: 'gap-16',
    },
  },
  defaultVariants: {
    verticalAlign: 'none',
    gap: 'md',
  },
})

export const ContainerBlock = (props: ContainerBlockType) => {
  const { textRight, textLeft, enableSize, settings } = props

  const getWidthClasses = () => {
    switch (enableSize) {
      case 'third':
        return {
          left: 'w-full sm:w-1/3',
          right: 'w-full sm:w-2/3',
        }
      case 'twofifths':
        return {
          left: 'w-full sm:w-2/5',
          right: 'w-full sm:w-3/5',
        }
      case 'half':
        return {
          left: 'w-full sm:w-1/2',
          right: 'w-full sm:w-1/2',
        }
      case 'twothirds':
        return {
          left: 'w-full sm:w-2/3',
          right: 'w-full sm:w-1/3',
        }
      case 'threefourths':
        return {
          left: 'w-full sm:w-3/4',
          right: 'w-full sm:w-1/4',
        }
      case 'fourfifths':
        return {
          left: 'w-full sm:w-4/5',
          right: 'w-full sm:w-1/5',
        }
      case 'fivesixths':
        return {
          left: 'w-full sm:w-5/6',
          right: 'w-full sm:w-1/6',
        }
      // case 'sixsevenths':
      //   return {
      //     left: 'w-full sm:w-6/7',
      //     right: 'w-full sm:w-1/7',
      //   }
      // case 'seveneights':
      //   return {
      //     left: 'w-full sm:w-7/8',
      //     right: 'w-full sm:w-1/8',
      //   }
      default:
        return {
          left: 'w-full sm:w-3/4',
          right: 'w-full sm:w-1/4',
        }
    }
  }

  const widthClasses = getWidthClasses()
  console.log(JSON.stringify(textRight))

  return (
    <div className="w-full my-14">
      <div
        className={cn(
          containerVariants({
            verticalAlign: settings?.verticalAlign,
            gap: settings?.gap,
          }),
          'relative',
        )}
      >
        <div className={widthClasses.left}>
          <RichText
            data={textLeft}
            container={false}
            className="prose-h2:font-semibold sm:prose-h2:font-semibold md:prose-h2:font-semibold prose-h2:text-xl sm:prose-h2:text-xl lg:prose-h2:text-[2.5rem] prose-h2:leading-10 md:prose-h2:leading-[3rem]"
          />
        </div>

        <div className={widthClasses.right}>
          <RichText
            data={textRight}
            container={false}
            className="prose-h2:font-semibold sm:prose-h2:font-semibold md:prose-h2:font-semibold prose-h2:text-base sm:prose-h2:text-base prose-p:font-normal"
          />
        </div>
      </div>
    </div>
  )
}
