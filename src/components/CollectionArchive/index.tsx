import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  showTags?: boolean
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, showTags } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-8 gap-x-6 lg:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div
                  className="col-span-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  key={index}
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
                >
                  <Card
                    className="h-full"
                    doc={result}
                    relationTo="posts"
                    showCategories
                    showTags={showTags}
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
