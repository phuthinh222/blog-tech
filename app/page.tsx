import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Mail, Clock, User } from "lucide-react";
import ArticleCard from "@/components/blog/ArticleCard";
import { POSTS, CATEGORIES } from "@/lib/posts";
import { getCategoryIcon } from "@/lib/categories";
import { TEAM } from "@/lib/team";

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <Link
        href={href}
        className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Xem tất cả
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const featured = POSTS[0];
  const latest   = POSTS.slice(1, 4);
  const trending = POSTS.slice(0, 5);
  const recent   = POSTS.slice(5, 9);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-16">

      {/* ── Hero featured article ─────────────────────────── */}
      <section className="animate-fade-in-up">
        <ArticleCard post={featured} variant="featured" />
      </section>

      {/* ── Latest articles ───────────────────────────────── */}
      <section className="flex flex-col gap-6 animate-fade-in-up delay-100">
        <SectionHeader title="Đánh Giá Mới Nhất" href="/articles" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, i) => (
            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending + Sidebar ────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-3 animate-fade-in-up delay-200">

        {/* Trending list */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 shadow-md shadow-orange-400/30">
              <TrendingUp className="size-4 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Đang Thịnh Hành</h2>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group flex items-start gap-4 border-b border-border/50 p-4 last:border-0 transition-colors hover:bg-muted/50"
              >
                {/* Gradient number */}
                <span
                  className="w-8 shrink-0 text-right text-2xl font-black leading-none select-none"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #a855f7, #3b82f6)"
                      : "none",
                    WebkitBackgroundClip: i === 0 ? "text" : undefined,
                    WebkitTextFillColor: i === 0 ? "transparent" : undefined,
                    backgroundClip: i === 0 ? "text" : undefined,
                    color: i === 0 ? undefined : `oklch(0.7 0 0 / ${0.15 + (4 - i) * 0.1})`,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: post.coverColor }}
                  >
                    {post.category}
                  </span>
                  <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="size-3" />{post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime} phút đọc</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
              <h2 className="text-xl font-bold tracking-tight">Danh Mục</h2>
            </div>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-muted"
                  >
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${cat.color}, ${cat.color}aa)`,
                        boxShadow: `0 4px 12px ${cat.color}40`,
                      }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium">{cat.name}</span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-background">
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Authors */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
                <h2 className="text-xl font-bold tracking-tight">Tác Giả</h2>
              </div>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Xem tất cả
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              {TEAM.map((member) => (
                <div key={member.name} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted cursor-default">
                  <span
                    className="relative flex size-9 shrink-0 overflow-hidden rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ boxShadow: `0 4px 12px ${member.color}40` }}
                  >
                    <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="36px" />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold truncate">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── More recent ───────────────────────────────────── */}
      <section className="flex flex-col gap-6 animate-fade-in-up delay-300">
        <SectionHeader title="Đánh Giá Gần Đây" href="/articles" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((post, i) => (
            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section className="animate-fade-in-up delay-400 relative overflow-hidden rounded-2xl p-10 sm:p-16">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 25%, #2563eb 55%, #0ea5e9 80%, #06b6d4 100%)",
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl animate-pulse-glow delay-300" />
        <div className="pointer-events-none absolute top-0 left-1/2 size-40 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-2xl animate-float delay-200" />

        <div className="relative flex flex-col items-center gap-6 text-center text-white">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg shadow-white/10 backdrop-blur-sm animate-float">
            <Mail className="size-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Đừng bỏ lỡ đánh giá mới</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Nhận thông báo khi có đánh giá mới về điện thoại, màn hình, laptop và phụ kiện — trước khi bạn quyết định mua.
            </p>
          </div>
          <form className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="email@example.com"
              className="h-11 flex-1 rounded-xl border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm transition-colors focus:border-white/50 focus:bg-white/20"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-bold text-violet-700 shadow-xl shadow-black/20 transition-all hover:bg-white/90 hover:shadow-white/20 active:scale-95"
            >
              Đăng Ký
            </button>
          </form>
          <p className="text-xs text-white/50">Không spam. Hủy đăng ký bất kỳ lúc nào.</p>
        </div>
      </section>

    </div>
  );
}
