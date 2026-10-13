"use client"

import { useEffect, useState } from "react"
import { Sparkles, X, ChevronDown, Check, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

type Faq = { question: string; answer: string }

type Props = {
  rating: number
  recommendation: string
  verdictSummary: string
  pros: string[]
  cons: string[]
  faq?: Faq[]
  accentColor: string
}

export function ArticleAiSummary({
  rating,
  recommendation,
  verdictSummary,
  pros,
  cons,
  faq = [],
  accentColor,
}: Props) {
  const t = useTranslations("AiSummary")
  const [open, setOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-border bg-card group flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors hover:border-violet-500/40"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-500/25">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t("title")}</p>
          <p className="text-muted-foreground text-xs">{t("subtitle")}</p>
        </div>
        <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center bg-black/60 px-4 pt-[8vh] backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("dialogLabel")}
            className="border-border bg-background flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl"
          >
            {/* Header */}
            <div className="border-border flex items-start gap-3 border-b px-5 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-500/25">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{t("title")}</p>
                <p className="text-muted-foreground text-xs">{t("generatedNote")}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="border-border text-muted-foreground hover:bg-muted flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors"
                aria-label={t("close")}
              >
                <X className="size-3" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-2xl font-black" style={{ color: accentColor }}>
                  {rating}
                  <span className="text-muted-foreground text-sm font-normal">/10</span>
                </span>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {recommendation}
                </span>
              </div>

              <p className="border-border/60 text-foreground mb-6 border-l-4 pl-4 text-sm leading-relaxed italic">
                {verdictSummary}
              </p>

              {pros.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-emerald-600 uppercase">
                    {t("highlights")}
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {pros.slice(0, 3).map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm leading-relaxed">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cons.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-rose-600 uppercase">
                    {t("caveats")}
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {cons.slice(0, 2).map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {faq.length > 0 && (
                <div>
                  <h4 className="text-muted-foreground mb-2 text-xs font-bold tracking-wider uppercase">
                    {t("quickQa")}
                  </h4>
                  <div className="border-border divide-border divide-y rounded-xl border">
                    {faq.map((item, i) => {
                      const isOpen = openFaq === i
                      return (
                        <div key={item.question}>
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : i)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium"
                          >
                            {item.question}
                            <ChevronDown
                              className={`text-muted-foreground size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {isOpen && (
                            <p className="text-muted-foreground px-4 pb-3 text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
