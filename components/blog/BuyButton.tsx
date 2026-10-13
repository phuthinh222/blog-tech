import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  url: string
  size?: "md" | "sm"
  className?: string
}

// Nút "Mua sản phẩm" dùng chung (trang review, thanh dính đáy mobile, hộp
// "Lựa chọn tốt nhất", bảng so sánh). Link Shopee dùng màu cam Shopee; nơi bán
// khác dùng màu chủ đạo. Luôn là link affiliate: rel="sponsored nofollow".
export function BuyButton({ url, size = "md", className = "" }: Props) {
  const t = useTranslations("ArticlePage")
  const isShopee = url.includes("shopee")
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
        isShopee
          ? "bg-[#EE4D2D] text-white shadow-[#EE4D2D]/25 hover:bg-[#d73211]"
          : "bg-primary text-primary-foreground shadow-black/10 hover:opacity-90"
      } ${className}`}
    >
      <ShoppingBag className={size === "sm" ? "size-4" : "size-4.5"} />
      {t("buy")}
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}
