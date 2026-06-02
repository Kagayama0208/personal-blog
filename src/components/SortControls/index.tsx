'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { DEFAULT_POST_SORT, POST_SORT_OPTIONS, resolvePostSort } from './options'

export const SortControls: React.FC<{
  /** Route the archive lives at (page 1). Sort changes navigate here, resetting pagination. */
  basePath?: string
  className?: string
}> = ({ basePath = '/posts', className }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = resolvePostSort(searchParams.get('sort'))

  const onValueChange = (value: string) => {
    const sort = resolvePostSort(value)
    // Changing sort resets to the first page. Keep the default sort out of the URL.
    if (sort === DEFAULT_POST_SORT) {
      router.push(basePath)
    } else {
      router.push(`${basePath}?sort=${encodeURIComponent(sort)}`)
    }
  }

  return (
    <div className={className}>
      <Select value={current} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px]" aria-label="Sort posts">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(POST_SORT_OPTIONS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
