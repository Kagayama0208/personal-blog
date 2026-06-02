import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { SortControls } from '@/components/SortControls'
import { DEFAULT_POST_SORT, resolvePostSort } from '@/components/SortControls/options'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { SITE_NAME } from '@/utilities/siteMetadata'

// Reader-driven sorting reads `?sort=` at request time, so this route renders dynamically.
export const revalidate = 600

type Args = {
  searchParams: Promise<{
    sort?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { sort: sortParam } = await searchParamsPromise
  const sort = resolvePostSort(sortParam)
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort,
    select: {
      title: true,
      slug: true,
      categories: true,
      tags: true,
      meta: true,
      publishedAt: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
        <SortControls />
      </div>

      <CollectionArchive posts={posts.docs} showTags />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination
            page={posts.page}
            totalPages={posts.totalPages}
            sort={sort !== DEFAULT_POST_SORT ? sort : undefined}
          />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `${SITE_NAME} Posts`,
  }
}
