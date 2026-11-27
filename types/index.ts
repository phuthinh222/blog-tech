// Offer 1 sản phẩm trên 1 market/merchant (README.md mục 2.2 — Product ≠ Offer).
// Nguồn: bảng product_offers.
export type Offer = {
  id: string
  merchant: string | null
  market: string
  currency: string
  price: number | null
  affiliateUrl: string
  sourceUrl: string | null
  availability: string
  commissionRate: number | null
  lastCheckedAt: string
}

// View model cho UI (trang review, ArticleCard, ...). Từ Phase 2 trở đi được
// compose từ products + product_translations + product_offers trên Supabase
// thay vì đọc content/posts/*.json trực tiếp — xem lib/content.ts.
//
// itemId/affiliateUrl vẫn giữ dạng field đơn (không phải mảng) để tương thích
// ngược với UI hiện tại (1 nút CTA, 1 JSON-LD). Giá trị lấy từ "best offer"
// theo thuật toán ở README mục 10. Field `offers` chứa toàn bộ danh sách offer
// — Phase 3 (tách Product ≠ Offer trong UI) sẽ dùng field này để render nhiều
// offer theo market thay vì 1 CTA duy nhất.
// Nơi mua Amazon theo khu vực — link tìm kiếm (gắn tracking ID của đúng
// marketplace) khi chưa có offer Amazon cụ thể. Không kèm giá: giá đổi liên tục.
export type AmazonRegion = "US" | "UK" | "DE"
export type RegionalLink = { region: AmazonRegion; url: string }

// Phần bổ sung của bài review (cột product_translations.extras, migration 0006)
// — tất cả tuỳ chọn, bài cũ chưa có thì UI ẩn mục tương ứng.
export type ReviewExtras = {
  // Tên sản phẩm để tìm trên Amazon (VD "Logitech G203 LIGHTSYNC" — tên bán ở
  // Mỹ/châu Âu khác tên ở châu Á). Bỏ trống thì lấy phần trước ":" của title.
  productName?: string
  // Ghi chú theo khu vực (tên gọi khác, bảo hành, phiên bản).
  regionalNote?: string
  // false = sản phẩm không bán trên Amazon (VD thương hiệu chỉ có ở Việt Nam):
  // ẩn bảng "Where to buy" và nút mua Amazon.
  amazon?: boolean
  bestFor?: string[]
  notFor?: string[]
  alternatives?: { name: string; slug?: string; note: string }[]
  sources?: { label: string; url: string }[]
}

export type Post = {
  slug: string
  // Ngôn ngữ của nội dung đang hiển thị — khác locale của trang khi bài chưa có
  // bản dịch và đang dùng bản tiếng Việt (SEO: noindex, không đưa vào sitemap).
  contentLocale: string
  title: string
  excerpt: string
  category: string
  author: string
  // Slug trang tác giả (/authors/<slug>); "" = đứng tên site.
  authorSlug: string
  publishedAt: string
  // Ngày cập nhật nội dung/giá gần nhất (= publishedAt nếu chưa cập nhật).
  updatedAt: string
  // "tested" = đã test thực tế, "compiled" = tổng hợp từ thông số + đánh giá.
  reviewMethod: "tested" | "compiled"
  coverImage: string
  images?: string[]
  itemId: string
  affiliateUrl: string
  // Link mua theo từng sàn ("" = sàn đó chưa có offer → không hiện nút).
  amazonUrl: string
  taobaoUrl: string
  // Giá của best offer (null = chưa có giá thật — UI ẩn phần giá).
  price: number | null
  currency: string | null
  priceCheckedAt: string | null
  rating: {
    overall: number
    design: number
    performance: number
    battery: number
    value: number
  }
  specs: { label: string; value: string }[]
  pros: string[]
  cons: string[]
  sections: { title: string; content: string }[]
  faq: { question: string; answer: string }[]
  verdict: {
    summary: string
    recommendation: string
  }
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  // Mới ở Phase 2 — không phá vỡ UI hiện tại (chỉ thêm), dùng cho Phase 3.
  offers: Offer[]
  productName: string
  amazonLinks: RegionalLink[]
  extras: ReviewExtras
}

export type Category = {
  slug: string
  name: string
  color: string
  count: number
}

// Bài hướng dẫn chọn mua — không chấm điểm, không gắn offer. Nguồn:
// content/guides/*.json (xem lib/guides.ts). `relatedPosts` là slug các bài
// review liên quan, hiển thị cuối bài để dẫn về trang có nút mua.
export type Guide = {
  slug: string
  // Như Post.contentLocale — gán khi đọc file, không có trong JSON.
  contentLocale: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  // Ngày sửa nội dung gần nhất (YYYY-MM-DD) — hiện "Cập nhật …" + dateModified.
  updatedAt?: string
  sections: { title: string; content: string }[]
  faq: { question: string; answer: string }[]
  relatedPosts: string[]
  // true = không hiện hộp "Lựa chọn tốt nhất" (VD bài gom nhiều loại sản phẩm,
  // điểm khác danh mục không so sánh được với nhau).
  hideBestPick?: boolean
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}
