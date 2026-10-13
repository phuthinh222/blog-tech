import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { getGuides } from "@/lib/guides"
import { getCategoryColor } from "@/lib/categories"
import { formatDate } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates } from "@/lib/seo"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: "GuidesPage" })
  return {
    title: `${t("title")} — ${SITE_NAME}`,
    description: t("metaDescription"),
    alternates: localeAlternates("/guides", locale),
  }
}

export default async function GuidesPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const guides = getGuides(locale)
  const [t, tCat] = await Promise.all([
    getTranslations("GuidesPage"),
    getTranslations("Categories"),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-border flex flex-col gap-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground max-w-xl">{t("intro")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {guides.map((guide) => {
          const color = getCategoryColor(guide.category)
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group border-border bg-card hover:border-foreground/20 flex flex-col gap-3 rounded-2xl border p-6 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="rounded-full px-2.5 py-0.5 font-semibold text-white"
                  style={{ backgroundColor: color }}
                >
                  {tCat(`${guide.category}.name`)}
                </span>
                <span className="text-muted-foreground">
                  {formatDate(guide.publishedAt, locale)}
                </span>
              </div>
              <h2 className="text-lg leading-snug font-bold group-hover:underline">
                {guide.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {guide.excerpt}
              </p>
              <span className="text-primary mt-auto flex items-center gap-1 text-sm font-medium">
                {t("readGuide")} <ChevronRight className="size-4" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
