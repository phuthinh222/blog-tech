// One-off import: content/posts/*.json → Supabase (products / product_translations).
// Không tạo offer/link affiliate (đã bỏ Shopee; tạm chưa dùng affiliate —
// xem AFFILIATE_LINKS_ENABLED trong lib/constants.ts).
//
// Mặc định chạy dry-run (chỉ in ra sẽ làm gì, KHÔNG ghi DB). Thêm --commit để ghi thật.
//
// Cách chạy (từ thư mục blog-tech/):
//   node --env-file=.env.local scripts/import-content.mjs            # dry-run
//   node --env-file=.env.local scripts/import-content.mjs --commit   # ghi thật
//
// Yêu cầu Node >= 20.6 (hỗ trợ --env-file). Nếu Node cũ hơn, tự export
// NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY trước khi chạy.
//
// Script idempotent: chạy lại nhiều lần sẽ upsert (không tạo trùng), dựa trên
// unique constraint của từng bảng (products.slug, product_translations
// (product_id, locale)).

import { createClient } from "@supabase/supabase-js"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.join(__dirname, "..", "content", "posts")

const COMMIT = process.argv.includes("--commit")

// Phải khớp với tên tiếng Việt trong messages/vi.json ("Categories.<slug>.name")
// và slug trong lib/categories.ts. Import script này chạy bằng Node thuần
// (không qua bundler Next) — giữ đồng bộ thủ công nếu danh mục đổi.
const CATEGORY_NAMES = {
  "desk-setup": "Góc Làm Việc",
  "gaming-gear": "Gaming Gear",
  "pc-laptop": "PC & Laptop",
  "audio-video": "Âm Thanh",
}

function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(POSTS_DIR, f), "utf8")))
}

// Bonus, không dùng bởi UI hiện tại — chỉ để không mất thông tin targetUsers/
// buyReasons vốn có trong content/posts/*.json nhưng chưa từng được render.
function buildExtraNotes(post) {
  const parts = []
  if (post.targetUsers?.length) {
    parts.push(`## Phù hợp với ai?\n\n${post.targetUsers.map((t) => `- ${t}`).join("\n")}`)
  }
  if (post.buyReasons?.length) {
    parts.push(`## Vì sao nên mua?\n\n${post.buyReasons.map((t) => `- ${t}`).join("\n")}`)
  }
  return parts.join("\n\n") || null
}

function buildSpecs(post) {
  const fromSpecs = post.specs ?? []
  const fromHighlights = Object.entries(post.specHighlights ?? {}).map(([label, value]) => ({
    label,
    value,
  }))
  return [...fromSpecs, ...fromHighlights]
}

// Chuyển 1 post JSON thành các row cần upsert. Hàm thuần, không I/O — dùng
// được cho cả dry-run lẫn commit.
function planProduct(post) {
  const warnings = []
  warnings.push(
    "brand_id = NULL — content/posts hiện không có field brand, cần bổ sung thủ công (xem todo.md Phase 8)"
  )
  warnings.push("model = NULL — content/posts hiện không có GTIN/UPC/SKU/model (xem README mục 6)")

  return {
    slug: post.slug,
    categorySlug: post.category,
    product: {
      name: post.productName || post.title,
      model: null,
      slug: post.slug,
      description: null,
      status: "PUBLISHED",
      cover_image: post.coverImage ?? null,
      images: post.images ?? [],
      specs: buildSpecs(post),
      rating: post.rating ?? {},
      tags: post.tags ?? [],
      created_at: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      // Cột từ migration 0005 — chỉ ghi khi JSON có field, để DB chưa chạy 0005
      // vẫn import được.
      ...(post.reviewMethod && { review_method: post.reviewMethod }),
      ...(post.updatedAt && { content_updated_at: new Date(post.updatedAt).toISOString() }),
    },
    translation: {
      locale: "vi",
      title: post.title,
      summary: post.excerpt ?? null,
      description: buildExtraNotes(post),
      sections: post.sections ?? [],
      author: post.author ?? null,
      verdict_summary: post.verdict?.summary ?? null,
      pros: post.pros ?? [],
      cons: post.cons ?? [],
      buying_advice: post.verdict?.recommendation ?? null,
      faq: post.faq ?? [],
      seo_title: post.seo?.metaTitle ?? null,
      seo_description: post.seo?.metaDescription ?? null,
      status: "PUBLISHED",
    },
    warnings,
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY

  if (!url || !serviceKey) {
    console.error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SECRET_KEY.\n" +
        "Chạy lại với: node --env-file=.env.local scripts/import-content.mjs"
    )
    process.exit(1)
  }

  const posts = loadPosts()
  const plans = posts.map(planProduct)

  console.log(`Tìm thấy ${posts.length} file trong content/posts/.`)
  console.log(
    COMMIT
      ? "Chế độ: COMMIT (sẽ ghi vào Supabase)\n"
      : "Chế độ: DRY-RUN (không ghi gì, chỉ xem trước)\n"
  )

  for (const plan of plans) {
    console.log(`— ${plan.slug}`)
    for (const w of plan.warnings) console.log(`    ⚠️  ${w}`)
  }

  if (!COMMIT) {
    console.log("\nDry-run xong. Thêm --commit để ghi thật vào Supabase.")
    return
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Chặn tạo sản phẩm trùng: file đã dùng slug mới (lib/slug-redirects.json)
  // nhưng Supabase vẫn còn slug cũ → phải chạy scripts/rename-slugs.mjs trước.
  const slugMap = JSON.parse(
    readFileSync(path.join(__dirname, "..", "lib", "slug-redirects.json"), "utf8")
  )
  const { data: existing, error: existingErr } = await supabase.from("products").select("slug")
  if (existingErr) throw existingErr
  const existingSlugs = new Set(existing.map((p) => p.slug))
  const notRenamed = Object.entries(slugMap).filter(
    ([from, to]) => existingSlugs.has(from) && !existingSlugs.has(to)
  )
  if (notRenamed.length) {
    throw new Error(
      `Supabase còn slug cũ (${notRenamed.map(([f]) => f).join(", ")}) — chạy scripts/rename-slugs.mjs --commit trước.`
    )
  }

  // 1. Categories (upsert theo slug).
  const categorySlugs = [...new Set(plans.map((p) => p.categorySlug))]
  const categoryRows = categorySlugs.map((slug) => ({
    slug,
    name: CATEGORY_NAMES[slug] ?? slug,
  }))
  const { data: categories, error: categoryErr } = await supabase
    .from("categories")
    .upsert(categoryRows, { onConflict: "slug" })
    .select("id, slug")
  if (categoryErr) throw categoryErr
  const categoryIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]))

  // 2. Products, translations — theo thứ tự vì cần product.id làm FK.
  for (const plan of plans) {
    const { data: product, error: productErr } = await supabase
      .from("products")
      .upsert(
        { ...plan.product, category_id: categoryIdBySlug[plan.categorySlug] ?? null },
        { onConflict: "slug" }
      )
      .select("id")
      .single()
    if (productErr) throw productErr

    const { error: translationErr } = await supabase
      .from("product_translations")
      .upsert({ ...plan.translation, product_id: product.id }, { onConflict: "product_id,locale" })
    if (translationErr) throw translationErr

    console.log(`✓ Đã import ${plan.slug}`)
  }

  console.log(`\nHoàn tất — ${plans.length} sản phẩm đã upsert vào Supabase.`)
  console.log("Nhắc lại: brand_id, model đang NULL cho toàn bộ — cần bổ sung thủ công.")
}

main().catch((err) => {
  console.error("Import thất bại:", err)
  process.exit(1)
})
