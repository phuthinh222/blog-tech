"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, LogIn, LogOut, ChevronDown, User } from "lucide-react"
import { SITE_NAME, NAV_LINKS } from "@/lib/constants"

function UserMenu() {
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
        className="hidden rounded-xl border-0 bg-linear-to-r from-violet-600 to-blue-500 text-white shadow-md shadow-violet-500/25 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/30 md:inline-flex"
      >
        <a href="/auth/login">
          <LogIn className="mr-1.5 size-3.5" />
          Đăng Nhập
        </a>
      </Button>
    )
  }

  const initials = (user.name ?? user.email ?? "U")[0].toUpperCase()

  return (
    <div className="relative hidden md:block">
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
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="border-border bg-background absolute top-full right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border shadow-xl shadow-black/10">
            {/* User info */}
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
            {/* Actions */}
            <div className="p-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                <User className="text-muted-foreground size-4" />
                Hồ Sơ
              </Link>
              <a
                href="/auth/logout"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                <LogOut className="size-4" />
                Đăng Xuất
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="bg-muted h-9 animate-pulse rounded-xl" />
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-blue-500 py-2.5 text-sm font-semibold text-white"
      >
        <LogIn className="size-4" />
        Đăng Nhập
      </a>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5">
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt={user.name ?? ""}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
            {(user.name ?? user.email ?? "U")[0].toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </div>
      </div>
      <Link
        href="/profile"
        onClick={onClose}
        className="bg-muted hover:bg-muted/80 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
      >
        <User className="size-4" />
        Hồ Sơ
      </Link>
      <a
        href="/auth/logout"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
      >
        <LogOut className="size-4" />
        Đăng Xuất
      </a>
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full backdrop-blur-xl">
      {/* Gradient top line */}
      <div className="h-px bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold">
          <Image
            src="/logo.png"
            alt={SITE_NAME}
            width={34}
            height={34}
            className="rounded-xl"
          />
          <span>{SITE_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group text-muted-foreground hover:text-foreground relative rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
              <span className="absolute right-3 bottom-1 left-3 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            aria-label="Tìm kiếm (⌘K)"
            onClick={() => window.dispatchEvent(new Event("open-search"))}
          >
            <Search className="size-4" />
          </Button>

          <UserMenu />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Gradient bottom border */}
      <div className="via-border h-px bg-linear-to-r from-transparent to-transparent" />

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="animate-fade-in-up border-border bg-background/95 border-b px-4 py-3 backdrop-blur-xl md:hidden">
          <nav aria-label="Điều hướng mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="animate-fade-in-up text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-border mt-2 border-t pt-2">
              <MobileAuthSection onClose={() => setIsMenuOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
