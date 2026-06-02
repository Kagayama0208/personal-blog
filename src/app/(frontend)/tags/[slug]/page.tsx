import type { Metadata } from 'next/types'

import { ActiveTagFilter } from '@/components/ActiveTagFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { SortControls } from '@/components/SortControls'
import { DEFAULT_POST_SORT, resolvePostSort } from '@/components/SortControls/options'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { SITE_NAME } from '@/utilities/siteMetadata'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    sort?: string
  }>
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const { sort: sortParam } = await searchParamsPromise
  const sort = resolvePostSort(sortParam)

  const tag = await queryTagBySlug({ slug: decodedSlug })

  if (!tag) notFound()

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort,
    where: {
      tags: {
        in: [tag.id],
      },
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      tags: true,
      meta: true,
      publishedAt: true,
    },
  })

  const basePath = `/tags/${decodedSlug}`

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts tagged &ldquo;{tag.title}&rdquo;</h1>
        </div>
        <ActiveTagFilter title={tag.title} className="mt-6" />
      </div>

      <div className="container mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
        <SortControls basePath={basePath} />
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs} showTags />
      ) : (
        <div className="container">No posts found for this tag.</div>
      )}

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination
            page={posts.page}
            totalPages={posts.totalPages}
            basePath={`${basePath}/page`}
            sort={sort !== DEFAULT_POST_SORT ? sort : undefined}
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const tag = await queryTagBySlug({ slug: decodeURIComponent(slug) })

  return {
    title: tag ? `Posts tagged “${tag.title}” | ${SITE_NAME}` : `Tag | ${SITE_NAME}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tags = await payload.find({
    collection: 'tags',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return tags.docs.filter((tag) => Boolean(tag.slug)).map(({ slug }) => ({ slug: String(slug) }))
}

const queryTagBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'tags',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
