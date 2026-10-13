"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, LogIn, LogOut, ChevronDown, User } from "lucide-react"
import { SITE_NAME, NAV_LINKS } from "@/lib/constants"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher"

function UserMenu() {
  const t = useTranslations("Header")
  const { user, isLoading } = useUser()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return <div className="bg-muted size-8 animate-pulse rounded-full" />
  }

  if (!user) {
    return (
      <Button
        asChild
        size="sm"
        className="hidden rounded-xl border-0 bg-linear-to-r from-violet-600 to-blue-500 text-white shadow-md shadow-violet-500/25 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/30 lg:inline-flex"
      >
        <a href="/auth/login">
          <LogIn className="mr-1.5 size-3.5" />
          {t("login")}
        </a>
      </Button>
    )
  }

  const initials = (user.name ?? user.email ?? "U")[0].toUpperCase()

  return (
    <div className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="hover:bg-muted flex items-center gap-2 rounded-xl py-1 pr-2.5 pl-1 transition-colors"
      >
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt={user.name ?? ""}
            className="size-7 rounded-full object-cover ring-2 ring-violet-500/30"
          />
        ) : (
          <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white">
            {initials}
          </span>
        )}
        <span className="max-w-24 truncate text-sm font-medium">{user.name ?? user.email}</span>
        <ChevronDown
          className={`text-muted-foreground size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="border-border bg-background absolute top-full right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border shadow-xl shadow-black/10">
            <div className="border-border flex items-center gap-3 border-b px-4 py-3">
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name ?? ""}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="text-muted-foreground truncate text-xs">{user.email}</p>
              </div>
            </div>
            <div className="p-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                <User className="text-muted-foreground size-4" />
                {t("profile")}
              </Link>
              <a
                href="/auth/logout"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                <LogOut className="size-4" />
                {t("logout")}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Mục đăng nhập / hồ sơ / đăng xuất trong menu mobile — cùng kiểu với các mục
// điều hướng (NAV_LINKS) để nằm chung một danh sách.
const MOBILE_ITEM =
  "animate-fade-in-up flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-medium transition-colors"

function MobileAuthLinks({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Header")
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="bg-muted mx-4 my-3 h-6 animate-pulse rounded-lg" />
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        onClick={onClose}
        className={`${MOBILE_ITEM} text-foreground hover:bg-muted`}
      >
        {t("login")}
      </a>
    )
  }

  return (
    <>
      <Link
        href="/profile"
        onClick={onClose}
        className={`${MOBILE_ITEM} text-foreground hover:bg-muted`}
      >
        {t("profile")}
      </Link>
      <a href="/auth/logout" className={`${MOBILE_ITEM} text-rose-500 hover:bg-rose-500/10`}>
        {t("logout")}
      </a>
    </>
  )
}

export default function Header() {
  const t = useTranslations("Header")
  const tNav = useTranslations("Nav")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  // Close menu on navigation — adjusting state during render (React's
  // recommended pattern) instead of an effect, so it can't cascade an
  // extra render on every route change.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsMenuOpen(false)
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="bg-background/80 sticky top-0 z-50 w-full backdrop-blur-xl">
        {/* Gradient top line */}
        <div className="h-px bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400" />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold">
            <Image src="/logo.png" alt={SITE_NAME} width={34} height={34} className="rounded-xl" />
            <span>{SITE_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label={t("mainNav")} className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-[color,font-weight] duration-300 ${
                  pathname === link.href
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground hover:font-bold"
                }`}
              >
                {tNav(link.key)}
                <span
                  className={`absolute right-3 bottom-1 left-3 h-0.5 rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-transform duration-300 ${
                    pathname === link.href
                      ? "scale-x-100"
                      : "origin-left scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              aria-label={t("searchShortcut")}
              onClick={() => window.dispatchEvent(new Event("open-search"))}
            >
              <Search className="size-4" />
            </Button>

            <LocaleSwitcher className="hidden sm:block" />

            <ThemeToggle className="hidden sm:inline-flex" />

            <UserMenu />

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isMenuOpen}
            >
              <Menu
                className={`size-5 transition-all duration-200 ${isMenuOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
              />
              <X
                className={`absolute size-5 transition-all duration-200 ${isMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              />
            </Button>
          </div>
        </div>

        {/* Gradient bottom border */}
        <div className="via-border h-px bg-linear-to-r from-transparent to-transparent" />
      </header>

      {/* Mobile full-screen overlay — rendered outside header to avoid stacking context issues */}
      {isMenuOpen && (
        <div className="bg-background fixed inset-0 z-[60] flex flex-col lg:hidden">
          {/* Header row */}
          <div className="h-px shrink-0 bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400" />
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 text-xl font-bold"
            >
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={34}
                height={34}
                className="rounded-xl"
              />
              <span>{SITE_NAME}</span>
            </Link>
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setIsMenuOpen(false)}
                aria-label={t("closeMenu")}
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>
          <div className="via-border h-px shrink-0 bg-linear-to-r from-transparent to-transparent" />

          {/* Nav links */}
          <nav
            aria-label={t("mobileNav")}
            className="stagger-children flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`animate-fade-in-up flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {tNav(link.key)}
                </Link>
              )
            })}
            <MobileAuthLinks onClose={() => setIsMenuOpen(false)} />
          </nav>
        </div>
      )}
    </>
  )
}
