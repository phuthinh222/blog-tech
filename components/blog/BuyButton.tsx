import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { Post } from "@/types"

type Size = "md" | "sm"

const STORE_STYLES = {
  Shopee: "bg-[#EE4D2D] text-white shadow-[#EE4D2D]/25 hover:bg-[#d73211]",
  Amazon: "bg-[#FF9900] text-black shadow-[#FF9900]/25 hover:bg-[#e68a00]",
} as const

type Store = keyof typeof STORE_STYLES

type Props = {
  url: string
  // Truyền khi đã biết sàn (link rút gọn không lộ tên sàn); bỏ trống thì đoán từ URL.
  store?: Store
  size?: Size
  className?: string
}

function storeOf(url: string): Store | null {
  if (/shopee/i.test(url)) return "Shopee"
  if (/amazon|amzn/i.test(url)) return "Amazon"
  return null
}

// Nút "Mua sản phẩm" dùng chung (trang review, thanh dính đáy mobile, hộp
// "Lựa chọn tốt nhất", bảng so sánh). Shopee/Amazon dùng màu của sàn và ghi
// tên sàn; nơi bán khác dùng màu chủ đạo. Luôn là link affiliate:
// rel="sponsored nofollow".
export function BuyButton({ url, store: storeProp, size = "md", className = "" }: Props) {
  const t = useTranslations("ArticlePage")
  const store = storeProp ?? storeOf(url)
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
  const links = (
    [
      { url: post.shopeeUrl, store: "Shopee" },
      { url: post.amazonUrl, store: "Amazon" },
    ] as const
  ).filter((l) => l.url)
  if (locale !== "vi") links.reverse()
  if (links.length === 0) return null

  return (
    <div className={`flex gap-2 ${className}`}>
      {links.map(({ url, store }) => (
        <BuyButton key={url} url={url} store={store} size={size} className="flex-1" />
      ))}
    </div>
  )
}
