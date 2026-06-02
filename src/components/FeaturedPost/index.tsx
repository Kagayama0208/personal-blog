import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { MediaPlaceholder } from '@/components/Media/MediaPlaceholder'
import { formatDateTime } from '@/utilities/formatDateTime'

export type FeaturedPostData = Pick<Post, 'slug' | 'title' | 'meta' | 'categories' | 'publishedAt'>

// トップの注目記事。最新記事を大きく見せる。RSC（リンク以外の対話なし）。
export const FeaturedPost: React.FC<{ doc: FeaturedPostData }> = ({ doc }) => {
  const { slug, title, meta, categories, publishedAt } = doc
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/posts/${slug}`

  return (
    <article className="group grid items-center gap-6 md:grid-cols-2 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link
        aria-label={title ?? undefined}
        className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-muted"
        href={href}
      >
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            resource={metaImage}
            size="(min-width: 768px) 60vw, 100vw"
          />
        ) : (
          <MediaPlaceholder title={title} />
        )}
      </Link>

      <div>
        <span className="text-xs font-medium uppercase tracking-widest text-brand">注目の記事</span>
        {title && (
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            <Link className="transition-colors hover:text-brand" href={href}>
              {title}
            </Link>
          </h2>
        )}
        {description && (
          <p className="mt-4 leading-relaxed text-muted-foreground line-clamp-3">
            {sanitizedDescription}
          </p>
        )}
        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          {hasCategories && (
            <span className="uppercase tracking-wide">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const categoryTitle = category.title || 'Untitled category'
                  const isLast = index === categories.length - 1
                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }
                return null
              })}
            </span>
          )}
          {hasCategories && publishedAt && <span aria-hidden="true">·</span>}
          {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
        </div>
      </div>
    </article>
  )
}
