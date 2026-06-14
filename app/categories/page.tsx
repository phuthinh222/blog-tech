import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, POSTS } from "@/lib/posts";
import ArticleCard from "@/components/blog/ArticleCard";
import { getCategoryIcon, CATEGORY_DESC } from "@/lib/categories";

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-14">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Danh Mục</h1>
        <p className="text-muted-foreground max-w-xl">
          Tìm đánh giá theo loại sản phẩm bạn quan tâm — điện thoại, màn hình, laptop hay phụ kiện công nghệ.
        </p>
      </div>

      {/* ── Category Overview Cards ───────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`#${cat.slug}`}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: cat.color }}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">{cat.name}</h2>
                <p className="text-xs text-muted-foreground">{cat.count} bài viết</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-auto">
                Xem bài viết <ArrowRight className="size-3" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Per-category Sections ─────────────────────────── */}
      {CATEGORIES.map((cat) => {
        const Icon = getCategoryIcon(cat.slug);
        const desc = CATEGORY_DESC[cat.slug as keyof typeof CATEGORY_DESC];
        const posts = POSTS.filter((p) => p.categorySlug === cat.slug);

        return (
          <section key={cat.slug} id={cat.slug} className="flex flex-col gap-6 scroll-mt-20">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl text-white shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <p className="text-sm text-muted-foreground max-w-lg">{desc}</p>
                </div>
              </div>
              <Link
                href={`/articles?category=${cat.slug}`}
                className="shrink-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Xem tất cả <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Posts grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        );
      })}

    </div>
  );
}
