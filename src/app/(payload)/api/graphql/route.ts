/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

// 本番では GraphQL API を無効化する（フロントは未使用）。
export const POST =
  process.env.NODE_ENV === 'production'
    ? () => new Response('Not Found', { status: 404 })
    : GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
