#!/usr/bin/env node
// Kiểm tra link affiliate hỏng (checklist 2.2 — chạy hằng tuần).
//
//   node --env-file=.env scripts/check-links.mjs
//
// Đọc mọi product_offers của sản phẩm PUBLISHED (anon key, tôn trọng RLS), mở
// từng affiliate_url (theo redirect) và báo:
//   - BROKEN : lỗi mạng, HTTP >= 400, hoặc link Shopee không còn dẫn tới đúng
//              sản phẩm (URL cuối không chứa item id — thường là sản phẩm bị gỡ
//              hoặc link AccessTrade hết hạn, rơi về trang chủ/tìm kiếm).
//   - WARN   : không xác minh được (VD sàn chặn bot) — nên mở tay kiểm tra.
// Hết hàng/ngừng bán trên Shopee không lộ qua HTTP (trang vẫn trả 200), nên
// vẫn cần mở tay vài link mỗi tuần.
// Thoát với mã 1 nếu có link BROKEN (GitHub Actions sẽ gửi email báo lỗi).

import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
if (!url || !key) {
  console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  process.exit(2)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })
const TIMEOUT_MS = 20_000
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"

async function resolve(link) {
  const res = await fetch(link, {
    redirect: "follow",
    headers: { "User-Agent": UA, "Accept-Language": "vi,en;q=0.8" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  // Không cần body — huỷ để giải phóng kết nối.
  await res.body?.cancel()
  return { status: res.status, finalUrl: res.url }
}

function classify(offer, { status, finalUrl }) {
  const final = new URL(finalUrl)
  if (status >= 400 && status !== 403) return ["BROKEN", `HTTP ${status}`]
  if (/shopee\./i.test(final.hostname)) {
    const itemId = offer.source_product_id
    if (final.pathname === "/" || final.pathname.startsWith("/search")) {
      return ["BROKEN", "rơi về trang chủ/tìm kiếm Shopee"]
    }
    if (itemId && !finalUrl.includes(itemId)) {
      return ["BROKEN", "không còn dẫn tới sản phẩm (sai item id)"]
    }
  }
  if (status === 403) return ["WARN", `HTTP 403 (${final.hostname} chặn bot) — mở tay kiểm tra`]
  return ["OK", `HTTP ${status}`]
}

const { data, error } = await supabase
  .from("products")
  .select("slug, product_offers ( merchant, affiliate_url, source_product_id )")
  .eq("status", "PUBLISHED")
  .order("slug")

if (error) {
  console.error(`Supabase: ${error.message}`)
  process.exit(2)
}

const results = { OK: 0, WARN: 0, BROKEN: 0 }
for (const product of data ?? []) {
  for (const offer of product.product_offers ?? []) {
    let verdict
    try {
      verdict = classify(offer, await resolve(offer.affiliate_url))
    } catch (e) {
      verdict = ["BROKEN", `lỗi mạng: ${e.cause?.code ?? e.name ?? e}`]
    }
    const [level, note] = verdict
    results[level]++
    console.log(
      `${level.padEnd(6)} ${product.slug} [${offer.merchant ?? "?"}]\n       ${offer.affiliate_url} — ${note}`
    )
  }
}

console.log(`\nTổng: ${results.OK} OK, ${results.WARN} cần xem tay, ${results.BROKEN} hỏng.`)
process.exit(results.BROKEN > 0 ? 1 : 0)
