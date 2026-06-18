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
}

export type Category = {
  slug: string
  name: string
  color: string
  count: number
}
