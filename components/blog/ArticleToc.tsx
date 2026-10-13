"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

export type TocItem = { id: string; label: string }

export function ArticleToc({ items, accentColor }: { items: TocItem[]; accentColor: string }) {
  const t = useTranslations("ArticleToc")
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav
      aria-label={t("label")}
      className="border-border bg-card hidden rounded-2xl border p-5 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col lg:gap-0.5 lg:overflow-y-auto"
    >
      <h3 className="text-muted-foreground mb-2 text-sm font-bold tracking-wider uppercase">
        {t("title")}
      </h3>
      {items.map((item) => {
        const isActive = activeId === item.id
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`relative rounded-lg py-2 pr-3 pl-4 text-sm leading-snug font-medium transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full transition-colors"
              style={{ backgroundColor: isActive ? accentColor : "transparent" }}
            />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
