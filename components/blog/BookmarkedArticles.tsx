"use client"
import { Bookmark } from "lucide-react"
import { useTranslations } from "next-intl"
import { useBookmarks } from "@/hooks/useBookmarks"
import type { Post } from "@/types"
import ArticleCard from "@/components/blog/ArticleCard"

export function BookmarkedArticles({ posts }: { posts: Post[] }) {
  const t = useTranslations("Bookmarks")
  const { bookmarks } = useBookmarks()
  const saved = posts.filter((p) => bookmarks.includes(p.slug))

  if (saved.length === 0) {
    return (
      <div className="border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
        <Bookmark className="text-muted-foreground/30 size-10" />
        <p className="text-muted-foreground text-sm font-medium">{t("emptyTitle")}</p>
        <p className="text-muted-foreground/60 text-xs">
          {t.rich("emptyHint", { icon: () => <Bookmark className="inline size-3" /> })}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((p) => (
        <ArticleCard key={p.slug} post={p} />
      ))}
    </div>
  )
}
