import Link from "next/link"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-32 text-center">
      <FileSearch className="text-muted-foreground/40 size-12" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">404 — Không tìm thấy trang</h1>
        <p className="text-muted-foreground text-sm">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Về Trang Chủ</Link>
      </Button>
    </div>
  )
}
