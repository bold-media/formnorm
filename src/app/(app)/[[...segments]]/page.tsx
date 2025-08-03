import { resolvePathname } from '@/utils/resolvePathname'
import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPathSegments } from '@/utils/getPathSegments'
import { getPageByPathname } from '@/modules/common/data'
import { RichText } from '@/modules/common/RichText'
import { Hero } from '@/modules/common/Hero'
import { PageBreadcrumbs } from '@/modules/common/PageBreadcrumbs'
import { checkAndRedirect } from '@/utils/redirects'

interface Props {
  params: Promise<{
    segments: string[]
  }>
}

const Pages = async ({ params }: Props) => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await getPageByPathname(pathname)

  if (!page) {
    // Check for redirects before returning 404
    await checkAndRedirect(pathname)
    notFound()
  }

  return (
    <>
      <Hero {...page.hero} />
      <RichText data={page?.content} container={page?.containerSize} />
      {page?.enableBreadcrumbs && <PageBreadcrumbs breadcrumbs={page.breadcrumbs} />}
    </>
  )
}

export const generateStaticParams = async () => {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'page',
      draft: false,
      limit: 0,
      overrideAccess: false,
      select: {
        pathname: true,
      },
    })

    const paths = pages?.docs
      ?.filter(
        (page): page is typeof page & { pathname: string } => typeof page?.pathname === 'string',
      )
      .map((page) => ({
        segments: getPathSegments(page.pathname),
      }))

    return paths || []
  } catch (error) {
    return []
  }
}

export const generateMetadata = async (
  { params }: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await getPageByPathname(pathname)

  const fallback = await parentPromise

  return await generateMeta({ meta: page?.meta, fallback, pathname })
}

export default Pages
