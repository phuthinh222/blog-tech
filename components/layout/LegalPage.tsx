import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

export type LegalSection = {
  id?: string
  title: string
  content: ReactNode
}

// Nội dung 1 trang tĩnh ở 1 ngôn ngữ — mỗi trang (privacy, terms, contact) có file copy.tsx chứa Record<Locale, LegalCopy>.
export type LegalCopy = {
  title: string
  description: string
  intro: ReactNode
  sections: LegalSection[]
}

type Props = {
  title: string
  intro: ReactNode
  updatedAt: string
  sections: LegalSection[]
}

// Shared shell for the static info pages (privacy, terms, contact, affiliate
// disclosure) — same hero band + content width as app/about/page.tsx.
export default function LegalPage({ title, intro, updatedAt, sections }: Props) {
  const t = useTranslations("Legal")
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-border bg-muted/20 border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{intro}</div>
          <p className="text-muted-foreground text-sm">{t("updatedAt", { date: updatedAt })}</p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        {/* Style link trong nội dung, trừ link dạng <Button asChild> (data-slot=button)
            — không thì chữ nút bị tô màu primary trùng nền nút. */}
        {sections.map(({ id, title: heading, content }) => (
          <section key={heading} id={id} className="flex scroll-mt-24 flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
            <div className="text-muted-foreground [&_a:not([data-slot=button])]:text-primary [&_strong]:text-foreground flex flex-col gap-3 leading-relaxed [&_a:not([data-slot=button])]:underline [&_a:not([data-slot=button])]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc">
              {content}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
