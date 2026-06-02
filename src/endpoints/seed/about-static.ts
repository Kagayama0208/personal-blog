import type { RequiredDataFromCollectionSlug } from 'payload'

import { SITE_DESCRIPTION } from '@/utilities/siteMetadata'

const ABOUT_TITLE = 'このブログについて'

// `/about` の静的フォールバック。管理画面で slug='about' のページを作成すれば上書きされる。
// （以前ホームに表示していた説明文をこのページへ移動したもの）
export const aboutStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'about',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ABOUT_TITLE,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: SITE_DESCRIPTION,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  meta: {
    description: SITE_DESCRIPTION,
    title: ABOUT_TITLE,
  },
  title: ABOUT_TITLE,
  layout: [],
}
