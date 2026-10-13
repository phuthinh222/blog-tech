import Image from "next/image"
import { ArrowRight, Award, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { BuyButton } from "@/components/blog/BuyButton"
import { PriceTag } from "@/components/blog/PriceTag"
import type { Post } from "@/types"

// Hộp "Lựa chọn tốt nhất" ở đầu bài hướng dẫn: sản phẩm điểm cao nhất trong
// các bài review mà guide liên kết tới, kèm lối đi thẳng tới review và nút mua.
export function BestPickBox({ post }: { post: Post }) {
  const t = useTranslations("BestPick")

  return (
    <aside className="border-border from-primary/5 overflow-hidden rounded-2xl border bg-linear-to-br to-transparent">
      <div className="flex items-center gap-2 border-b border-inherit px-5 py-3">
        <Award className="size-4 text-amber-500" />
        <span className="text-sm font-bold">{t("title")}</span>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        {post.coverImage && (
          <Link
            href={`/articles/${post.slug}`}
            className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl sm:w-40"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
            />
          </Link>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Link href={`/articles/${post.slug}`} className="leading-snug font-bold hover:underline">
            {post.title}
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-bold text-yellow-500">
              <Star className="size-3.5 fill-yellow-500" />
              {post.rating.overall}/10
            </span>
            <PriceTag post={post} compact />
          </div>
          {post.verdict.summary && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{post.verdict.summary}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {post.affiliateUrl && <BuyButton url={post.affiliateUrl} size="sm" />}
            <Link
              href={`/articles/${post.slug}`}
              className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
            >
              {t("readReview")} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
