import canUseDOM from './canUseDOM'

let warnedMissingServerURL = false

export const getServerSideURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // 本番で公開URLが未設定だと CORS / リンク / OG / sitemap が localhost にフォールバックする。
  // 一度だけ警告して気付けるようにする（ビルド時のログを汚さないため抑制する）。
  if (process.env.NODE_ENV === 'production' && !warnedMissingServerURL) {
    warnedMissingServerURL = true
    console.warn(
      '[config] NEXT_PUBLIC_SERVER_URL is not set in production; falling back to http://localhost:3000',
    )
  }

  return 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
