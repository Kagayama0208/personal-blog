import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { FeaturedPost } from '@/components/FeaturedPost'
import { CMSLink } from '@/components/Link'
import { DEFAULT_POST_SORT } from '@/components/SortControls/options'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { SITE_DESCRIPTION, SITE_NAME } from '@/utilities/siteMetadata'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

// ホームに表示する最新記事の件数。これを超える分は /posts で見せる。
const HOME_POST_LIMIT = 12

export const revalidate = 600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: HOME_POST_LIMIT,
    overrideAccess: false,
    sort: DEFAULT_POST_SORT,
    select: {
      title: true,
      slug: true,
      categories: true,
      tags: true,
      meta: true,
      publishedAt: true,
    },
  })

  const [featured, ...rest] = posts.docs

  return (
    <div className="pt-16 pb-24 md:pt-24">
      {featured && (
        <div className="container mb-20">
          <FeaturedPost doc={featured} />
        </div>
      )}

      {posts.docs.length === 0 && (
        <div className="container">
          <p className="text-muted-foreground">記事がまだありません。</p>
        </div>
      )}

      {rest.length > 0 && (
        <>
          <div className="container mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">最新の記事</h2>
          </div>
          <CollectionArchive posts={rest} showTags />
        </>
      )}

      {posts.totalDocs > HOME_POST_LIMIT && (
        <div className="container mt-12 flex justify-center">
          <CMSLink appearance="outline" label="すべての記事を見る" type="custom" url="/posts" />
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    openGraph: mergeOpenGraph({
      description: SITE_DESCRIPTION,
      title: SITE_NAME,
      url: '/',
    }),
  }
}
