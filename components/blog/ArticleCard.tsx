import { memo } from "react"
import Image from "next/image"
import { Clock, Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Post } from "@/types"
import { Link } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { getCategoryColor } from "@/lib/categories"
import { formatDate } from "@/lib/utils"
import { BookmarkButton } from "@/components/blog/BookmarkButton"

function AuthorAvatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/30 text-[10px] font-bold text-white backdrop-blur-sm"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}

type Props = {
  post: Post
  variant?: "default" | "featured" | "compact"
}

function ArticleCard({ post, variant = "default" }: Props) {
  const coverColor = getCategoryColor(post.category)
  const t = useTranslations("ArticleCard")
  const tCat = useTranslations("Categories")
  const locale = toLocale(useLocale())
  const categoryName = tCat(`${post.category}.name`)

  /* ── FEATURED ─────────────────────────────────────────── */
  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${post.slug}`}
        className="shimmer group relative flex h-100 w-full overflow-hidden rounded-2xl sm:h-135 lg:h-150"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1152px"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${coverColor}99 0%, ${coverColor}44 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-30"
          style={{
            background: `linear-gradient(135deg, ${coverColor}cc 0%, ${coverColor}33 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        <div className="animate-float absolute top-4 left-4 flex items-center gap-2 sm:top-6 sm:left-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-white" />
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-yellow-400 shadow-lg backdrop-blur-md">
            <Star className="size-3 fill-yellow-400" />
            {post.rating.overall}
          </span>
        </div>

        {/* Hand-drawn "human touch" sticky note — deliberately imperfect, not AI-polished */}
        <span
          className="absolute top-4 right-4 rotate-[-5deg] rounded-sm bg-yellow-300 px-2.5 py-1 text-sm text-neutral-900 shadow-lg select-none sm:top-5 sm:right-5 sm:px-3 sm:py-1.5 sm:text-base"
          style={{ fontFamily: "var(--font-hand)" }}
        >
          ✎ {t("editorsPick")}
        </span>

        <div className="animate-fade-in-up relative mt-auto flex flex-col gap-4 p-5 sm:gap-5 sm:p-10">
          <h2 className="line-clamp-2 max-w-4xl text-3xl leading-[1.1] font-black tracking-tight text-white decoration-white/40 underline-offset-4 group-hover:underline sm:text-5xl lg:text-7xl lg:leading-[1.05]">
            {post.title}
          </h2>
          <p className="line-clamp-2 max-w-lg text-xs text-white/60 sm:text-sm">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <AuthorAvatar name={post.author} color={coverColor} />
            <span className="font-semibold text-white/90">{post.author}</span>
            <span className="text-white/30">·</span>
            <span>{formatDate(post.publishedAt, locale)}</span>
          </div>
        </div>
      </Link>
    )
  }

  /* ── COMPACT ──────────────────────────────────────────── */
  if (variant === "compact") {
    return (
      <Link href={`/articles/${post.slug}`} className="group flex items-start gap-3 py-3.5">
        <div className="shimmer relative size-14 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)` }}
            />
          )}
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `linear-gradient(135deg, ${coverColor}aa, ${coverColor}33)` }}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className="text-xs font-bold tracking-widest uppercase sm:text-[11px]"
            style={{ color: coverColor }}
          >
            {categoryName}
          </span>
          <p className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-[color,font-weight] duration-300 group-hover:font-extrabold">
            {post.title}
          </p>
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            <span className="text-foreground font-semibold">{post.rating.overall}</span>
          </span>
        </div>
      </Link>
    )
  }

  /* ── DEFAULT ──────────────────────────────────────────── */
  return (
    <div className="group border-border bg-card relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl">
      <Link
        href={`/articles/${post.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={post.title}
      />

      <div className="relative h-48 w-full overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)` }}
          />
        )}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(135deg, ${coverColor}cc, ${coverColor}33)` }}
        />
        <div className="absolute top-3 right-3 z-[2] flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-yellow-400 shadow-md backdrop-blur-sm">
          <Star className="size-3 fill-yellow-400" />
          {post.rating.overall}
        </div>
        <div className="absolute top-3 left-3 z-[2]">
          <BookmarkButton slug={post.slug} />
        </div>
      </div>

      <div className="relative z-[2] flex flex-1 flex-col gap-3 p-5">
        <span
          className="text-xs font-bold tracking-widest uppercase sm:text-[11px]"
          style={{ color: coverColor }}
        >
          {categoryName}
        </span>
        <h3 className="group-hover:text-primary line-clamp-2 text-[15px] leading-snug font-semibold transition-[color,font-weight] duration-300 group-hover:font-extrabold">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 flex-1 text-xs leading-relaxed">
          {post.excerpt}
        </p>

        <div className="border-border/60 flex items-center gap-2.5 border-t pt-3">
          <AuthorAvatar name={post.author} color={coverColor} />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">{post.author}</span>
          <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
            <Clock className="size-3" />
            {formatDate(post.publishedAt, locale)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(ArticleCard)
