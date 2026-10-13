-- RLS cho toàn bộ bảng trong 0001_init_schema.sql.
--
-- Nguyên tắc:
--   - service_role (dùng bởi Cloudflare Worker và các Route Handler phía
--     server của Next.js, KHÔNG bao giờ lộ ra client) luôn bypass RLS,
--     nên không cần policy riêng cho ghi/đọc nội bộ.
--   - anon key (dùng ở Server Component phía website qua Supabase JS client,
--     xem README.md mục 4 lưu ý kết nối Supabase) chỉ được đọc, và chỉ đọc
--     nội dung đã PUBLISHED — không lộ DRAFT/đang xử lý ra public site.
--   - social_posts, affiliate_clicks, ai_usage là dữ liệu nội bộ/vận hành,
--     không có policy đọc công khai.

alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_sources enable row level security;
alter table product_offers enable row level security;
alter table product_translations enable row level security;
alter table social_posts enable row level security;
alter table affiliate_clicks enable row level security;
alter table ai_usage enable row level security;

create policy "public read brands"
  on brands for select
  using (true);

create policy "public read categories"
  on categories for select
  using (true);

create policy "public read product_sources"
  on product_sources for select
  using (true);

create policy "public read published products"
  on products for select
  using (status = 'PUBLISHED');

create policy "public read offers of published products"
  on product_offers for select
  using (
    exists (
      select 1 from products p
      where p.id = product_offers.product_id
        and p.status = 'PUBLISHED'
    )
  );

create policy "public read published translations"
  on product_translations for select
  using (status = 'PUBLISHED');

-- Không tạo policy select cho social_posts / affiliate_clicks / ai_usage:
-- mặc định RLS sẽ chặn hết truy cập qua anon key, chỉ service_role đọc/ghi được.
