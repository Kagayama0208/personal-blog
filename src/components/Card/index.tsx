'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { MediaPlaceholder } from '@/components/Media/MediaPlaceholder'
import { formatDateTime } from '@/utilities/formatDateTime'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'tags' | 'meta' | 'title' | 'publishedAt'
>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  showTags?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, showTags, title: titleFromProps } = props

  const { slug, categories, tags, meta, title, publishedAt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const hasTags = tags && Array.isArray(tags) && tags.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card',
        'transition-[transform,box-shadow,border-color] duration-300',
        'hover:-translate-y-1 hover:shadow-soft-lg hover:border-brand/30 dark:hover:border-brand/40',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            resource={metaImage}
            size="33vw"
          />
        ) : (
          <MediaPlaceholder title={titleToUse} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {(showCategories && hasCategories) || publishedAt ? (
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            {showCategories && hasCategories && (
              <span className="uppercase tracking-wide">
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory } = category

                    const categoryTitle = titleFromCategory || 'Untitled category'

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
            {showCategories && hasCategories && publishedAt && <span aria-hidden="true">·</span>}
            {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
          </div>
        ) : null}
        {titleToUse && (
          <h3 className="text-lg font-semibold leading-snug tracking-tight">
            <Link className="transition-colors group-hover:text-brand" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {sanitizedDescription}
          </p>
        )}
        {showTags && hasTags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags?.map((tag, index) => {
              if (typeof tag !== 'object' || tag === null) return null

              const tagTitle = tag.title || 'Untitled tag'

              return (
                <Link
                  className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand"
                  href={`/tags/${tag.slug}`}
                  key={index}
                >
                  {tagTitle}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
