import React from 'react'
import { getAllCategories, getAllPosts } from '@/modules/post/data'
import { PreviewCard } from '@/modules/common/PreviewCard'
import { Metadata, ResolvingMetadata } from 'next'

import { generateMeta } from '@/utils/generateMeta'
import { PostCategories } from '@/modules/post/PostCategories'
import { cn } from '@/utils/cn'

type Props = {
  params: Promise<{
    category: string
  }>
}

const BlogPostsByCategory = async ({ params }: Props) => {
  const { category } = await params
  // Fetch categories and posts
  const posts = await getAllPosts(category)
  const categories = await getAllCategories()

  return (
    <div className="overflow-x-hidden">
      <div className={cn('container mt-8 sm:mt-16 min-h-svh')}>
        <h1 className="uppercase font-semibold text-[2.375rem] sm:text-[3rem] mb-4">Блог</h1>
        <PostCategories categories={categories} activeSlug={category} />

        {posts && Array.isArray(posts) && (
          <div className="grid sm:grid-cols-3 gap-10">
            {posts.map((post) => (
              <PreviewCard key={post.id} data={post} type="post" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostsByCategory
