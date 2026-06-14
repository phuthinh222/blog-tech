import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { BookmarkedArticles } from "@/components/blog/BookmarkedArticles";
import { LogOut, Mail, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hồ Sơ — The Zero Tech",
};

export default async function ProfilePage() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const { user } = session;
  const initials = (user.name ?? user.email ?? "U")[0].toUpperCase();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ── User Card ─────────────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Avatar */}
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name ?? ""}
            className="size-20 shrink-0 rounded-2xl object-cover shadow-xl ring-4 ring-violet-500/20 sm:size-24"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-bold text-white shadow-xl sm:size-24">
            {initials}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5" />
            <span>{user.email}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="size-3" />
            <span>Thành viên The Zero Tech</span>
          </div>
        </div>

        {/* Logout */}
        <a
          href="/auth/logout"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/10 sm:self-center"
        >
          <LogOut className="size-4" />
          Đăng Xuất
        </a>
      </div>

      {/* ── Bookmarks ─────────────────────────────────────── */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500" />
          <h2 className="text-xl font-bold">Bài Viết Đã Lưu</h2>
        </div>
        <BookmarkedArticles />
      </section>

    </main>
  );
}
