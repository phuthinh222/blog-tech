import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Post } from "@/types"

type Size = "md" | "sm"

type Props = {
  url: string
  size?: Size
  className?: string
}

const STORE_STYLES = {
  Shopee: "bg-[#EE4D2D] text-white shadow-[#EE4D2D]/25 hover:bg-[#d73211]",
  Amazon: "bg-[#FF9900] text-black shadow-[#FF9900]/25 hover:bg-[#e68a00]",
} as const

function storeOf(url: string): keyof typeof STORE_STYLES | null {
  if (/shopee/i.test(url)) return "Shopee"
  if (/amazon|amzn/i.test(url)) return "Amazon"
  return null
}

// Nút "Mua sản phẩm" dùng chung (trang review, thanh dính đáy mobile, hộp
// "Lựa chọn tốt nhất", bảng so sánh). Shopee/Amazon dùng màu của sàn và ghi
// tên sàn; nơi bán khác dùng màu chủ đạo. Luôn là link affiliate:
// rel="sponsored nofollow".
export function BuyButton({ url, size = "md", className = "" }: Props) {
  const t = useTranslations("ArticlePage")
  const store = storeOf(url)
  const sizing =
    size === "sm"
      ? "gap-1.5 rounded-lg px-3 py-2 text-sm"
      : "gap-2.5 rounded-xl px-5 py-3.5 text-[15px] shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={`group inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all ${sizing} ${
        store
          ? STORE_STYLES[store]
          : "bg-primary text-primary-foreground shadow-black/10 hover:opacity-90"
      } ${className}`}
    >
      <ShoppingBag className={size === "sm" ? "size-4" : "size-4.5"} />
      {store ? (size === "sm" ? store : t("buyOn", { store })) : t("buy")}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}

// Bộ nút mua theo từng sàn của 1 sản phẩm. Trang tiếng Việt ưu tiên Shopee
// (giao trong nước), các ngôn ngữ khác ưu tiên Amazon.
export function BuyButtons({
  post,
  size = "md",
  className = "",
}: {
  post: Pick<Post, "shopeeUrl" | "amazonUrl">
  size?: Size
  className?: string
}) {
  const locale = useLocale()
  const urls = [post.shopeeUrl, post.amazonUrl].filter(Boolean)
  if (locale !== "vi") urls.reverse()
  if (urls.length === 0) return null

  return (
    <div className={`flex gap-2 ${className}`}>
      {urls.map((url) => (
        <BuyButton key={url} url={url} size={size} className="flex-1" />
      ))}
    </div>
  )
}
