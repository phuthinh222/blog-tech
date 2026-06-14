import { Smartphone, Monitor, Laptop, Headphones, type LucideIcon } from "lucide-react"

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  dienthoai: Smartphone,
  manhinh:   Monitor,
  laptop:    Laptop,
  phukien:   Headphones,
}

export const CATEGORY_DESC: Record<string, string> = {
  dienthoai: "Đánh giá chi tiết các flagship và mid-range mới nhất từ Apple, Samsung, Google và các hãng hàng đầu — camera, hiệu năng, pin và trải nghiệm thực tế.",
  manhinh:   "Review màn hình 4K, OLED, gaming monitor và màn hình đồ họa — độ phân giải, màu sắc, refresh rate và giá trị thực sự bạn nhận được.",
  laptop:    "Phân tích laptop văn phòng, ultrabook, gaming laptop — hiệu năng chip, thời lượng pin, thiết kế và mức giá xứng đáng nhất.",
  phukien:   "Tai nghe, chuột, bàn phím, sạc nhanh và mọi phụ kiện công nghệ — liệu chúng có đáng đồng tiền bạn bỏ ra?",
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Smartphone
}
