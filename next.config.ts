import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/articles", destination: "/categories", permanent: true },
      { source: "/:locale(en|zh)/articles", destination: "/:locale/categories", permanent: true },

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
          source: `/:locale(en|zh)/categories/${from}`,
          destination: to ? `/:locale/categories/${to}` : "/:locale/categories",
          permanent: true,
        },
      ]),
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
      { protocol: "https", hostname: "nhatminhlaptop.com" },
      { protocol: "https", hostname: "cdn2.cellphones.com.vn" },
    ],
  },
}

export default withNextIntl(nextConfig)
