import type { ReactNode } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"

// Nội dung 1 mục của bài hướng dẫn. Các khối cách nhau bằng dòng trống; mỗi
// khối là đoạn văn, danh sách (mọi dòng bắt đầu "- ") hoặc bảng kiểu Markdown
// (mọi dòng bắt đầu "|", dòng 1 là tiêu đề, dòng "|---|" bị bỏ qua), hoặc
// khối ảnh (mọi dòng là ![chú thích](/images/...), nhiều ảnh xếp lưới). Trong
// chữ hỗ trợ link [chữ](/duong-dan) và **đậm**.

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
const LINK_CLASS = "text-foreground underline underline-offset-2 hover:text-primary"

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    const [, label, href, bold] = m
    if (label !== undefined && href !== undefined) {
      out.push(
        href.startsWith("/") ? (
          <Link key={i} href={href} className={LINK_CLASS}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        )
      )
    } else {
      out.push(
        <strong key={i} className="text-foreground font-semibold">
          {bold}
        </strong>
      )
    }
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim())

const IMAGE_LINE = /^!\[([^\]]*)\]\((\/[^)\s]+)\)$/

function Block({ block }: { block: string }) {
  const lines = block.split("\n").filter((l) => l.trim() !== "")

  // Khối ảnh: mỗi dòng ![chú thích](/images/...). Chỉ nhận ảnh trong public/.
  const images = lines.map((l) => IMAGE_LINE.exec(l.trim()))
  if (images.length > 0 && images.every((m) => m !== null)) {
    const cols = images.length >= 3 ? "sm:grid-cols-3" : images.length === 2 ? "sm:grid-cols-2" : ""
    return (
      <div className={`grid gap-3 ${cols}`}>
        {images.map((m, i) => (
          <figure key={i} className="flex flex-col gap-1.5">
            <div className="border-border relative aspect-4/5 overflow-hidden rounded-xl border bg-white">
              <Image
                src={m![2]!}
                alt={m![1]!}
                fill
                className="object-contain"
                sizes={
                  images.length > 1
                    ? "(max-width: 640px) 100vw, 260px"
                    : "(max-width: 768px) 100vw, 720px"
                }
              />
            </div>
            {m![1] && (
              <figcaption className="text-muted-foreground text-center text-xs">{m![1]}</figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }

  if (lines.length > 0 && lines.every((l) => l.trimStart().startsWith("|"))) {
    const rows = lines.filter((l) => !/^\s*\|[\s|:-]+\|\s*$/.test(l)).map(cells)
    const [head, ...body] = rows
    return (
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              {head?.map((c, i) => (
                <th key={i} className="px-4 py-2.5 font-semibold whitespace-nowrap">
                  {renderInline(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-border border-t">
                {row.map((c, i) => (
                  <td
                    key={i}
                    className={`px-4 py-2.5 align-top ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {renderInline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (lines.length > 0 && lines.every((l) => l.trimStart().startsWith("- "))) {
    return (
      <ul className="text-muted-foreground flex list-disc flex-col gap-1.5 pl-5 leading-relaxed">
        {lines.map((l, i) => (
          <li key={i}>{renderInline(l.trimStart().slice(2))}</li>
        ))}
      </ul>
    )
  }

  return <p className="text-muted-foreground leading-relaxed">{renderInline(block)}</p>
}

export function GuideContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n\n").map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  )
}
