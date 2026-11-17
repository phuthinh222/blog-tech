// Xoá toàn bộ offer Shopee (link affiliate AccessTrade) trên Supabase — site đã
// bỏ Shopee và tạm chưa dùng link affiliate (AFFILIATE_LINKS_ENABLED trong
// lib/constants.ts).
//
//   node --env-file=.env scripts/remove-shopee-offers.mjs            # dry-run
//   node --env-file=.env scripts/remove-shopee-offers.mjs --commit   # xoá thật
//
// Chạy SAU khi deploy bản code mới: bản đang chạy trên production vẫn hiện nút
// "Mua trên Shopee" (về trang chủ Shopee) khi bài không còn offer.

import { createClient } from "@supabase/supabase-js"

const COMMIT = process.argv.includes("--commit")
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY")
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })

const isShopee = (o) =>
  /shopee/i.test(o.merchant ?? "") || /shopee|shorten\.asia/i.test(o.affiliate_url ?? "")

async function main() {
  const { data, error } = await supabase
    .from("product_offers")
    .select("id, merchant, affiliate_url, products ( slug )")
  if (error) throw error

  const targets = data.filter(isShopee)
  for (const o of targets) {
    console.log(`- ${o.products?.slug ?? "?"} [${o.merchant}] ${o.affiliate_url}`)
  }
  console.log(`\n${targets.length}/${data.length} offer là Shopee.`)

  if (!COMMIT) {
    console.log("Dry-run xong. Thêm --commit để xoá thật.")
    return
  }
  if (targets.length === 0) return

  const { error: delErr } = await supabase
    .from("product_offers")
    .delete()
    .in(
      "id",
      targets.map((o) => o.id)
    )
  if (delErr) throw delErr
  console.log(`✓ Đã xoá ${targets.length} offer Shopee.`)
}

main().catch((err) => {
  console.error("Thất bại:", err)
  process.exit(1)
})
