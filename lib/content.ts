import { cache } from "react"
import { getTranslations } from "next-intl/server"
import { supabasePublic } from "@/lib/supabase"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { AMAZON_DEFAULT_URL, SITE_NAME } from "@/lib/constants"
import { routing, type Locale } from "@/i18n/routing"
import type { Post, Category, Offer } from "@/types"

// Content đọc từ Supabase (products/product_translations/product_offers) qua
// anon key + RLS. Mỗi sản phẩm có 1 bản dịch / locale; nếu chưa có bản dịch ở
// locale đang xem thì dùng bản tiếng Việt (defaultLocale) thay vì ẩn bài.
const FALLBACK_LOCALE = routing.defaultLocale

const PRODUCT_SELECT = `
  slug,
  cover_image,
  images,
  specs,
  rating,
  created_at,
  categories ( slug ),
  product_translations!inner ( * ),
  product_offers (
    id, merchant, market, currency, price, affiliate_url, source_url,
    availability, commission_rate, last_checked_at, source_product_id
  )
`

type ProductRow = {
  slug: string
  cover_image: string | null
  images: string[] | null
  specs: { label: string; value: string }[] | null
  rating: Post["rating"] | null
  created_at: string
  categories: { slug: string } | null
  // Chọn "*" (không liệt kê cột) để cột `specs` thêm ở migration 0004 là
  // tuỳ chọn — DB chưa chạy 0004 thì field này chỉ đơn giản là undefined.
  product_translations: {
    locale: string
    specs?: { label: string; value: string }[] | null
    status: string
    title: string
    summary: string | null
    sections: { title: string; content: string }[] | null
    pros: string[] | null
    cons: string[] | null
    buying_advice: string | null
    faq: { question: string; answer: string }[] | null
    seo_title: string | null
    seo_description: string | null
    author: string | null
    verdict_summary: string | null
  }[]
  product_offers: {
    id: string
    merchant: string | null
    market: string
    currency: string
    price: number | null
    affiliate_url: string
    source_url: string | null
    availability: string
    commission_rate: number | null
    last_checked_at: string
    source_product_id: string | null
  }[]
}

// Thuật toán chọn Best Offer — README mục 10:
// availability IN_STOCK trước → commission_rate cao nhất → giá thấp nhất →
// last_checked_at gần nhất.
function pickBestOffer(offers: (Offer & { sourceProductId: string | null })[]) {
  if (offers.length === 0) return null
  const inStock = offers.filter((o) => o.availability === "IN_STOCK")
  const pool = inStock.length > 0 ? inStock : offers
  return [...pool].sort((a, b) => {
    const commissionDiff = (b.commissionRate ?? 0) - (a.commissionRate ?? 0)
    if (commissionDiff !== 0) return commissionDiff
    const priceA = a.price ?? Infinity
    const priceB = b.price ?? Infinity
    if (priceA !== priceB) return priceA - priceB
    return new Date(b.lastCheckedAt).getTime() - new Date(a.lastCheckedAt).getTime()
  })[0]
}

function mapRowToPost(row: ProductRow, locale: Locale): Post | null {
  const translation =
    row.product_translations.find((t) => t.locale === locale) ??
    row.product_translations.find((t) => t.locale === FALLBACK_LOCALE)
  if (!translation) return null

  const offers: Offer[] = (row.product_offers ?? []).map((o) => ({
    id: o.id,
    merchant: o.merchant,
    market: o.market,
    currency: o.currency,
    price: o.price,
    affiliateUrl: o.affiliate_url,
    sourceUrl: o.source_url,
    availability: o.availability,
    commissionRate: o.commission_rate,
    lastCheckedAt: o.last_checked_at,
  }))
  const offersWithSource = (row.product_offers ?? []).map((o, i) => ({
    ...offers[i],
    sourceProductId: o.source_product_id,
  }))
  const bestOffer = pickBestOffer(offersWithSource)
  const offerUrlFor = (pattern: RegExp) =>
    pickBestOffer(offersWithSource.filter((o) => pattern.test(o.affiliateUrl)))?.affiliateUrl

  return {
    slug: row.slug,
    title: translation.title,
    excerpt: translation.summary ?? "",
    category: row.categories?.slug ?? "",
    // Mọi bài đứng tên site (không có tác giả cá nhân) — bỏ qua cột author
    // trong DB (dữ liệu cũ ghi "The Zero Tech").
    author: SITE_NAME,
    publishedAt: row.created_at,
    coverImage: row.cover_image ?? "",
    images: row.images ?? [],
    itemId: bestOffer?.sourceProductId ?? "",
    affiliateUrl: bestOffer?.affiliateUrl ?? "",
    shopeeUrl: offerUrlFor(/shopee/i) ?? "",
    amazonUrl: offerUrlFor(/amazon|amzn/i) ?? AMAZON_DEFAULT_URL,
    price: bestOffer?.price ?? null,
    currency: bestOffer?.price != null ? bestOffer.currency : null,
    priceCheckedAt: bestOffer?.price != null ? bestOffer.lastCheckedAt : null,
    rating: row.rating ?? { overall: 0, design: 0, performance: 0, battery: 0, value: 0 },
    specs: translation.specs ?? row.specs ?? [],
    pros: translation.pros ?? [],
    cons: translation.cons ?? [],
    sections: translation.sections ?? [],
    faq: translation.faq ?? [],
    verdict: {
      summary: translation.verdict_summary ?? "",
      recommendation: translation.buying_advice ?? "",
    },
    seo: {
      metaTitle: translation.seo_title ?? "",
      metaDescription: translation.seo_description ?? "",
      keywords: [],
    },
    offers,
  }
}

// cache() dedupe các lệnh gọi trùng tham số trong cùng 1 render pass (VD trang
// category gọi cả getCategories() lẫn getPosts() — getCategories() gọi lại
// getPosts() nội bộ, chỉ tốn 1 round-trip Supabase thay vì 2).
export const getPosts = cache(async (locale: Locale): Promise<Post[]> => {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "PUBLISHED")
    .in("product_translations.locale", [locale, FALLBACK_LOCALE])
    .eq("product_translations.status", "PUBLISHED")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`getPosts: ${error.message}`)

  return ((data ?? []) as unknown as ProductRow[])
    .map((row) => mapRowToPost(row, locale))
    .filter((p): p is Post => p !== null)
})

export const getPostBySlug = cache(async (slug: string, locale: Locale): Promise<Post | null> => {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "PUBLISHED")
    .eq("slug", slug)
    .in("product_translations.locale", [locale, FALLBACK_LOCALE])
    .eq("product_translations.status", "PUBLISHED")
    .maybeSingle()

  if (error) throw new Error(`getPostBySlug(${slug}): ${error.message}`)
  if (!data) return null

  return mapRowToPost(data as unknown as ProductRow, locale)
})

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
  const [posts, t] = await Promise.all([
    getPosts(locale),
    getTranslations({ locale, namespace: "Categories" }),
  ])
  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(CATEGORY_CONFIG)
    .map(([slug, { color }]) => ({
      slug,
      name: t(`${slug}.name`),
      color,
      count: counts[slug] ?? 0,
    }))
    .filter((cat) => cat.count > 0)
})
