import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LOCALE_TAGS, type Locale } from "@/i18n/routing"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, locale: Locale): string {
  return new Date(dateStr).toLocaleDateString(LOCALE_TAGS[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ~200 từ/phút cho tiếng Việt/Anh. Tiếng Trung không tách từ bằng dấu cách
// nên đếm theo ký tự Hán, ~400 chữ/phút.
export function estimateReadingTime(locale: Locale, ...texts: string[]): number {
  const text = texts.join(" ").trim()
  if (locale === "zh") {
    const hanzi = text.match(/\p{Script=Han}/gu)?.length ?? 0
    return Math.max(1, Math.round(hanzi / 400))
  }
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
