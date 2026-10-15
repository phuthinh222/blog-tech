import type { MetadataRoute } from "next"
import { routing, LOCALE_TAGS } from "@/i18n/routing"
import { getPosts } from "@/lib/content"
import { getGuides } from "@/lib/guides"
import { localizedUrl } from "@/lib/seo"

// /sitemap.xml — mỗi trang 1 mục cho từng ngôn ngữ, kèm hreflang alternates.
// Slug giống nhau giữa các ngôn ngữ nên chỉ cần đọc danh sách tiếng Việt.
export const revalidate = 3600

const STATIC_PAGES = ["/", "/guides", "/categories", "/about", "/contact", "/privacy", "/terms"]

function entries(href: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [LOCALE_TAGS[l], localizedUrl(href, l)])
  )
  return routing.locales.map((locale) => ({
    url: localizedUrl(href, locale),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(routing.defaultLocale)
  const guides = getGuides(routing.defaultLocale)
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))]

  return [
    ...STATIC_PAGES.flatMap((href) => entries(href)),
    ...categories.flatMap((slug) => entries(`/categories/${slug}`)),
    ...posts.flatMap((p) => entries(`/articles/${p.slug}`, p.publishedAt)),
    ...guides.flatMap((g) => entries(`/guides/${g.slug}`, g.publishedAt)),
  ]
}
