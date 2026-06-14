import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { type Post, formatDate } from "@/lib/posts";
import { AUTHOR_PHOTOS } from "@/lib/team";
import { BookmarkButton } from "@/components/blog/BookmarkButton";

function AuthorAvatar({ name, color }: { name: string; color: string }) {
  const photo = AUTHOR_PHOTOS[name];
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  if (photo) {
    return (
      <span className="relative flex size-7 shrink-0 overflow-hidden rounded-full border border-white/30">
        <Image src={photo} alt={name} fill className="object-cover" sizes="28px" />
      </span>
    );
  }
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-[10px] font-bold text-white backdrop-blur-sm"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

type Props = {
  post: Post;
  variant?: "default" | "featured" | "compact";
};

export default function ArticleCard({ post, variant = "default" }: Props) {

  /* ── FEATURED ─────────────────────────────────────────── */
  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${post.slug}`}
        className="shimmer group relative flex h-[360px] sm:h-[500px] w-full overflow-hidden rounded-2xl"
      >
        {/* Real cover image */}
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1200px) 100vw, 1152px"
          priority
        />

        {/* Color tint */}
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-30"
          style={{ background: `linear-gradient(135deg, ${post.coverColor}cc 0%, ${post.coverColor}33 100%)` }}
        />

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {/* Floating badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2 animate-float">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: "white" }} />
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-yellow-400 shadow-lg backdrop-blur-md">
            <Star className="size-3 fill-yellow-400" />
            {post.rating}
          </span>
        </div>

        {/* Content */}
        <div className="relative mt-auto flex flex-col gap-4 p-6 sm:p-10 animate-fade-in-up">
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl line-clamp-3 group-hover:underline underline-offset-4 decoration-white/40">
            {post.title}
          </h2>
          <p className="max-w-2xl text-sm text-white/70 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <AuthorAvatar name={post.author} color={post.coverColor} />
            <span className="font-semibold text-white/90">{post.author}</span>
            <span className="text-white/30">·</span>
            <span>{formatDate(post.date)}</span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readTime} phút đọc
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* ── COMPACT ──────────────────────────────────────────── */
  if (variant === "compact") {
    return (
      <Link href={`/articles/${post.slug}`} className="group flex items-start gap-3 py-3.5">
        <div className="shimmer relative size-14 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="56px"
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `linear-gradient(135deg, ${post.coverColor}aa, ${post.coverColor}33)` }}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: post.coverColor }}
          >
            {post.category}
          </span>
          <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </p>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">{post.rating}</span>
            <span>·</span>
            {post.readTime} phút đọc
          </span>
        </div>
      </Link>
    );
  }

  /* ── DEFAULT ──────────────────────────────────────────── */
  const photo = AUTHOR_PHOTOS[post.author];
  const initials = post.author.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent">
      {/* Ghost link — covers whole card */}
      <Link
        href={`/articles/${post.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={post.title}
      />

      {/* Cover with zoom */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(135deg, ${post.coverColor}cc, ${post.coverColor}33)` }}
        />
        {/* Rating badge */}
        <div className="absolute top-3 right-3 z-[2] flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-yellow-400 backdrop-blur-sm shadow-md">
          <Star className="size-3 fill-yellow-400" />
          {post.rating}
        </div>
        {/* Bookmark button */}
        <div className="absolute top-3 left-3 z-[2]">
          <BookmarkButton slug={post.slug} />
        </div>
      </div>

      {/* Body */}
      <div className="relative z-[2] flex flex-1 flex-col gap-3 p-5">
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: post.coverColor }}
        >
          {post.category}
        </span>
        <h3 className="text-[15px] font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-2.5 border-t border-border/60 pt-3">
          {photo ? (
            <span className="relative flex size-7 shrink-0 overflow-hidden rounded-full">
              <Image src={photo} alt={post.author} fill className="object-cover" sizes="28px" />
            </span>
          ) : (
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: post.coverColor }}
            >
              {initials}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-xs font-medium">{post.author}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {post.readTime} phút
          </span>
        </div>
      </div>
    </div>
  );
}
