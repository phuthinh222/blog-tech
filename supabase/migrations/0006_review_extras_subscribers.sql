-- Bản quốc tế (tiếng Anh mặc định):
-- 1. product_translations.extras — phần bổ sung của bài review theo từng ngôn
--    ngữ: productName (tên để tìm trên Amazon), regionalNote, bestFor, notFor,
--    alternatives, sources. Xem type ReviewExtras trong types/index.ts.
--    lib/content.ts đọc bản dịch bằng "*" nên DB chưa chạy migration này thì
--    extras chỉ là undefined (site vẫn chạy); scripts/import-translations.mjs
--    cần cột này khi file bản dịch có "extras".
-- 2. subscribers — email đăng ký nhận bản tin (form trên trang chủ/bài review,
--    app/api/subscribe/route.ts). Chỉ ghi/đọc bằng service-role key; không có
--    policy công khai nên anon key không đọc được danh sách email.
--
-- An toàn để chạy lại.

alter table product_translations
  add column if not exists extras jsonb not null default '{}'::jsonb;

create table if not exists subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  locale          text not null default 'en',
  source          text,
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index if not exists subscribers_email_key on subscribers (lower(email));

alter table subscribers enable row level security;
