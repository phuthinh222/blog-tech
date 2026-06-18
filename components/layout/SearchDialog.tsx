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
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  /* open via custom event (from Header button) */
  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      setQuery("")
      setActiveIdx(-1)
    }
    window.addEventListener("open-search", open)
    return () => window.removeEventListener("open-search", open)
  }, [])

  /* ⌘K / Ctrl+K + Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((v) => {
          if (!v) {
            setQuery("")
            setActiveIdx(-1)
          }
          return !v
        })
      }
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  /* fetch posts once on first open */
  useEffect(() => {
    if (!isOpen) return
    setTimeout(() => inputRef.current?.focus(), 50)
    if (posts.length > 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

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
      className="fixed inset-0 z-100 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="border-border bg-background w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl">
        {/* Input row */}
        <div className="border-border flex items-center gap-3 border-b px-4">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIdx(-1)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Tìm kiếm bài viết..."
            className="placeholder:text-muted-foreground flex-1 bg-transparent py-4 text-sm outline-none"
          />
          <button
            onClick={close}
            className="border-border text-muted-foreground hover:bg-muted flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors"
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
                  <div className="bg-muted size-12 shrink-0 animate-pulse rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                    <div className="bg-muted h-2.5 w-1/4 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((post, idx) => {
              const color = getCategoryColor(post.category)
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
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${color}99, ${color}44)` }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-snug font-semibold">{post.title}</p>
                    <p className="mt-0.5 text-xs font-medium" style={{ color }}>
                      {getCategoryName(post.category)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-yellow-500">
                    {post.rating.overall}
                  </span>
                </Link>
              )
            })
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground text-sm">
                {query ? `Không tìm thấy kết quả cho "${query}"` : "Nhập từ khoá để tìm kiếm"}
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-border text-muted-foreground/70 flex items-center gap-4 border-t px-4 py-2 text-[11px]">
          <span>
            <kbd className="border-border rounded border px-1 py-0.5 font-mono">↑↓</kbd> chọn
          </span>
          <span>
            <kbd className="border-border rounded border px-1 py-0.5 font-mono">↵</kbd> mở
          </span>
          <span>
            <kbd className="border-border rounded border px-1 py-0.5 font-mono">Esc</kbd> đóng
          </span>
          <span className="ml-auto">
            <kbd className="border-border rounded border px-1 py-0.5 font-mono">⌘K</kbd> bật/tắt
          </span>
        </div>
      </div>
    </div>
  )
}
