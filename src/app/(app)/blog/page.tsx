import React from 'react'
import { getAllCategories, getAllPosts } from '@/modules/post/data'
import { PreviewCard } from '@/modules/common/PreviewCard'
import { Metadata, ResolvingMetadata } from 'next'
import { getSettings } from '@/modules/common/data'
import { generateMeta } from '@/utils/generateMeta'
import { PostCategories } from '@/modules/post/PostCategories'
import { cn } from '@/utils/cn'

const BlogPage = async () => {
  // Fetch categories and posts
  const categories = await getAllCategories()
  const posts = await getAllPosts()

  return (
    <div className="overflow-x-hidden">
      <div className={cn('container mt-8 sm:mt-16 min-h-svh')}>
        <h1 className="uppercase font-semibold text-[2.375rem] sm:text-[3rem] mb-4">Блог</h1>
        <PostCategories categories={categories} />
        {posts && Array.isArray(posts) && (
          <div className="grid sm:grid-cols-3 gap-10">
            {posts.map((post: any) => (
              <PreviewCard key={post.id} data={post} type="post" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const generateMetadata = async ({}, parentPromise: ResolvingMetadata): Promise<Metadata> => {
  const settings = await getSettings()

  const fallback = await parentPromise

  return {} //TODO
  // return generateMeta({
  //   meta: categorySlug
  //     ? { title: `Posts in ${categorySlug}`, description: `Browse posts in ${categorySlug}` }
  //     : settings?.seo?.posts,
  //   fallback,
  //   pathname: categorySlug ? `/blog/${categorySlug}` : `/blog`,
  // });
}

export default BlogPage
