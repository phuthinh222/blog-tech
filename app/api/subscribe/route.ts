import { NextResponse, type NextRequest } from "next/server"
import { hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import { getSupabaseAdmin } from "@/lib/supabase"

// Đăng ký nhận bản tin (components/blog/NewsletterForm.tsx) → bảng subscribers
// (migration 0006). Email trùng coi như thành công để không lộ email nào đã
// đăng ký. Trường "website" là bẫy bot (input ẩn, người thật để trống).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: NextRequest) {
  let body: { email?: unknown; locale?: unknown; source?: unknown; website?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true })

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }
  const locale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale
  const source = typeof body.source === "string" ? body.source.slice(0, 100) : null

  const { error } = await getSupabaseAdmin().from("subscribers").insert({ email, locale, source })
  // 23505 = unique_violation (đã đăng ký).
  if (error && error.code !== "23505") {
    console.error("subscribe:", error.message)
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
