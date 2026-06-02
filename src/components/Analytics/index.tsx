import React from 'react'

// Plausible のアクセス解析タグ。
// `PLAUSIBLE_DOMAIN` が設定されている場合のみ出力する（dev では計測しない）。
// セルフホストの場合は `PLAUSIBLE_SRC` にスクリプトURLを指定する。
// 注: ページは SSG/ISR で生成されるため、この値は実質ビルド時に確定する。
export const Analytics: React.FC = () => {
  const domain = process.env.PLAUSIBLE_DOMAIN

  if (!domain) return null

  const src = process.env.PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'

  return <script defer data-domain={domain} src={src} />
}
