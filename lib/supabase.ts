import { createClient, type SupabaseClient } from "@supabase/supabase-js"

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Thiếu biến môi trường ${name} — thêm vào .env.local (local) hoặc Vercel → Project Settings → Environment Variables.`
    )
  }
  return value
}

let adminClient: SupabaseClient | null = null
export function getSupabaseAdmin(): SupabaseClient {
  adminClient ??= createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    requireEnv("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY)
  )
  return adminClient
}

export const supabasePublic = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
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
