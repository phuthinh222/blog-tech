# Supabase — Phase 1 (Data foundation)

Migration thủ công (chưa cài Supabase CLI trong repo này). Áp dụng theo thứ tự:

## 1. Apply migrations

Mở Supabase Dashboard → SQL Editor → chạy lần lượt (theo đúng thứ tự số):

1. `migrations/0001_init_schema.sql` — tạo toàn bộ bảng theo README.md mục 5, kèm vài cột mở rộng cần thiết (đọc comment trong file để biết lý do).
2. `migrations/0002_rls_policies.sql` — bật RLS, cho phép đọc công khai (publishable key) với nội dung đã `PUBLISHED`, chặn hết các bảng nội bộ (`social_posts`, `affiliate_clicks`, `ai_usage`).

Nếu sau này cài Supabase CLI (`supabase init` + link project), 2 file trên đã đúng format để dùng `supabase db push` trực tiếp — không cần đổi gì.

## 2. Import content cũ

7 file trong `content/posts/*.json` là dữ liệu Shopee VN hiện có trên site — cần đưa vào Supabase để Phase 2 (chuyển `lib/content.ts` sang đọc Supabase) có dữ liệu.

```bash
# Xem trước sẽ import gì (không ghi DB)
node --env-file=.env.local scripts/import-content.mjs

# Ghi thật vào Supabase
node --env-file=.env.local scripts/import-content.mjs --commit
```

Script tự tạo `categories` (theo `lib/categories.ts`) và `product_sources` (Shopee) nếu chưa có, rồi upsert `products` / `product_translations` (locale `vi`) / `product_offers` theo từng file JSON. An toàn để chạy lại nhiều lần (upsert theo unique key, không tạo trùng).

### Giới hạn đã biết (in ra khi chạy script)

- `brand_id` = NULL cho cả 7 sản phẩm — `content/posts/*.json` hiện không có field brand. Cần bổ sung tay hoặc làm Phase 8 (thêm bảng `brands` + gán) trước.
- `model` = NULL — không có GTIN/UPC/SKU/model trong data hiện tại (đúng gap đã nêu ở README mục 6).
- `product_offers.price` = NULL — `priceRange` trong JSON chỉ là bucket string (VD `"20-25-trieu"`), không phải giá số thật. Script cố tình **không** tự suy ra số cụ thể (tránh bịa dữ liệu, đúng nguyên tắc AI Fact Protection ở README mục 18) — cần nhập giá thật thủ công sau khi import, hoặc để trống chờ Worker tự cập nhật khi có Cron refresh (README mục 38).

## 3. Env cần có trong `.env.local`

Đã có sẵn trong repo (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`) — script dùng secret key để bypass RLS khi ghi. Không commit giá trị thật của các key này lên git.

## 4. Đa ngôn ngữ (vi / en / zh)

Site có 3 ngôn ngữ (`i18n/routing.ts`). Bản dịch nội dung sản phẩm nằm ở `content/translations/products/<slug>.<en|zh>.json` (sửa trực tiếp file để duyệt bản dịch), đưa lên Supabase theo 2 bước:

1. SQL Editor → chạy `migrations/0004_i18n_zh_locale.sql` (cho phép `locale = 'zh'`, thêm cột `product_translations.specs` cho nhãn thông số theo ngôn ngữ).
2. Import bản dịch:

```bash
# Kiểm tra file + đối chiếu với bản tiếng Việt (không ghi DB)
node --env-file=.env.local scripts/import-translations.mjs

# Ghi thật
node --env-file=.env.local scripts/import-translations.mjs --commit
```

Sản phẩm chưa có bản dịch ở một ngôn ngữ thì site hiện bản tiếng Việt (`lib/content.ts`). Chữ giao diện nằm ở `messages/<locale>.json` — chạy `pnpm i18n:check` để chắc 3 file có cùng bộ khoá. Bài hướng dẫn đọc từ `content/guides/<locale>/`.

## 5. Amazon Associates readiness (chưa bật affiliate)

`AFFILIATE_LINKS_ENABLED` vẫn là `false`; không nhập offer Amazon hoặc đưa link live lên site cho tới khi chương trình được kích hoạt. Khi chuẩn bị:

- Kiểm tra marketplace mục tiêu và ASIN của từng sản phẩm. Chỉ tạo offer cho sản phẩm đang được bán trên Amazon marketplace đó; không suy ra availability từ kết quả tìm kiếm.
- Không nhập giá/availability Amazon bằng tay. Theo chính sách Amazon, site chỉ được hiển thị các thông tin này qua link/format Amazon hoặc dữ liệu Creators API/PA API dùng đúng license. Lưu metadata nguồn và thời điểm kiểm tra cho dữ liệu nội bộ; không hiển thị giá cũ như giá hiện tại.
- Dùng SiteStripe hoặc link tạo trong Associates Central cho link tĩnh và giữ đúng Associate tag/marketplace. Creators API hiện yêu cầu tài khoản đã được chấp nhận cuối cùng và ít nhất 10 qualifying sales trong 30 ngày; xác minh eligibility trước khi phát triển tích hợp.
- Chỉ dùng ảnh tự chụp hoặc ảnh hãng được phép sử dụng. Không tải hình từ listing Amazon để lưu trong `public/`.
- Tạo bảng `product_offers` riêng biệt cho từng marketplace/offer, không đặt ASIN hoặc affiliate URL giả vào `products`. Dùng `merchant`, `market`, `currency`, `affiliate_url`, `source_url`, `availability`, `last_checked_at` theo schema; trường Amazon-specific có thể được bổ sung bằng migration khi cần.
- Gắn tracking ID/sub-tag theo vị trí link để đo hiệu quả, nhưng không gán ID riêng theo từng người truy cập.
- Trước khi mở feature, bảo đảm disclosure Amazon chuẩn trên site và notice dễ thấy cạnh từng link/review, trước CTA đầu tiên. Disclosure chuẩn: `As an Amazon Associate I earn from qualifying purchases.`
- Amazon yêu cầu sales để xét duyệt hồ sơ ban đầu: sau 3 qualifying sales họ xem xét đơn; nếu không có đủ qualifying sales trong 180 ngày, hồ sơ có thể bị rút. Không tính đơn tự mua. Đăng ký khai đủ site/kênh; hoàn tất tax interview và phương thức thanh toán trong Associates Central.
- Không tự mua qua Special Link, không chạy quảng cáo nhắm từ khóa thương hiệu Amazon để đẩy traffic vào link. Amazon hiện cho phép email/SMS/direct message Special Links trong một số trường hợp có opt-in và tuân thủ điều khoản; mặc định newsletter của site chỉ trỏ về bài trên website để giảm rủi ro vận hành. Không đưa link affiliate vào ebook/tài liệu in.

Tham khảo chính sách chính thức: [review và điều kiện 3 sales/180 ngày](https://affiliate-program.amazon.com/help/node/topic/G7MJTPEP9NC3YKMG), [Operating Agreement/disclosure](https://affiliate-program.amazon.com/help/operating/agreement/), [Creators API eligibility](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction), [price and availability rules](https://affiliate-program.amazon.com/help/operating/policies/).
