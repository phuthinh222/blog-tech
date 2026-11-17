import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/constants"

// /robots.txt — chặn API và trang cá nhân/đăng nhập, khai báo sitemap của từng
// ngôn ngữ (xem app/sitemap.ts).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/profile", "/vi/profile", "/zh/profile"],
    },
    sitemap: routing.locales.map((l) => `${SITE_URL}/sitemap/${l}.xml`),
    host: SITE_URL,
  }
}
