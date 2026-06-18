import { getPosts, getCategories } from "@/lib/content"
import { ArticlesList } from "@/components/blog/ArticlesList"

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams
  const posts = getPosts()
  const categories = getCategories()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="border-border flex flex-col gap-3 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tất Cả Đánh Giá</h1>
        <p className="text-muted-foreground max-w-xl">
          Đánh giá chi tiết, trung thực về điện thoại, màn hình, laptop và phụ kiện — từ đội ngũ The
          Zero Tech dựa trên trải nghiệm thực tế.
        </p>
      </div>

      <ArticlesList
        posts={posts}
        categories={categories}
        initialQuery={params.q ?? ""}
        initialCategory={params.category ?? ""}
      />
    </div>
  )
}
