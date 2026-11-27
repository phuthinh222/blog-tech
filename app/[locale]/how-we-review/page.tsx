import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import LegalPage from "@/components/layout/LegalPage"
import { toLocale } from "@/i18n/routing"
import { legalMetadata } from "@/lib/legal"
import { formatDate } from "@/lib/utils"
import { HOW_WE_REVIEW_COPY } from "./copy"

const UPDATED_AT = "2026-11-17"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return legalMetadata(HOW_WE_REVIEW_COPY[locale], "/how-we-review", locale)
}

export default async function HowWeReviewPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const copy = HOW_WE_REVIEW_COPY[locale]

  return (
    <LegalPage
      title={copy.title}
      intro={copy.intro}
      updatedAt={formatDate(UPDATED_AT, locale)}
      sections={copy.sections}
    />
  )
}
