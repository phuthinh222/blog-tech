# Supabase — Phase 1 (Data foundation)

Migration thủ công (chưa cài Supabase CLI trong repo này). Áp dụng theo thứ tự:

## 1. Apply migrations

Mở Supabase Dashboard → SQL Editor → chạy lần lượt (theo đúng thứ tự số):

1. `migrations/0001_init_schema.sql` — tạo toàn bộ bảng theo README.md mục 5, kèm vài cột mở rộng cần thiết (đọc comment trong file để biết lý do).
2. `migrations/0002_rls_policies.sql` — bật RLS, cho phép đọc công khai (anon key) với nội dung đã `PUBLISHED`, chặn hết các bảng nội bộ (`social_posts`, `affiliate_clicks`, `ai_usage`).

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

Đã có sẵn trong repo (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — script dùng service-role key để bypass RLS khi ghi. Không commit giá trị thật của các key này lên git.

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
