import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, User } from "lucide-react";
import ArticleCard from "@/components/blog/ArticleCard";
import { getPosts, getCategories } from "@/lib/content";
import { getCategoryIcon, getCategoryName } from "@/lib/categories";
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
  const posts      = getPosts();
  const categories = getCategories();

  const featured = posts[0];
  const latest   = posts.slice(1, 4);
  const trending = posts.slice(0, 5);
  const recent   = posts.slice(5, 9);

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
            <div key={post.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
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
                key={post.slug}
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
                    style={{ color: `var(--color-cat-${post.category}, #6366f1)` }}
                  >
                    {getCategoryName(post.category)}
                  </span>
                  <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="size-3" />{post.author}</span>
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
              {categories.map((cat) => {
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
            <div key={post.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}

