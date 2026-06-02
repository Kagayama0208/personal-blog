import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const ActiveTagFilter: React.FC<{
  /** Tag title shown inside the chip. */
  title: string
  /** Where to navigate when the filter is cleared. Defaults to the unfiltered posts archive. */
  clearHref?: string
  className?: string
}> = ({ title, clearHref = '/posts', className }) => {
  return (
    <div className={className}>
      <Link
        aria-label={`Remove “${title}” tag filter`}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm transition-colors hover:bg-card"
        href={clearHref}
      >
        <span>{title}</span>
        <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </Link>
    </div>
  )
}
