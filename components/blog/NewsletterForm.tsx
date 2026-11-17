"use client"

import { useState } from "react"
import { Mail, Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

type Status = "idle" | "sending" | "done" | "error"

// Khối "nhận bản tin qua email" — trang chủ, cuối bài review. `source` ghi lại
// nơi đăng ký (VD "home", "review:<slug>") để biết vị trí nào hiệu quả.
export function NewsletterForm({ source, className = "" }: { source: string; className?: string }) {
  const t = useTranslations("Newsletter")
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const website = new FormData(e.currentTarget).get("website")
    setStatus("sending")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source, website }),
      })
      setStatus(res.ok ? "done" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      className={`border-border bg-card flex flex-col gap-4 rounded-2xl border p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Mail className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{t("body")}</p>
        </div>
      </div>

      {status === "done" ? (
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-600" role="status">
          <Check className="size-4" />
          {t("done")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`newsletter-${source}`} className="sr-only">
            {t("label")}
          </label>
          <input
            id={`newsletter-${source}`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            className="border-border bg-background focus-visible:ring-primary min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus-visible:ring-2"
          />
          {/* Bẫy bot — ẩn với người dùng và trình đọc màn hình */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-sm text-rose-600" role="alert">
          {t("error")}
        </p>
      )}
      <p className="text-muted-foreground text-xs">
        {t.rich("privacy", {
          link: (chunks) => (
            <Link href="/privacy" className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </section>
  )
}
