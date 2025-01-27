import { cn } from '@/utils/cn'
import { ComponentPropsWithRef, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithRef<'input'>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn([
        'w-full pt-4 pb-2 px-0',
        'bg-transparent',
        'border-0 border-b border-zinc-300',
        'text-base',
        // 'transition-all duration-200',
        // Show placeholder by default
        'placeholder:text-zinc-500 placeholder:font-medium',
        // Hide placeholder on focus
        'focus:placeholder:text-transparent',
        // Focus styles
        'focus:outline-none focus:border-b focus:border-zinc-300',
        className,
      ])}
      {...props}
    />
  ),
)

Input.displayName = 'Input'

export default Input
