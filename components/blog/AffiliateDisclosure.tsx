import { useTranslations } from "next-intl"
import { AFFILIATE_LINKS_ENABLED } from "@/lib/constants"

// Công bố liên kết tiếp thị — đặt phía trên nút/link mua đầu tiên của trang
// (trang review, trang hướng dẫn có hộp "Lựa chọn tốt nhất"). Ẩn khi đang tắt
// link affiliate (không có link nào để công bố).
export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  const t = useTranslations("ArticlePage")
  if (!AFFILIATE_LINKS_ENABLED) return null
  return (
    <p
      className={`border-border bg-muted/30 text-muted-foreground rounded-xl border px-4 py-3 text-xs leading-relaxed ${className}`}
    >
      {t("affiliateDisclosure")}
    </p>
  )
}
