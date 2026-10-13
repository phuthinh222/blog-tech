"use client"
import { Bookmark } from "lucide-react"
import { useTranslations } from "next-intl"
import { useBookmarks } from "@/hooks/useBookmarks"

type Props = {
  slug: string
  className?: string
}

export function BookmarkButton({ slug, className = "" }: Props) {
  const t = useTranslations("Bookmarks")
  const { toggle, isBookmarked } = useBookmarks()
  const saved = isBookmarked(slug)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(slug)
      }}
      aria-label={saved ? t("remove") : t("save")}
      className={`flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
        saved
          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/40"
          : "bg-black/50 text-white/70 hover:bg-black/70 hover:text-white"
      } ${className}`}
    >
      <Bookmark className={`size-3.5 transition-all ${saved ? "fill-white" : ""}`} />
    </button>
  )
}
