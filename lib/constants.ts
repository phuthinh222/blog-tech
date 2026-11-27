export const SITE_NAME = "Zero Technology"

export const SITE_URL = "https://www.zerotech-lab.site"

// Tạm tắt toàn bộ link affiliate/nút mua (giai đoạn xây traffic). false = ẩn
// nút mua, bảng "Where to buy", thanh mua dính đáy và hộp công bố affiliate
// trong bài. Bật lại khi có chương trình affiliate (VD Amazon Associates).
export const AFFILIATE_LINKS_ENABLED = false

export const CONTACT_EMAIL = "tetdecor85@gmail.com"

// `key` là khoá trong namespace "Nav" của messages/*.json.
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/guides", key: "guides" },
  { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
] as const
