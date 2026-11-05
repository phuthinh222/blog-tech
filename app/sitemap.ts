import type { MetadataRoute } from "next"
import { routing, LOCALE_TAGS, type Locale } from "@/i18n/routing"
import { getPosts } from "@/lib/content"
import { getGuides } from "@/lib/guides"
import { localizedUrl } from "@/lib/seo"

// /sitemap.xml — mỗi trang 1 mục cho từng ngôn ngữ, kèm hreflang alternates.
// Bài review/hướng dẫn chỉ đưa vào ở những ngôn ngữ đã có bản dịch thật: bản
// dự phòng (hiện nội dung tiếng Việt dưới URL /en, /zh) là noindex nên không
// được nằm trong sitemap hay hreflang.
export const revalidate = 3600

const STATIC_PAGES = ["/", "/guides", "/categories", "/about", "/contact", "/privacy", "/terms"]

function entries(
  href: string,
  locales: readonly Locale[] = routing.locales,
  lastModified?: string
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [LOCALE_TAGS[l], localizedUrl(href, l)]))
  return locales.map((locale) => ({
    url: localizedUrl(href, locale),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: { languages },
  }))
}

// slug → { các ngôn ngữ có bản dịch, ngày đăng }.
function translatedLocales<T extends { slug: string; contentLocale: string; publishedAt: string }>(
  byLocale: T[][]
) {
  const map = new Map<string, { locales: Locale[]; publishedAt: string }>()
  routing.locales.forEach((locale, i) => {
    for (const item of byLocale[i]) {
      if (item.contentLocale !== locale) continue
      const entry = map.get(item.slug) ?? { locales: [], publishedAt: item.publishedAt }
      entry.locales.push(locale)
      map.set(item.slug, entry)
    }
  })
  return map
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await Promise.all(routing.locales.map((l) => getPosts(l)))
  const guidesByLocale = routing.locales.map((l) => getGuides(l))
  const posts = translatedLocales(postsByLocale)
  const guides = translatedLocales(guidesByLocale)
  const categories = [...new Set(postsByLocale[0].map((p) => p.category).filter(Boolean))]

  return [
    ...STATIC_PAGES.flatMap((href) => entries(href)),
    ...categories.flatMap((slug) => entries(`/categories/${slug}`)),
    ...[...posts].flatMap(([slug, p]) => entries(`/articles/${slug}`, p.locales, p.publishedAt)),
    ...[...guides].flatMap(([slug, g]) => entries(`/guides/${slug}`, g.locales, g.publishedAt)),
  ]
}
