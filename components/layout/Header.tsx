"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
      {/* Gradient top line */}
      <div className="h-px bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              width={34}
              height={34}
              className="rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="gradient-text">{SITE_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Tìm kiếm">
            <Search className="size-4" />
          </Button>
          <Button
            size="sm"
            className="hidden md:inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white border-0 shadow-md shadow-violet-500/25 hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          >
            Đăng Ký
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Gradient bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="animate-fade-in-up border-b border-border bg-background/95 backdrop-blur-xl px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="animate-fade-in-up rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <Button
                size="sm"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white border-0"
              >
                Đăng Ký
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
