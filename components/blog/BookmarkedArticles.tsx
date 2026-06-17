"use client";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { Post } from "@/types";
import ArticleCard from "@/components/blog/ArticleCard";

export function BookmarkedArticles({ posts }: { posts: Post[] }) {
  const { bookmarks } = useBookmarks();
  const saved = posts.filter((p) => bookmarks.includes(p.slug));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <Bookmark className="size-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">Chưa có bài viết nào được lưu</p>
        <p className="text-xs text-muted-foreground/60">
          Nhấn vào icon <Bookmark className="inline size-3" /> trên bài viết để lưu lại
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((p) => (
        <ArticleCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
