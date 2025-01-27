import { cva, type VariantProps } from 'class-variance-authority'

export const typographyVariants = cva(
  'prose prose-zinc dark:prose-invert prose-thead:bg-zinc-900',
  {
    variants: {
      variant: {
        default: [
          'prose-h1:uppercase prose-h1:font-semibold prose-h1:text-[2.375rem] sm:prose-h1:text-[3rem] md:prose-h1:text-[4rem] md:prose-h1:leading-tight',
          'prose-h2:uppercase prose-h2:font-semibold prose-h2:text-[2rem] sm:prose-h2:text-[2.5rem]',
          'prose-h3:uppercase prose-h3:font-semibold prose-h3:text-[1.5rem] sm:prose-h3:text-[1.7rem]',
          'prose-p:leading-relaxed',
        ],
        post: [
          'prose-h1:font-semibold prose-h1:leading-tight prose-h1:text-[1.75rem] sm:prose-h1:text-[2rem] md:prose-h1:text-[2.25rem]',
          'prose-h2:font-bold prose-h2:leading-10 prose-h2:text-[1.625rem] sm:prose-h2:text-[1.75rem] md:prose-h2:text-[1.875rem]',
          'prose-h3:font-semibold prose-h3:leading-snug prose-h3:text-[1.5rem] sm:prose-h3:text-[1.625rem] md:prose-h3:text-[1.75rem]',
          'prose-p:font-light prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl',
          'prose-ul:font-light prose-ul:leading-8 prose-ul:text-base sm:prose-ul:text-lg md:prose-ul:text-xl',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type TypographyVariantProps = VariantProps<typeof typographyVariants>
