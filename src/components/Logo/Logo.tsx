import clsx from 'clsx'
import React from 'react'

import { SITE_NAME } from '@/utilities/siteMetadata'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

// プレースホルダーのテキストロゴ。テーマ色を継承し外部依存もない。
// 画像ロゴに差し替える場合は public/ に配置し、下記を <img src="/logo.svg" ... /> へ変更する。
export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      className={clsx(
        'inline-flex items-center h-8.5 text-xl font-semibold tracking-tight text-current',
        className,
      )}
    >
      {SITE_NAME}
    </span>
  )
}
