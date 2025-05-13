import { cache } from '@/utils/cache'
import { getServerSideURL } from '@/utils/getURL'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

const collectionSettings = {
  page: {
    priority: 0.8,
    changeFrequency: 'monthly' as ChangeFrequency,
  },
  post: {
    priority: 0.7,
    changeFrequency: 'weekly' as ChangeFrequency,
  },
  project: {
    priority: 0.7,
    changeFrequency: 'weekly' as ChangeFrequency,
  },
  service: {
    priority: 0.6,
    changeFrequency: 'monthly' as ChangeFrequency,
  },
  term: {
    priority: 0.5,
    changeFrequency: 'monthly' as ChangeFrequency,
  },
  category: {
    priority: 0.5,
    changeFrequency: 'monthly' as ChangeFrequency,
  },
}

const getPages = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: pages } = await payload.find({
      collection: 'page',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        pathname: true,
      },
    })
    return pages
  },
  { revalidate: 3600, tags: ['page'] },
  ['sitemap-pages'],
)

const getPosts = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: posts } = await payload.find({
      collection: 'post',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        slug: true,
      },
    })
    return posts
  },
  { revalidate: 3600, tags: ['post'] },
  ['sitemap-posts'],
)

const getProjects = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: projects } = await payload.find({
      collection: 'project',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        slug: true,
      },
    })
    return projects
  },
  { revalidate: 3600, tags: ['project'] },
  ['sitemap-projects'],
)

const getServices = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: services } = await payload.find({
      collection: 'service',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        slug: true,
      },
    })
    return services
  },
  { revalidate: 3600, tags: ['service'] },
  ['sitemap-services'],
)

const getTerms = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: terms } = await payload.find({
      collection: 'term',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        slug: true,
      },
    })
    return terms
  },
  { revalidate: 3600, tags: ['term'] },
  ['sitemap-terms'],
)

const getCategories = cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs: categories } = await payload.find({
      collection: 'category',
      draft: false,
      overrideAccess: false,
      select: {
        updatedAt: true,
        slug: true,
      },
    })
    return categories
  },
  { revalidate: 3600, tags: ['category'] },
  ['sitemap-categories'],
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getServerSideURL()

  // Fetch all content
  const [pages, posts, projects, services, terms, categories] = await Promise.all([
    getPages(),
    getPosts(),
    getProjects(),
    getServices(),
    getTerms(),
    getCategories(),
  ])

  const homepage = pages.find((page) => page.pathname === '/')

  const staticRoutes = [
    {
      url: `${baseUrl}/blog`,
      priority: 0.8,
      changeFrequency: 'daily' as ChangeFrequency,
      lastModified:
        posts.length > 0
          ? new Date(Math.max(...posts.map((p) => new Date(p.updatedAt).getTime()))).toISOString()
          : new Date().toISOString(),
    },
    {
      url: `${baseUrl}/projects`,
      priority: 0.8,
      changeFrequency: 'daily' as ChangeFrequency,
      lastModified:
        projects.length > 0
          ? new Date(
              Math.max(...projects.map((p) => new Date(p.updatedAt).getTime())),
            ).toISOString()
          : new Date().toISOString(),
    },
    {
      url: `${baseUrl}/services`,
      priority: 0.8,
      changeFrequency: 'daily' as ChangeFrequency,
      lastModified:
        services.length > 0
          ? new Date(
              Math.max(...services.map((s) => new Date(s.updatedAt).getTime())),
            ).toISOString()
          : new Date().toISOString(),
    },
  ]

  // Transform pages, handling homepage separately
  const pageRoutes = pages
    .filter((page) => page.pathname !== '/')
    .map((page) => ({
      url: `${baseUrl}${page.pathname}`,
      lastModified: new Date(page.updatedAt).toISOString(),
      ...collectionSettings.page,
    }))

  // Add homepage with highest priority
  if (homepage) {
    pageRoutes.unshift({
      url: baseUrl,
      lastModified: new Date(homepage.updatedAt).toISOString(),
      priority: 1.0,
      changeFrequency: 'daily' as const,
    })
  }

  // Transform posts
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt).toISOString(),
    ...collectionSettings.post,
  }))

  // Transform projects
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt).toISOString(),
    ...collectionSettings.project,
  }))

  // Transform services
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt).toISOString(),
    ...collectionSettings.service,
  }))

  // Transform terms
  const termRoutes = terms.map((term) => ({
    url: `${baseUrl}/terms/${term.slug}`,
    lastModified: new Date(term.updatedAt).toISOString(),
    ...collectionSettings.term,
  }))

  // Transform categories
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category.updatedAt).toISOString(),
    ...collectionSettings.category,
  }))

  return [
    ...pageRoutes,
    ...staticRoutes,
    ...postRoutes,
    ...projectRoutes,
    ...serviceRoutes,
    ...termRoutes,
    ...categoryRoutes,
  ]
}
