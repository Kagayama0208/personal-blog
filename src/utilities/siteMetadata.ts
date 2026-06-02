// サイト全体のブランド情報を一元管理する。
// 公開前に実際のブログ名・説明・SNSハンドルへ変更すること。
// （ここを変えるだけでメタタイトル・OG・SEOプラグインへ反映される）

/** サイト名。メタタイトルの接尾辞や OG siteName に使われる。 */
export const SITE_NAME = '抜錨'

/** サイトの説明。OG / メタの description フォールバックに使われる。 */
export const SITE_DESCRIPTION = 'A blog built with Payload CMS and Next.js.'

/**
 * X (Twitter) のハンドル（例: '@your_handle'）。
 * 空文字にすると Twitter カードの creator 出力を省略する。
 */
export const TWITTER_HANDLE: string = ''
