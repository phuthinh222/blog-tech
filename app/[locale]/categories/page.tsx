import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { getPosts, getCategories } from "@/lib/content"
import { getCategoryIcon } from "@/lib/categories"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates } from "@/lib/seo"
import ArticleCard from "@/components/blog/ArticleCard"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: "CategoriesPage" })
  return {
    title: `${t("title")} — ${SITE_NAME}`,
    description: t("intro"),
    alternates: localeAlternates("/categories", locale),
  }
}

export const revalidate = 3600 // ISR — content giờ động (Supabase), xem todo.md Phase 2

export default async function CategoriesPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const [posts, categories, t, tCat] = await Promise.all([
    getPosts(locale),
    getCategories(locale),
    getTranslations("CategoriesPage"),
    getTranslations("Categories"),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-border flex flex-col gap-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground max-w-xl">{t("intro")}</p>
      </div>

      {/* ── Category Overview Cards ───────────────────────── */}
      {/* Điện thoại: 2 cột, thẻ gọn (icon cạnh tên); từ sm thẻ đứng như cũ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug)
          return (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="group border-border bg-card hover:border-foreground/20 flex items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-sm sm:flex-col sm:items-start sm:gap-4 sm:p-5"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white sm:size-12"
                style={{ backgroundColor: cat.color }}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
                <h2 className="truncate text-sm font-semibold sm:text-base">{cat.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {t("postCount", { count: cat.count })}
                </p>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground mt-auto hidden items-center gap-1 text-xs font-medium transition-colors sm:flex">
                {t("viewPosts")} <ArrowRight className="size-3" />
              </span>
            </a>
          )
        })}
      </div>

      {/* ── Per-category Sections ─────────────────────────── */}
      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.slug)
        const desc = tCat(`${cat.slug}.desc`)
        const catPosts = posts.filter((p) => p.category === cat.slug)

        return (
          <section key={cat.slug} id={cat.slug} className="flex scroll-mt-20 flex-col gap-6">
            <div className="border-border flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex items-start gap-3 sm:items-center">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <p className="text-muted-foreground max-w-lg text-sm">{desc}</p>
                </div>
              </div>
              <Link
                href={`/articles?category=${cat.slug}`}
                className="text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1 text-sm transition-colors"
              >
                {t("viewAll")} <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
