import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

// Công bố liên kết tiếp thị — đặt phía trên nút/link mua đầu tiên của trang
// (trang review, trang hướng dẫn có hộp "Lựa chọn tốt nhất").
export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  const t = useTranslations("ArticlePage")
  return (
    <p
      className={`border-border bg-muted/30 text-muted-foreground rounded-xl border px-4 py-3 text-xs leading-relaxed ${className}`}
    >
      {t("affiliateDisclosure")}{" "}
      <Link
        href="/about#phuong-phap-danh-gia"
        className="text-foreground underline underline-offset-2"
      >
        {t("affiliateDisclosureLink")}
      </Link>
    </p>
  )
}
