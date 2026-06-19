"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-32 text-center">
      <AlertTriangle className="size-12 text-rose-500" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Đã xảy ra lỗi</h1>
        <p className="text-muted-foreground text-sm">
          Có lỗi xảy ra. Bạn có thể thử lại hoặc quay về trang chủ.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Thử lại</Button>
        <Button variant="outline" asChild>
          <Link href="/">Trang Chủ</Link>
        </Button>
      </div>
    </div>
  )
}
