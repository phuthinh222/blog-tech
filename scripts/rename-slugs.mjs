// Đổi slug sản phẩm trên Supabase theo lib/slug-redirects.json (slug cũ → slug
// mới). Giữ nguyên id nên bản dịch, offer, lượt click không đổi. Đồng thời sửa
// cột author cũ ("The Zero Tech") thành tên site hiện tại.
//
//   node --env-file=.env scripts/rename-slugs.mjs            # dry-run
//   node --env-file=.env scripts/rename-slugs.mjs --commit   # ghi thật
//
// Chạy NGAY khi deploy bản code có route /reviews + redirect 301 (next.config.ts),
// và TRƯỚC import-content.mjs — import theo slug mới khi DB còn slug cũ sẽ tạo
// sản phẩm trùng. Idempotent: slug đã đổi thì bỏ qua.

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MAP = JSON.parse(
  readFileSync(path.join(__dirname, "..", "lib", "slug-redirects.json"), "utf8")
)
const COMMIT = process.argv.includes("--commit")
const SITE_NAME = "Zero Technology"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY")
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })

async function main() {
  const { data, error } = await supabase.from("products").select("id, slug")
  if (error) throw error
  const bySlug = new Map(data.map((p) => [p.slug, p.id]))

  for (const [from, to] of Object.entries(MAP)) {
    if (bySlug.has(to)) {
      console.log(`= ${to} (đã đổi)`)
      continue
    }
    if (!bySlug.has(from)) {
      console.log(`? ${from}: không có trên Supabase — bỏ qua`)
      continue
    }
    console.log(`${COMMIT ? "✓" : "→"} ${from} → ${to}`)
    if (COMMIT) {
      const { error: e } = await supabase.from("products").update({ slug: to }).eq("slug", from)
      if (e) throw e
    }
  }

  const { data: stale, error: authorErr } = await supabase
    .from("product_translations")
    .select("id")
    .neq("author", SITE_NAME)
  if (authorErr) throw authorErr
  console.log(`${stale.length} bản dịch có author khác "${SITE_NAME}"`)
  if (COMMIT && stale.length) {
    const { error: e } = await supabase
      .from("product_translations")
      .update({ author: SITE_NAME })
      .neq("author", SITE_NAME)
    if (e) throw e
    console.log("✓ Đã sửa author")
  }
  if (!COMMIT) console.log("\nDry-run xong. Thêm --commit để ghi thật.")
}

main().catch((err) => {
  console.error("Đổi slug thất bại:", err)
  process.exit(1)
})
