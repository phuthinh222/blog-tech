import { Smartphone, Monitor, Laptop, Headphones, Music, type LucideIcon } from "lucide-react"

// Tên + mô tả từng danh mục theo ngôn ngữ nằm trong messages/*.json, namespace
// "Categories" (`<slug>.name`, `<slug>.desc`). Ở đây chỉ giữ phần không đổi
// theo ngôn ngữ.
export const CATEGORY_CONFIG: Record<string, { color: string; Icon: LucideIcon }> = {
  phone: { color: "#7c3aed", Icon: Smartphone },
  monitor: { color: "#0ea5e9", Icon: Monitor },
  laptop: { color: "#10b981", Icon: Laptop },
  accessory: { color: "#f97316", Icon: Headphones },
  audio: { color: "#ec4899", Icon: Music },
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_CONFIG[slug]?.Icon ?? Smartphone
}

export function getCategoryColor(slug: string): string {
  return CATEGORY_CONFIG[slug]?.color ?? "#6366f1"
}

// Danh mục có sản phẩm dùng pin. Danh mục khác (màn hình, phụ kiện có dây, giá
// treo...) vẫn lưu điểm ở `rating.battery` nhưng hiển thị là "Độ bền & bảo hành".
const BATTERY_CATEGORIES = new Set(["phone", "laptop", "audio"])

export type RatingLabelKey = "design" | "performance" | "battery" | "durability" | "value"

// Khoá nhãn (namespace "Rating" của messages/*.json) cho tiêu chí thứ 3.
export function batteryLabelKey(category: string): "battery" | "durability" {
  return BATTERY_CATEGORIES.has(category) ? "battery" : "durability"
}

// `key` là khoá trong namespace "Rating" của messages/*.json.
export function getRatingBreakdown(
  rating: {
    overall: number
    design: number
    performance: number
    battery: number
    value: number
  },
  category: string
): { key: RatingLabelKey; score: number }[] {
  return [
    { key: "design", score: rating.design },
    { key: "performance", score: rating.performance },
    { key: batteryLabelKey(category), score: rating.battery },
    { key: "value", score: rating.value },
  ]
}
