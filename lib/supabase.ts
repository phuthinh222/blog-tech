import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
