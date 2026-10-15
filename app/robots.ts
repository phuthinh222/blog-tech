import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

// /robots.txt — chặn API và trang cá nhân/đăng nhập, trỏ tới sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/profile", "/en/profile", "/zh/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
