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
- [x] Đổi route `app/articles/[slug]` → `app/reviews/[slug]` (và giữ redirect 301 từ `/articles/*` cũ nếu đã có traffic/SEO index).
- [x] Cấu trúc `app/[locale]/...` chung cho mọi trang (đổi `/articles` → `/reviews` vẫn để mục trên).
- [x] Bỏ hardcode `<html lang="vi">`, set động theo locale (`app/[locale]/layout.tsx`).
- [x] Thêm Language switcher (`VI | EN | 中文`) — `components/layout/LocaleSwitcher.tsx` trong Header.
- [x] Thêm `hreflang` alternate links trong `generateMetadata` (mọi trang, `lib/seo.ts`).
- [ ] Cập nhật `next.config.ts` nếu cần rewrites cho routing locale.

## Phase 6 — SEO còn thiếu

- [x] Tạo `app/sitemap.ts` (Next 16 native sitemap generator) — hiện chưa tồn tại dù `proxy.ts` đã loại trừ path này như thể có sẵn.
- [x] Tạo `app/robots.ts`.
- [x] Thêm `canonical` vào `generateMetadata` của `app/reviews/[slug]/page.tsx` (hiện chỉ có ở trang category).
- [x] Thêm Breadcrumb JSON-LD (mục 28) vào trang review.
- [x] Thêm Organization/WebSite JSON-LD ở `app/layout.tsx` (hiện chưa có schema global nào).

## Phase 7 — Compliance

- [x] Thêm affiliate disclosure cố định (template-level, không cần AI sinh) render trên mọi trang review có affiliate offer — theo yêu cầu Amazon Associates + FTC đã thêm vào README mục 19.
- [ ] Thêm dòng disclosure tương ứng nếu sau này hiển thị nội dung Facebook preview trên site (nếu có).

## Phase 8 — Data model hoàn thiện (có thể làm song song/sau Phase 1–2)

- [ ] Chuyển `lib/categories.ts` từ flat 5-category hardcode sang đọc `categories` table có `parent_id` (hỗ trợ phân cấp như README mục 5 ví dụ Technology → Computer → Developer Gear → Keyboard).
- [ ] Thêm `brands` table + liên kết vào `products.brand_id`; hiển thị brand trên trang review (hiện `author` đang bị dùng nhầm làm "reviewer", không phải brand).
- [ ] Giữ `lib/team.ts` (TEAM hardcode) riêng biệt — đây là editorial team, không liên quan Product/Brand, không cần đổi.

## Phase 9 — Global (en mặc định)

- [x] en ở URL gốc, vi → `/vi`, zh → `/zh`; 301 từ URL cũ (`next.config.ts`).
- [x] Slug tiếng Anh + `/reviews/` (`lib/slug-redirects.json`, `scripts/rename-slugs.mjs`).
- [x] Trang How We Review, Editorial Policy; About bản en viết lại. Disclosure hiển thị cạnh link affiliate và ở footer khi affiliate bật, không dùng trang disclosure riêng.
- [x] Disclosure FTC + Amazon đầu mỗi bài; byline, Last updated, Best for/Not for, Alternatives, Sources, Where to buy (Amazon US/UK/DE).
- [x] Trang chủ: tagline, CTA, Best picks, form email (bảng `subscribers`, migration 0006).
- [x] Bài mẫu G102 bản en viết lại theo chuẩn global.
- [x] Viết lại bản en của 13 bài còn lại theo mẫu G102 (extras + nguồn).
- [ ] Bản zh vẫn là bản dịch cũ (còn giá VND, bảo hành Việt Nam).
- [ ] Trang `/best/...` (VD best budget gaming mice) — cần thêm bài review cùng loại.
- [ ] Gửi email bản tin (chưa có công cụ gửi; danh sách lưu ở `subscribers`).
- [x] Đổi slug guide sang tiếng Anh và thêm redirect 301 từ slug cũ (`lib/guide-slug-redirects.json`).

## Phase 10 — Amazon Associates readiness (feature vẫn tắt)

`AFFILIATE_LINKS_ENABLED = false`; đây là hạng mục chuẩn bị, không phải tín hiệu bật affiliate ngay. Hoàn tất và rà soát điều khoản hiện hành trước khi mở link.

- [ ] Kiểm tra traffic/độc giả mục tiêu và chọn marketplace phù hợp; xác minh thị trường bán hàng Amazon cho từng sản phẩm trước khi thêm vào kế hoạch affiliate. Ưu tiên sản phẩm có listing Amazon US nếu nhắm Amazon.com; bỏ khỏi Amazon plan các sản phẩm chỉ bán tại Việt Nam.
- [ ] Kiểm tra site có nội dung gốc, mới, thông tin vận hành/liên hệ đáng tin cậy; About khớp với thông tin đăng ký. Tác giả hiện là bút danh tiếng Anh của editorial desks, không phải người thật: duy trì việc công khai rõ pseudonym trên About, bio, và Editorial Policy; không thêm chân dung/chức danh/kinh nghiệm bịa.
- [ ] Khi đăng ký: khai đủ mọi website/kênh, hoàn tất tax interview (thường W-8BEN cho cá nhân không phải người Mỹ nếu phù hợp) và xác nhận payment methods khả dụng trực tiếp trong Associates Central. Amazon xem hồ sơ sau 3 qualifying sales; không tính đơn tự mua; hồ sơ có thể bị rút nếu không có qualifying sales trong 180 ngày.
- [ ] Bổ sung câu chuẩn `As an Amazon Associate I earn from qualifying purchases.` trên site và link-level disclosure cạnh mỗi review/link, trước CTA đầu tiên. Disclosure đặt ở footer một mình là chưa đủ.
- [ ] Trước khi bật nút mua: thêm `asin` và marketplace vào metadata có kiểm soát; tạo link với Associate tag đúng marketplace, kiểm tra URL/redirect; nút ghi “Check price on Amazon”; link có `rel="sponsored nofollow noopener"` và `target="_blank"`.
- [ ] Không nhập giá/availability Amazon bằng tay. Chỉ hiển thị thông tin đó qua link/format Amazon hoặc API được cấp quyền theo điều khoản. Chỉ dùng ảnh tự chụp hoặc ảnh hãng được phép, không lưu ảnh Amazon. Dùng SiteStripe/Associates Central cho link tĩnh khi đủ điều kiện.
- [ ] Tạo tracking ID cho vị trí link, không gắn định danh tracking tới cá nhân. Không click/mua qua link của mình, không chạy quảng cáo nhắm từ khóa Amazon.
- [ ] Giữ newsletter chỉ trỏ về bài viết trên site theo mặc định. Chính sách Amazon hiện cho phép email/SMS/direct message có Special Links trong điều kiện giới hạn, bao gồm opt-in và tuân thủ điều khoản; xác minh kỹ trước mọi thay đổi. Không đưa link vào tài liệu offline/ebook.
- [ ] Creators API chỉ sau khi Associates được chấp nhận cuối cùng và đạt ngưỡng hiện tại (10 qualifying sales trong 30 ngày theo tài liệu API); xác minh lại khi triển khai.
- [x] Bài roundup hiển thị rõ phương pháp tổng hợp; trang review ẩn điểm thành phần cho bài chưa test và giải thích điểm tổng hợp dựa trên thông số/nguồn công bố.
- [x] Đổi khu homepage “Trending” thành “More Reviews” vì chưa có dữ liệu lượt xem; chọn dải bài khác với “Latest Reviews”.
- [x] Sửa lỗi ngữ pháp “The SoundPEATS T3 Pro bring…” thành “brings…”.
- [x] Hiển thị câu Amazon chuẩn ở footer toàn site khi affiliate được bật; disclosure trong bài đứng trước CTA và nêu câu chuẩn. Tính năng vẫn tắt.
- [x] Product/Review JSON-LD đã có trên trang review; giữ không khai báo giá Amazon tĩnh.
- [ ] Hoàn tất kiểm tra nội dung còn lại: xác minh mâu thuẫn từng giá/phiên bản bằng nguồn chính hãng, kiểm kê alt text cho toàn bộ liên kết ảnh, kiểm tra ngày đăng/redmi và grammar các bản dịch, và rà soát từng model Amazon US.
- [ ] Cập nhật thông tin chủ site và email theo tên miền sau khi có tên pháp nhân/người vận hành và hộp thư domain đã xác minh; không tạo thông tin liên hệ giả.
- [ ] Bổ sung ASIN/marketplace, link Amazon theo ASIN và tracking ID theo vị trí sau khi có quyền Associates hợp lệ và dữ liệu ASIN đã xác minh.
- [ ] Bổ sung ảnh hands-on chỉ khi đội ngũ thực sự sở hữu/dùng sản phẩm và có thể tự chụp; hiện chưa có căn cứ để tuyên bố có trải nghiệm đó.
- [ ] Sau khi được chấp nhận, khai báo mọi domain/kênh đã dùng và kiểm tra trực tiếp điều khoản Associates mới nhất trước mỗi thay đổi lớn.

Nguồn và hướng dẫn vận hành được ghi tại `supabase/README.md`.
