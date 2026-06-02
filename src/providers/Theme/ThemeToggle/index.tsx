'use client'

import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useTheme } from '..'

// ヘッダー用のコンパクトな light↔dark トグル。Auto は引き続きフッターの ThemeSelector が担当。
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  // SSR と初回クライアントレンダーを一致させ、hydration の不一致を避ける。
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // mounted になるまでは SSR と同じ「未確定（=dark でない）」状態として描画し、
  // aria-label / アイコンの hydration 不一致を防ぐ。
  const isDark = mounted && theme === 'dark'

  return (
    <button
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="inline-flex size-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
