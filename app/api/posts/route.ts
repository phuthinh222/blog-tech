import { NextResponse, type NextRequest } from "next/server"
import { hasLocale } from "next-intl"
import { getPosts } from "@/lib/content"
import { routing } from "@/i18n/routing"

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("locale")
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  return NextResponse.json(await getPosts(locale))
}
