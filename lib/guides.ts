import fs from "node:fs"
import path from "node:path"
import { cache } from "react"
import { routing, SOURCE_LOCALE, type Locale } from "@/i18n/routing"
import type { Guide } from "@/types"

// Bài hướng dẫn là nội dung biên tập tĩnh, đọc thẳng từ repo (không qua
// Supabase): content/guides/<locale>/<slug>.json. Danh sách bài lấy theo thư
// mục tiếng Việt (gốc); bài nào chưa có bản dịch ở locale đang xem thì dùng
// bản tiếng Việt.
const GUIDES_DIR = path.join(process.cwd(), "content", "guides")

function readGuide(locale: Locale, file: string): Guide | null {
  const filePath = path.join(GUIDES_DIR, locale, file)
  if (!fs.existsSync(filePath)) return null
  const guide = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Omit<Guide, "contentLocale">
  return { ...guide, contentLocale: locale }
}

// Các ngôn ngữ đã có file dịch của 1 bài hướng dẫn — dùng cho hreflang/canonical.
export const getGuideLocales = cache((slug: string): Locale[] =>
  routing.locales.filter((l) => getGuides(l).some((g) => g.slug === slug && g.contentLocale === l))
)

export const getGuides = cache((locale: Locale): Guide[] => {
  const baseDir = path.join(GUIDES_DIR, SOURCE_LOCALE)
  if (!fs.existsSync(baseDir)) return []
  return fs
    .readdirSync(baseDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readGuide(locale, file) ?? readGuide(SOURCE_LOCALE, file))
    .filter((guide): guide is Guide => guide !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
})

export const getGuideBySlug = cache(
  (slug: string, locale: Locale): Guide | null =>
    getGuides(locale).find((guide) => guide.slug === slug) ?? null
)
