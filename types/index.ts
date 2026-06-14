export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  author: string
  date: string
  readTime: number
  coverColor: string
  coverImage: string
  rating: number
}

export type Category = {
  name: string
  slug: string
  count: number
  color: string
}
