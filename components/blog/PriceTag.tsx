import { useLocale, useTranslations } from "next-intl"
import { LOCALE_TAGS, toLocale } from "@/i18n/routing"
import type { Post } from "@/types"

type Props = {
  post: Pick<Post, "price" | "currency" | "priceCheckedAt">
  compact?: boolean
}

// Giá tham khảo của best offer. Chưa có giá thật (price = null) thì không hiện
// gì — không bịa giá (README mục 18). Giá trên site chỉ để tham khảo, giá cuối
// cùng là giá ở nơi bán.
export function PriceTag({ post, compact = false }: Props) {
  const t = useTranslations("Price")
  const localeTag = LOCALE_TAGS[toLocale(useLocale())]
  if (post.price == null || !post.currency) return null

  const price = new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: post.currency,
    maximumFractionDigits: 0,
  }).format(post.price)

  if (compact) return <span className="font-bold">{price}</span>

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-muted-foreground text-xs">{t("label")}</span>
      <span className="text-2xl font-bold tracking-tight">{price}</span>
      {post.priceCheckedAt && (
        <span className="text-muted-foreground text-xs">
          {t("checkedAt", {
            date: new Date(post.priceCheckedAt).toLocaleDateString(localeTag),
          })}
        </span>
      )}
    </div>
  )
}
