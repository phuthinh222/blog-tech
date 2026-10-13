"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, LayoutGrid, Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import ArticleCard from "@/components/blog/ArticleCard"
import type { Post, Category } from "@/types"
import { getCategoryColor, getCategoryIcon } from "@/lib/categories"

type Props = {
  posts: Post[]
  categories: Category[]
  initialCategory?: string
  initialQuery?: string
}

type FilterOption = { slug: string; name: string; count: number }

function OptionIcon({ slug }: { slug: string }) {
  if (!slug) {
    return (
      <span className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-lg">
        <LayoutGrid className="size-3.5" />
      </span>
    )
  }
  const Icon = getCategoryIcon(slug)
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
      style={{ backgroundColor: getCategoryColor(slug) }}
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon className="size-3.5" />
    </span>
  )
}

// Dropdown chọn 1 danh mục ("" = tất cả) — cùng kiểu với LocaleSwitcher.
function CategoryFilter({
  options,
  value,
  label,
  onChange,
}: {
  options: FilterOption[]
  value: string
  label: string
  onChange: (slug: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.slug === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <div className="flex items-center gap-3">
      <span id="category-filter-label" className="text-muted-foreground text-sm font-medium">
        {label}
      </span>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="category-filter-label category-filter-value"
          className="border-border bg-background hover:bg-muted flex min-w-44 items-center gap-2.5 rounded-xl border py-1.5 pr-3 pl-1.5 text-sm shadow-sm transition-colors"
        >
          <OptionIcon slug={selected.slug} />
          <span id="category-filter-value" className="flex-1 text-left font-semibold">
            {selected.name}
          </span>
          <ChevronDown
            className={`text-muted-foreground size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-labelledby="category-filter-label"
            className="border-border bg-background animate-fade-in-up absolute top-full left-0 z-40 mt-2 w-60 overflow-hidden rounded-2xl border p-1.5 shadow-xl shadow-black/10"
          >
            {options.map((option) => {
              const isSelected = option.slug === selected.slug
              return (
                <li key={option.slug || "all"} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      onChange(option.slug)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors ${
                      isSelected ? "bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <OptionIcon slug={option.slug} />
                    <span className="flex-1">{option.name}</span>
                    <span className="text-muted-foreground text-xs">{option.count}</span>
                    <Check className={`text-primary size-4 ${isSelected ? "" : "invisible"}`} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function ArticlesList({
  posts,
  categories,
  initialCategory = "",
  initialQuery = "",
}: Props) {
  const router = useRouter()
  const t = useTranslations("ArticlesList")
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = !category || p.category === category
      const q = query.toLowerCase()
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [posts, query, category])

  function syncURL(newQuery: string, newCategory: string) {
    const params = new URLSearchParams()
    if (newQuery) params.set("q", newQuery)
    if (newCategory) params.set("category", newCategory)
    const qs = params.toString()
    router.replace(qs ? `/categories?${qs}` : "/categories", { scroll: false })
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Bộ lọc danh mục dạng dropdown + nhãn từ khoá (nếu có) */}
      <div className="flex flex-wrap items-center gap-3">
        <CategoryFilter
          options={[{ slug: "", name: t("all"), count: posts.length }, ...categories]}
          value={category}
          label={t("filterLabel")}
          onChange={(next) => {
            setCategory(next)
            syncURL(query, next)
          }}
        />

        {/* Từ khoá đến từ ô tìm kiếm trên Header (?q=) — bấm × để bỏ */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              syncURL("", category)
            }}
            aria-label={t("clearQuery")}
            className="border-border hover:bg-muted flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
          >
            <Search className="text-muted-foreground size-3.5" />
            &ldquo;{query}&rdquo;
            <X className="text-muted-foreground size-3.5" />
          </button>
        )}
      </div>

      {/* Grid or empty state */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
          <Search className="text-muted-foreground/30 size-10" />
          <p className="text-muted-foreground text-sm font-medium">{t("emptyTitle")}</p>
          <p className="text-muted-foreground/60 text-xs">{t("emptyHint")}</p>
        </div>
      )}
    </div>
  )
}
