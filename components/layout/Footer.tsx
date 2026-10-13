import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { SITE_NAME } from "@/lib/constants"

// Nhãn là khoá trong namespace "Footer"; riêng cột danh mục lấy tên từ
// "Categories.<slug>.name".
const footerLinks = [
  {
    key: "explore",
    links: [
      { href: "/articles", key: "newArticles" },
      { href: "/guides", key: "buyingGuides" },
      { href: "/categories", key: "allCategories" },
      { href: "/about#phuong-phap-danh-gia", key: "scoring" },
    ],
  },
  {
    key: "categories",
    links: ["phone", "monitor", "laptop", "accessory"].map((slug) => ({
      href: `/categories/${slug}`,
      category: slug,
    })),
  },
  {
    key: "company",
    links: [
      { href: "/about", key: "aboutUs" },
      { href: "/contact", key: "contact" },
    ],
  },
]

export default function Footer() {
  const t = useTranslations("Footer")
  const tMeta = useTranslations("Metadata")
  const tCat = useTranslations("Categories")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 mt-auto">
      {/* Gradient top line */}
      <div className="h-px bg-linear-to-r from-violet-500/30 via-blue-500/60 to-cyan-400/30" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-2 text-xl font-bold">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span>{SITE_NAME}</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">{tMeta("description")}</p>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ key: column, links }) => (
            <div key={column} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wide">{t(column)}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {"category" in link ? tCat(`${link.category}.name`) : t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border text-muted-foreground mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>
            © {currentYear} {SITE_NAME}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/privacy#cookies" className="hover:text-foreground transition-colors">
              {t("cookie")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
