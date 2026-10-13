-- i18n: thêm tiếng Trung giản thể (zh) cho product_translations và cho phép
-- mỗi bản dịch có bảng thông số riêng.
--
-- - locale: 0001 chỉ cho 'en' | 'vi'. Site giờ có 3 ngôn ngữ (vi, en, zh —
--   xem i18n/routing.ts); "zh" trên URL và trong DB đều là tiếng Trung giản thể.
-- - specs: products.specs là nhãn tiếng Việt ("Lưu trữ", "Màu sắc"...). Bản
--   dịch cần nhãn/giá trị theo ngôn ngữ của nó; NULL = dùng products.specs
--   (lib/content.ts tự fallback), nên bản tiếng Việt hiện có không phải đổi gì.
--
-- An toàn để chạy lại (drop/add constraint, add column if not exists).

alter table product_translations
  drop constraint if exists product_translations_locale_check;

alter table product_translations
  add constraint product_translations_locale_check check (locale in ('vi', 'en', 'zh'));

alter table product_translations
  add column if not exists specs jsonb;
