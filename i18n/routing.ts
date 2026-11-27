import { defineRouting } from "next-intl/routing"

// en là ngôn ngữ mặc định (site hướng tới người đọc quốc tế) và không có tiền
// tố URL; vi và zh có tiền tố /vi, /zh. URL tiếng Việt cũ (không tiền tố) được
// chuyển 301 trong next.config.ts.
// localeDetection: false — không tự chuyển theo ngôn ngữ trình duyệt hay cookie
// NEXT_LOCALE; chỉ đổi khi người dùng tự chọn ở LocaleSwitcher (hoặc bấm
// LocaleSuggestBanner).
export const routing = defineRouting({
  locales: ["en", "vi", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

// Ngôn ngữ gốc của nội dung: bài review (content/posts/*.json) và bài hướng dẫn
// được viết bằng tiếng Việt trước, en/zh là bản dịch. Bài chưa có bản dịch ở
// locale đang xem thì hiện bản gốc này (noindex). Khác routing.defaultLocale
// (ngôn ngữ của URL không tiền tố).
export const SOURCE_LOCALE: Locale = "vi"

// Mã BCP 47 đầy đủ cho <html lang>, hreflang, Intl.* — "zh" trên URL là tiếng
// Trung giản thể.
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  vi: "vi-VN",
  zh: "zh-CN",
}

// params.locale trong page/route là string; layout đã chặn locale lạ bằng
// notFound(), nên đây chỉ thu hẹp kiểu (fallback defaultLocale cho chắc).
// Không dùng hasLocale của next-intl vì file này cũng được proxy.ts import.
export function toLocale(value: string | undefined): Locale {
  return (routing.locales as readonly string[]).includes(value ?? "")
    ? (value as Locale)
    : routing.defaultLocale
}
