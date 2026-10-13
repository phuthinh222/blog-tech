import type { Metadata } from "next"
import { getPathname } from "@/i18n/navigation"
import { routing, LOCALE_TAGS, type Locale } from "@/i18n/routing"
import { SITE_URL } from "@/lib/constants"

export const OG_LOCALES: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
  zh: "zh_CN",
}

// URL tuyệt đối của 1 trang ở 1 ngôn ngữ, VD ("/guides/x", "en") →
// https://www.zerotech-lab.site/en/guides/x (vi không có tiền tố).
export function localizedUrl(href: string, locale: Locale): string {
  return SITE_URL + getPathname({ href, locale })
}

// canonical + hreflang cho 3 ngôn ngữ (+ x-default trỏ về bản tiếng Việt).
export function localeAlternates(href: string, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [LOCALE_TAGS[l], localizedUrl(href, l)])
  )
  languages["x-default"] = localizedUrl(href, routing.defaultLocale)
  return { canonical: localizedUrl(href, locale), languages }
}
