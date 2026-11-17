import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Award, BookOpen, LayoutGrid, TrendingUp, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ArticleCard from "@/components/blog/ArticleCard"
import { NewsletterForm } from "@/components/blog/NewsletterForm"
import { Link } from "@/i18n/navigation"
import { LOCALE_TAGS, toLocale } from "@/i18n/routing"
import { getPosts, getCategories } from "@/lib/content"
import { getCategoryIcon, getCategoryColor } from "@/lib/categories"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { jsonLdHtml, localeAlternates, localizedUrl, OG_LOCALES, ORGANIZATION_LD } from "@/lib/seo"
import type { Post } from "@/types"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const alternates = localeAlternates("/", locale)
  // openGraph ở trang ghi đè cả object của layout nên khai báo lại đủ trường.
  return {
    alternates,
    openGraph: {
      url: alternates?.canonical?.toString(),
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALES[locale],
    },
  }
}

function TrendingEntry({ post, index }: { post: Post; index: number }) {
  const tCat = useTranslations("Categories")
  const color = getCategoryColor(post.category)
  return (
    <Link href={`/reviews/${post.slug}`} className="group flex items-start gap-4">
      <span className="text-muted-foreground/25 w-10 shrink-0 text-4xl leading-none font-black select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <span
          className="text-xs font-bold tracking-widest uppercase sm:text-[11px]"
          style={{ color }}
        >
          {tCat(`${post.category}.name`)}
        </span>
        <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-bold transition-colors">
          {post.title}
        </h3>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <User className="size-3" />
          {post.author}
        </span>
      </div>
    </Link>
  )
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  const t = useTranslations("Common")
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <Link
        href={href}
        className="group text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
      >
        {t("viewAll")}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export const revalidate = 3600 // ISR — content giờ động (Supabase), xem todo.md Phase 2

export default async function HomePage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const [posts, categories, t, tCat] = await Promise.all([
    getPosts(locale),
    getCategories(locale),
    getTranslations("HomePage"),
    getTranslations("Categories"),
  ])

  const featured = posts[0]
  const latest = posts.slice(1, 4)
  const trending = posts.slice(0, 5)
  const recent = posts.slice(5, 9)
  // Lựa chọn hàng đầu = điểm cao nhất (không theo hoa hồng).
  const bestPicks = [...posts].sort((a, b) => b.rating.overall - a.rating.overall).slice(0, 4)
  const ctas = [
    { href: "/categories", label: t("ctaReviews"), Icon: LayoutGrid, primary: true },
    { href: "/#best-picks", label: t("ctaBestPicks"), Icon: Award, primary: false },
    { href: "/guides", label: t("ctaGuides"), Icon: BookOpen, primary: false },
  ]

  const jsonLd = jsonLdHtml(
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: localizedUrl("/", locale),
      inLanguage: LOCALE_TAGS[locale],
      publisher: { "@id": ORGANIZATION_LD["@id"] },
    },
    ORGANIZATION_LD
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-12 sm:gap-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      {/* ── Tagline + CTA ─────────────────────────────────── */}
      <section className="-mb-10 flex flex-col items-start gap-5 sm:-mb-16">
        <h1 className="max-w-3xl text-3xl leading-tight font-black tracking-tight sm:text-5xl">
          {t("tagline")}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
          {t("taglineSub")}
        </p>
        <div className="flex flex-wrap gap-3">
          {ctas.map(({ href, label, Icon, primary }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                primary
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border-border bg-card hover:bg-muted border"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Hero featured article ─────────────────────────── */}
      {/* Không fade-in: ảnh bìa là LCP, opacity 0 lúc đầu làm LCP trễ. */}
      <section>
        <ArticleCard post={featured} variant="featured" />
      </section>

      {/* ── Latest articles ───────────────────────────────── */}
      <section className="animate-fade-in-up flex flex-col gap-6 delay-100">
        <SectionHeader title={t("latest")} href="/categories" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <div key={post.slug} className="reveal">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending + Sidebar ────────────────────────────── */}
      <section className="animate-fade-in-up grid gap-16 delay-200 lg:grid-cols-3">
        {/* Trending — bài #1 dạng thẻ lớn, #2–#5 xếp dọc bên cạnh */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 shadow-md shadow-orange-400/30">
              <TrendingUp className="size-4 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">{t("trending")}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <Link
              href={`/reviews/${trending[0].slug}`}
              className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl"
            >
              {trending[0].coverImage ? (
                <Image
                  src={trending[0].coverImage}
                  alt={trending[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${getCategoryColor(trending[0].category)}99, ${getCategoryColor(trending[0].category)}33)`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
              <span className="absolute top-4 left-5 text-[100px] leading-none font-black text-white/10 select-none">
                01
              </span>
              <div className="relative flex flex-col gap-2 p-6 sm:p-8">
                <span className="text-xs font-bold tracking-widest text-white/70 uppercase sm:text-[11px]">
                  {tCat(`${trending[0].category}.name`)}
                </span>
                <h3 className="line-clamp-3 text-2xl leading-tight font-black text-white sm:text-3xl">
                  {trending[0].title}
                </h3>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                  <User className="size-3" />
                  {trending[0].author}
                </span>
              </div>
            </Link>

            <div className="divide-border/70 flex flex-col divide-y">
              {trending.slice(1).map((post, i) => (
                <div key={post.slug} className="py-5 first:pt-0 last:pb-0">
                  <TrendingEntry post={post} index={i + 1} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          {/* Categories */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
              <h2 className="text-xl font-bold tracking-tight">{t("categories")}</h2>
            </div>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug)
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                  >
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${cat.color}, ${cat.color}aa)`,
                        boxShadow: `0 4px 12px ${cat.color}40`,
                      }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium">{cat.name}</span>
                    <span className="bg-muted text-muted-foreground group-hover:bg-background rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors">
                      {cat.count}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Best picks (điểm cao nhất) ─────────────────────── */}
      <section id="best-picks" className="flex scroll-mt-24 flex-col gap-6">
        <SectionHeader title={t("ctaBestPicks")} href="/categories" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestPicks.map((post) => (
            <div key={post.slug} className="reveal">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>

      <NewsletterForm source="home" />

      {/* ── More recent ───────────────────────────────────── */}
      <section className="animate-fade-in-up flex flex-col gap-6 delay-300">
        <SectionHeader title={t("recent")} href="/categories" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((post) => (
            <div key={post.slug} className="reveal">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
