import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getPosts, getCategories } from "@/lib/content"
import { getCategoryIcon, CATEGORY_DESC } from "@/lib/categories"
import ArticleCard from "@/components/blog/ArticleCard"

export default function CategoriesPage() {
  const posts = getPosts()
  const categories = getCategories()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-border flex flex-col gap-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Danh Mục</h1>
        <p className="text-muted-foreground max-w-xl">
          Tìm đánh giá theo loại sản phẩm bạn quan tâm — điện thoại, màn hình, laptop hay phụ kiện
          công nghệ.
        </p>
      </div>

      {/* ── Category Overview Cards ───────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug)
          return (
            <Link
              key={cat.slug}
              href={`#${cat.slug}`}
              className="group border-border bg-card hover:border-foreground/20 flex flex-col gap-4 rounded-xl border p-5 transition-all hover:shadow-sm"
            >
              <div
                className="flex size-12 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: cat.color }}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">{cat.name}</h2>
                <p className="text-muted-foreground text-xs">{cat.count} bài viết</p>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground mt-auto flex items-center gap-1 text-xs font-medium transition-colors">
                Xem bài viết <ArrowRight className="size-3" />
              </span>
            </Link>
          )
        })}
      </div>

      {/* ── Per-category Sections ─────────────────────────── */}
      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.slug)
        const desc = CATEGORY_DESC[cat.slug]
        const catPosts = posts.filter((p) => p.category === cat.slug)

        return (
          <section key={cat.slug} id={cat.slug} className="flex scroll-mt-20 flex-col gap-6">
            <div className="border-border flex items-start justify-between gap-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <p className="text-muted-foreground max-w-lg text-sm">{desc}</p>
                </div>
              </div>
              <Link
                href={`/articles?category=${cat.slug}`}
                className="text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1 text-sm transition-colors"
              >
                Xem tất cả <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {catPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
