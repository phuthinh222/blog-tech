# Zero Technology (zerotech-lab.site) — quy tắc làm việc

Site review sản phẩm công nghệ + affiliate, hướng tới người đọc quốc tế. Next.js 16 + next-intl: **en mặc định** (URL không tiền tố), `/vi`, `/zh`; nội dung gốc vẫn viết tiếng Việt (`SOURCE_LOCALE`), en/zh là bản dịch. Dữ liệu sản phẩm trên Supabase. Tên thương hiệu duy nhất: **Zero Technology** (`SITE_NAME`) — không dùng "The Zero Tech"/"Zero Tech Lab". Dùng **pnpm** (không npm/package-lock).

## Chung

- Không chạy app (`pnpm dev`, `next start`, mở trình duyệt). Kiểm tra bằng `npm run check` (prettier + eslint + tsc + i18n:check). Nếu tsc báo lỗi trong `.next/types` thì chạy `pnpm exec next typegen`.
- Được phép tự chạy import lên Supabase, không cần hỏi lại. Commit/push thì hỏi trước.
- Chuỗi giao diện nằm trong `messages/{vi,en,zh}.json` — thêm/xoá khoá ở cả 3 file.

## Viết bài review sản phẩm

**Affiliate hiện đang tắt**: `AFFILIATE_LINKS_ENABLED = false` trong `lib/constants.ts` ẩn các CTA, bảng Where to buy và disclosure ở cấp bài. Không thêm live affiliate links/offers cho đến khi được chỉ đạo bật lại. Các profile tác giả là **bút danh tiếng Anh** của các desk biên tập theo danh mục; không tạo người, ảnh chân dung, kinh nghiệm hoặc hoạt động thử nghiệm giả. About/Editorial Policy và bio phải nói rõ đây là bút danh.

### Amazon Associates — checklist khi được bật lại

- Chỉ đăng ký khi site công khai có nội dung gốc, gần đây và có bình luận/phân tích riêng. Amazon xem xét sau 3 qualifying sales; đơn tự mua không tính; hồ sơ có thể bị rút nếu không có đủ qualifying sales trong 180 ngày. Xác minh marketplace và điều khoản hiện hành trước khi đăng ký.
- Khai báo mọi website/kênh sẽ dùng, thông tin liên hệ chính xác, hoàn thành tax interview và chọn phương thức thanh toán trong Associates Central.
- Hiển thị nguyên câu `As an Amazon Associate I earn from qualifying purchases.` rõ ràng trên site; đặt disclosure dễ thấy gần review/link affiliate và trước CTA mua đầu tiên. Không cho rằng disclosure ở footer là đủ.
- Giữ câu chuẩn trên footer mọi trang khi affiliate bật, đồng thời giữ link-level disclosure trước CTA đầu tiên. Bài `compiled` không dùng điểm thành phần tạo cảm giác đã test; nếu có điểm tổng thể phải giải thích đó là nhận định biên tập dựa trên thông số và nguồn đã dẫn.
- Không tự mua qua link của mình, không dùng quảng cáo nhắm từ khóa Amazon để quảng bá Special Links. Newsletter chỉ được gửi Special Links khi người nhận đã opt in và mọi điều khoản/email marketing đều được đáp ứng; phương án mặc định của site là chỉ link về bài trên website. Không nhúng link vào ebook/tài liệu offline.
- Không chép ảnh Amazon hoặc gõ giá/availability Amazon thủ công. Hiển thị giá và availability chỉ qua định dạng Amazon cung cấp hoặc Creators API/PA API theo license hiện hành. Dùng ảnh tự chụp hoặc ảnh hãng có quyền sử dụng.
- Link phải dùng đúng Associate tag theo marketplace; dùng `rel="sponsored nofollow noopener"`, `target="_blank"`; CTA dùng ngôn ngữ như “Check price on Amazon”. Ghi marketplace/ASIN trong dữ liệu bài khi đã được cấp phép và có lý do sử dụng.
- Creators API hiện yêu cầu Associates được chấp nhận cuối cùng và tối thiểu 10 qualifying sales trong 30 ngày gần nhất. Kiểm tra trang chính thức trước khi triển khai vì eligibility có thể đổi.

0. **Keyword** — chọn keyword chính theo [seo-keywords.md](seo-keywords.md) (1 keyword/URL, không trùng bài khác), đặt ở đầu `seo.metaTitle`/title; thêm dòng mới vào bảng mục 3.
1. **Sản phẩm** — người dùng gửi tên/link sản phẩm (link Shopee chỉ dùng làm nguồn tham khảo, không đặt link mua).
2. **Nghiên cứu** — ưu tiên trang chính hãng (thông số), rồi nhà bán lẻ VN (giá, bảo hành: CellphoneS, FPT Shop, TGDĐ, Phong Vũ, ThinkPro…), rồi bài trải nghiệm thật (Sforum, review quốc tế). Khi các nguồn ghi khác nhau thì nói rõ trong bài, không tự chọn số đẹp.
3. **Ảnh — chỉ lấy từ nguồn nước ngoài, không lấy nguồn Việt Nam.** Không dùng Shopee, nhà bán lẻ (CellphoneS, TGDĐ, FPT Shop…), nhà phân phối hay trang hãng phiên bản Việt Nam (VD `mi.com/vn`, `/vi-vn/`). Lấy ảnh chính thức trên trang quốc tế của hãng (`/en-us/`, `/global/`…; store Shopify thì `/products/<handle>.json`; datasheet PDF thì `pdfimages`). Tải về, thu nhỏ còn 1200–1600px JPG (~quality 82), lưu `public/images/products/<ten-san-pham>/` (`cover.jpg` + tên mô tả, không dấu). `coverImage`/`images` dùng đường dẫn `/images/products/...`; `images` không lặp lại ảnh bìa. Nếu hãng không có trang/ảnh chính thức thì dùng ảnh từ listing nhà bán lẻ quốc tế (VD store Shopify nước ngoài, Newegg) của **đúng sản phẩm đó** và ghi nguồn ảnh trong bài; nếu cả listing quốc tế cũng không có (hãng/hàng chỉ bán ở VN) thì để trống ảnh và báo người dùng. Nhắc: ảnh chỉ hiện sau khi commit + deploy.
4. **File nội dung** (cấu trúc theo bài có sẵn):
   - `content/posts/<slug>.json` (vi) + `content/translations/products/<slug>.{en,zh}.json`.
   - Slug: tiếng Anh, chỉ tên sản phẩm, ví dụ `logitech-g305-x-superlight`, `redmi-buds-6-play` (URL `/reviews/<slug>`, `/vi/reviews/<slug>`). Đổi slug bài cũ: thêm cặp cũ→mới vào `lib/slug-redirects.json` (next.config.ts tự tạo 301) rồi chạy `scripts/rename-slugs.mjs --commit` **trước** import.
   - `title` (hiển thị trên trang, ~50–70 ký tự): `<Sản phẩm>: <lợi ích/đối tượng dùng, có thể là câu hỏi>`, không mở đầu bằng "Review". Ví dụ: "VXE R1 SE: Chuột Gaming Không Dây Siêu Nhẹ Cho Game FPS", "SoundPEATS T3 Pro: Tai Nghe Chống Ồn Giá Rẻ Có Gì Nổi Bật?". Bản en/zh dịch theo cùng ý.
   - `seo.metaTitle` (≤ ~60 ký tự): mở đầu bằng cụm từ người mua hay tìm (loại sản phẩm), kết bằng câu hỏi kiểu "Có Đáng Mua?". Không giật tít ("tốt nhất", "đỉnh nhất").
   - `seo.metaDescription` ~150 ký tự: thông số chính + "ưu nhược điểm" + "ai nên mua".
   - `category` là một trong: `desk-setup`, `gaming-gear`, `pc-laptop`, `audio-video` (xem `lib/categories.ts`).
   - `publishedAt` = ngày hôm nay (YYYY-MM-DD), `author` = "Zero Technology".
   - `reviewMethod`: `"compiled"` (tổng hợp — mặc định, mọi bài viết từ nguồn) hoặc `"tested"` (chỉ khi người dùng xác nhận đã tự dùng và có ảnh tự chụp).
   - Khi sửa thông tin bài cũ: đặt `updatedAt` = ngày hôm nay (YYYY-MM-DD) rồi import lại — trang hiện "Cập nhật …" và `dateModified`.
5. **Nội dung bài** — trung thực, có phân tích riêng:
   - 6–8 mục `sections`, bắt buộc có: "Ai nên mua và ai không nên mua?", "Nguồn thông tin của bài viết" (ghi rõ Zero Technology **chưa trực tiếp sử dụng**, nguồn nào, tháng/năm cập nhật, ảnh của ai), và mục kết luận "Có nên mua …?".
   - Nếu sản phẩm có nhiều phiên bản/phân loại: có mục so sánh các bản và nhắc chọn đúng phiên bản.
   - Khi có bài cùng danh mục, so sánh với sản phẩm đó trong bài và FAQ.
   - Không bao giờ viết như đã tự dùng/tự đo. Trích trải nghiệm của bên khác thì ghi tên nguồn.
   - Nêu rõ tính năng **không có** (ANC, Bluetooth codec, cổng…) — người mua hay nhầm.
   - 6 `pros`, 5–6 `cons` cụ thể (không ghi kiểu "thương hiệu uy tín"), 6 `faq`, `specs` kèm dòng "Giá tham khảo: khoảng … (tháng/năm)". Chỉ ghi **khoảng giá** để người đọc ước chừng (giá cụ thể xem khi bấm nút sang sàn); site không hiển thị khối giá chính xác.
   - Điểm `rating` có phân hoá thật (7–9), không cho mọi sản phẩm 9+.
6. **Bản dịch en/zh** — dịch đủ mọi trường (`title`, `summary`, `description`, `specs`, `sections`, `pros`, `cons`, `buying_advice`, `faq`, `seo_title`, `seo_description`, `verdict_summary`).
   - **Bản en viết cho người đọc toàn cầu, không dịch máy móc**: bỏ "người dùng Việt Nam", bảo hành/giá Việt Nam (ghi "warranty varies by region; check your local retailer"); giá tham khảo theo USD nếu có nguồn (VD giá niêm yết trên store Mỹ của hãng); nêu tên gọi khác theo khu vực (VD G305 X SUPERLIGHT = G304 X SUPERLIGHT ở châu Á).
   - Thông số quan trọng ghi nguồn ngay trong câu ("Logitech lists…", "according to the manufacturer…") hoặc "(Logitech)" trong `specs`; con số không xác minh được với hãng thì nói rõ hoặc bỏ. Không viết "we tested".
   - `extras` (cột `product_translations.extras`, migration 0006): `productName` (tên dùng tìm trên Amazon), `regionalNote`, `bestFor[]`, `notFor[]`, `alternatives[{name, slug?, note}]` (slug = bài có trên site), `sources[{label, url}]`. Mẫu: `content/translations/products/logitech-g305-x-superlight.en.json`.
   - Khi affiliate được bật hợp lệ, chỉ hiển thị marketplace và link đã được cấu hình, không ghi giá Amazon tĩnh. Xác nhận sản phẩm thực sự có mặt trên marketplace tương ứng trước khi thêm link.
7. **Kiểm tra & đăng** — `pnpm exec prettier --write` các file mới → `npm run check` → `node --env-file=.env scripts/import-content.mjs --commit` → `node --env-file=.env scripts/import-translations.mjs --commit` (đúng thứ tự; script đọc `.env`, không phải `.env.local`) → đọc lại Supabase xác nhận PUBLISHED, đủ vi/en/zh.
8. **Báo cáo** — bảng tóm tắt (tiêu đề, SEO title, URL, meta description, danh mục, điểm), điểm cần người dùng kiểm tra (thông tin chưa thống nhất), và danh sách nguồn dạng link.

## Đổi / gỡ sản phẩm

- Gỡ bài: xoá dòng `products` theo slug trên Supabase (bản dịch tự xoá theo) + xoá file trong `content/` và thư mục ảnh.
- Đổi slug: `update products set slug` trên Supabase (giữ id, bản dịch, offer) rồi đổi tên file; không tạo sản phẩm mới.
