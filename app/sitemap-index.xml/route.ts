import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/constants"

// /sitemap.xml (rewrite trong next.config.ts → /sitemap-index.xml; không đặt
// thư mục app/sitemap.xml vì trùng route metadata của app/sitemap.ts) — sitemap index trỏ tới sitemap của từng ngôn ngữ (app/sitemap.ts
// dùng generateSitemaps nên không còn tự sinh /sitemap.xml). Giữ URL này vì đã
// nộp trên Google Search Console.
export const dynamic = "force-static"

export function GET() {
  const items = routing.locales
    .map((l) => `  <sitemap><loc>${SITE_URL}/sitemap/${l}.xml</loc></sitemap>`)
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
