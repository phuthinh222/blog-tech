import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toLocale, type Locale } from "@/i18n/routing"
import type { Post } from "@/types"

type Size = "md" | "sm"

const STORE_STYLES = {
  Shopee: "bg-[#EE4D2D] text-white shadow-[#EE4D2D]/25 hover:bg-[#d73211]",
  Amazon: "bg-[#FF9900] text-black shadow-[#FF9900]/25 hover:bg-[#e68a00]",
  Taobao: "bg-[#FF5000] text-white shadow-[#FF5000]/25 hover:bg-[#e04600]",
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
  if (/taobao/i.test(url)) return "Taobao"
  return null
}

// Nút "Mua sản phẩm" dùng chung (trang review, thanh dính đáy mobile, hộp
// "Lựa chọn tốt nhất", bảng so sánh). Shopee/Amazon/Taobao dùng màu của sàn và ghi
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

// Mỗi ngôn ngữ chỉ bán qua 1 sàn: vi → Shopee, en → Amazon, zh → Taobao.
// Bài chưa có offer ở sàn đó thì tạm dẫn về trang chủ sàn.
const STORE_BY_LOCALE: Record<Locale, { store: Store; fallback: string }> = {
  vi: { store: "Shopee", fallback: "https://shopee.vn/" },
  en: { store: "Amazon", fallback: "https://www.amazon.com/" },
  zh: { store: "Taobao", fallback: "https://www.taobao.com/" },
}

type BuyLinkPost = Pick<Post, "shopeeUrl" | "amazonUrl" | "taobaoUrl">

export function buyLinkFor(
  post: BuyLinkPost,
  locale: string
): { url: string; store: Store } | null {
  const { store, fallback } = STORE_BY_LOCALE[toLocale(locale)]
  const offerUrl = { Shopee: post.shopeeUrl, Amazon: post.amazonUrl, Taobao: post.taobaoUrl }[store]
  const url = offerUrl || fallback
  return url ? { url, store } : null
}

// Nút mua của 1 sản phẩm theo sàn ứng với ngôn ngữ đang xem.
export function BuyButtons({
  post,
  size = "md",
  className = "",
}: {
  post: BuyLinkPost
  size?: Size
  className?: string
}) {
  const locale = useLocale()
  const link = buyLinkFor(post, locale)
  if (!link) return null

  return (
    <div className={`flex gap-2 ${className}`}>
      <BuyButton url={link.url} store={link.store} size={size} className="flex-1" />
    </div>
  )
}
