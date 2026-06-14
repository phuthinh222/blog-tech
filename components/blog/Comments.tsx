"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogIn, MessageSquare, Send, Trash2 } from "lucide-react";
import type { Comment } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name, picture }: { name: string; picture: string | null }) {
  const initials = name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="size-9 shrink-0 rounded-full object-cover ring-2 ring-border"
      />
    );
  }
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white ring-2 ring-border">
      {initials}
    </div>
  );
}

export function Comments({ slug }: { slug: string }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setComments(data); })
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, body }),
    });
    if (res.ok) {
      const comment: Comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setBody("");
      textareaRef.current?.focus();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
        <h2 className="text-xl font-bold">
          Bình Luận
          {comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <Avatar name={user.name ?? "U"} picture={user.picture ?? null} />
          <div className="flex flex-1 flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm outline-none transition-colors focus:border-violet-500 focus:bg-background"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Đăng với tên <span className="font-medium">{user.name}</span>
              </span>
              <button
                type="submit"
                disabled={!body.trim() || submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="size-3.5" />
                {submitting ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="size-4" />
            Đăng nhập để tham gia bình luận
          </div>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 hover:opacity-90 transition-opacity"
          >
            <LogIn className="size-3.5" />
            Đăng Nhập
          </a>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="size-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <MessageSquare className="size-10 opacity-20" />
          <p className="text-sm font-medium">Chưa có bình luận nào</p>
          <p className="text-xs opacity-60">Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.user_name} picture={comment.user_picture} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{comment.user_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                  {user?.sub === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-xs text-rose-500/60 hover:text-rose-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Xóa
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
