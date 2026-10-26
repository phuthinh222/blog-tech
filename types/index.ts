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
export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  coverImage: string
  images?: string[]
  itemId: string
  affiliateUrl: string
  // Link mua theo từng sàn ("" = sàn đó chưa có offer → không hiện nút).
  shopeeUrl: string
  amazonUrl: string
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
  title: string
  excerpt: string
  category: string
  publishedAt: string
  sections: { title: string; content: string }[]
  faq: { question: string; answer: string }[]
  relatedPosts: string[]
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}
