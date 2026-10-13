import { createClient } from "@supabase/supabase-js"

// service-role key — bypass RLS. Chỉ dùng cho thao tác nội bộ cần ghi/đọc mọi
// dòng (hiện tại: comments). KHÔNG dùng client này để đọc nội dung public.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// anon/publishable key — tôn trọng RLS, chỉ thấy dữ liệu PUBLISHED
// (xem supabase/migrations/0002_rls_policies.sql). Dùng cho mọi read công khai
// từ Server Component (products/categories/offers/translations) — xem
// README.md mục 4 lưu ý kết nối Supabase.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
