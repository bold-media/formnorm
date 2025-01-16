import { cva } from 'class-variance-authority'

export const sectionMarginVariants = cva(undefined, {
  variants: {
    size: {
      none: 'my-0',
      xs: 'my-6',
      sm: 'my-12',
      md: 'my-16',
      lg: 'my-24',
      xl: 'my-32',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
