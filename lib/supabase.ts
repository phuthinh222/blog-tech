import { createClient, type SupabaseClient } from "@supabase/supabase-js"

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Thiếu biến môi trường ${name} — thêm vào .env.local (local) hoặc Vercel → Project Settings → Environment Variables.`
    )
  }
  return value
}

// secret key (sb_secret_...) — bypass RLS. Chỉ dùng cho thao tác nội bộ cần ghi/đọc mọi
// dòng (hiện tại: comments). KHÔNG dùng client này để đọc nội dung public.
// Tạo lười (lần gọi đầu tiên lúc chạy request) thay vì lúc import module: bước
// "collect page data" khi build có import route /api/comments, nếu tạo client
// ngay thì thiếu key là hỏng cả build.
let adminClient: SupabaseClient | null = null
export function getSupabaseAdmin(): SupabaseClient {
  adminClient ??= createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    requireEnv("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY)
  )
  return adminClient
}

// publishable key (sb_publishable_...) — tôn trọng RLS, chỉ thấy dữ liệu PUBLISHED
// (xem supabase/migrations/0002_rls_policies.sql). Dùng cho mọi read công khai
// từ Server Component (products/categories/offers/translations) — xem
// README.md mục 4 lưu ý kết nối Supabase. Trang nội dung được render lúc build
// nên 2 biến này BẮT BUỘC có ở môi trường build (Vercel).
export const supabasePublic = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
)

export type Comment = {
  id: string
  post_slug: string
  user_id: string
  user_name: string
  user_picture: string | null
  body: string
  created_at: string
}
