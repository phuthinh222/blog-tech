import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import SLUG_REDIRECTS from "./lib/slug-redirects.json"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // /sitemap.xml (đã nộp trên Google Search Console) → sitemap index trỏ tới
  // /sitemap/<locale>.xml. Next không tự sinh index khi dùng generateSitemaps.
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/sitemap-index.xml" }]
  },
  async redirects() {
    // 301 cho URL cũ (trước khi đổi tiếng Anh thành ngôn ngữ mặc định):
    // - /articles/<slug> (tiếng Việt, không tiền tố) → /vi/reviews/<slug mới>
    // - /en/articles/<slug> → /reviews/<slug mới>; /zh/articles/<slug> → /zh/reviews/<slug mới>
    // - /en/* → /* (en giờ không có tiền tố)
    // Next dùng quy tắc khớp đầu tiên → slug cụ thể đứng trước quy tắc chung,
    // /en/articles đứng trước /en/:path*.
    const bySlug = Object.entries(SLUG_REDIRECTS).flatMap(([from, to]) => [
      { source: `/en/articles/${from}`, destination: `/reviews/${to}`, permanent: true },
      { source: `/zh/articles/${from}`, destination: `/zh/reviews/${to}`, permanent: true },
      { source: `/articles/${from}`, destination: `/vi/reviews/${to}`, permanent: true },
      // Slug cũ dưới đường dẫn mới (link nội bộ/chia sẻ tạo trong lúc chuyển đổi).
      { source: `/reviews/${from}`, destination: `/reviews/${to}`, permanent: true },
      {
        source: `/:locale(vi|zh)/reviews/${from}`,
        destination: `/:locale/reviews/${to}`,
        permanent: true,
      },
    ])

    return [
      ...bySlug,
      { source: "/en/articles/:slug", destination: "/reviews/:slug", permanent: true },
      { source: "/zh/articles/:slug", destination: "/zh/reviews/:slug", permanent: true },
      { source: "/articles/:slug", destination: "/vi/reviews/:slug", permanent: true },
      { source: "/en/articles", destination: "/categories", permanent: true },
      { source: "/zh/articles", destination: "/zh/categories", permanent: true },
      { source: "/articles", destination: "/vi/categories", permanent: true },
      { source: "/:locale(vi|zh)/reviews", destination: "/:locale/categories", permanent: true },
      { source: "/reviews", destination: "/categories", permanent: true },

      ...Object.entries({
        phone: "",
        monitor: "pc-laptop",
        laptop: "pc-laptop",
        accessory: "desk-setup",
        audio: "audio-video",
      }).flatMap(([from, to]) => [
        {
          source: `/categories/${from}`,
          destination: to ? `/categories/${to}` : "/categories",
          permanent: true,
        },
        {
          source: `/:locale(en|vi|zh)/categories/${from}`,
          destination: to ? `/:locale/categories/${to}` : "/:locale/categories",
          permanent: true,
        },
      ]),

      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ]
  },
  experimental: {
    inlineCss: true,
    cpus: 4,
    turbopackMemoryLimit: 1536 * 1024 * 1024,
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "down-vn.img.susercontent.com" },
      { protocol: "https", hostname: "sg-11134275-8260s.susercontent.com" },
      { protocol: "https", hostname: "cdn2.cellphones.com.vn" },
    ],
  },
}

export default withNextIntl(nextConfig)
