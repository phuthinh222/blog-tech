import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPosts, getCategories } from "@/lib/content";
import { getCategoryIcon, getCategoryColor, getCategoryName, CATEGORY_DESC } from "@/lib/categories";
import ArticleCard from "@/components/blog/ArticleCard";

export async function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = getCategoryName(slug);
  if (!name) return {};
  return {
    title: `${name} — The Zero Tech`,
    description: CATEGORY_DESC[slug] ?? `Đánh giá ${name} từ The Zero Tech.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const Icon  = getCategoryIcon(slug);
  const color = getCategoryColor(slug);
  const desc  = CATEGORY_DESC[slug];
  const posts = getPosts().filter((p) => p.category === slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-border pb-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Tất cả danh mục
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 8px 24px ${color}44` }}
          >
            <Icon className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
            {desc && <p className="text-muted-foreground max-w-xl">{desc}</p>}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {posts.length} bài đánh giá
        </p>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
          <Icon className="size-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Chưa có bài viết nào trong danh mục này</p>
          <Link href="/articles" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
            Xem tất cả bài viết →
          </Link>
        </div>
      )}

    </div>
  );
}
