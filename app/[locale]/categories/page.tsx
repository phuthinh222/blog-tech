import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { toLocale } from "@/i18n/routing"
import { getPosts, getCategories } from "@/lib/content"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates } from "@/lib/seo"
import { ArticlesList } from "@/components/blog/ArticlesList"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string }>
}

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

export default async function CategoriesPage({ params, searchParams }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const query = await searchParams
  const [posts, categories, t] = await Promise.all([
    getPosts(locale),
    getCategories(locale),
    getTranslations("CategoriesPage"),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-border flex flex-col gap-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground max-w-xl">{t("intro")}</p>
      </div>

      {/* ── Tất cả bài viết: lọc theo danh mục + từ khoá (?category=, ?q=) ── */}
      <ArticlesList
        posts={posts}
        categories={categories}
        initialQuery={query.q ?? ""}
        initialCategory={query.category ?? ""}
      />
    </div>
  )
}
