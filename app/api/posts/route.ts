import { NextResponse } from "next/server"
import { getPosts } from "@/lib/content"

export function GET() {
  return NextResponse.json(getPosts())
}
