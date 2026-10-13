-- Schema khởi tạo theo README.md mục 5 (Database).
-- Tham chiếu số mục README được ghi trong comment để dễ đối chiếu khi spec thay đổi.

create extension if not exists pgcrypto;

-- Dùng chung cho mọi bảng có updated_at.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- brands (mục 5)
-- =========================================================
create table brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  website_url text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_brands_updated_at
  before update on brands
  for each row execute function set_updated_at();

-- =========================================================
-- categories (mục 5) — tự tham chiếu để hỗ trợ phân cấp
-- (VD Technology > Computer > Developer Gear > Keyboard).
-- =========================================================
create table categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  parent_id  uuid references categories (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_parent_id on categories (parent_id);

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

-- =========================================================
-- products (mục 5)
-- status theo Product Content Lifecycle (mục 41).
--
-- cover_image / images / specs / rating / tags: KHÔNG có trong danh sách field
-- gốc ở mục 5, nhưng mục 9 (Product Data Extraction) yêu cầu lưu Media +
-- Specifications, và mục 6 (Product Identity) cần structured spec để nhận diện.
-- Đây là phần schema mở rộng cần thiết để mục 9/30 có chỗ lưu — không phải
-- diễn giải lại spec, mà là bổ sung chỗ trống spec chưa định nghĩa.
-- =========================================================
create table products (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid references brands (id) on delete set null,
  category_id uuid references categories (id) on delete set null,
  name        text not null,
  model       text,
  slug        text not null unique,
  description text,
  status      text not null default 'DISCOVERED'
              check (status in (
                'DISCOVERED', 'EXTRACTED', 'VALIDATED', 'QUALIFIED',
                'AI_GENERATED', 'CONTENT_VALIDATED', 'PUBLISHED',
                'NEEDS_UPDATE', 'ARCHIVED'
              )),
  -- Mở rộng ngoài mục 5 (xem ghi chú phía trên):
  cover_image text,
  images      jsonb not null default '[]'::jsonb,
  specs       jsonb not null default '[]'::jsonb,
  rating      jsonb not null default '{}'::jsonb,
  tags        jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_products_brand_id on products (brand_id);
create index idx_products_category_id on products (category_id);
create index idx_products_status on products (status);

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- =========================================================
-- product_sources (mục 5) — Amazon, Shopee, TikTok Shop, Impact, Direct Brand...
-- =========================================================
create table product_sources (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  type       text,
  country    text,
  status     text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_product_sources_updated_at
  before update on product_sources
  for each row execute function set_updated_at();

-- =========================================================
-- product_offers (mục 5)
-- source_product_id: KHÔNG có trong danh sách field gốc ở mục 5, nhưng mục 6
-- (Product Identity) xếp "Source Product ID" là tiêu chí nhận diện ưu tiên thứ
-- 6, và mục 9 liệt kê nó trong dữ liệu cần extract — bổ sung cột này để thuật
-- toán nhận diện ở mục 6 có dữ liệu để chạy.
-- =========================================================
create table product_offers (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid not null references products (id) on delete cascade,
  source_id         uuid references product_sources (id) on delete set null,
  source_product_id text, -- xem ghi chú phía trên
  merchant          text,
  market            text not null,
  currency          text not null default 'VND',
  price             numeric(14, 2),
  affiliate_url     text not null,
  source_url        text,
  commission_rate   numeric(6, 3),
  commission_type   text,
  availability      text not null default 'IN_STOCK',
  last_checked_at   timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (product_id, source_id, merchant, market)
);

create index idx_product_offers_product_id on product_offers (product_id);
create index idx_product_offers_market on product_offers (market);
create index idx_product_offers_last_checked_at on product_offers (last_checked_at);

create trigger trg_product_offers_updated_at
  before update on product_offers
  for each row execute function set_updated_at();

-- =========================================================
-- product_translations (mục 5)
-- status dùng chung enum với social_posts (mục 42 Social Content Lifecycle)
-- vì cùng là "generated content" đi qua chu trình generate → validate →
-- publish/retry (mục 17), khác với products.status vốn theo dõi cả pipeline
-- sản phẩm (mục 41).
-- =========================================================
create table product_translations (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references products (id) on delete cascade,
  locale           text not null check (locale in ('en', 'vi')),
  title            text not null,
  summary          text,
  description      text,
  pros             jsonb not null default '[]'::jsonb,
  cons             jsonb not null default '[]'::jsonb,
  buying_advice    text,
  faq              jsonb not null default '[]'::jsonb,
  seo_title        text,
  seo_description  text,
  status           text not null default 'DRAFT'
                   check (status in ('DRAFT', 'VALIDATED', 'PUBLISHED', 'FAILED', 'RETRY')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (product_id, locale)
);

create index idx_product_translations_product_id on product_translations (product_id);

create trigger trg_product_translations_updated_at
  before update on product_translations
  for each row execute function set_updated_at();

-- =========================================================
-- social_posts (mục 5), status theo mục 42.
-- =========================================================
create table social_posts (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references products (id) on delete cascade,
  platform         text not null default 'facebook',
  locale           text,
  content          text,
  title            text,
  image_url        text,
  cta_url          text,
  status           text not null default 'DRAFT'
                   check (status in ('DRAFT', 'VALIDATED', 'PUBLISHED', 'FAILED', 'RETRY')),
  external_post_id text,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_social_posts_product_id on social_posts (product_id);

create trigger trg_social_posts_updated_at
  before update on social_posts
  for each row execute function set_updated_at();

-- =========================================================
-- affiliate_clicks (mục 5) — ghi bởi route /go/:product (mục 24).
-- =========================================================
create table affiliate_clicks (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references products (id) on delete set null,
  offer_id   uuid references product_offers (id) on delete set null,
  market     text,
  locale     text,
  referrer   text,
  device     text,
  created_at timestamptz not null default now()
);

create index idx_affiliate_clicks_product_id on affiliate_clicks (product_id);
create index idx_affiliate_clicks_created_at on affiliate_clicks (created_at);

-- =========================================================
-- ai_usage (mục 5) — dùng bởi AI Budget Guard (mục 14).
-- =========================================================
create table ai_usage (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid references products (id) on delete set null,
  provider        text not null,
  model           text,
  operation       text,
  input_tokens    integer,
  output_tokens   integer,
  neurons         integer,
  status          text,
  estimated_cost  numeric(12, 4) not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_ai_usage_created_at on ai_usage (created_at);
create index idx_ai_usage_provider on ai_usage (provider);
