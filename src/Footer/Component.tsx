import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Github, Rss } from 'lucide-react'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { SITE_DESCRIPTION, SITE_NAME } from '@/utilities/siteMetadata'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  // 管理画面(/admin)へのリンクは公開フッターに出さない。
  const navItems = (footerData?.navItems || []).filter(({ link }) => link?.url !== '/admin')
  const year = new Date().getFullYear()

  // SNS リンクのプレースホルダ。URL が決まったら href を差し替える。
  const socialLinks = [
    { label: 'GitHub', href: '#', Icon: Github },
    { label: 'RSS', href: '/posts', Icon: Rss },
  ]

  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {/* About への遷移ボタン（常設） */}
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href="/about"
            >
              About
            </Link>
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  key={i}
                  {...link}
                  appearance="inline"
                />
              )
            })}
          </nav>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium">Connect</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => {
                const isExternal = href.startsWith('http')
                return (
                  <Link
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                    href={href}
                    key={label}
                    {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                  >
                    <Icon className="size-4" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE_NAME}
          </p>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
