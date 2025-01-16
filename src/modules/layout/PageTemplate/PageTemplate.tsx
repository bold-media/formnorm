import React from 'react'

interface Props {
  children?: React.ReactNode
}
export const PageTemplate = ({ children }: Props) => {
  return <div className="min-h-page-min pt-header">{children}</div>
}
