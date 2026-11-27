import type { MetadataRoute } from "next"
import { routing, LOCALE_TAGS, toLocale, type Locale } from "@/i18n/routing"
import { getPosts } from "@/lib/content"
import { AUTHORS } from "@/lib/authors"
import { getGuides } from "@/lib/guides"
import { localizedUrl } from "@/lib/seo"

// Mỗi ngôn ngữ 1 sitemap riêng: /sitemap/en.xml, /sitemap/vi.xml, /sitemap/zh.xml
// (khai báo cả ba trong robots.txt, nộp từng cái vào Google Search Console).
// Mỗi mục vẫn kèm hreflang alternates trỏ sang các bản dịch khác.
// Bài review/hướng dẫn chỉ có mặt trong sitemap của ngôn ngữ đã dịch thật: bản
// dự phòng (nội dung tiếng Việt gốc dưới URL /, /zh) là noindex.
export const revalidate = 3600

const STATIC_PAGES = [
  "/",
  "/guides",
  "/categories",
  "/about",
  "/how-we-review",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/contact",
  "/privacy",
  "/terms",
]

export function generateSitemaps() {
  return routing.locales.map((id) => ({ id }))
}

function entry(
  href: string,
  locale: Locale,
  locales: readonly Locale[] = routing.locales,
  lastModified?: string
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [LOCALE_TAGS[l], localizedUrl(href, l)])
  )
  const xDefault = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0]
  if (xDefault) languages["x-default"] = localizedUrl(href, xDefault)
  return {
    url: localizedUrl(href, locale),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: { languages },
  }
}

// slug → { các ngôn ngữ có bản dịch, ngày cập nhật }.
function translatedLocales<
  T extends { slug: string; contentLocale: string; publishedAt: string; updatedAt?: string },
>(byLocale: T[][]) {
  const map = new Map<string, { locales: Locale[]; modified: string }>()
  routing.locales.forEach((locale, i) => {
    for (const item of byLocale[i]) {
      if (item.contentLocale !== locale) continue
      const entry = map.get(item.slug) ?? {
        locales: [],
        modified: item.updatedAt ?? item.publishedAt,
      }
      entry.locales.push(locale)
      map.set(item.slug, entry)
    }
  })
  return map
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const locale = toLocale(await props.id)
  const postsByLocale = await Promise.all(routing.locales.map((l) => getPosts(l)))
  const guidesByLocale = routing.locales.map((l) => getGuides(l))
  const posts = translatedLocales(postsByLocale)
  const guides = translatedLocales(guidesByLocale)
  const categories = [...new Set(postsByLocale[0].map((p) => p.category).filter(Boolean))]

  return [
    ...STATIC_PAGES.map((href) => entry(href, locale)),
    ...categories.map((slug) => entry(`/categories/${slug}`, locale)),
    ...AUTHORS.map((a) => entry(`/authors/${a.slug}`, locale)),
    ...[...posts]
      .filter(([, p]) => p.locales.includes(locale))
      .map(([slug, p]) => entry(`/reviews/${slug}`, locale, p.locales, p.modified)),
    ...[...guides]
      .filter(([, g]) => g.locales.includes(locale))
      .map(([slug, g]) => entry(`/guides/${slug}`, locale, g.locales, g.modified)),
  ]
}
