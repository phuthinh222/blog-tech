// Import bản dịch sản phẩm: content/translations/products/<slug>.<locale>.json
// → Supabase product_translations (1 dòng / sản phẩm / locale).
//
// Mặc định chạy dry-run (chỉ kiểm tra file + in ra sẽ làm gì, KHÔNG ghi DB).
// Thêm --commit để ghi thật.
//
//   node --env-file=.env.local scripts/import-translations.mjs            # dry-run
//   node --env-file=.env.local scripts/import-translations.mjs --commit   # ghi thật
//
// Yêu cầu: đã chạy supabase/migrations/0004_i18n_zh_locale.sql (cho phép
// locale 'zh' và cột specs). Idempotent — upsert theo (product_id, locale).
// `author` lấy theo bản tiếng Việt của cùng sản phẩm (tên riêng, không dịch).

import { createClient } from "@supabase/supabase-js"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.join(__dirname, "..", "content", "translations", "products")
const LOCALES = ["en", "zh"]
const COMMIT = process.argv.includes("--commit")

const REQUIRED_TEXT = ["title", "summary", "seo_title", "seo_description", "verdict_summary"]
const REQUIRED_ARRAY = ["sections", "pros", "cons", "faq", "specs"]

function loadTranslations() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const match = file.match(/^(.+)\.([a-z]{2})\.json$/)
      if (!match || !LOCALES.includes(match[2])) {
        throw new Error(`Tên file không hợp lệ: ${file} (cần <slug>.<${LOCALES.join("|")}>.json)`)
      }
      const data = JSON.parse(readFileSync(path.join(DIR, file), "utf8"))
      const problems = [
        ...REQUIRED_TEXT.filter((k) => typeof data[k] !== "string" || !data[k].trim()),
        ...REQUIRED_ARRAY.filter((k) => !Array.isArray(data[k])),
      ]
      if (problems.length) throw new Error(`${file}: thiếu/sai field ${problems.join(", ")}`)
      return { file, slug: match[1], locale: match[2], data }
    })
}

function toRow(t, productId, author) {
  const d = t.data
  return {
    product_id: productId,
    locale: t.locale,
    title: d.title,
    summary: d.summary,
    description: d.description ?? null,
    sections: d.sections,
    pros: d.pros,
    cons: d.cons,
    buying_advice: d.buying_advice ?? null,
    faq: d.faq,
    specs: d.specs,
    seo_title: d.seo_title,
    seo_description: d.seo_description,
    verdict_summary: d.verdict_summary,
    author,
    status: "PUBLISHED",
  }
}

async function main() {
  const translations = loadTranslations()
  const slugs = [...new Set(translations.map((t) => t.slug))]
  console.log(`${translations.length} file bản dịch, ${slugs.length} sản phẩm:`)
  for (const slug of slugs) {
    const locales = translations.filter((t) => t.slug === slug).map((t) => t.locale)
    console.log(`  - ${slug}: ${locales.join(", ")}`)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) {
    console.log("\nThiếu NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY — chỉ kiểm tra file.")
    return
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Đọc product id + bản tiếng Việt để đối chiếu cấu trúc và lấy author.
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, product_translations ( locale, author, sections, faq )")
    .in("slug", slugs)
  if (error) throw error
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]))

  const rows = []
  for (const t of translations) {
    const product = bySlug[t.slug]
    if (!product) {
      console.warn(`! Bỏ qua ${t.file}: không có sản phẩm slug "${t.slug}" trên Supabase`)
      continue
    }
    const vi = product.product_translations.find((x) => x.locale === "vi")
    if (
      vi &&
      (vi.sections?.length !== t.data.sections.length || vi.faq?.length !== t.data.faq.length)
    ) {
      console.warn(`! ${t.file}: số mục sections/faq khác bản tiếng Việt — kiểm tra lại bản dịch`)
    }
    rows.push(toRow(t, product.id, vi?.author ?? null))
  }

  if (!COMMIT) {
    console.log(`\nDry-run xong — sẽ upsert ${rows.length} dòng. Thêm --commit để ghi thật.`)
    return
  }

  const { error: upsertErr } = await supabase
    .from("product_translations")
    .upsert(rows, { onConflict: "product_id,locale" })
  if (upsertErr) {
    if (/locale_check|column .*specs/.test(upsertErr.message)) {
      console.error(
        "Có vẻ chưa chạy supabase/migrations/0004_i18n_zh_locale.sql — chạy migration trước."
      )
    }
    throw upsertErr
  }
  console.log(`\nHoàn tất — đã upsert ${rows.length} bản dịch vào product_translations.`)
}

main().catch((err) => {
  console.error("Import thất bại:", err)
  process.exit(1)
})
