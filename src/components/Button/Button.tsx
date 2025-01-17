import React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Spinner } from '../Spinner'
import { MoveLeft, MoveRight } from 'lucide-react'

export const buttonVariants = cva(
  [
    'group inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'text-sm font-semibold transition-colors active-class',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    // '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    // '[&_svg]:transition-transform [&_svg]:duration-200',
    '[&_svg.button-icon]:pointer-events-none [&_svg.button-icon]:shrink-0',
    '[&_svg.button-icon]:transition-transform [&_svg.button-icon]:duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        black: [
          'bg-primary text-primary-foreground font-semibold border border-transparent',
          'hover:bg-background hover:text-primary hover:border-primary',
          'transition-all duration-200 ease-in-out',
        ],
        white: [
          'bg-background text-primary border border-primary',
          'hover:bg-primary hover:text-primary-foreground hover:border-transparent',
          'transition-all duration-200 ease-in-out',
        ],

        // destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-8',
        lg: 'h-14 px-16',
        xl: 'h-20 px-20 font-bold text-[1.25rem]',
        icon: 'h-14 w-14',
      },
      radius: {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'none',
    },
  },
)

export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: 'none' | 'arrowRight' | 'arrowLeft' | null | undefined
}

const getSpinnerVariant = (buttonVariant: ButtonProps['variant'] = 'default') => {
  switch (buttonVariant) {
    case 'outline':
    case 'ghost':
    case 'secondary':
    case 'link':
      return 'default' // Uses the primary color for these variants
    default:
      return 'white' // Uses white for filled variants (default, secondary, destructive)
  }
}

const getSpinnerSize = (buttonSize: ButtonProps['size'] = 'md') => {
  switch (buttonSize) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'sm'
    case 'xl':
      return 'md'
    case 'icon':
      return 'sm'
    default:
      return 'sm'
  }
}

export const Button = ({
  className,
  variant,
  size,
  children,
  asChild = false,
  disabled,
  loading = false,
  icon,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), {
        'disabled:pointer-events-none text-transparent relative select-none': loading,
        'disabled:pointer-events-none disabled:opacity-50': disabled && !loading,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={getSpinnerSize(size)} variant={getSpinnerVariant(variant)} />
        </div>
      )}
      {icon === 'arrowLeft' && (
        <MoveLeft className="button-icon size-4 stroke-[1.75] group-hover:-translate-x-1 will-change-transform" />
      )}
      <Slottable>{children}</Slottable>
      {icon === 'arrowRight' && (
        <MoveRight className="button-icon size-4 stroke-[1.75] group-hover:translate-x-1 will-change-transform" />
      )}
    </Comp>
  )
}

Button.displayName = 'Button'
