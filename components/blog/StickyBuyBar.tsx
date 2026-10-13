"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { BuyButton } from "@/components/blog/BuyButton"
import { PriceTag } from "@/components/blog/PriceTag"
import type { Post } from "@/types"

type Props = {
  post: Pick<
    Post,
    "title" | "coverImage" | "rating" | "affiliateUrl" | "price" | "currency" | "priceCheckedAt"
  >
}

// Thanh "Mua sản phẩm" dính đáy màn hình — chỉ trên điện thoại/iPad dọc (dưới
// lg, khi sidebar nằm dưới bài). Hiện khi người đọc cuộn tới bảng thông số
// (#specs, không có thì tới phần mở đầu bài) và tự ẩn khi khối mua chính
// (#buy-box) đang nằm trên màn hình (không trùng 2 nút) hoặc khi tới footer.
export function StickyBuyBar({ post }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const anchor = document.getElementById("specs") ?? document.getElementById("article-content")
      const buyBox = document.getElementById("buy-box")
      // Hiện ngay khi bảng thông số bắt đầu lộ ra ở mép dưới màn hình.
      const reachedAnchor = anchor ? anchor.getBoundingClientRect().top < window.innerHeight : false
      const buyBoxRect = buyBox?.getBoundingClientRect()
      const buyBoxOnScreen =
        !!buyBoxRect && buyBoxRect.top < window.innerHeight && buyBoxRect.bottom > 0
      // Tới footer thì ẩn để không che các link cuối trang.
      const footerTop = document.querySelector("footer")?.getBoundingClientRect().top
      const atFooter = footerTop !== undefined && footerTop < window.innerHeight
      setVisible(reachedAnchor && !buyBoxOnScreen && !atFooter)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        {post.coverImage && (
          <span className="relative size-11 shrink-0 overflow-hidden rounded-lg">
            <Image src={post.coverImage} alt="" fill className="object-cover" sizes="44px" />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-semibold">{post.title}</p>
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-yellow-500">
              <Star className="size-3 fill-yellow-500" />
              {post.rating.overall}
            </span>
            <PriceTag post={post} compact />
          </p>
        </div>
        <BuyButton url={post.affiliateUrl} size="sm" />
      </div>
    </div>
  )
}
