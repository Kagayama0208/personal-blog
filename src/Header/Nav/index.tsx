'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

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

const navLinkClass = (isActive: boolean): string =>
  cn(
    'relative inline-flex items-center text-sm transition-colors',
    'after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-brand after:transition-all after:duration-300',
    isActive
      ? 'text-brand after:w-full'
      : 'text-foreground/70 hover:text-foreground after:w-0 hover:after:w-full',
  )

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-5">
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
  )
}
