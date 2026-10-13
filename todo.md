# TODO — blog-tech alignment với README.md (tech_review platform)

Checklist triển khai để blog-tech tương thích với kiến trúc mô tả trong `../README.md` (Telegram → Cloudflare Worker → Supabase → AI → Website/Facebook affiliate automation).

Thứ tự đề xuất: **Phase 1 → 2 → 3 → 4** trước (nền tảng dữ liệu + tracking), sau đó Phase 5–8 có thể làm song song hoặc theo ưu tiên riêng.

## Phase 1 — Data foundation

- [x] Thiết kế schema Supabase đầy đủ theo README mục 5: `brands`, `categories` (có `parent_id`), `products`, `product_sources`, `product_offers`, `product_translations`, `social_posts`, `affiliate_clicks`, `ai_usage`. → `supabase/migrations/0001_init_schema.sql` (có thêm vài cột mở rộng ngoài mục 5, xem comment trong file).
- [x] Viết migration SQL (foreign keys, unique constraints, indexes). → `supabase/migrations/0001_init_schema.sql`.
- [x] Bật RLS: read-only public policy cho `products`/`product_offers`/`product_translations`/`categories`/`brands` (đọc qua anon key), write chỉ qua service-role key (dùng bởi Worker). → `supabase/migrations/0002_rls_policies.sql`.
- [x] Viết script one-off import 7 file `content/posts/*.json` hiện có vào Supabase, kèm bảng mapping field. → `scripts/import-content.mjs` (dry-run mặc định, `--commit` để ghi thật; hướng dẫn ở `supabase/README.md`).
- [x] Xóa `lib/post-details.ts` (dead code, không còn liên quan sau khi có Supabase). → đã xóa (đã xác nhận không có import nào tới file này).
- [ ] Xử lý `priceRange` (string bucket) → cần giá trị số thật (`price` + `currency`) trong `product_offers`; nếu chưa có số thật cho 7 sản phẩm cũ, cần nhập tay hoặc tạm ước lượng. **Còn lại: cần bạn nhập giá thật thủ công** — script import cố tình để `price = NULL` thay vì suy đoán (xem `supabase/README.md`).

**Trước khi qua Phase 2:** chạy migration + `node --env-file=.env.local scripts/import-content.mjs --commit` trên Supabase project thật, xác nhận dữ liệu lên đúng, rồi tự điền `price`/`brand`/`model` còn thiếu.

## Phase 2 — Chuyển content layer sang Supabase

- [x] Viết lại `lib/content.ts`: bỏ `fs.readdirSync`/`fs.readFileSync`, thay bằng Supabase query (join `products` + `product_translations` theo `locale` + `product_offers`) qua `supabasePublic` (anon key, tôn trọng RLS). Có thêm `pickBestOffer()` implement thuật toán mục 10 ngay trong Phase 2 (Phase 3 chỉ cần thêm UI, không cần viết lại thuật toán).
- [x] Cập nhật `types/index.ts`: thêm type `Offer` riêng (khớp `product_offers`), nhưng **giữ nguyên** shape `Post` hiện tại (không tách hẳn thành Product/Offer/ProductTranslation) — quyết định có chủ đích để Phase 2 chỉ đổi nguồn dữ liệu, không đổi UI cùng lúc. `Post` giờ có thêm field `offers: Offer[]` (additive, không phá vỡ component nào) để Phase 3 dùng. `itemId`/`affiliateUrl` được tính từ best offer.
- [x] Xóa `lib/posts.ts` (đã xác nhận không còn import nào tới nó — mọi nơi gọi thẳng `@/lib/content`).
- [x] Thêm `export const revalidate = 3600` (ISR) ở `app/page.tsx`, `app/articles/page.tsx`, `app/articles/[slug]/page.tsx`, `app/categories/page.tsx`, `app/categories/[slug]/page.tsx`. `generateStaticParams`/`generateMetadata`/page component đều đã chuyển sang `await getPosts()`/`await getPostBySlug()`/`await getCategories()`. Cũng đã sửa `app/profile/page.tsx` (dùng `getPosts()` cho bookmark) — bị `tsc` bắt lỗi vì quên sửa lúc đầu.
- [x] Cập nhật `app/api/posts/route.ts` — `GET` giờ `async` + `await getPosts()`. Giữ route lại (không xóa) vì không xác nhận được có consumer ngoài nào đang gọi.

**Ghi chú quan trọng — schema mở rộng thêm ngoài Phase 1:** UI hiện tại render `sections[]` thành từng block có heading + TOC anchor riêng (không phải 1 khối text) — nếu gộp phẳng vào `description` như dự tính ban đầu sẽ làm hỏng UI. Đã thêm migration mới **`supabase/migrations/0003_translation_extras.sql`** (cột `sections jsonb`, `author text`, `verdict_summary text` trên `product_translations`) và cập nhật `scripts/import-content.mjs` để ghi đúng 3 cột này thay vì gộp vào `description`.

**Việc bạn cần làm trước khi Phase 2 chạy được thật:**

1. Chạy `supabase/migrations/0003_translation_extras.sql` trong SQL Editor (sau `0001`/`0002` đã chạy).
2. Chạy lại `node --env-file=.env.local scripts/import-content.mjs --commit` (an toàn, upsert lại 7 sản phẩm cũ với `sections`/`author`/`verdict_summary` đầy đủ).
3. `pnpm dev` và mở `/`, `/articles`, `/articles/<slug>`, `/categories`, `/categories/<slug>` để xác nhận trang vẫn hiển thị đúng như trước (tôi không tự chạy được — sandbox của tôi không resolve được DNS `*.supabase.co`, xem hội thoại trước).

## Phase 3 — Tách Product ≠ Offer trong UI

- [ ] Xây component "Offer section" mới: hiển thị danh sách offer theo `market` (README mục 10 — ví dụ Amazon/Keychron cho US, Shopee/TikTok Shop cho VN), thay cho nút CTA đơn `<a href={post.affiliateUrl}>` hiện tại trong `app/articles/[slug]/page.tsx`.
- [ ] Implement thuật toán chọn Best Offer (mục 10: availability → commission_rate → giá → last_checked_at) ở server-side trước khi render.
- [ ] Cập nhật JSON-LD `Review`/`Product` schema trong `app/articles/[slug]/page.tsx` để phản ánh nhiều offer (Product schema hỗ trợ `offers[]` array theo schema.org).

## Phase 4 — Affiliate redirect & tracking

- [ ] Tạo route `app/go/[product]/route.ts`: nhận `product` slug, xác định market (theo mục 27: browser locale/IP/user preference), chọn Best Offer, ghi 1 row vào `affiliate_clicks` (product_id, offer_id, market, locale, referrer, device), rồi `redirect()` sang `affiliate_url` thật.
- [ ] Đổi mọi nút "Xem giá tốt nhất" trong content/template để trỏ qua `/go/:product` thay vì `affiliateUrl` trực tiếp.
- [ ] Thêm `rel="sponsored nofollow"` trên link ra ngoài (giữ nguyên `rel="sponsored"` đang có, bổ sung `nofollow`).

## Phase 5 — i18n & routing (`/reviews`, `/vi/reviews`)

- [x] Quyết định giải pháp i18n: dùng `next-intl` (vi/en/zh, `localePrefix: "as-needed"` — vi giữ URL cũ, `/en`, `/zh`). Xem `i18n/routing.ts`.
- [ ] Đổi route `app/articles/[slug]` → `app/reviews/[slug]` (và giữ redirect 301 từ `/articles/*` cũ nếu đã có traffic/SEO index).
- [x] Cấu trúc `app/[locale]/...` chung cho mọi trang (đổi `/articles` → `/reviews` vẫn để mục trên).
- [x] Bỏ hardcode `<html lang="vi">`, set động theo locale (`app/[locale]/layout.tsx`).
- [x] Thêm Language switcher (`VI | EN | 中文`) — `components/layout/LocaleSwitcher.tsx` trong Header.
- [x] Thêm `hreflang` alternate links trong `generateMetadata` (mọi trang, `lib/seo.ts`).
- [ ] Cập nhật `next.config.ts` nếu cần rewrites cho routing locale.

## Phase 6 — SEO còn thiếu

- [ ] Tạo `app/sitemap.ts` (Next 16 native sitemap generator) — hiện chưa tồn tại dù `proxy.ts` đã loại trừ path này như thể có sẵn.
- [ ] Tạo `app/robots.ts`.
- [ ] Thêm `canonical` vào `generateMetadata` của `app/reviews/[slug]/page.tsx` (hiện chỉ có ở trang category).
- [ ] Thêm Breadcrumb JSON-LD (mục 28) vào trang review.
- [ ] Thêm Organization/WebSite JSON-LD ở `app/layout.tsx` (hiện chưa có schema global nào).

## Phase 7 — Compliance

- [ ] Thêm affiliate disclosure cố định (template-level, không cần AI sinh) render trên mọi trang review có affiliate offer — theo yêu cầu Amazon Associates + FTC đã thêm vào README mục 19.
- [ ] Thêm dòng disclosure tương ứng nếu sau này hiển thị nội dung Facebook preview trên site (nếu có).

## Phase 8 — Data model hoàn thiện (có thể làm song song/sau Phase 1–2)

- [ ] Chuyển `lib/categories.ts` từ flat 5-category hardcode sang đọc `categories` table có `parent_id` (hỗ trợ phân cấp như README mục 5 ví dụ Technology → Computer → Developer Gear → Keyboard).
- [ ] Thêm `brands` table + liên kết vào `products.brand_id`; hiển thị brand trên trang review (hiện `author` đang bị dùng nhầm làm "reviewer", không phải brand).
- [ ] Giữ `lib/team.ts` (TEAM hardcode) riêng biệt — đây là editorial team, không liên quan Product/Brand, không cần đổi.
