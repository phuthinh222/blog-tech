-- Minh bạch nội dung (checklist 2.3):
-- - review_method: 'tested' = Zero Technology đã test thực tế (có ảnh tự chụp),
--   'compiled' = tổng hợp từ thông số hãng + đánh giá người dùng/báo chí.
--   Mặc định 'compiled' — mọi bài hiện có đều là bài tổng hợp.
-- - content_updated_at: ngày cập nhật nội dung/giá gần nhất do người viết ghi
--   (field "updatedAt" trong content/posts/*.json). Không dùng updated_at vì
--   cột đó đổi mỗi lần chạy lại script import.
--
-- An toàn để chạy lại.

alter table products
  add column if not exists review_method text not null default 'compiled';

alter table products
  drop constraint if exists products_review_method_check;

alter table products
  add constraint products_review_method_check check (review_method in ('tested', 'compiled'));

alter table products
  add column if not exists content_updated_at timestamptz;
