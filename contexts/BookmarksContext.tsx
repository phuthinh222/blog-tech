"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from "react"

const STORAGE_KEY = "zerotech_bookmarks"

type BookmarksCtx = {
  bookmarks: string[]
  toggle: (slug: string) => void
  isBookmarked: (slug: string) => boolean
}

const BookmarksContext = createContext<BookmarksCtx | null>(null)

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch {
      return []
    }
  })

  const toggle = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBookmarked = useCallback((slug: string) => bookmarks.includes(slug), [bookmarks])

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggle, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider")
  return ctx
}
