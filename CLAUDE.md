# Zero Technology (zerotech-lab.site) — quy tắc làm việc

Site review sản phẩm công nghệ + affiliate. Next.js 16 + next-intl (vi mặc định, en, zh), dữ liệu sản phẩm trên Supabase. Dùng **pnpm** (không npm/package-lock).

## Chung

- Không chạy app (`pnpm dev`, `next start`, mở trình duyệt). Kiểm tra bằng `npm run check` (prettier + eslint + tsc + i18n:check). Nếu tsc báo lỗi trong `.next/types` thì chạy `pnpm exec next typegen`.
- Được phép tự chạy import lên Supabase và tạo link AccessTrade, không cần hỏi lại. Commit/push thì hỏi trước.
- Chuỗi giao diện nằm trong `messages/{vi,en,zh}.json` — thêm/xoá khoá ở cả 3 file.

## Viết bài review sản phẩm (khi người dùng gửi link Shopee)

1. **Link affiliate** — gọi AccessTrade, lấy `short_link` (shorten.asia), kiểm tra link 302 về đúng sản phẩm:
   ```
   POST https://api.accesstrade.vn/v1/product_link/create
   Authorization: Token $ACCESSTRADE_API_KEY   (trong .env)
   {"campaign_id":"4751584435713464237","urls":["https://shopee.vn/product/<shop_id>/<item_id>"],"sub1":"<ten-san-pham>","sub2":"review"}
   ```
   `<shop_id>`/`<item_id>` lấy từ đuôi `-i.<shop_id>.<item_id>` của link Shopee. `productUrl` trong bài cũng dùng dạng rút gọn này.
2. **Nghiên cứu** — ưu tiên trang chính hãng (thông số), rồi nhà bán lẻ VN (giá, bảo hành: CellphoneS, FPT Shop, TGDĐ, Phong Vũ, ThinkPro…), rồi bài trải nghiệm thật (Sforum, review quốc tế). Khi các nguồn ghi khác nhau thì nói rõ trong bài, không tự chọn số đẹp.
3. **Ảnh — không lấy từ Shopee hay ảnh của nhà bán lẻ.** Lấy ảnh chính thức của hãng (trang sản phẩm chính hãng; store Shopify thì `/products/<handle>.json`; datasheet PDF thì `pdfimages`). Tải về, thu nhỏ còn 1200–1600px JPG (~quality 82), lưu `public/images/products/<ten-san-pham>/` (`cover.jpg` + tên mô tả, không dấu). `coverImage`/`images` dùng đường dẫn `/images/products/...`; `images` không lặp lại ảnh bìa. Nếu không có nguồn chính thức thì báo người dùng, không tự ý lấy ảnh nơi khác. Nhắc: ảnh chỉ hiện sau khi commit + deploy.
4. **File nội dung** (cấu trúc theo bài có sẵn):
   - `content/posts/<slug>.json` (vi) + `content/translations/products/<slug>.{en,zh}.json`.
   - Slug: `review-<loai-san-pham>-<ten-san-pham>`, ví dụ `review-tai-nghe-redmi-buds-6-play`.
   - `title` (hiển thị trên trang, ~50–70 ký tự): `<Sản phẩm>: <lợi ích/đối tượng dùng, có thể là câu hỏi>`, không mở đầu bằng "Review". Ví dụ: "VXE R1 SE: Chuột Gaming Không Dây Siêu Nhẹ Cho Game FPS", "SoundPEATS T3 Pro: Tai Nghe Chống Ồn Giá Rẻ Có Gì Nổi Bật?". Bản en/zh dịch theo cùng ý.
   - `seo.metaTitle` (≤ ~60 ký tự): mở đầu bằng cụm từ người mua hay tìm (loại sản phẩm), kết bằng câu hỏi kiểu "Có Đáng Mua?". Không giật tít ("tốt nhất", "đỉnh nhất").
   - `seo.metaDescription` ~150 ký tự: thông số chính + "ưu nhược điểm" + "ai nên mua".
   - `category` là một trong: `desk-setup`, `gaming-gear`, `pc-laptop`, `audio-video` (xem `lib/categories.ts`).
   - `publishedAt` = ngày hôm nay (YYYY-MM-DD), `author` = "Zero Technology".
5. **Nội dung bài** — trung thực, có phân tích riêng:
   - 6–8 mục `sections`, bắt buộc có: "Ai nên mua và ai không nên mua?", "Nguồn thông tin của bài viết" (ghi rõ Zero Technology **chưa trực tiếp sử dụng**, nguồn nào, tháng/năm cập nhật, ảnh của ai), và mục kết luận "Có nên mua …?".
   - Nếu trang Shopee bán nhiều phiên bản/phân loại: có mục so sánh các bản và nhắc chọn đúng phân loại.
   - Khi có bài cùng danh mục, so sánh với sản phẩm đó trong bài và FAQ.
   - Không bao giờ viết như đã tự dùng/tự đo. Trích trải nghiệm của bên khác thì ghi tên nguồn.
   - Nêu rõ tính năng **không có** (ANC, Bluetooth codec, cổng…) — người mua hay nhầm.
   - 6 `pros`, 5–6 `cons` cụ thể (không ghi kiểu "thương hiệu uy tín"), 6 `faq`, `specs` kèm dòng "Giá tham khảo … (tháng/năm)".
   - Điểm `rating` có phân hoá thật (7–9), không cho mọi sản phẩm 9+.
6. **Bản dịch en/zh** — dịch đủ mọi trường (`title`, `summary`, `description`, `specs`, `sections`, `pros`, `cons`, `buying_advice`, `faq`, `seo_title`, `seo_description`, `verdict_summary`).
7. **Kiểm tra & đăng** — `pnpm exec prettier --write` các file mới → `npm run check` → `node --env-file=.env scripts/import-content.mjs --commit` → `node --env-file=.env scripts/import-translations.mjs --commit` (đúng thứ tự; script đọc `.env`, không phải `.env.local`) → đọc lại Supabase xác nhận PUBLISHED, đủ vi/en/zh, có `affiliate_url`.
8. **Báo cáo** — bảng tóm tắt (tiêu đề, SEO title, URL, meta description, danh mục, điểm, link AccessTrade), điểm cần người dùng kiểm tra (giá thực tế trên Shopee, thông tin chưa thống nhất), và danh sách nguồn dạng link.

## Đổi / gỡ sản phẩm

- Gỡ bài: xoá dòng `products` theo slug trên Supabase (bản dịch, offer tự xoá theo) + xoá file trong `content/` và thư mục ảnh.
- Đổi slug: `update products set slug` trên Supabase (giữ id, bản dịch, offer) rồi đổi tên file; không tạo sản phẩm mới.
