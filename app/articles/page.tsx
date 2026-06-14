import { Search } from "lucide-react";
import Link from "next/link";
import ArticleCard from "@/components/blog/ArticleCard";
import { POSTS, CATEGORIES } from "@/lib/posts";

export default function ArticlesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-10">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tất Cả Đánh Giá</h1>
        <p className="text-muted-foreground max-w-xl">
          Đánh giá chi tiết, trung thực về điện thoại, màn hình, laptop và phụ kiện — từ đội ngũ The Zero Tech dựa trên trải nghiệm thực tế.
        </p>
      </div>

      {/* ── Filter & Search ───────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/articles"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Tất cả
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/articles?category=${cat.slug}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* ── Articles Grid ─────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* ── Pagination ────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1 border-t border-border pt-8">
        <button
          disabled
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground disabled:opacity-40"
        >
          ← Trước
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
              page === 1
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          Sau →
        </button>
      </div>

    </div>
  );
}
