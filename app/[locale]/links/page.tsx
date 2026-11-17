import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, BookOpen, LayoutGrid, Mail, ShieldCheck, Star } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPathname } from "@/i18n/navigation"
import { toLocale, type Locale } from "@/i18n/routing"
import { SITE_NAME } from "@/lib/constants"
import { getPosts } from "@/lib/content"
import { localeAlternates } from "@/lib/seo"

// /links (vi), /en/links, /zh/links — trang "link in bio" cho TikTok, Facebook,
// Pinterest, YouTube… Mỗi nút gắn UTM để GA4 tách được lượt đến từ trang này.
// Không index (trang chỉ có link), không có trong sitemap.
export const revalidate = 3600

const UTM = { utm_source: "bio", utm_medium: "social", utm_campaign: "link_in_bio" }

function withUtm(href: string, locale: Locale, content: string): string {
  const params = new URLSearchParams({ ...UTM, utm_content: content })
  const [path, hash] = getPathname({ href, locale }).split("#")
  return `${path}?${params}${hash ? `#${hash}` : ""}`
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: "LinksPage" })
  return {
    title: `${t("title")} — ${SITE_NAME}`,
    description: t("intro"),
    alternates: localeAlternates("/links", locale),
    robots: { index: false, follow: true },
  }
}

export default async function LinksPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const [posts, t] = await Promise.all([getPosts(locale), getTranslations("LinksPage")])
  const latest = posts.slice(0, 5)

  const mainLinks = [
    { href: "/", key: "home", icon: Star },
    { href: "/guides", key: "guides", icon: BookOpen },
    { href: "/categories", key: "categories", icon: LayoutGrid },
    { href: "/how-we-review", key: "method", icon: ShieldCheck },
    { href: "/contact", key: "contact", icon: Mail },
  ] as const

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <Image src="/logo.png" alt={SITE_NAME} width={72} height={72} className="rounded-2xl" />
        <h1 className="text-2xl font-bold">{SITE_NAME}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{t("intro")}</p>
      </header>

      <nav className="flex flex-col gap-3" aria-label={t("title")}>
        {mainLinks.map(({ href, key, icon: Icon }) => (
          <a
            key={key}
            href={withUtm(href, locale, key)}
            className="border-border bg-card hover:border-foreground/20 hover:bg-muted flex items-center gap-3 rounded-2xl border px-5 py-4 font-semibold transition-colors"
          >
            <Icon className="text-primary size-5 shrink-0" />
            <span className="flex-1">{t(`links.${key}`)}</span>
            <ArrowUpRight className="text-muted-foreground size-4" />
          </a>
        ))}
      </nav>

      {latest.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {t("latest")}
          </h2>
          {latest.map((post) => (
            <a
              key={post.slug}
              href={withUtm(`/reviews/${post.slug}`, locale, `review_${post.slug}`)}
              className="border-border bg-card hover:border-foreground/20 hover:bg-muted flex items-center gap-3 rounded-2xl border p-3 transition-colors"
            >
              {post.coverImage && (
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </span>
              )}
              <span className="line-clamp-2 flex-1 text-sm font-semibold">{post.title}</span>
            </a>
          ))}
        </section>
      )}
    </div>
  )
}
