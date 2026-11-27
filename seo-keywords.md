# Bản đồ keyword SEO — Zero Technology

Cập nhật: 2026-11-17. Mỗi URL nhắm **1 keyword chính** (một ý định tìm kiếm), không để 2 trang tranh cùng keyword. Keyword en cho bản gốc (`/`), cột vi cho `/vi`.

> Chưa có số liệu lượt tìm thật (chưa nối Google Search Console / Keyword Planner). Mức "Cạnh tranh" là ước lượng theo loại kết quả đang xếp hạng (site lớn như RTINGS, Tom's Hardware, PCMag hay chỉ có Reddit/YouTube/shop). Sau 4–8 tuần có dữ liệu GSC → xem mục 6 để điều chỉnh.

## 1. Chiến lược tổng

- **Thế mạnh của site:** sản phẩm giá rẻ, hãng nhỏ/châu Á (VXE, AULA, SoundPEATS, Redmi, Xiaomi, North Bayou) — site review lớn ít viết, kết quả Google thường chỉ có Reddit/YouTube/Amazon → **long-tail "<sản phẩm> review" dễ lên top nhất**.
- **Tránh đối đầu trực diện** keyword đầu (VD "best gaming mouse", "best monitor") — để sau khi site có uy tín.
- **Cụm chủ đề (topic cluster):** mỗi danh mục = 1 trang danh mục (pillar) + guide (ý định "cách chọn") + review (ý định "<sản phẩm> review") + bài so sánh "A vs B" (ý định gần mua). Liên kết qua lại trong cụm.
- Brand "Zero Technology" chỉ cần ở trang chủ; trang con đặt keyword lên đầu title.

## 2. Trang chủ & danh mục

| URL                       | Keyword chính (en)             | Keyword phụ (en)                                                       | Keyword chính (vi)           | Cạnh tranh          |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------------- | ---------------------------- | ------------------- |
| `/`                       | budget tech reviews            | honest tech reviews, desk setup gear reviews, budget gaming gear       | đánh giá đồ công nghệ giá rẻ | Cao (chỉ cần brand) |
| `/categories/gaming-gear` | budget gaming gear reviews     | budget gaming mouse, budget mechanical keyboard, budget gaming headset | review gaming gear giá rẻ    | Trung bình          |
| `/categories/pc-laptop`   | budget monitor reviews         | budget gaming monitor, 24 inch gaming monitor, 27 inch IPS monitor     | review màn hình giá rẻ       | Trung bình          |
| `/categories/audio-video` | budget audio reviews           | budget earbuds, budget PC speakers, budget studio monitors             | review tai nghe, loa giá rẻ  | Trung bình          |
| `/categories/desk-setup`  | desk setup accessories reviews | monitor arm, monitor light bar, desk pegboard                          | phụ kiện setup bàn làm việc  | Thấp–TB             |

Title danh mục đã đổi theo bảng này (khoá `Categories.<slug>.metaTitle` trong `messages/*.json`).

## 3. Bài review (15 bài)

Keyword chính nên nằm ở đầu `seo_title` + H1 + câu đầu bài. Keyword phụ dùng trong H2/FAQ (đã có sẵn phần lớn).

| URL `/reviews/…`               | Keyword chính (en)                 | Keyword phụ / câu hỏi (en)                                                                 | Keyword chính (vi)                   | Cạnh tranh            |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------ | --------------------- |
| `logitech-g102-gen-2`          | logitech g203 review               | g102 vs g203, g203 lightsync dpi, g203 for fps, logitech g102 review                       | đánh giá logitech g102               | Cao                   |
| `logitech-g502-lightspeed`     | logitech g502 lightspeed review    | g502 lightspeed vs g502 hero, g502 lightspeed vs g502 x plus, g502 lightspeed battery life | đánh giá logitech g502 lightspeed    | Trung bình–Cao        |
| `vxe-r1-se`                    | vxe r1 se review                   | vxe dragonfly r1 se, r1 se vs r1 se+, vxe r1 se software                                   | đánh giá vxe r1 se                   | **Thấp**              |
| `aula-f75-pro`                 | aula f75 pro review                | aula f75 pro vs f75, aula f75 pro switches, aula f75 pro software                          | đánh giá aula f75 pro                | **Thấp**              |
| `hyperx-cloud-stinger-2-core`  | hyperx cloud stinger 2 core review | stinger 2 core vs stinger 2, stinger 2 core mic, ps5/xbox                                  | đánh giá hyperx cloud stinger 2 core | Trung bình            |
| `xiaomi-g24i-gaming-monitor`   | xiaomi g24i review                 | xiaomi gaming monitor g24i 180hz, g24i settings, g24i vs g24                               | đánh giá xiaomi g24i                 | **Thấp**              |
| `asus-tuf-gaming-vg249qe5a`    | asus vg249qe5a review              | vg249qe5a 146hz, asus tuf 24 inch monitor, vg249qe5a vs vg249q1a                           | đánh giá asus vg249qe5a              | Thấp–TB               |
| `vsp-ip2705f-27-inch-monitor`  | vsp ip2705f review                 | vsp 27 inch monitor, ip2705f 100hz                                                         | đánh giá màn hình vsp ip2705f        | **Thấp** (chủ yếu VN) |
| `soundpeats-t3-pro`            | soundpeats t3 pro review           | soundpeats t3 pro anc, t3 pro app, t3 pro vs t3                                            | đánh giá soundpeats t3 pro           | **Thấp**              |
| `redmi-buds-6-play`            | redmi buds 6 play review           | redmi buds 6 play battery, buds 6 play vs buds 6 active                                    | đánh giá redmi buds 6 play           | Thấp–TB               |
| `edifier-mr3`                  | edifier mr3 review                 | edifier mr3 vs mr4, mr3 vs mr5, edifier mr3 bluetooth                                      | đánh giá loa edifier mr3             | Trung bình            |
| `microlab-m105`                | microlab m105 review               | microlab m-105 2.1 speakers                                                                | đánh giá loa microlab m105           | **Thấp** (chủ yếu VN) |
| `north-bayou-f80-monitor-arm`  | north bayou f80 review             | north bayou f80 weight limit, f80 gas spring monitor arm                                   | đánh giá giá treo north bayou f80    | Thấp                  |
| `sidohome-sg301-monitor-light` | rgb monitor light bar (budget)     | monitor light bar with rgb backlight, sidohome sg301                                       | đèn treo màn hình sidohome sg301     | Thấp (brand chỉ ở VN) |
| `clamp-on-desk-pegboard`       | clamp on desk pegboard             | desk pegboard no drilling, clamp pegboard for desk                                         | pegboard kẹp bàn                     | Thấp                  |

Ghi chú:

- **G102:** ở Mỹ/EU người ta tìm "G203" nhiều hơn → title en đã đổi để "G203" đứng đầu.
- **Sidohome, pegboard:** người đọc quốc tế không tìm theo tên hãng → nhắm keyword loại sản phẩm.
- **VSP, Microlab:** gần như chỉ có người Việt tìm → ưu tiên tối ưu bản `/vi`.

## 4. Bài hướng dẫn (guides)

| Guide (slug hiện tại)                          | Keyword chính (en)                     | Keyword chính (vi)                | Review liên kết tới                  |
| ---------------------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------ |
| `chon-man-hinh-gaming-24-inch-pho-thong`       | how to choose a 24 inch gaming monitor | cách chọn màn hình gaming 24 inch | Xiaomi G24i, ASUS VG249QE5A          |
| `cach-chon-man-hinh-27-inch-de-lap-trinh`      | 27 inch monitor for coding             | màn hình 27 inch cho lập trình    | VSP IP2705F, North Bayou F80         |
| `co-nen-mua-gia-treo-man-hinh`                 | is a monitor arm worth it              | có nên mua giá treo màn hình      | North Bayou F80                      |
| `chuot-cho-lap-trinh-vien-va-dan-van-phong`    | best mouse for programmers             | chuột cho lập trình viên          | G102/G203, VXE R1 SE (nên thêm link) |
| `ban-phim-co-van-phong-yen-tinh`               | quiet mechanical keyboard for office   | bàn phím cơ yên tĩnh văn phòng    | AULA F75 Pro (nên thêm link)         |
| `chon-laptop-van-phong-va-lap-trinh-tam-trung` | mid-range laptop for programming       | laptop lập trình tầm trung        | (chưa có review laptop)              |

Tránh tranh keyword: guide nhắm "how to choose / is it worth it", review nhắm "<sản phẩm> review" — không đặt tên sản phẩm cụ thể lên title guide.

## 5. Bài nên viết thêm (khoảng trống keyword)

Ưu tiên theo mức dễ + gần ý định mua, tận dụng review đã có:

| #   | Keyword                                | Loại bài   | Dùng lại review                        |
| --- | -------------------------------------- | ---------- | -------------------------------------- |
| 1   | vxe r1 se vs logitech g203             | So sánh    | VXE R1 SE, G102                        |
| 2   | xiaomi g24i vs asus vg249qe5a          | So sánh    | Xiaomi G24i, ASUS                      |
| 3   | soundpeats t3 pro vs redmi buds 6 play | So sánh    | SoundPEATS, Redmi                      |
| 4   | edifier mr3 vs microlab m105           | So sánh    | Edifier, Microlab                      |
| 5   | best budget gaming mouse under $30     | `/best/…`  | G203, VXE R1 SE (+ cần 1–2 review nữa) |
| 6   | best budget 24 inch gaming monitor     | `/best/…`  | Xiaomi G24i, ASUS (+ 1 review nữa)     |
| 7   | best budget wireless earbuds with anc  | `/best/…`  | SoundPEATS, Redmi (+ 1 review nữa)     |
| 8   | budget desk setup ideas                | Guide      | North Bayou, Sidohome, pegboard, VSP   |
| 9   | 144hz vs 165hz vs 180hz monitor        | Giải thích | ASUS, Xiaomi                           |
| 10  | gasket mount keyboard explained        | Giải thích | AULA F75 Pro                           |

Trang `/best/…` chỉ nên làm khi có ≥ 3 review cùng loại (xem todo.md).

## 6. Việc tiếp theo

- [ ] Nối Google Search Console (đã nộp `/sitemap.xml`) → sau 4–8 tuần xem truy vấn thật, chỉnh lại bảng (keyword có hiển thị nhưng CTR thấp → sửa title/description).
- [ ] Đổi slug guide sang tiếng Anh theo keyword en ở mục 4 (+ 301), cùng cách đổi slug review.
- [ ] Thêm link từ guide chuột → VXE R1 SE, guide bàn phím → AULA F75 Pro.
- [ ] Viết bài so sánh #1–#4 trước (dễ nhất, dùng lại nội dung đã có).
- [ ] Khi viết bài mới: chọn keyword chính trước, thêm dòng vào bảng mục 3.
