import { defineRouting } from "next-intl/routing"

// vi là ngôn ngữ mặc định và giữ nguyên URL cũ (không tiền tố) để không mất
// link/SEO đã có; en và zh có tiền tố /en, /zh.
export const routing = defineRouting({
  locales: ["vi", "en", "zh"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
})

export type Locale = (typeof routing.locales)[number]

// Mã BCP 47 đầy đủ cho <html lang>, hreflang, Intl.* — "zh" trên URL là tiếng
// Trung giản thể.
export const LOCALE_TAGS: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
}

// params.locale trong page/route là string; layout đã chặn locale lạ bằng
// notFound(), nên đây chỉ thu hẹp kiểu (fallback vi cho chắc).
// Không dùng hasLocale của next-intl vì file này cũng được proxy.ts import.
export function toLocale(value: string | undefined): Locale {
  return (routing.locales as readonly string[]).includes(value ?? "")
    ? (value as Locale)
    : routing.defaultLocale
}
