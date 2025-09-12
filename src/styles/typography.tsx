import { cva, type VariantProps } from 'class-variance-authority'

export const typographyVariants = cva(
  'prose prose-zinc dark:prose-invert prose-thead:bg-zinc-900',
  {
    variants: {
      variant: {
        default: [
          'prose-h1:uppercase prose-h1:font-semibold prose-h1:text-[2.375rem] sm:prose-h1:text-[3rem] md:prose-h1:text-[4rem] md:prose-h1:leading-tight',
          'prose-h2:uppercase prose-h2:font-semibold prose-h2:text-[2rem] sm:prose-h2:text-[2.5rem] sm:prose-h2:leading-1.875rem',
          'prose-h3:uppercase prose-h3:font-semibold prose-h3:text-[1.5rem] sm:prose-h3:text-[1.7rem]',
          'prose-p:leading-relaxed',
          'prose-a:font-normal prose-a:no-underline',
          'prose-li:marker:text-zinc-900 prose-li:my-1',
          'prose-ul:font-normal prose-ul:leading-6 prose-ul:text-base ',
        ],
        post: [
          'prose-h1:font-semibold prose-h1:leading-tight prose-h1:text-[1.75rem] sm:prose-h1:text-[2rem] md:prose-h1:text-[2.25rem]',
          'prose-h2:font-bold prose-h2:leading-10 prose-h2:text-[1.625rem] sm:prose-h2:text-[1.75rem] md:prose-h2:text-[1.875rem]',
          'prose-h3:font-semibold prose-h3:leading-snug prose-h3:text-[1.5rem] sm:prose-h3:text-[1.625rem] md:prose-h3:text-[1.75rem]',
          'prose-p:font-light prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl',
          'prose-ul:font-light prose-ul:leading-8 prose-ul:text-base sm:prose-ul:text-lg md:prose-ul:text-xl',
          'prose-li:marker:text-zinc-900',
          'prose-ol:font-light prose-ol:leading-8 prose-ol:text-base sm:prose-ol:text-lg md:prose-ol:text-xl',
          'prose-blockquote:font-light prose-blockquote:leading-8 prose-blockquote:text-base sm:prose-blockquote:text-lg md:prose-blockquote:text-xl',
          'prose-a:font-light prose-a:no-underline',
        ],
        description: [
          'prose-p:text-sm prose-p:text-muted-foreground/70',
          'prose-ul:text-sm prose-ul:text-muted-foreground/70',
          'prose-ol:text-sm prose-ol:text-muted-foreground/70',
          'prose-blockquote:text-sm prose-blockquote:text-muted-foreground/70',
          'prose-a:text-sm prose-a:text-muted-foreground/70 prose-a:underline',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type TypographyVariantProps = VariantProps<typeof typographyVariants>
