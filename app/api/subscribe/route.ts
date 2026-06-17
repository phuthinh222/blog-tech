import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 })
  }

  /* Lưu vào Supabase — bỏ qua nếu đã tồn tại */
  const { error: dbError } = await supabase
    .from("subscribers")
    .insert({ email })
    .select()
    .single()

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "Email này đã đăng ký rồi." }, { status: 409 })
    }
    return NextResponse.json({ error: "Không thể lưu email." }, { status: 500 })
  }

  /* Gửi email chào mừng */
  const from = process.env.RESEND_FROM_EMAIL ?? "The Zero Tech <noreply@thezerotechvn.com>"
  await resend.emails.send({
    from,
    to: email,
    subject: "Chào mừng bạn đến với The Zero Tech!",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0f0f12;color:#e5e7eb;border-radius:16px;">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">Cảm ơn bạn đã đăng ký! 🎉</h1>
        <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;">
          Bạn sẽ nhận được thông báo khi có đánh giá mới về điện thoại, màn hình, laptop và phụ kiện từ The Zero Tech.
        </p>
        <a href="${process.env.APP_BASE_URL ?? "https://thezerotechvn.com"}/articles"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;">
          Xem đánh giá mới nhất →
        </a>
        <p style="color:#6b7280;font-size:12px;margin:24px 0 0;">
          Bạn nhận được email này vì đã đăng ký tại The Zero Tech. Để hủy đăng ký, hãy liên hệ chúng tôi.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
