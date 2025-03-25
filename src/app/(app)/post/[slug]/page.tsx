import { getPostBySlug, getRelatedPosts } from '@/modules/post/data'
import { PostBreadcrumbs } from '@/modules/post/PostBreadcrumbs'
import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cn } from '@/utils/cn'
import { typographyVariants } from '@/styles/typography'

import Link from 'next/link'
import Image from 'next/image'
import { AspectRatio } from '@/components/AspectRatio'
import { Icon } from '@/components/Icon'
import { ImageIcon } from 'lucide-react'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const PostPage = async ({ params }: Props) => {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }
  const relatedPosts = await getRelatedPosts(slug)

  const { title, cover, article } = post

  const date = post?.publishedAt
    ? new Intl.DateTimeFormat('ru', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null

  const image = typeof cover === 'object' ? cover : null

  return (
    <div className="mb-20">
      <div className="container-post relative md:mt-header mb-6 ">
        <PostBreadcrumbs title={title} />

        <div className={cn('prose mx-auto pt-4 md:pt-12', typographyVariants({ variant: 'post' }))}>
          <h1>{title}</h1>
        </div>
      </div>

      <time className="block text-xs font-semibold text-zinc-400 tracking-[0.094rem] mb-0 container-post  mx-auto">
        {date}
      </time>
      <div className="container-post relative md:mt-12 mb-6 lg:mb-12">
        {image && image?.url && image?.height && image?.width && (
          <AspectRatio className="relative w-full mb-[3.75rem] h-full" ratio={4 / 3}>
            <Image
              src={image?.url}
              alt={image?.alt}
              fill={true}
              className="object-cover rounded-sm select-none"
              draggable={false}
            />
          </AspectRatio>
        )}{' '}
      </div>

      <RichText
        data={article}
        container={'post'}
        prose={{ variant: 'post' }}
        className="pb-12 sm:pb-16 mx-auto !overflow-x-visible"
        tag="article"
      />

      <div className="container-post mx-auto font-light text-xs sm:text-sm pb-10 flex items-center gap-4">
        {post?.author && typeof post?.author === 'object' && (
          <div key={post?.author?.id} className="flex items-center gap-4">
            {typeof post?.author?.picture === 'object' && post?.author?.picture?.url && (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={post?.author?.picture?.url}
                  alt={post?.author?.picture?.alt || 'Автор'}
                  fill={true}
                  className="object-cover"
                  draggable={false}
                />
              </div>
            )}

            <div className="">
              {post?.author?.name}, {post?.author?.job}
            </div>
          </div>
        )}
      </div>

      <div className="container-post tracking-[0.156rem] font-semibold uppercase text-zinc-400 text-xs">
        {post &&
          Array.isArray(post?.categories) &&
          post?.categories?.map(
            (category) =>
              typeof category === 'object' && (
                <Link href={`/blog/${category.slug}`} key={category.id}>
                  {category.name}
                </Link>
              ),
          )}
      </div>
      {/* Block "Смотрите также" */}
      <div className="container-post mx-auto mt-16 sm:mt-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-12">Смотрите также</h2>
        <div className="flex flex-col gap-6">
          {relatedPosts.map((relatedPost) => (
            <Link
              key={relatedPost.id}
              href={`/post/${relatedPost.slug}`}
              className="flex gap-4 items-start group"
            >
              <div className="relative w-20 h-16 sm:w-28 sm:h-20 flex-shrink-0 overflow-hidden rounded-sm">
                {typeof relatedPost?.cover === 'object' && relatedPost?.cover?.url ? (
                  <Image
                    src={relatedPost.cover.url}
                    alt={relatedPost.cover.alt || relatedPost.title}
                    fill={true}
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="bg-gradient-to-br from-background-light/80 to-background-light/10 h-full w-full flex items-center justify-center">
                    <Icon size="xl" className="opacity-80 stroke-1 size-12">
                      <ImageIcon />
                    </Icon>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {relatedPost?.categories &&
                  Array.isArray(relatedPost?.categories) &&
                  relatedPost?.categories?.length > 0 &&
                  typeof relatedPost?.categories[0] === 'object' && (
                    <span className="text-xs font-semibold uppercase text-zinc-400 mb-1 block tracking-[0.156rem] ">
                      {relatedPost?.categories[0]?.name}
                    </span>
                  )}

                <h3 className="font-semibold text-sm sm:text-md mb-1 ">{relatedPost.title}</h3>

                {relatedPost.excerpt && (
                  <p className="text-xs sm:text-sm text-zinc-600">{relatedPost.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const generateStaticParams = async () => {
  try {
    const payload = await getPayload({ config })
    const post = await payload.find({
      collection: 'post',
      draft: false,
      limit: 0,
      overrideAccess: false,
      select: {
        slug: true,
      },
      where: {
        slug: {
          exists: true,
        },
      },
    })

    const params = post?.docs?.map(({ slug }) => ({ slug }))
    return params
  } catch (error) {
    return []
  }
}

export const generateMetadata = async (
  { params }: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  const fallback = await parentPromise

  return generateMeta({ meta: post?.meta, fallback, pathname: `/post/${post?.slug}` })
}

export default PostPage
