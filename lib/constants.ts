export const SITE_NAME = "Zero Technology"

export const SITE_URL = "https://www.zerotech-lab.site"

export const CONTACT_EMAIL = "tetdecor85@gmail.com"

// Link Amazon tạm cho mọi sản phẩm chưa có offer Amazon trong product_offers.
// Khi thêm offer Amazon (affiliate_url chứa amazon/amzn) vào DB, link đó tự thay thế.
export const AMAZON_DEFAULT_URL = "https://www.amazon.com/"

// `key` là khoá trong namespace "Nav" của messages/*.json.
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/guides", key: "guides" },
  { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
] as const
