// Kiểm tra messages/en.json và messages/zh.json có đúng bộ khoá như
// messages/vi.json (nguồn gốc) — thiếu khoá thì next-intl hiện tên khoá thô.
//   node scripts/check-messages.mjs
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "messages")
const load = (locale) => JSON.parse(readFileSync(path.join(dir, `${locale}.json`), "utf8"))

function keys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )
}

// Biến ICU ({name}) và thẻ rich text (<tag>) phải giống nhau giữa các bản dịch.
function placeholders(text) {
  const vars = [...text.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1])
  const tags = [...text.matchAll(/<(\w+)>/g)].map((m) => m[1])
  return [...new Set([...vars, ...tags])].sort().join(",")
}

function get(obj, key) {
  return key.split(".").reduce((o, k) => o?.[k], obj)
}

const base = load("vi")
const baseKeys = new Set(keys(base))
let failed = false

for (const locale of ["en", "zh"]) {
  const messages = load(locale)
  const localeKeys = new Set(keys(messages))
  const missing = [...baseKeys].filter((k) => !localeKeys.has(k))
  const extra = [...localeKeys].filter((k) => !baseKeys.has(k))
  const mismatched = [...baseKeys].filter(
    (k) => localeKeys.has(k) && placeholders(get(base, k)) !== placeholders(get(messages, k))
  )
  for (const [label, list] of [
    ["thiếu", missing],
    ["thừa", extra],
    ["lệch biến/thẻ", mismatched],
  ]) {
    if (list.length) {
      failed = true
      console.error(`${locale}: ${label} ${list.length} khoá:\n  ${list.join("\n  ")}`)
    }
  }
}

if (failed) process.exit(1)
console.log(`OK — en, zh khớp ${baseKeys.size} khoá với vi`)
