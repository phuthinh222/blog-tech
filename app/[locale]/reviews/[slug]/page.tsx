import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import React from "react"
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  RefreshCw,
  FlaskConical,
  ClipboardList,
  ExternalLink,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LOCALE_TAGS, toLocale } from "@/i18n/routing"
import { getPostBySlug, getPostLocales, getPosts } from "@/lib/content"
import { getGuides } from "@/lib/guides"
import { getCategoryIcon, getCategoryColor, getRatingBreakdown } from "@/lib/categories"
import { formatDate, estimateReadingTime } from "@/lib/utils"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import {
  breadcrumbLd,
  fallbackRobots,
  jsonLdHtml,
  localeAlternates,
  localizedUrl,
  OG_LOCALES,
  ORGANIZATION_LD,
} from "@/lib/seo"
import ArticleCard from "@/components/blog/ArticleCard"
import { AffiliateDisclosure } from "@/components/blog/AffiliateDisclosure"
import { ArticleGallery } from "@/components/blog/ArticleGallery"
import { BookmarkButton } from "@/components/blog/BookmarkButton"
import { Comments } from "@/components/blog/Comments"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { ArticleToc, type TocItem } from "@/components/blog/ArticleToc"
import { ArticleAiSummary } from "@/components/blog/ArticleAiSummary"
import { BuyButtons, buyLinkFor } from "@/components/blog/BuyButton"
import { ComparisonTable } from "@/components/blog/ComparisonTable"
import { StickyBuyBar } from "@/components/blog/StickyBuyBar"
import { NewsletterForm } from "@/components/blog/NewsletterForm"

export const revalidate = 3600 // ISR — content giờ động (Supabase), xem todo.md Phase 2

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return (await getPosts(toLocale(params.locale))).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  const [post, available] = await Promise.all([getPostBySlug(slug, locale), getPostLocales(slug)])
  if (!post) return {}
  const alternates = localeAlternates(`/reviews/${post.slug}`, locale, available)
  const description = post.seo?.metaDescription || post.excerpt
  // Tiêu đề trên Google: ưu tiên metaTitle (viết riêng cho từ khoá, ~60 ký tự,
  // không thêm tên site để khỏi bị cắt); bài chưa có metaTitle thì dùng tiêu đề bài.
  const seoTitle = post.seo?.metaTitle || `${post.title} — ${SITE_NAME}`
  return {
    title: seoTitle,
    description,
    alternates,
    robots: fallbackRobots(locale, available),
    openGraph: {
      url: alternates?.canonical?.toString(),
      siteName: SITE_NAME,
      title: seoTitle,
      description,
      type: "article",
      locale: OG_LOCALES[locale],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

function CategoryIcon({
  category,
  ...props
}: { category: string } & React.SVGProps<SVGSVGElement>) {
  const Icon = getCategoryIcon(category)
  // eslint-disable-next-line react-hooks/static-components
  return <Icon {...props} />
}

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-28 shrink-0 text-xs">{label}</span>
      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-all"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-bold">{score}</span>
    </div>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  setRequestLocale(locale)
  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()

  const [allPosts, t, tNav, tCat, tRating, tCompare] = await Promise.all([
    getPosts(locale),
    getTranslations("ArticlePage"),
    getTranslations("Nav"),
    getTranslations("Categories"),
    getTranslations("Rating"),
    getTranslations("Compare"),
  ])
  const coverColor = getCategoryColor(post.category)
  const categoryName = tCat(`${post.category}.name`)
  const related = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)
  const breakdown = getRatingBreakdown(post.rating, post.category)
  const readingTime = estimateReadingTime(
    locale,
    post.excerpt,
    ...post.sections.map((s) => s.content),
    post.verdict.summary
  )

  const { bestFor = [], notFor = [], alternatives = [], sources = [], regionalNote } = post.extras
  // Bảng nơi mua theo khu vực: chỉ bản tiếng Anh (Amazon US/UK/DE); vi/zh giữ 1
  // nút mua theo sàn của ngôn ngữ đó.
  const showWhereToBuy = locale === "en" && post.amazonLinks.length > 0
  const postSlugs = new Set(allPosts.map((p) => p.slug))

  const tocItems: TocItem[] = [
    ...(post.specs.length > 0 ? [{ id: "specs", label: t("specs") }] : []),
    ...post.sections.map((s, i) => ({ id: `section-${i}`, label: s.title })),
    ...(post.pros.length > 0 || post.cons.length > 0
      ? [{ id: "pros-cons", label: t("prosCons") }]
      : []),
    ...(post.faq && post.faq.length > 0 ? [{ id: "faq", label: t("faq") }] : []),
    { id: "ket-luan", label: t("verdict") },
    ...(showWhereToBuy ? [{ id: "where-to-buy", label: t("whereToBuy") }] : []),
    ...(related.length > 0 ? [{ id: "compare", label: tCompare("title") }] : []),
    ...(alternatives.length > 0 ? [{ id: "alternatives", label: t("alternatives") }] : []),
    ...(sources.length > 0 ? [{ id: "sources", label: t("sources") }] : []),
  ]
  const relatedGuides = getGuides(locale).filter((g) => g.relatedPosts.includes(post.slug))

  const pageUrl = localizedUrl(`/reviews/${post.slug}`, locale)
  const contentLang = LOCALE_TAGS[toLocale(post.contentLocale)]
  const coverUrl = post.coverImage ? new URL(post.coverImage, SITE_URL).href : undefined
  // Bút danh là nhãn của editorial desk, không phải một người riêng lẻ.
  const authorLd = post.authorSlug
    ? {
        "@type": "Organization",
        name: post.author,
        url: localizedUrl(`/authors/${post.authorSlug}`, locale),
      }
    : { "@id": ORGANIZATION_LD["@id"] }
  const articleLd = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: pageUrl,
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    ...(coverUrl && { image: coverUrl }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: contentLang,
    author: authorLd,
    publisher: { "@id": ORGANIZATION_LD["@id"] },
  }
  // Product là node gốc, Review lồng trong `review`. Nếu để Product nằm trong
  // Review.itemReviewed mà không có offers/review/aggregateRating, Google Search
  // Console báo mục Product không hợp lệ ("Phải chỉ định offers, review hoặc
  // aggregateRating"). Không thêm `offers` vì site không hiển thị giá chính xác.
  const productLd = {
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: post.productName,
    description: post.seo?.metaDescription || post.excerpt,
    // Ảnh lưu trong public/ là đường dẫn tương đối — JSON-LD cần URL tuyệt đối.
    ...(coverUrl && { image: coverUrl }),
    review: {
      "@type": "Review",
      "@id": `${pageUrl}#review`,
      url: pageUrl,
      name: post.title,
      reviewBody: post.excerpt,
      reviewRating: {
        "@type": "Rating",
        ratingValue: post.rating.overall,
        bestRating: 10,
        worstRating: 0,
      },
      author: authorLd,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: contentLang,
      publisher: { "@id": ORGANIZATION_LD["@id"] },
    },
  }
  const jsonLd = jsonLdHtml(
    articleLd,
    productLd,
    ORGANIZATION_LD,
    breadcrumbLd(
      [
        { name: tNav("home"), href: "/" },
        { name: tNav("categories"), href: "/categories" },
        { name: categoryName, href: `/categories/${post.category}` },
        { name: post.title, href: `/reviews/${post.slug}` },
      ],
      locale
    )
  )

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ReadingProgress targetId="article-content" />
      {buyLinkFor(post, locale) && <StickyBuyBar post={post} />}
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative flex min-h-105 w-full items-end overflow-hidden sm:min-h-135">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            // Ảnh LCP: preload + fetchpriority=high (priority đã deprecated ở Next 16
            // và không tự gắn fetchpriority).
            preload
            fetchPriority="high"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${coverColor}88 0%, ${coverColor}22 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${coverColor}88 0%, ${coverColor}22 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/10" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pt-24 pb-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">
              {tNav("home")}
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/categories" className="transition-colors hover:text-white/80">
              {tNav("categories")}
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href={`/categories/${post.category}`}
              className="transition-colors hover:text-white/80"
            >
              {categoryName}
            </Link>
          </nav>

          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: `${coverColor}cc` }}
            >
              <CategoryIcon category={post.category} className="size-3" />
              {categoryName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-300">
              <Star className="size-3 fill-yellow-300" />
              {post.rating.overall} / 10
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {post.verdict.recommendation}
            </span>
            <Link
              href="/how-we-review"
              title={t(post.reviewMethod === "tested" ? "methodTestedHint" : "methodCompiledHint")}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                post.reviewMethod === "tested"
                  ? "border-emerald-400/30 bg-emerald-400/20 text-emerald-200"
                  : "border-sky-400/30 bg-sky-400/20 text-sky-200"
              }`}
            >
              {post.reviewMethod === "tested" ? (
                <FlaskConical className="size-3" />
              ) : (
                <ClipboardList className="size-3" />
              )}
              {t(post.reviewMethod === "tested" ? "methodTested" : "methodCompiled")}
            </Link>
          </div>

          <h1 className="max-w-3xl text-2xl leading-tight font-bold text-white sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(post.publishedAt, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="size-3.5" />
              <time dateTime={post.updatedAt.slice(0, 10)}>
                {t("updatedAt", { date: formatDate(post.updatedAt, locale) })}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {t("readingTime", { minutes: readingTime })}
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="size-3.5" />
              <span>
                {t.rich(post.authorSlug ? "byline" : "bylineTeam", {
                  site: SITE_NAME,
                  author: post.author,
                  authorLink: (chunks) => (
                    <Link
                      href={`/authors/${post.authorSlug}`}
                      className="font-semibold underline underline-offset-2 hover:text-white"
                    >
                      {chunks}
                    </Link>
                  ),
                  link: (chunks) => (
                    <Link
                      href="/editorial-policy"
                      className="underline underline-offset-2 hover:text-white"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div id="article-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToList")}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* ── Left: Article Body ───────────────────────────── */}
          <div className="flex min-w-0 flex-col gap-10">
            {/* Công bố liên kết tiếp thị — trước mọi nút/link mua trong bài */}
            <AffiliateDisclosure />

            {/* Bài test thực tế hay tổng hợp — nói rõ ngay đầu bài */}
            <p className="text-muted-foreground -mt-6 flex items-start gap-2 px-1 text-xs leading-relaxed">
              {post.reviewMethod === "tested" ? (
                <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
              ) : (
                <ClipboardList className="mt-0.5 size-3.5 shrink-0 text-sky-500" />
              )}
              <span>
                <strong className="text-foreground font-semibold">
                  {t(post.reviewMethod === "tested" ? "methodTested" : "methodCompiled")}:
                </strong>{" "}
                {t(post.reviewMethod === "tested" ? "methodTestedHint" : "methodCompiledHint")}
              </span>
            </p>

            {/* Lead */}
            <p
              className="text-muted-foreground border-l-4 pl-5 text-lg leading-relaxed"
              style={{ borderColor: coverColor }}
            >
              {post.excerpt}
            </p>

            {/* Hợp với ai / không hợp với ai */}
            {(bestFor.length > 0 || notFor.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: "bestFor", items: bestFor, Icon: ThumbsUp, tone: "emerald" },
                  { key: "notFor", items: notFor, Icon: ThumbsDown, tone: "rose" },
                ]
                  .filter((col) => col.items.length > 0)
                  .map(({ key, items, Icon, tone }) => (
                    <div
                      key={key}
                      className={`border-border bg-card rounded-2xl border p-5 ${
                        tone === "emerald"
                          ? "border-l-4 border-l-emerald-500"
                          : "border-l-4 border-l-rose-500"
                      }`}
                    >
                      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                        <Icon
                          className={`size-4 ${tone === "emerald" ? "text-emerald-500" : "text-rose-500"}`}
                        />
                        {t(key as "bestFor" | "notFor")}
                      </h2>
                      <ul className="flex flex-col gap-2">
                        {items.map((item) => (
                          <li
                            key={item}
                            className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
                          >
                            <span
                              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                                tone === "emerald" ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}

            {/* Image Gallery */}
            {(() => {
              const galleryImages = [post.coverImage, ...(post.images ?? [])].filter(Boolean)
              return galleryImages.length > 1 ? (
                <ArticleGallery images={galleryImages} title={post.title} />
              ) : null
            })()}

            {/* Specs Table */}
            {post.specs.length > 0 && (
              <div
                id="specs"
                className="border-border scroll-mt-24 overflow-hidden rounded-2xl border"
              >
                <div
                  className="flex items-center gap-2 px-5 py-3"
                  style={{
                    background: `linear-gradient(135deg, ${coverColor}22, ${coverColor}08)`,
                  }}
                >
                  <CategoryIcon
                    category={post.category}
                    className="size-4"
                    style={{ color: coverColor }}
                  />
                  <h2
                    className="text-sm font-bold tracking-wider uppercase"
                    style={{ color: coverColor }}
                  >
                    {t("specs")}
                  </h2>
                </div>
                <div className="divide-border divide-y">
                  {post.specs.map((spec) => (
                    <div key={spec.label} className="flex gap-4 px-5 py-3 text-sm">
                      <span className="text-muted-foreground w-28 shrink-0 font-medium sm:w-36">
                        {spec.label}
                      </span>
                      <span className="min-w-0 flex-1 break-words">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Sections */}
            {post.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="flex scroll-mt-24 flex-col gap-4">
                <h2 className="flex items-center gap-3 text-xl font-bold">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: coverColor }}
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

            {/* Pros & Cons */}
            {(post.pros.length > 0 || post.cons.length > 0) && (
              <div id="pros-cons" className="grid scroll-mt-24 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-emerald-600">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                      ✓
                    </span>
                    {t("pros")}
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
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-rose-600">
                    <span className="flex size-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                      ✕
                    </span>
                    {t("cons")}
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
              <section id="faq" className="flex scroll-mt-24 flex-col gap-4">
                <h2 className="text-xl font-bold">{t("faq")}</h2>
                <div className="flex flex-col gap-3">
                  {post.faq.map((item, i) => (
                    <div key={i} className="border-border bg-card rounded-2xl border p-5">
                      <h3 className="mb-2 text-sm font-bold">{item.question}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Verdict */}
            <div
              id="ket-luan"
              className="scroll-mt-24 rounded-2xl border p-6"
              style={{
                background: `linear-gradient(135deg, ${coverColor}12, ${coverColor}06)`,
                borderColor: `${coverColor}33`,
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <h3 className="text-lg font-bold">{t("verdict")}</h3>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-3xl font-black" style={{ color: coverColor }}>
                    {post.rating.overall}
                    <span className="text-muted-foreground text-base font-normal">/10</span>
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-3 leading-relaxed">{post.verdict.summary}</p>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: coverColor }}
              >
                {post.verdict.recommendation}
              </span>
            </div>

            {/* Nơi mua theo khu vực — link tìm sản phẩm ở từng marketplace, không ghi giá */}
            {showWhereToBuy && (
              <section id="where-to-buy" className="flex scroll-mt-24 flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">{t("whereToBuy")}</h2>
                  <p className="text-muted-foreground text-sm">{t("whereToBuyIntro")}</p>
                </div>
                <div className="border-border overflow-hidden rounded-2xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-muted-foreground text-left text-xs tracking-wider uppercase">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          {t("region")}
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          {t("store")}
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <span className="sr-only">{t("checkPrice")}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {post.amazonLinks.map((link) => (
                        <tr key={link.region}>
                          <td className="px-4 py-3 font-medium">{t(`regions.${link.region}`)}</td>
                          <td className="text-muted-foreground px-4 py-3">
                            {new URL(link.url).hostname.replace(/^www\./, "")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="sponsored nofollow noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF9900] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-black transition-colors hover:bg-[#e68a00]"
                            >
                              {t("checkPrice")}
                              <ExternalLink className="size-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {regionalNote ? `${regionalNote} ` : ""}
                  {t("warrantyNote")}
                </p>
              </section>
            )}

            {/* So sánh với sản phẩm cùng danh mục */}
            {related.length > 0 && (
              <section id="compare" className="flex scroll-mt-24 flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">{tCompare("title")}</h2>
                  <p className="text-muted-foreground text-sm">
                    {tCompare("intro", { category: categoryName })}
                  </p>
                </div>
                <ComparisonTable current={post} others={related} />
              </section>
            )}

            {/* Bài hướng dẫn có nhắc tới sản phẩm này (liên kết ngược guide ↔ review) */}
            {relatedGuides.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">{t("relatedGuides")}</h2>
                <div className="flex flex-col gap-2">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group border-border bg-card hover:border-foreground/20 flex items-center gap-3 rounded-xl border p-4 transition-colors"
                    >
                      <BookOpen className="text-primary size-5 shrink-0" />
                      <span className="flex-1 text-sm font-medium group-hover:underline">
                        {guide.title}
                      </span>
                      <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Lựa chọn thay thế (có thể là sản phẩm chưa có bài trên site) */}
            {alternatives.length > 0 && (
              <section id="alternatives" className="flex scroll-mt-24 flex-col gap-3">
                <h2 className="text-xl font-bold">{t("alternatives")}</h2>
                <ul className="flex flex-col gap-2">
                  {alternatives.map((alt) => (
                    <li
                      key={alt.name}
                      className="border-border bg-card flex flex-col gap-1 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold">{alt.name}</span>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {alt.note}
                        </span>
                      </div>
                      {alt.slug && postSlugs.has(alt.slug) && (
                        <Link
                          href={`/reviews/${alt.slug}`}
                          className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
                        >
                          {t("readReview")}
                          <ChevronRight className="size-4" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Nguồn tham khảo */}
            {sources.length > 0 && (
              <section id="sources" className="flex scroll-mt-24 flex-col gap-3">
                <h2 className="text-xl font-bold">{t("sources")}</h2>
                <p className="text-muted-foreground text-sm">{t("sourcesIntro")}</p>
                <ol className="text-muted-foreground flex list-decimal flex-col gap-1.5 pl-5 text-sm">
                  {sources.map((src) => (
                    <li key={src.url}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline-offset-2 hover:underline"
                      >
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <NewsletterForm source={`review:${post.slug}`} />
          </div>

          {/* ── Right: Sidebar ───────────────────────────────── */}
          <aside className="flex flex-col gap-6">
            {/* AI quick summary */}
            <ArticleAiSummary
              rating={post.rating.overall}
              recommendation={post.verdict.recommendation}
              verdictSummary={post.verdict.summary}
              pros={post.pros}
              cons={post.cons}
              faq={post.faq}
              accentColor={coverColor}
            />

            {/* Bookmark */}
            <div className="border-border bg-card flex items-center justify-between rounded-2xl border px-5 py-4">
              <span className="text-sm font-medium">{t("saveArticle")}</span>
              <BookmarkButton slug={post.slug} />
            </div>

            {/* Mua sản phẩm — id để thanh mua dính đáy (mobile) biết khi nào nút này
                đang hiện trên màn hình thì tự ẩn */}
            {buyLinkFor(post, locale) && (
              <div id="buy-box" className="flex flex-col gap-2.5">
                <BuyButtons post={post} className="flex-col" />
              </div>
            )}

            {/* Overall Score */}
            <div className="border-border bg-card rounded-2xl border p-6 text-center">
              <p className="text-muted-foreground mb-2 text-xs font-bold tracking-widest uppercase">
                {t("score")}
              </p>
              <div
                className="text-7xl leading-none font-black tracking-tighter"
                style={{ color: coverColor }}
              >
                {post.rating.overall}
              </div>
              <div className="text-muted-foreground mt-1 text-sm">/ 10</div>
              {post.reviewMethod === "compiled" && (
                <p className="text-muted-foreground mt-3 max-w-64 text-xs leading-relaxed">
                  {t("scoreBasisCompiled")}
                </p>
              )}
              <div className="mt-3 flex justify-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-4 rounded-full"
                    style={{
                      backgroundColor:
                        i < Math.round(post.rating.overall) ? coverColor : `${coverColor}22`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Rating Breakdown */}
            {post.reviewMethod === "tested" && breakdown.length > 0 && (
              <div className="border-border bg-card rounded-2xl border p-5">
                <h3 className="text-muted-foreground mb-4 text-sm font-bold tracking-wider uppercase">
                  {t("breakdown")}
                </h3>
                <div className="flex flex-col gap-3">
                  {breakdown.map((item) => (
                    <RatingBar key={item.key} label={tRating(item.key)} score={item.score} />
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="border-border bg-card rounded-2xl border p-5">
                <h3 className="text-muted-foreground mb-4 text-sm font-bold tracking-wider uppercase">
                  {t("related")}
                </h3>
                <div className="divide-border/60 flex flex-col divide-y">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/reviews/${p.slug}`}
                      className="group flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                        {p.coverImage ? (
                          <Image
                            src={p.coverImage}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(135deg, ${getCategoryColor(p.category)}99, ${getCategoryColor(p.category)}44)`,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors">
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

            {/* Table of contents — cuối sidebar: khi dính (sticky) không còn ô nào
                bên dưới cuộn lên đè vào */}
            <ArticleToc items={tocItems} accentColor={coverColor} />
          </aside>
        </div>

        {/* ── Comments ─────────────────────────────────────── */}
        <Comments slug={post.slug} />

        {/* ── More in Category ─────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-border mt-16 flex flex-col gap-6 border-t pt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-linear-to-b from-violet-500 to-blue-500" />
                <h2 className="text-xl font-bold">{t("moreIn", { category: categoryName })}</h2>
              </div>
              <Link
                href={`/categories/${post.category}`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t("viewAll")} →
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
  )
}
