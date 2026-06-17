"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import type { Post } from "@/types"
import { getCategoryColor, getCategoryName } from "@/lib/categories"

export function SearchDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen]       = useState(false)
  const [query, setQuery]         = useState("")
  const [posts, setPosts]         = useState<Post[]>([])
  const [loading, setLoading]     = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  /* open via custom event (from Header button) */
  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener("open-search", open)
    return () => window.removeEventListener("open-search", open)
  }, [])

  /* ⌘K / Ctrl+K + Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((v) => !v)
      }
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  /* fetch posts once on first open */
  useEffect(() => {
    if (!isOpen) return
    setQuery("")
    setActiveIdx(-1)
    setTimeout(() => inputRef.current?.focus(), 50)
    if (posts.length > 0) return
    setLoading(true)
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isOpen])

  /* reset active index when query changes */
  useEffect(() => { setActiveIdx(-1) }, [query])

  const filtered = posts
    .filter((p) => {
      const q = query.toLowerCase()
      return !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    })
    .slice(0, 6)

  const close = () => setIsOpen(false)

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) {
        router.push(`/articles/${filtered[activeIdx].slug}`)
      } else if (query.trim()) {
        router.push(`/articles?q=${encodeURIComponent(query.trim())}`)
      }
      close()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[12vh]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">

        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Tìm kiếm bài viết..."
            className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={close}
            className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Đóng"
          >
            <X className="size-3" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-1 p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                  <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-1/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((post, idx) => {
              const color   = getCategoryColor(post.category)
              const isActive = idx === activeIdx
              return (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  onClick={close}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                    isActive ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                  onMouseEnter={() => setActiveIdx(idx)}
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}99, ${color}44)` }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-snug">{post.title}</p>
                    <p className="mt-0.5 text-xs font-medium" style={{ color }}>
                      {getCategoryName(post.category)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-yellow-500">{post.rating.overall}</span>
                </Link>
              )
            })
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {query ? `Không tìm thấy kết quả cho "${query}"` : "Nhập từ khoá để tìm kiếm"}
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground/70">
          <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">↑↓</kbd> chọn</span>
          <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">↵</kbd> mở</span>
          <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">Esc</kbd> đóng</span>
          <span className="ml-auto"><kbd className="rounded border border-border px-1 py-0.5 font-mono">⌘K</kbd> bật/tắt</span>
        </div>
      </div>
    </div>
  )
}
