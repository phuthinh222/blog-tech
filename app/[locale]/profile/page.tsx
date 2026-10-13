import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { LogOut, Mail, User } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPathname } from "@/i18n/navigation"
import { toLocale } from "@/i18n/routing"
import { auth0 } from "@/lib/auth0"
import { getPosts } from "@/lib/content"
import { SITE_NAME } from "@/lib/constants"
import { BookmarkedArticles } from "@/components/blog/BookmarkedArticles"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = await getTranslations({ locale, namespace: "ProfilePage" })
  return { title: `${t("title")} — ${SITE_NAME}` }
}

export default async function ProfilePage({ params }: Props) {
  const locale = toLocale((await params).locale)
  setRequestLocale(locale)
  const session = await auth0.getSession()
  if (!session) {
    // Đăng nhập xong quay lại đúng trang hồ sơ ở ngôn ngữ đang xem.
    const returnTo = getPathname({ href: "/profile", locale })
    redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
  }

  const { user } = session
  const initials = (user.name ?? user.email ?? "U")[0].toUpperCase()
  const [posts, t] = await Promise.all([getPosts(locale), getTranslations("ProfilePage")])

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── User Card ─────────────────────────────────────── */}
      <div className="border-border bg-card mb-10 flex flex-col gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center sm:gap-8">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt={user.name ?? ""}
            className="size-20 shrink-0 rounded-2xl object-cover shadow-xl ring-4 ring-violet-500/20 sm:size-24"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-bold text-white shadow-xl sm:size-24">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
            <Mail className="size-3.5" />
            <span>{user.email}</span>
          </div>
          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
            <User className="size-3" />
            <span>{t("member", { site: SITE_NAME })}</span>
          </div>
        </div>

        <a
          href="/auth/logout"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10 sm:self-center"
        >
          <LogOut className="size-4" />
          {t("logout")}
        </a>
      </div>

      {/* ── Bookmarks ─────────────────────────────────────── */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
          <h2 className="text-xl font-bold">{t("saved")}</h2>
        </div>
        <BookmarkedArticles posts={posts} />
      </section>
    </main>
  )
}
