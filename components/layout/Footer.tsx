import Link from "next/link";
import Image from "next/image";
import { GitBranch, MessageSquareShare, Briefcase, Globe, Mail } from "lucide-react";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const footerLinks = {
  "Khám Phá": [
    { href: "/articles", label: "Bài Viết Mới" },
    { href: "/categories", label: "Danh Mục" },
    { href: "/authors", label: "Tác Giả" },
    { href: "/library", label: "Thư Viện" },
  ],
  "Chủ Đề": [
    { href: "/categories/ai", label: "Trí Tuệ Nhân Tạo" },
    { href: "/categories/web", label: "Lập Trình Web" },
    { href: "/categories/devops", label: "DevOps & Cloud" },
    { href: "/categories/security", label: "Bảo Mật" },
  ],
  "Công Ty": [
    { href: "/about", label: "Về Chúng Tôi" },
    { href: "/contact", label: "Liên Hệ" },
    { href: "/careers", label: "Tuyển Dụng" },
    { href: "/policy", label: "Chính Sách" },
  ],
};

const socialLinks = [
  { href: "https://github.com", icon: GitBranch, label: "GitHub" },
  { href: "https://twitter.com", icon: MessageSquareShare, label: "Twitter" },
  { href: "https://linkedin.com", icon: Briefcase, label: "LinkedIn" },
  { href: "/", icon: Globe, label: "Website" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-muted/30">
      {/* Gradient top line */}
      <div className="h-px bg-gradient-to-r from-violet-500/30 via-blue-500/60 to-cyan-400/30" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl w-fit">
              <Image src="/logo.png" alt={SITE_NAME} width={32} height={32} className="rounded-lg" />
              <span>{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex items-center gap-1">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-110 hover:bg-gradient-to-br hover:from-violet-500/15 hover:to-blue-500/15 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wide">{category}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 rounded-xl border border-border bg-background p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Đăng ký nhận bản tin</p>
                <p className="text-xs text-muted-foreground">Nhận bài viết mới nhất mỗi tuần, miễn phí.</p>
              </div>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="h-8 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50 sm:w-52 sm:flex-none"
              />
              <button
                type="submit"
                className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {SITE_NAME}</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="transition-colors hover:text-foreground">Điều Khoản</Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">Bảo Mật</Link>
            <Link href="/cookies" className="transition-colors hover:text-foreground">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
