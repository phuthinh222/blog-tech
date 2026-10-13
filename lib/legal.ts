import type { Metadata } from "next"
import type { LegalCopy } from "@/components/layout/LegalPage"
import type { Locale } from "@/i18n/routing"
import { SITE_NAME } from "@/lib/constants"
import { localeAlternates } from "@/lib/seo"

export function legalMetadata(copy: LegalCopy, href: string, locale: Locale): Metadata {
  return {
    title: `${copy.title} — ${SITE_NAME}`,
    description: copy.description,
    alternates: localeAlternates(href, locale),
  }
}
