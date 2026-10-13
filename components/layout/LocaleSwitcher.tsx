"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Check, ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"

// Tên ngôn ngữ viết bằng chính ngôn ngữ đó — người đọc nhận ra ngôn ngữ của
// mình dù đang xem site ở ngôn ngữ nào.
const LOCALE_NAMES: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
}

// Ngôi sao 5 cánh bán kính 1, tâm (0,0) — dùng chung cho cờ VN và CN.
const STAR =
  "0,-1 0.2245,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.2245,-0.309"

function FlagVN() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" fill="#DA251D" />
      <polygon points={STAR} fill="#FFFF00" transform="translate(15 15.8) scale(8)" />
    </svg>
  )
}

function FlagGB() {
  // Phần giữa (30×30) của cờ Union Jack 60×30.
  return (
    <svg viewBox="15 0 30 30" aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

function FlagCN() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" fill="#EE1C25" />
      <g fill="#FFFF00">
        <polygon points={STAR} transform="translate(10 11) scale(5)" />
        <polygon points={STAR} transform="translate(18 5.5) scale(1.6)" />
        <polygon points={STAR} transform="translate(21 9) scale(1.6)" />
        <polygon points={STAR} transform="translate(21 13.5) scale(1.6)" />
        <polygon points={STAR} transform="translate(18 17) scale(1.6)" />
      </g>
    </svg>
  )
}

const FLAGS: Record<Locale, () => React.ReactElement> = {
  vi: FlagVN,
  en: FlagGB,
  zh: FlagCN,
}

function Flag({ locale, className = "size-6" }: { locale: Locale; className?: string }) {
  const Svg = FLAGS[locale]
  return (
    <span
      className={`ring-border/60 inline-flex shrink-0 overflow-hidden rounded-full ring-1 [&>svg]:size-full ${className}`}
    >
      <Svg />
    </span>
  )
}

// Dropdown chọn ngôn ngữ: nút chỉ hiện cờ, mở ra mới hiện cờ + tên. Đổi ngôn ngữ nhưng ở lại đúng trang đang
// xem; next-intl tự ghi cookie NEXT_LOCALE để lần sau vào "/" vẫn nhớ.
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const rootRef = useRef<HTMLDivElement>(null)

  // Đóng khi bấm ra ngoài hoặc nhấn Esc.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function switchTo(next: Locale) {
    setOpen(false)
    if (next === locale) return
    startTransition(() => {
      // pathname từ next-intl đã bỏ tiền tố locale, VD "/articles/iphone-16".
      // Giữ cả query (VD ?q= của trang danh sách).
      router.replace(pathname + window.location.search, { locale: next, scroll: false })
    })
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        className={`border-border bg-background hover:bg-muted flex items-center gap-2 rounded-full border py-1 pr-2.5 pl-1 text-sm font-medium shadow-sm transition-colors ${isPending ? "opacity-60" : ""}`}
      >
        <Flag locale={locale} />
        <ChevronDown
          className={`text-muted-foreground size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="border-border bg-background animate-fade-in-up absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border p-1.5 shadow-xl shadow-black/10"
        >
          {routing.locales.map((l) => {
            const selected = l === locale
            return (
              <li key={l} role="option" aria-selected={selected}>
                <button
                  type="button"
                  lang={l}
                  onClick={() => switchTo(l)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selected ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <Flag locale={l} className="size-7" />
                  <span className="flex-1">{LOCALE_NAMES[l]}</span>
                  {selected && <Check className="text-primary size-4" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
