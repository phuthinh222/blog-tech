import { cache } from "react"
import { getTranslations } from "next-intl/server"
import { supabasePublic } from "@/lib/supabase"
import { authorForCategory } from "@/lib/authors"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { AFFILIATE_LINKS_ENABLED, SITE_NAME } from "@/lib/constants"
import { routing, SOURCE_LOCALE, type Locale } from "@/i18n/routing"
import type { AmazonRegion, Category, Offer, Post, RegionalLink, ReviewExtras } from "@/types"

// Content đọc từ Supabase (products/product_translations/product_offers) qua
// anon key + RLS. Mỗi sản phẩm có 1 bản dịch / locale; nếu chưa có bản dịch ở
// locale đang xem thì dùng bản gốc tiếng Việt (SOURCE_LOCALE) thay vì ẩn bài.
const FALLBACK_LOCALE = SOURCE_LOCALE

// Cột của products lấy bằng "*" để các cột thêm ở migration 0005
// (review_method, content_updated_at) là tuỳ chọn — DB chưa chạy 0005 thì
// field chỉ là undefined.
const PRODUCT_SELECT = `
  *,
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
  updated_at: string
  review_method?: string | null
  content_updated_at?: string | null
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
    extras?: ReviewExtras | null
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

// Tracking ID Amazon Associates cho kênh website — mỗi marketplace một ID riêng
// (ID của amazon.com không dùng được ở amazon.co.uk/.de). Đặt trong env:
// AMAZON_WEB_TAG (US, VD "zerotech-web-20"), AMAZON_UK_TAG, AMAZON_DE_TAG. Các
// kênh Pinterest/YouTube dùng ID riêng khi tạo link ở nơi đó. Link amazon.* trên
// site luôn mang tag của đúng marketplace, kể cả khi offer trong DB lưu tag
// khác. Link rút gọn amzn.to không sửa được — giữ nguyên.
const AMAZON_MARKETS: Record<AmazonRegion, { host: string; tag: string | undefined }> = {
  US: { host: "www.amazon.com", tag: process.env.AMAZON_WEB_TAG },
  UK: { host: "www.amazon.co.uk", tag: process.env.AMAZON_UK_TAG },
  DE: { host: "www.amazon.de", tag: process.env.AMAZON_DE_TAG },
}

function amazonTagFor(hostname: string): string | undefined {
  const host = hostname.toLowerCase().replace(/^(www|smile)\./, "")
  return Object.values(AMAZON_MARKETS).find((m) => m.host.replace(/^www\./, "") === host)?.tag
}

function withAmazonTag(url: string | undefined): string | undefined {
  if (!url) return url
  try {
    const u = new URL(url)
    const tag = amazonTagFor(u.hostname)
    if (!tag) return url
    u.searchParams.set("tag", tag)
    return u.toString()
  } catch {
    return url
  }
}

// Link tìm kiếm sản phẩm ở từng marketplace (Amazon cho phép link affiliate tới
// trang kết quả tìm kiếm). Marketplace chưa có tag vẫn hiện link (không hoa hồng).
function amazonSearchLinks(query: string): RegionalLink[] {
  if (!query) return []
  return (Object.keys(AMAZON_MARKETS) as AmazonRegion[]).map((region) => {
    const { host, tag } = AMAZON_MARKETS[region]
    const params = new URLSearchParams({ k: query })
    if (tag) params.set("tag", tag)
    return { region, url: `https://${host}/s?${params}` }
  })
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
  const extras: ReviewExtras = translation.extras ?? {}
  const productName = extras.productName?.trim() || translation.title.split(":")[0].trim()
  // Khớp theo merchant trước — link affiliate rút gọn (VD shorten.asia của
  // AccessTrade) không chứa tên sàn trong URL.
  const offerUrlFor = (pattern: RegExp) =>
    pickBestOffer(
      offersWithSource.filter((o) => pattern.test(o.merchant ?? "") || pattern.test(o.affiliateUrl))
    )?.affiliateUrl

  return {
    slug: row.slug,
    contentLocale: translation.locale,
    title: translation.title,
    excerpt: translation.summary ?? "",
    category: row.categories?.slug ?? "",
    // Tác giả = bút danh biên tập phụ trách danh mục (lib/authors.ts); bỏ qua
    // cột author trong DB (dữ liệu cũ ghi "The Zero Tech").
    author: authorForCategory(row.categories?.slug ?? "")?.name ?? SITE_NAME,
    authorSlug: authorForCategory(row.categories?.slug ?? "")?.slug ?? "",
    publishedAt: row.created_at,
    // Ngày cập nhật do người viết ghi; chưa có thì coi như ngày đăng.
    updatedAt: row.content_updated_at ?? row.created_at,
    reviewMethod: row.review_method === "tested" ? "tested" : "compiled",
    coverImage: row.cover_image ?? "",
    images: row.images ?? [],
    itemId: bestOffer?.sourceProductId ?? "",
    affiliateUrl: bestOffer?.affiliateUrl ?? "",
    amazonUrl: AFFILIATE_LINKS_ENABLED ? (withAmazonTag(offerUrlFor(/amazon|amzn/i)) ?? "") : "",
    taobaoUrl: AFFILIATE_LINKS_ENABLED ? (offerUrlFor(/taobao/i) ?? "") : "",
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
    productName,
    amazonLinks:
      !AFFILIATE_LINKS_ENABLED || extras.amazon === false ? [] : amazonSearchLinks(productName),
    extras,
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

// Các ngôn ngữ đã có bản dịch PUBLISHED của 1 bài — dùng cho hreflang/canonical.
export const getPostLocales = cache(async (slug: string): Promise<Locale[]> => {
  const { data, error } = await supabasePublic
    .from("products")
    .select("product_translations!inner ( locale )")
    .eq("status", "PUBLISHED")
    .eq("slug", slug)
    .eq("product_translations.status", "PUBLISHED")
    .maybeSingle()

  if (error) throw new Error(`getPostLocales(${slug}): ${error.message}`)
  const translated = new Set(
    ((data?.product_translations ?? []) as { locale: string }[]).map((t) => t.locale)
  )
  return routing.locales.filter((l) => translated.has(l))
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
