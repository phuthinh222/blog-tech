import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth0.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { user } = session

  const { data: comment } = await getSupabaseAdmin()
    .from("comments")
    .select("user_id")
    .eq("id", id)
    .single()

  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (comment.user_id !== user.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await getSupabaseAdmin().from("comments").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
