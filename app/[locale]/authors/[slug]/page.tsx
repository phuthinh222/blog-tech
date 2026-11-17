import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ArticleCard from "@/components/blog/ArticleCard"
import { Link } from "@/i18n/navigation"
import { routing, toLocale } from "@/i18n/routing"
import { AUTHORS, getAuthor } from "@/lib/authors"
import { SITE_NAME } from "@/lib/constants"
import { getPosts } from "@/lib/content"
import { jsonLdHtml, localeAlternates, localizedUrl, ORGANIZATION_LD } from "@/lib/seo"

// Trang tác giả cho bút danh biên tập (lib/authors.ts) — ghi rõ đây là bút
// danh của đội ngũ biên tập, liệt kê các bài của danh mục bút danh phụ trách.
export const revalidate = 3600

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => AUTHORS.map((a) => ({ locale, slug: a.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  const author = getAuthor(slug)
  if (!author) return {}
  const t = await getTranslations({ locale, namespace: "AuthorPage" })
  return {
    title: t("metaTitle", { name: author.name, site: SITE_NAME }),
    description: author.bio[locale],
    alternates: localeAlternates(`/authors/${author.slug}`, locale),
  }
}

export default async function AuthorPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params
  const locale = toLocale(rawLocale)
  setRequestLocale(locale)
  const author = getAuthor(slug)
  if (!author) notFound()

  const [posts, t, tCat] = await Promise.all([
    getPosts(locale),
    getTranslations("AuthorPage"),
    getTranslations("Categories"),
  ])
  const reviews = posts.filter((p) => p.authorSlug === author.slug)
  const category = tCat(`${author.category}.name`)
  const jsonLd = jsonLdHtml(
    {
      "@type": "Person",
      name: author.name,
      url: localizedUrl(`/authors/${author.slug}`, locale),
      description: author.bio[locale],
      worksFor: { "@id": ORGANIZATION_LD["@id"] },
    },
    ORGANIZATION_LD
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className="flex max-w-2xl flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">
          {t("penName", { site: SITE_NAME })}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">{author.name}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{author.bio[locale]}</p>
        <p className="text-muted-foreground border-border bg-muted/30 rounded-xl border px-4 py-3 text-sm leading-relaxed">
          {t.rich("note", {
            name: author.name,
            site: SITE_NAME,
            category,
            link: (chunks) => (
              <Link href="/how-we-review" className="text-foreground underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </header>

      {reviews.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">{t("reviews", { name: author.name })}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
