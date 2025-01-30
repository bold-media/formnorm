import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPathSegments } from '@/utils/getPathSegments'

import { RichText } from '@/modules/common/RichText'
import { PageBreadcrumbs } from '@/modules/common/PageBreadcrumbs'
import { ProjectHero } from '@/modules/project/ProjectHero'
import { getProjectBySlug } from '@/modules/project/data'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const ProjectPage = async ({ params }: Props) => {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      <ProjectHero project={project} />
      <RichText data={project?.article} container="default" />
      {/* {page?.enableBreadcrumbs && <PageBreadcrumbs breadcrumbs={page.breadcrumbs} />} */}
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
  const { slug } = await params
  const page = await getProjectBySlug(slug)
  const fallback = await parentPromise

  return await generateMeta({ meta: page?.meta, fallback, pathname: `/project/${slug}` })
}

export default ProjectPage
