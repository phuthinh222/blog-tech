import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { getPosts } from "@/lib/content"
import { getGuides } from "@/lib/guides"

// /llms.txt (https://llmstxt.org) — bản tóm tắt Markdown của site cho mô hình
// ngôn ngữ: H1 tên site, đoạn mô tả, rồi danh sách link chính (danh mục, bài
// review, hướng dẫn, trang chính sách). Dùng bản tiếng Anh (ngôn ngữ mặc định).
// Làm mới theo chu kỳ giống trang review.
export const revalidate = 3600

const locale = routing.defaultLocale

export async function GET() {
  const [posts, tCat] = await Promise.all([
    getPosts(locale),
    getTranslations({ locale, namespace: "Categories" }),
  ])
  const guides = getGuides(locale)
  const url = (path: string) => `${SITE_URL}${path}`
  const line = (title: string, path: string, note?: string) =>
    `- [${title}](${url(path)})${note ? `: ${note.replace(/\s+/g, " ").trim()}` : ""}`

  const categories = Object.keys(CATEGORY_CONFIG).map((slug) =>
    line(tCat(`${slug}.name`), `/categories/${slug}`, tCat(`${slug}.desc`))
  )

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> Independent tech reviews, buying guides and comparisons for desk setups, gaming gear, PCs, monitors and audio. Reviews are research roundups based on manufacturer specifications and named third-party sources unless a review says it was tested in person. Content is available in English (default), Vietnamese (/vi) and Chinese (/zh).`,
    "",
    "## Categories",
    "",
    ...categories,
    "",
    "## Reviews",
    "",
    ...posts.map((p) => line(p.title, `/reviews/${p.slug}`, p.verdict.summary || p.excerpt)),
    "",
    "## Buying guides",
    "",
    ...guides.map((g) => line(g.title, `/guides/${g.slug}`, g.excerpt)),
    "",
    "## About and policies",
    "",
    line("About", "/about"),
    line("How we review", "/how-we-review"),
    line("Editorial policy", "/editorial-policy"),
    line("Affiliate disclosure", "/affiliate-disclosure"),
    line("Contact", "/contact"),
    "",
    "## Optional",
    "",
    line("Sitemap", "/sitemap.xml"),
    line("Vietnamese edition", "/vi"),
    line("Chinese edition", "/zh"),
    "",
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
