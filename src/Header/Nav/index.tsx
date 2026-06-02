'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { HeaderSearch } from '@/components/HeaderSearch'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { cn } from '@/utilities/ui'

type NavLink = NonNullable<HeaderType['navItems']>[number]['link']

// CMSLink と同じ href 導出ロジック（参照は pages は接頭辞なし、posts は /posts を付与）。
const getHref = (link: NavLink): string | null => {
  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const { relationTo, value } = link.reference
    return relationTo === 'pages' ? `/${value.slug}` : `/${relationTo}/${value.slug}`
  }
  return link.url ?? null
}

const isActivePath = (pathname: string, href: string | null): boolean =>
  Boolean(href && (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))))

// デスクトップ: 下線アニメーション付きの横並びリンク。
const navLinkClass = (isActive: boolean): string =>
  cn(
    'relative inline-flex items-center text-sm transition-colors',
    'after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-brand after:transition-all after:duration-300',
    isActive
      ? 'text-brand after:w-full'
      : 'text-foreground/70 hover:text-foreground after:w-0 hover:after:w-full',
  )

// モバイル: パネル内に縦積みするブロック型リンク。
const mobileNavLinkClass = (isActive: boolean): string =>
  cn(
    'rounded-md px-3 py-2 text-base transition-colors',
    isActive ? 'bg-accent text-brand' : 'text-foreground/80 hover:bg-accent hover:text-foreground',
  )

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuId = useId()

  // ルート遷移時（リンク／検索で navigate したとき）はモバイルメニューを閉じる。
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // 開いている間は Escape で閉じられるようにする。
  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  return (
    <>
      {/* デスクトップ: 横並びナビ（ナビ項目 + About + 検索 + テーマトグル） */}
      <nav className="hidden items-center gap-5 md:flex">
        {navItems.map(({ link }, i) => {
          const href = getHref(link)

          return (
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className={navLinkClass(isActivePath(pathname, href))}
            />
          )
        })}
        {/* About への遷移ボタン（常設） */}
        <Link className={navLinkClass(isActivePath(pathname, '/about'))} href="/about">
          About
        </Link>
        <HeaderSearch />
        <ThemeToggle />
      </nav>

      {/* モバイル: テーマトグル + ハンバーガーボタン */}
      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <button
          aria-controls={menuId}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'メニューを閉じる' : 'メニューを開く'}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* モバイルメニュー: ヘッダー直下に開くパネル（検索バー + ナビ項目 + About）。
          要素は常時マウントし、grid-rows を 0fr↔1fr で遷移させて開閉を高さアニメーションで見せる。 */}
      <div
        className={cn(
          'absolute inset-x-0 top-full z-50 grid transition-[grid-template-rows] duration-300 ease-out md:hidden',
          mobileOpen ? 'grid-rows-[1fr]' : 'pointer-events-none grid-rows-[0fr]',
        )}
        id={menuId}
      >
        {/* min-h-0 + overflow-hidden の入れ子で、閉じている間は枠線ごとクリップする。 */}
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'border-b border-border bg-background/95 backdrop-blur-md transition-opacity duration-300',
              mobileOpen ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className="container flex flex-col gap-4 py-4">
              <HeaderSearch fullWidth />
              <nav className="flex flex-col gap-1">
                {navItems.map(({ link }, i) => {
                  const href = getHref(link)

                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      appearance="inline"
                      className={mobileNavLinkClass(isActivePath(pathname, href))}
                    />
                  )
                })}
                {/* About への遷移ボタン（常設） */}
                <Link
                  className={mobileNavLinkClass(isActivePath(pathname, '/about'))}
                  href="/about"
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
