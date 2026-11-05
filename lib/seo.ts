import type { Metadata } from "next"
import { getPathname } from "@/i18n/navigation"
import { routing, LOCALE_TAGS, type Locale } from "@/i18n/routing"
import { SITE_NAME, SITE_URL } from "@/lib/constants"

export const OG_LOCALES: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
  zh: "zh_CN",
}
export function localizedUrl(href: string, locale: Locale): string {
  return SITE_URL + getPathname({ href, locale })
}

// canonical + hreflang cho 1 trang. `available` = các ngôn ngữ có nội dung dịch
// thật (mặc định: mọi ngôn ngữ). Trang đang xem là bản dự phòng (chưa dịch, hiện
// nội dung tiếng Việt) thì canonical trỏ về bản gốc và không có mặt trong
// hreflang — tránh Google coi là trang trùng lặp.
export function localeAlternates(
  href: string,
  locale: Locale,
  available: readonly Locale[] = routing.locales
): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    available.map((l) => [LOCALE_TAGS[l], localizedUrl(href, l)])
  )
  const defaultLocale = available.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (available[0] ?? routing.defaultLocale)
  languages["x-default"] = localizedUrl(href, defaultLocale)
  return {
    canonical: localizedUrl(href, available.includes(locale) ? locale : defaultLocale),
    languages,
  }
}

// Bản dự phòng chưa dịch: không index (vẫn cho bot đi theo link).
export function fallbackRobots(locale: Locale, available: readonly Locale[]): Metadata["robots"] {
  return available.includes(locale) ? undefined : { index: false, follow: true }
}

export const ORGANIZATION_LD = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
} as const

// BreadcrumbList — items theo thứ tự từ trang chủ tới trang hiện tại.
export function breadcrumbLd(items: { name: string; href: string }[], locale: Locale) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedUrl(item.href, locale),
    })),
  }
}

// Gộp nhiều node schema.org vào 1 thẻ <script type="application/ld+json">.
// Escape "<" để chuỗi nội dung không thể đóng thẻ script sớm.
export function jsonLdHtml(...nodes: object[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(
    /</g,
    "\\u003c"
  )
}
