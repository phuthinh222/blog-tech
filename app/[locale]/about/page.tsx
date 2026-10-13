import {
  Smartphone,
  Monitor,
  Laptop,
  Headphones,
  Target,
  Zap,
  BookOpen,
  Users,
  ArrowRight,
  Mail,
} from "lucide-react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { getCategoryColor } from "@/lib/categories"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"
import { getPosts } from "@/lib/content"
import { localeAlternates } from "@/lib/seo"

// Chữ của từng mục nằm trong messages/*.json, namespace "AboutPage"
// (values.<key>, scoring.<key>); tên chủ đề lấy từ "Categories".
const VALUES = [
  { icon: Target, key: "independent" },
  { icon: Zap, key: "consistent" },
  { icon: BookOpen, key: "honest" },
  { icon: Users, key: "local" },
] as const

const SCORING = ["design", "performance", "battery", "value"] as const

const TOPICS = [
  { icon: Smartphone, category: "phone" },
  { icon: Monitor, category: "monitor" },
  { icon: Laptop, category: "laptop" },
  { icon: Headphones, category: "accessory" },
] as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: "AboutPage" })
  return {
    title: `${t("metaTitle")} — ${SITE_NAME}`,
    description: t("intro"),
    alternates: localeAlternates("/about", locale),
  }
}

export const revalidate = 3600 // ISR — số bài viết lấy từ Supabase

export default async function AboutPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const [posts, t, tCat] = await Promise.all([
    getPosts(locale),
    getTranslations("AboutPage"),
    getTranslations("Categories"),
  ])
  const stats = [
    { value: String(posts.length), label: t("stats.reviews") },
    { value: String(SCORING.length), label: t("stats.criteria") },
    { value: String(TOPICS.length), label: t("stats.topics") },
    { value: "100%", label: t("stats.free") },
  ]

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-border bg-muted/20 border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            {t.rich("heroTitle", {
              site: SITE_NAME,
              highlight: (chunks) => <span className="text-primary">{chunks}</span>,
            })}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Stats ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-border bg-card flex flex-col items-center gap-1 rounded-xl border p-6 text-center"
            >
              <span className="text-4xl font-bold tracking-tight">{s.value}</span>
              <span className="text-muted-foreground text-sm">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Mission ───────────────────────────────────────── */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold tracking-tight">{t("mission.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("mission.p1")}</p>
            <p className="text-muted-foreground leading-relaxed">
              {t("mission.p2", { site: SITE_NAME })}
            </p>
            <p className="text-muted-foreground leading-relaxed">{t("mission.p3")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TOPICS.map(({ icon: Icon, category }) => (
              <Link
                key={category}
                href={`/categories/${category}`}
                className="group border-border bg-card hover:border-foreground/20 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: getCategoryColor(category) }}
                >
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{tCat(`${category}.name`)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Values ────────────────────────────────────────── */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{t("valuesTitle")}</h2>
            <p className="text-muted-foreground">{t("valuesIntro")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, key }) => (
              <div key={key} className="border-border bg-card flex gap-4 rounded-xl border p-5">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{t(`values.${key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`values.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scoring ───────────────────────────────────────── */}
        <section id="phuong-phap-danh-gia" className="flex scroll-mt-24 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{t("scoringTitle")}</h2>
            <p className="text-muted-foreground">{t("scoringIntro")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {SCORING.map((key) => (
              <div
                key={key}
                className="border-border bg-card flex flex-col gap-1 rounded-xl border p-5"
              >
                <h3 className="font-semibold">{t(`scoring.${key}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`scoring.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-border bg-muted/20 flex flex-col gap-2 rounded-xl border p-5">
            <h3 className="font-semibold">{t("commissionTitle")}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("commissionBody")}</p>
          </div>
        </section>

        {/* ── Contact CTA ───────────────────────────────────── */}
        <section className="border-border bg-card flex flex-col items-center gap-5 rounded-2xl border p-10 text-center">
          <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
            <Mail className="size-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground max-w-md">{t("ctaBody", { site: SITE_NAME })}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {t("ctaContact")} <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">{t("ctaRead")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
