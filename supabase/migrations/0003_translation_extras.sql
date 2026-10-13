-- Phase 2: bổ sung cột cho product_translations để giữ nguyên hành vi UI hiện tại
-- khi chuyển lib/content.ts từ đọc content/posts/*.json sang đọc Supabase.
--
-- Lý do 3 cột này không nằm trong 0001_init_schema.sql: mục 5 (README) chỉ định
-- nghĩa product_translations.description là 1 field text đơn, nhưng UI hiện tại
-- (app/articles/[slug]/page.tsx) render "sections" như danh sách có heading +
-- TOC anchor riêng từng phần — nếu gộp phẳng vào description sẽ mất khả năng
-- render đúng như cũ. author/verdict_summary cũng không có chỗ nào trong mục 5
-- nhưng UI cần để hiển thị tác giả (khớp lib/team.ts) và đoạn "Kết luận".

alter table product_translations
  add column if not exists sections jsonb not null default '[]'::jsonb,
  add column if not exists author text,
  add column if not exists verdict_summary text;
