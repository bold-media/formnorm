import { cva, type VariantProps } from 'class-variance-authority'

export const typographyVariants = cva('prose prose-zinc dark:prose-invert', {
  variants: {
    variant: {
      default: [
        'prose-h1:uppercase prose-h1:font-semibold prose-h1:text-[2.375rem] sm:prose-h1:text-[3.5rem]',
        'prose-h2:uppercase prose-h2:font-semibold prose-h2:text-[2rem] sm:prose-h2:text-[2.5rem]',
        'prose-h3:uppercase prose-h3:font-semibold prose-h3:text-[1.5rem] sm:prose-h3:text-[1.7rem]',
        'prose-p:leading-relaxed',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type TypographyVariantProps = VariantProps<typeof typographyVariants>
