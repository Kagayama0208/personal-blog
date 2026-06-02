import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  // 記事タイトルがあれば頭文字を控えめに表示する。なければアイコンのみ。
  title?: string | null
}

// 画像未設定の記事カード/注目記事で使う、ブランド色のグラデーションプレースホルダー。
// Card と FeaturedPost で共有する。
export const MediaPlaceholder: React.FC<Props> = ({ className, title }) => {
  const initial = title?.trim()?.charAt(0)

  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-subtle to-muted',
        className,
      )}
    >
      {initial ? (
        <span className="text-4xl font-semibold tracking-tight text-brand/40 select-none">
          {initial}
        </span>
      ) : (
        <svg
          className="size-10 text-brand/30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M5.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21zm3.75-11.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}
