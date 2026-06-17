import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, ChevronRight } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/content";
import { getCategoryIcon, getCategoryColor, getCategoryName, getRatingBreakdown } from "@/lib/categories";
import { formatDate } from "@/lib/utils";
import { TEAM } from "@/lib/team";
import ArticleCard from "@/components/blog/ArticleCard";
import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { Comments } from "@/components/blog/Comments";

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — The Zero Tech`,
    description: post.seo?.metaDescription ?? post.excerpt,
  };
}

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-bold">{score}</span>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const coverColor   = getCategoryColor(post.category);
  const categoryName = getCategoryName(post.category);
  const CategoryIcon = getCategoryIcon(post.category);
  const author       = TEAM.find((m) => m.name === post.author);
  const allPosts     = getPosts();
  const related      = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  const breakdown    = getRatingBreakdown(post.rating);

  return (
    <article>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative h-[420px] sm:h-[540px] w-full overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${coverColor}88 0%, ${coverColor}22 100%)` }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${coverColor}88 0%, ${coverColor}22 100%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">Trang Chủ</Link>
            <ChevronRight className="size-3" />
            <Link href="/articles" className="hover:text-white/80 transition-colors">Đánh Giá</Link>
            <ChevronRight className="size-3" />
            <Link href={`/categories/${post.category}`} className="hover:text-white/80 transition-colors">
              {categoryName}
            </Link>
          </nav>

          {/* Badges */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: `${coverColor}cc` }}
            >
              <CategoryIcon className="size-3" />
              {categoryName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-300 border border-yellow-400/30">
              <Star className="size-3 fill-yellow-300" />
              {post.rating.overall} / 10
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              {post.verdict.recommendation}
            </span>
          </div>

          <h1 className="text-2xl font-bold leading-tight text-white sm:text-4xl max-w-3xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            {author && (
              <div className="flex items-center gap-2">
                <span className="relative flex size-8 overflow-hidden rounded-full border border-white/30">
                  <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="32px" />
                </span>
                <span className="font-medium text-white/90">{author.name}</span>
              </div>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

          {/* ── Left: Article Body ───────────────────────────── */}
          <div className="flex flex-col gap-10 min-w-0">

            {/* Lead */}
            <p
              className="text-lg leading-relaxed text-muted-foreground border-l-4 pl-5"
              style={{ borderColor: coverColor }}
            >
              {post.excerpt}
            </p>

            {/* Specs Table */}
            {post.specs.length > 0 && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div
                  className="flex items-center gap-2 px-5 py-3"
                  style={{ background: `linear-gradient(135deg, ${coverColor}22, ${coverColor}08)` }}
                >
                  <CategoryIcon className="size-4" style={{ color: coverColor }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: coverColor }}>
                    Thông Số Kỹ Thuật
                  </h2>
                </div>
                <div className="divide-y divide-border">
                  {post.specs.map((spec) => (
                    <div key={spec.label} className="flex gap-4 px-5 py-3 text-sm">
                      <span className="w-36 shrink-0 font-medium text-muted-foreground">{spec.label}</span>
                      <span className="flex-1">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Sections */}
            {post.sections.map((section, i) => (
              <section key={i} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                    style={{ backgroundColor: coverColor }}
                  >
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                {section.content.split("\n\n").map((para, j) => (
                  <p key={j} className="leading-relaxed text-muted-foreground">{para}</p>
                ))}
              </section>
            ))}

            {/* Pros & Cons */}
            {(post.pros.length > 0 || post.cons.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="mb-3 font-bold text-emerald-600 flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                    Điểm Cộng
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {post.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                  <h3 className="mb-3 font-bold text-rose-600 flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-rose-500 text-white text-xs">✕</span>
                    Điểm Trừ
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {post.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Câu Hỏi Thường Gặp</h2>
                <div className="flex flex-col gap-3">
                  {post.faq.map((item, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-5">
                      <h3 className="font-bold text-sm mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Verdict */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: `linear-gradient(135deg, ${coverColor}12, ${coverColor}06)`,
                borderColor: `${coverColor}33`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <h3 className="font-bold text-lg">Kết Luận</h3>
                <div className="ml-auto flex items-center gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: coverColor }}
                  >
                    {post.rating.overall}
                    <span className="text-base font-normal text-muted-foreground">/10</span>
                  </span>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground mb-3">{post.verdict.summary}</p>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: coverColor }}
              >
                {post.verdict.recommendation}
              </span>
            </div>
          </div>

          {/* ── Right: Sidebar ───────────────────────────────── */}
          <aside className="flex flex-col gap-6">

            {/* Bookmark */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
              <span className="text-sm font-medium">Lưu bài viết này</span>
              <BookmarkButton slug={post.slug} />
            </div>

            {/* Affiliate link */}
            {post.affiliateUrl && (
              <a
                href={post.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: coverColor }}
              >
                Xem giá tốt nhất →
              </a>
            )}

            {/* Overall Score */}
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Điểm Đánh Giá</p>
              <div
                className="text-7xl font-black tracking-tighter leading-none"
                style={{ color: coverColor }}
              >
                {post.rating.overall}
              </div>
              <div className="text-sm text-muted-foreground mt-1">/ 10</div>
              <div className="mt-3 flex justify-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-4 rounded-full"
                    style={{
                      backgroundColor: i < Math.round(post.rating.overall)
                        ? coverColor
                        : `${coverColor}22`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Rating Breakdown */}
            {breakdown.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Chi Tiết Đánh Giá
                </h3>
                <div className="flex flex-col gap-3">
                  {breakdown.map((item) => (
                    <RatingBar key={item.label} label={item.label} score={item.score} />
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            {author && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Tác Giả</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="relative flex size-12 shrink-0 overflow-hidden rounded-full shadow-md"
                    style={{ boxShadow: `0 4px 16px ${author.color}40` }}
                  >
                    <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="48px" />
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{author.name}</p>
                    <p className="text-xs font-medium" style={{ color: author.color }}>{author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{author.bio}</p>
              </div>
            )}

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Bài Liên Quan
                </h3>
                <div className="flex flex-col divide-y divide-border/60">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/articles/${p.slug}`}
                      className="group flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                        {p.coverImage ? (
                          <Image src={p.coverImage} alt={p.title} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${getCategoryColor(p.category)}99, ${getCategoryColor(p.category)}44)` }} />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-yellow-500">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          {p.rating.overall}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* ── Comments ─────────────────────────────────────── */}
        <Comments slug={post.slug} />

        {/* ── More in Category ─────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 flex flex-col gap-6 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                <h2 className="text-xl font-bold">Thêm về {categoryName}</h2>
              </div>
              <Link
                href={`/categories/${post.category}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
