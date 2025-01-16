import type { ComponentPropsWithRef } from 'react'

interface Props extends ComponentPropsWithRef<'div'> {
  width?: number | string
}

export const Width = ({ children, className, width, ...props }: Props) => (
  <div className={className} style={{ maxWidth: width ? `${width}%` : undefined }} {...props}>
    {children}
  </div>
)
