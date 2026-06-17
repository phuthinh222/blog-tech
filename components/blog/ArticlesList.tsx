"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import ArticleCard from "@/components/blog/ArticleCard"
import type { Post, Category } from "@/types"

type Props = {
  posts: Post[]
  categories: Category[]
  initialCategory?: string
  initialQuery?: string
}

export function ArticlesList({ posts, categories, initialCategory = "", initialQuery = "" }: Props) {
  const [query, setQuery]       = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = !category || p.category === category
      const q = query.toLowerCase()
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [posts, query, category])

  return (
    <div className="flex flex-col gap-10">

      {/* Filter + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug === category ? "" : cat.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Grid or empty state */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
          <Search className="size-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Không tìm thấy bài viết nào</p>
          <p className="text-xs text-muted-foreground/60">Thử từ khoá khác hoặc chọn danh mục khác</p>
        </div>
      )}
    </div>
  )
}
