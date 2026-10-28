import { LampDesk, Gamepad2, Laptop, Headphones, Sparkles, type LucideIcon } from "lucide-react"

// Tên + mô tả từng danh mục theo ngôn ngữ nằm trong messages/*.json, namespace
// "Categories" (`<slug>.name`, `<slug>.desc`). Ở đây chỉ giữ phần không đổi
// theo ngôn ngữ.
export const CATEGORY_CONFIG: Record<string, { color: string; Icon: LucideIcon }> = {
  "desk-setup": { color: "#f97316", Icon: LampDesk },
  "gaming-gear": { color: "#7c3aed", Icon: Gamepad2 },
  "pc-laptop": { color: "#0ea5e9", Icon: Laptop },
  "audio-video": { color: "#ec4899", Icon: Headphones },
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_CONFIG[slug]?.Icon ?? Sparkles
}

export function getCategoryColor(slug: string): string {
  return CATEGORY_CONFIG[slug]?.color ?? "#6366f1"
}

// Danh mục chủ yếu là thiết bị dùng pin (tai nghe Bluetooth, loa, micro không
// dây...). Danh mục khác (màn hình, chuột có dây, giá treo...) vẫn lưu điểm ở
// `rating.battery` nhưng hiển thị là "Độ bền & bảo hành".
const BATTERY_CATEGORIES = new Set(["audio-video"])

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
