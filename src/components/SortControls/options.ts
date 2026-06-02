// Whitelist of sort values exposed to readers on the posts archive.
// Keys are passed verbatim to Payload's `find({ sort })` (a leading `-` means descending).
export const POST_SORT_OPTIONS = {
  '-publishedAt': 'Newest first',
  publishedAt: 'Oldest first',
  '-createdAt': 'Recently added',
  title: 'Title (A–Z)',
} as const

export type PostSortValue = keyof typeof POST_SORT_OPTIONS

export const DEFAULT_POST_SORT: PostSortValue = '-publishedAt'

// Coerce an untrusted query value into a known sort, falling back to the default.
export const resolvePostSort = (value?: string | null): PostSortValue =>
  value && value in POST_SORT_OPTIONS ? (value as PostSortValue) : DEFAULT_POST_SORT
