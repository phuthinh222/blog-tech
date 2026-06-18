import { Smartphone, Monitor, Laptop, Headphones, Music, type LucideIcon } from "lucide-react"

export const CATEGORY_CONFIG: Record<string, { name: string; color: string; Icon: LucideIcon }> = {
  phone: { name: "Điện Thoại", color: "#7c3aed", Icon: Smartphone },
  monitor: { name: "Màn Hình", color: "#0ea5e9", Icon: Monitor },
  laptop: { name: "Laptop", color: "#10b981", Icon: Laptop },
  accessory: { name: "Phụ Kiện", color: "#f97316", Icon: Headphones },
  audio: { name: "Âm Thanh", color: "#ec4899", Icon: Music },
}

export const CATEGORY_DESC: Record<string, string> = {
  phone:
    "Đánh giá chi tiết các flagship và mid-range mới nhất từ Apple, Samsung, Google và các hãng hàng đầu — camera, hiệu năng, pin và trải nghiệm thực tế.",
  monitor:
    "Review màn hình 4K, OLED, gaming monitor và màn hình đồ họa — độ phân giải, màu sắc, refresh rate và giá trị thực sự bạn nhận được.",
  laptop:
    "Phân tích laptop văn phòng, ultrabook, gaming laptop — hiệu năng chip, thời lượng pin, thiết kế và mức giá xứng đáng nhất.",
  accessory:
    "Tai nghe, chuột, bàn phím, sạc nhanh và mọi phụ kiện công nghệ — liệu chúng có đáng đồng tiền bạn bỏ ra?",
  audio:
    "Review loa bluetooth, tai nghe true wireless và thiết bị âm thanh di động — chất lượng âm thanh thực tế, pin và độ bền.",
}

export const RATING_LABELS = {
  design: "Thiết kế",
  performance: "Hiệu năng",
  battery: "Pin",
  value: "Giá trị",
} as const

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_CONFIG[slug]?.Icon ?? Smartphone
}

export function getCategoryColor(slug: string): string {
  return CATEGORY_CONFIG[slug]?.color ?? "#6366f1"
}

export function getCategoryName(slug: string): string {
  return CATEGORY_CONFIG[slug]?.name ?? slug
}

export function getRatingBreakdown(rating: {
  overall: number
  design: number
  performance: number
  battery: number
  value: number
}): { label: string; score: number }[] {
  return [
    { label: RATING_LABELS.design, score: rating.design },
    { label: RATING_LABELS.performance, score: rating.performance },
    { label: RATING_LABELS.battery, score: rating.battery },
    { label: RATING_LABELS.value, score: rating.value },
  ]
}
