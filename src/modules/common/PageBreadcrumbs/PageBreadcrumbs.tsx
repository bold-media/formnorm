import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/Breadcrumbs'
import { Page } from '@payload-types'
import React from 'react'

interface BreadcrumbItem {
  title: string
  href?: string
}

interface PageBreadcrumbsProps {
  breadcrumbs: Page['breadcrumbs']
}

export const PageBreadcrumbs = ({ breadcrumbs }: PageBreadcrumbsProps) => {
  return (
    <Breadcrumb className="container mt-4 mb-20">
      <BreadcrumbList>
        {breadcrumbs?.map((item, index) => (
          <React.Fragment key={item.id}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="truncate max-w-48 font-semibold">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.url || '#'}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
