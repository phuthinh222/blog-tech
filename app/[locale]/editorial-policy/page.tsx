import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import LegalPage from "@/components/layout/LegalPage"
import { toLocale } from "@/i18n/routing"
import { legalMetadata } from "@/lib/legal"
import { formatDate } from "@/lib/utils"
import { EDITORIAL_POLICY_COPY } from "./copy"

const UPDATED_AT = "2026-11-17"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return legalMetadata(EDITORIAL_POLICY_COPY[locale], "/editorial-policy", locale)
}

export default async function EditorialPolicyPage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const copy = EDITORIAL_POLICY_COPY[locale]

  return (
    <LegalPage
      title={copy.title}
      intro={copy.intro}
      updatedAt={formatDate(UPDATED_AT, locale)}
      sections={copy.sections}
    />
  )
}
