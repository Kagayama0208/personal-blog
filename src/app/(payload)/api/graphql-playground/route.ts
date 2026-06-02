/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

// 本番では GraphQL Playground を無効化する（スキーマ流出面を塞ぐ）。
// フロントは GraphQL を使わずローカルAPIで動作するため影響なし。
export const GET =
  process.env.NODE_ENV === 'production'
    ? () => new Response('Not Found', { status: 404 })
    : GRAPHQL_PLAYGROUND_GET(config)
