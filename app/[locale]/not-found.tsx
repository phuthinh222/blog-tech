import { FileSearch } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const t = useTranslations("NotFoundPage")
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-32 text-center">
      <FileSearch className="text-muted-foreground/40 size-12" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>
      <Button asChild>
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  )
}
