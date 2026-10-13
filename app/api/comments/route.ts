import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const { data, error } = await getSupabaseAdmin()
    .from("comments")
    .select("*")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth0.getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let slug: string, body: string
  try {
    const json = await req.json()
    slug = json.slug
    body = json.body
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
  if (!slug || typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const { user } = session
  const { data, error } = await getSupabaseAdmin()
    .from("comments")
    .insert({
      post_slug: slug,
      user_id: user.sub,
      user_name: user.name ?? user.email ?? "Ẩn danh",
      user_picture: user.picture ?? null,
      body: body.trim(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
