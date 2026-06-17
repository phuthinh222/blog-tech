import fs from "fs"
import path from "path"
import type { Post, Category } from "@/types"
import { CATEGORY_CONFIG } from "@/lib/categories"

const POSTS_DIR = path.join(process.cwd(), "content/posts")

export function getPosts(): Post[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"))
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf-8")) as Post)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Post
}

export function getCategories(): Category[] {
  const posts = getPosts()
  return Object.entries(CATEGORY_CONFIG)
    .map(([slug, { name, color }]) => ({
      slug,
      name,
      color,
      count: posts.filter((p) => p.category === slug).length,
    }))
    .filter((cat) => cat.count > 0)
}
