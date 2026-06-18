# The Zero Tech

Blog đánh giá sản phẩm công nghệ tiêu dùng bằng tiếng Việt — điện thoại, màn hình, laptop và phụ kiện. Xây dựng bằng Next.js App Router với Tailwind CSS v4.

## Tech Stack

- **Next.js 16** — App Router, Server Components
- **React 19** — Client Components cho interactive UI
- **Tailwind CSS v4** — Styling với oklch color system
- **shadcn/ui** — Button, Card components
- **lucide-react** — Icons
- **TypeScript** — Strict typing

## Cấu trúc dự án

```
├── app/
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Trang chủ
│   ├── articles/page.tsx   # Danh sách tất cả đánh giá
│   ├── categories/page.tsx # Danh mục sản phẩm
│   └── about/page.tsx      # Giới thiệu đội ngũ
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation bar
│   │   └── Footer.tsx      # Footer với newsletter
│   ├── blog/
│   │   └── ArticleCard.tsx # Card bài đánh giá (3 variants: default, featured, compact)
│   └── ui/
│       ├── button.tsx      # shadcn Button
│       └── card.tsx        # shadcn Card
│
├── lib/
│   ├── posts.ts            # Mock data bài viết (9 reviews)
│   ├── categories.ts       # Danh mục + icons + mô tả
│   ├── team.ts             # Thông tin đội ngũ reviewer
│   └── constants.ts        # SITE_NAME, SITE_DESCRIPTION, NAV_LINKS
│
└── types/
    └── index.ts            # Post, Category types
```

## Danh mục

| Slug        | Tên        | Icon       |
| ----------- | ---------- | ---------- |
| `dienthoai` | Điện Thoại | Smartphone |
| `manhinh`   | Màn Hình   | Monitor    |
| `laptop`    | Laptop     | Laptop     |
| `phukien`   | Phụ Kiện   | Headphones |

## Data Model

```typescript
type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string // Tên hiển thị
  categorySlug: string // "dienthoai" | "manhinh" | "laptop" | "phukien"
  author: string
  date: string // ISO format "YYYY-MM-DD"
  readTime: number // Phút đọc
  coverColor: string // Hex color cho overlay
  coverImage: string // URL ảnh bìa (picsum.photos)
  rating: number // Điểm đánh giá 0–10
}
```

## Cài đặt & chạy

```bash
# Cài dependencies
pnpm install

# Chạy dev server
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

```bash
# Build production
pnpm build

# Chạy production
pnpm start
```

## Thêm bài đánh giá mới

Thêm object vào mảng `POSTS` trong [lib/posts.ts](lib/posts.ts):

```typescript
{
  id: "10",
  slug: "ten-san-pham-review",
  title: "Tên Sản Phẩm: Tiêu Đề Hấp Dẫn",
  excerpt: "Mô tả ngắn 1–2 câu về điểm nổi bật...",
  category: "Điện Thoại",          // Tên hiển thị
  categorySlug: "dienthoai",       // slug danh mục
  author: "Nguyễn Văn An",         // Tên trong lib/team.ts
  date: "2026-06-15",
  readTime: 10,
  coverColor: "#7c3aed",           // Màu tint overlay
  coverImage: "https://picsum.photos/seed/ten-san-pham/800/450",
  rating: 8.5,
}
```

Cập nhật `count` tương ứng trong `CATEGORIES`.

## External Images

Ảnh bìa dùng [picsum.photos](https://picsum.photos) với seed cố định. Ảnh tác giả dùng [randomuser.me](https://randomuser.me). Cả hai domain đã được cấu hình trong `next.config.ts`.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Đẩy lên GitHub rồi import vào [Vercel](https://vercel.com) — không cần cấu hình thêm.
