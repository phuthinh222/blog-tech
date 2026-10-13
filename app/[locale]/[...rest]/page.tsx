import { notFound } from "next/navigation"

// Bắt mọi đường dẫn không khớp trang nào để hiện app/[locale]/not-found.tsx
// (có Header/Footer và đúng ngôn ngữ) thay vì 404 mặc định của Next.
export default function CatchAllPage() {
  notFound()
}
