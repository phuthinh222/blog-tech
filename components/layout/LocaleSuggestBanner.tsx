"use client"

import { useState, useSyncExternalStore } from "react"
import { useLocale } from "next-intl"
import { X } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"

// Chữ viết bằng chính ngôn ngữ được gợi ý (người đọc chưa hiểu ngôn ngữ trang
// đang hiện), nên để ở đây thay vì messages/*.json của locale hiện tại.
const COPY: Record<Locale, { text: string; action: string; close: string }> = {
  vi: { text: "Trang này có bản tiếng Việt.", action: "Xem bằng tiếng Việt", close: "Đóng" },
  en: { text: "This page is available in English.", action: "View in English", close: "Close" },
  zh: { text: "本页面提供中文版本。", action: "查看中文版", close: "关闭" },
}

const DISMISS_KEY = "locale-banner-dismissed"

// Ngôn ngữ ưa thích đầu tiên của trình duyệt mà site hỗ trợ.
function preferredLocale(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0]
    if ((routing.locales as readonly string[]).includes(base)) return base as Locale
  }
  return null
}

function suggestionFor(current: Locale): Locale | null {
  try {
    if (localStorage.getItem(DISMISS_KEY) === "1") return null
  } catch {}
  const preferred = preferredLocale()
  return preferred && preferred !== current ? preferred : null
}

const noopSubscribe = () => () => {}

// Banner gợi ý chuyển ngôn ngữ — KHÔNG tự redirect theo IP/trình duyệt
// (localeDetection: false trong i18n/routing.ts). Dẫn sang đúng trang tương ứng
// ở ngôn ngữ kia; đóng thì nhớ lựa chọn trên trình duyệt này.
export function LocaleSuggestBanner() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const [dismissed, setDismissed] = useState(false)
  // Đọc navigator/localStorage chỉ ở client; lúc render server và hydrate trả
  // null (không banner) nên không lệch HTML.
  const suggestion = useSyncExternalStore(
    noopSubscribe,
    () => suggestionFor(locale),
    () => null
  )
  const suggested = dismissed ? null : suggestion

  if (!suggested) return null
  const copy = COPY[suggested]

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {}
    setDismissed(true)
  }

  return (
    <div
      lang={suggested}
      role="region"
      aria-label={copy.action}
      className="border-border bg-muted/60 border-b text-sm backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="text-muted-foreground min-w-0 flex-1">
          {copy.text}{" "}
          <Link
            href={pathname}
            locale={suggested}
            onClick={dismiss}
            className="text-foreground font-semibold underline underline-offset-2"
          >
            {copy.action} →
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.close}
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
