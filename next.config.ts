import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Đọc i18n/request.ts (cấu hình next-intl: locale + messages theo request).
const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // Trang danh sách "Đánh giá" (/articles) đã gộp vào /categories; giữ query
  // (?q=, ?category=) để link cũ/SEO vẫn đúng. /articles/<slug> không đổi.
  async redirects() {
    return [
      { source: "/articles", destination: "/categories", permanent: true },
      { source: "/:locale(en|zh)/articles", destination: "/:locale/categories", permanent: true },
      // Danh mục cũ (10/2026 đổi sang 4 danh mục mới) → danh mục mới gần nhất.
      ...Object.entries({
        phone: "",
        monitor: "pc-laptop",
        laptop: "pc-laptop",
        accessory: "desk-setup",
        audio: "audio-video",
      }).flatMap(([from, to]) => [
        // to rỗng = danh mục bị bỏ hẳn → về trang tất cả danh mục.
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
    // Mặc định Next dùng (số nhân CPU - 1) worker khi build — máy 16 nhân là
    // 15 tiến trình Node song song, dễ hết RAM. 4 là đủ cho site cỡ này.
    cpus: 4,
    // Turbopack là Rust, KHÔNG bị NODE_OPTIONS giới hạn. Đặt trần để nó tự dọn
    // cache khi vượt ~1.5 GB thay vì phình mãi.
    turbopackMemoryLimit: 1536 * 1024 * 1024,
    // Mặc định Turbopack chạy PostCSS/Tailwind trong nhiều TIẾN TRÌNH Node con
    // (mỗi cái một V8 heap riêng, ~100-200 MB) — lần chạy 13/10 lên 79 tiến
    // trình / 2.5 GB trong 47 giây. Worker threads dùng chung một tiến trình.
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  images: {
    // Dev: bỏ tối ưu ảnh (encode AVIF/WebP bằng sharp rất tốn RAM/CPU mỗi lần
    // tải trang). Production vẫn tối ưu như cũ.
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
