import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/Breadcrumbs'
import React from 'react'

type ServiceBreadcrumbsProps = {
  title?: string
}

export const ServiceBreadcrumbs = ({ title }: ServiceBreadcrumbsProps) => {
  return (
    <Breadcrumb className="container py-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Главная</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {title ? (
            <BreadcrumbLink href="/services">Услуги и условия</BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="truncate max-w-48 font-semibold">
              Услуги и условия
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {title && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-48 font-semibold">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
