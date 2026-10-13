import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { getPosts, getCategories } from "@/lib/content"
import { CATEGORY_CONFIG, getCategoryIcon, getCategoryColor } from "@/lib/categories"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates } from "@/lib/seo"
import ArticleCard from "@/components/blog/ArticleCard"

function CategoryIcon({
  category,
  ...props
}: { category: string } & React.SVGProps<SVGSVGElement>) {
  const Icon = getCategoryIcon(category)
  // eslint-disable-next-line react-hooks/static-components
  return <Icon {...props} />
}

export const revalidate = 3600 // ISR — content giờ động (Supabase), xem todo.md Phase 2

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return (await getCategories(toLocale(params.locale))).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!CATEGORY_CONFIG[slug]) return {}
  const locale = toLocale(rawLocale)
  const t = await getTranslations({ locale, namespace: "Categories" })
  return {
    title: `${t(`${slug}.name`)} — ${SITE_NAME}`,
    description: t(`${slug}.desc`),
    alternates: localeAlternates(`/categories/${slug}`, locale),
  }
}

export default async function CategoryPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  setRequestLocale(locale)
  const categories = await getCategories(locale)
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) notFound()

  const [t, tCat] = await Promise.all([
    getTranslations("CategoryPage"),
    getTranslations("Categories"),
  ])
  const color = getCategoryColor(slug)
  const desc = tCat(`${slug}.desc`)
  const posts = (await getPosts(locale)).filter((p) => p.category === slug)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-border flex flex-col gap-6 border-b pb-8">
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("allCategories")}
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 8px 24px ${color}44` }}
          >
            <CategoryIcon category={slug} className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
            {desc && <p className="text-muted-foreground max-w-xl">{desc}</p>}
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{t("reviewCount", { count: posts.length })}</p>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed py-24 text-center">
          <CategoryIcon category={slug} className="text-muted-foreground/30 size-10" />
          <p className="text-muted-foreground text-sm font-medium">{t("empty")}</p>
          <Link
            href="/articles"
            className="text-muted-foreground/60 hover:text-foreground text-xs transition-colors"
          >
            {t("viewAllPosts")} →
          </Link>
        </div>
      )}
    </div>
  )
}
