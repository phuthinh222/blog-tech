import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { BuyButton } from "@/components/blog/BuyButton"
import { PriceTag } from "@/components/blog/PriceTag"
import type { Post } from "@/types"

type Props = {
  current: Post
  others: Post[]
}

const CRITERIA = ["design", "performance", "battery", "value"] as const

// Bảng so sánh sản phẩm đang xem với các sản phẩm cùng danh mục. Trên điện
// thoại cuộn ngang, cột tên sản phẩm dính bên trái.
export function ComparisonTable({ current, others }: Props) {
  const t = useTranslations("Compare")
  const tRating = useTranslations("Rating")
  const rows = [current, ...others]
  const showPrice = rows.some((p) => p.price != null)
  const best = Math.max(...rows.map((p) => p.rating.overall))

  return (
    <div className="border-border -mx-4 overflow-x-auto border-y sm:mx-0 sm:rounded-2xl sm:border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs">
          <tr>
            <th className="bg-muted sticky left-0 z-10 px-4 py-3 text-left font-semibold">
              {t("product")}
            </th>
            <th className="px-3 py-3 font-semibold">{t("overall")}</th>
            {CRITERIA.map((c) => (
              <th key={c} className="px-3 py-3 font-semibold">
                {tRating(c)}
              </th>
            ))}
            {showPrice && <th className="px-3 py-3 font-semibold">{t("price")}</th>}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {rows.map((post) => {
            const isCurrent = post.slug === current.slug
            return (
              <tr key={post.slug} className={isCurrent ? "bg-primary/5" : ""}>
                <td
                  className={`sticky left-0 z-10 px-4 py-3 ${isCurrent ? "bg-muted" : "bg-background"}`}
                >
                  <div className="flex w-52 items-center gap-3">
                    {post.coverImage && (
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-col">
                      {isCurrent ? (
                        <span className="line-clamp-2 font-semibold">{post.title}</span>
                      ) : (
                        <Link
                          href={`/articles/${post.slug}`}
                          className="line-clamp-2 font-semibold hover:underline"
                        >
                          {post.title}
                        </Link>
                      )}
                      {isCurrent && (
                        <span className="text-primary text-xs font-medium">{t("thisProduct")}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-1 font-bold ${
                      post.rating.overall === best
                        ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400"
                        : ""
                    }`}
                  >
                    {post.rating.overall}
                  </span>
                </td>
                {CRITERIA.map((c) => (
                  <td key={c} className="text-muted-foreground px-3 py-3 text-center">
                    {post.rating[c]}
                  </td>
                ))}
                {showPrice && (
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {post.price != null ? <PriceTag post={post} compact /> : "—"}
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  {post.affiliateUrl && <BuyButton url={post.affiliateUrl} size="sm" />}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
