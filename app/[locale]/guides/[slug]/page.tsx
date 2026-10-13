import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LOCALE_TAGS, toLocale } from "@/i18n/routing"
import { getGuideBySlug, getGuides } from "@/lib/guides"
import { getPosts } from "@/lib/content"
import { getCategoryColor } from "@/lib/categories"
import { formatDate } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates, localizedUrl, OG_LOCALES } from "@/lib/seo"
import ArticleCard from "@/components/blog/ArticleCard"
import { BestPickBox } from "@/components/blog/BestPickBox"

export const revalidate = 3600 // ISR — bài review liên quan lấy từ Supabase

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getGuides(toLocale(params.locale)).map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  const guide = getGuideBySlug(slug, locale)
  if (!guide) return {}
  const description = guide.seo?.metaDescription ?? guide.excerpt
  return {
    title: `${guide.seo?.metaTitle ?? guide.title} — ${SITE_NAME}`,
    description,
    keywords: guide.seo?.keywords,
    alternates: localeAlternates(`/guides/${guide.slug}`, locale),
    openGraph: { title: guide.title, description, type: "article", locale: OG_LOCALES[locale] },
  }
}

export default async function GuidePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  setRequestLocale(locale)
  const guide = getGuideBySlug(slug, locale)
  if (!guide) notFound()

  const [posts, t, tCat] = await Promise.all([
    getPosts(locale),
    getTranslations("GuidePage"),
    getTranslations("Categories"),
  ])
  const color = getCategoryColor(guide.category)
  const related = guide.relatedPosts
    .map((s) => posts.find((p) => p.slug === s))
    .filter((p) => p !== undefined)
  // Lựa chọn tốt nhất = review điểm cao nhất trong các review guide trỏ tới.
  // Không lấy từ gợi ý cùng danh mục để tránh gợi ý sai loại (VD chuột cho bài
  // về bàn phím).
  const bestPick = [...related].sort((a, b) => b.rating.overall - a.rating.overall)[0]
  // Không có review đúng sản phẩm thì gợi ý review cùng danh mục.
  const suggestions =
    related.length > 0 ? related : posts.filter((p) => p.category === guide.category).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    inLanguage: LOCALE_TAGS[locale],
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: localizedUrl(`/guides/${guide.slug}`, locale),
  }

  return (
    <article className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-border bg-muted/20 border-b">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/guides"
            className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" /> {t("back")}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className="rounded-full px-2.5 py-0.5 font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {tCat(`${guide.category}.name`)}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3.5" /> {formatDate(guide.publishedAt, locale)}
            </span>
          </div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            {guide.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{guide.excerpt}</p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        {bestPick && <BestPickBox post={bestPick} />}

        {/* ── Sections ──────────────────────────────────────── */}
        {guide.sections.map((section, i) => (
          <section key={i} id={`section-${i}`} className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {i + 1}
              </span>
              {section.title}
            </h2>
            {section.content.split("\n\n").map((para, j) => (
              <p key={j} className="text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </section>
        ))}

        {/* ── FAQ ───────────────────────────────────────────── */}
        {guide.faq.length > 0 && (
          <section id="faq" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="text-xl font-bold">{t("faq")}</h2>
            <div className="flex flex-col gap-3">
              {guide.faq.map((item, i) => (
                <div key={i} className="border-border bg-card rounded-2xl border p-5">
                  <h3 className="mb-2 text-sm font-bold">{item.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Related reviews ─────────────────────────────────── */}
      {suggestions.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight">{t("related")}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
