import fs from "fs"
import path from "path"
import { cache } from "react"
import type { Post, Category } from "@/types"
import { CATEGORY_CONFIG } from "@/lib/categories"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

// Module-level cache — shared across requests in production, reset on hot-reload in dev
let _postsCache: Post[] | null = null

export function getPosts(): Post[] {
  if (_postsCache) return _postsCache
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"))
  _postsCache = files
    .flatMap((f) => {
      try {
        return [JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf-8")) as Post]
      } catch {
        return []
      }
    })
    .sort((a, b) => {
      const ta = new Date(a.publishedAt).getTime()
      const tb = new Date(b.publishedAt).getTime()
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta)
    })
  return _postsCache
}

// React.cache deduplicates calls with the same slug within a single render tree
// (e.g. generateMetadata and the page component both calling getPostBySlug for the same slug)
export const getPostBySlug = cache((slug: string): Post | null => {
  const filePath = path.resolve(POSTS_DIR, `${slug}.json`)
  if (!filePath.startsWith(POSTS_DIR + path.sep)) return null
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Post
  } catch {
    return null
  }
})

export function getCategories(): Category[] {
  const posts = getPosts()
  // Single-pass count — O(posts) instead of O(posts × categories)
  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(CATEGORY_CONFIG)
    .map(([slug, { name, color }]) => ({ slug, name, color, count: counts[slug] ?? 0 }))
    .filter((cat) => cat.count > 0)
}
