'use client'

import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'
import { useDebounce } from '@/utilities/useDebounce'

type SearchResult = {
  id: string | number
  title?: string | null
  slug?: string | null
}

/**
 * Inline header search: type to see live suggestions in a dropdown without leaving
 * the current page. Selecting a result opens the post; "Search for …"/Enter falls
 * back to the full /search results page.
 */
export const HeaderSearch: React.FC = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  // -1 = the "Search for …" row; 0..n-1 = a result row.
  const [activeIndex, setActiveIndex] = useState(-1)

  const query = value.trim()
  const debouncedQuery = useDebounce(query, 200)

  // Fetch suggestions from Payload's REST API for the `search` collection (public read).
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams({ depth: '0', limit: '6' })
    params.set('where[or][0][title][like]', debouncedQuery)
    params.set('where[or][1][meta.description][like]', debouncedQuery)
    params.set('where[or][2][meta.title][like]', debouncedQuery)
    params.set('where[or][3][slug][like]', debouncedQuery)

    fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Search request failed'))))
      .then((data: { docs?: SearchResult[] }) => {
        setResults(Array.isArray(data?.docs) ? data.docs : [])
        setActiveIndex(-1)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setResults([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [debouncedQuery])

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const goToFullSearch = () => {
    setOpen(false)
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  const goToResult = (result: SearchResult) => {
    if (!result.slug) return goToFullSearch()
    setOpen(false)
    setValue('')
    router.push(`/posts/${result.slug}`)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1 >= results.length ? -1 : i + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i <= -1 ? results.length - 1 : i - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) goToResult(results[activeIndex])
      else goToFullSearch()
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const showDropdown = open && Boolean(query)

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          aria-activedescendant={
            showDropdown && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showDropdown}
          aria-label="Search"
          autoComplete="off"
          className="h-9 w-40 rounded-md border border-border bg-transparent pl-8 pr-3 text-sm outline-none transition-[width,box-shadow] placeholder:text-muted-foreground focus-visible:w-56 focus-visible:ring-4 focus-visible:ring-ring/20"
          onChange={(event) => {
            setValue(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search"
          ref={inputRef}
          role="combobox"
          type="search"
          value={value}
        />
      </div>

      {showDropdown && (
        <div
          className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
          id={listboxId}
          role="listbox"
        >
          <button
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
              activeIndex === -1 ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
            )}
            id={`${listboxId}-opt--1`}
            onClick={goToFullSearch}
            onMouseEnter={() => setActiveIndex(-1)}
            role="option"
            aria-selected={activeIndex === -1}
            type="button"
          >
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              Search for <span className="font-medium">&ldquo;{query}&rdquo;</span>
            </span>
          </button>

          {results.length > 0 && (
            <ul className="border-t border-border py-1">
              {results.map((result, index) => (
                <li key={result.id}>
                  <Link
                    aria-selected={activeIndex === index}
                    className={cn(
                      'block truncate px-3 py-2 text-sm',
                      activeIndex === index
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent',
                    )}
                    href={result.slug ? `/posts/${result.slug}` : '/search'}
                    id={`${listboxId}-opt-${index}`}
                    onClick={() => {
                      // <Link> handles navigation (with prefetch); just reset the UI here.
                      setOpen(false)
                      setValue('')
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                  >
                    {result.title || 'Untitled'}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && (
            <div className="border-t border-border px-3 py-2 text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
