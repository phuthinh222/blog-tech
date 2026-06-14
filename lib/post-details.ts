export type RatingItem = { label: string; score: number }

export type PostDetail = {
  price: string
  specs: { label: string; value: string }[]
  pros: string[]
  cons: string[]
  ratingBreakdown: RatingItem[]
  sections: { title: string; body: string[] }[]
  verdict: string
}

export const POST_DETAILS: Record<string, PostDetail> = {
  "iphone-16-pro-max-review": {
    price: "34.999.000đ",
    specs: [
      { label: "Màn hình",       value: '6,9" Super Retina XDR OLED, 2868×1320, 460ppi' },
      { label: "Chip",           value: "Apple A18 Pro (3nm), 6 nhân CPU, 6 nhân GPU" },
      { label: "RAM / Bộ nhớ",   value: "8GB RAM / 256GB – 1TB" },
      { label: "Camera sau",     value: "48MP main f/1.8 + 48MP ultrawide + 12MP 5x telephoto" },
      { label: "Camera trước",   value: "12MP TrueDepth f/1.9, Face ID" },
      { label: "Pin",            value: "4685mAh, sạc 27W có dây, 25W MagSafe" },
      { label: "Hệ điều hành",   value: "iOS 18.5" },
      { label: "Kết nối",        value: "USB-C 3.2 Gen 2, Wi-Fi 7, Bluetooth 5.3, NFC" },
      { label: "Kích thước",     value: "163 × 77,6 × 8,25 mm, 227g" },
    ],
    pros: [
      "Hệ thống camera tốt nhất thị trường, đặc biệt ảnh chân dung và telephoto",
      "Chip A18 Pro mạnh hơn mọi chip Android hiện tại",
      "Apple Intelligence hoạt động thực sự hữu ích trong công việc hàng ngày",
      "Màn hình ProMotion 120Hz đẹp và mượt, độ sáng tối đa 2000 nit",
      "Build quality titanium cao cấp, cảm giác cầm rất chắc tay",
    ],
    cons: [
      "Giá khởi điểm trên 34 triệu — đắt nhất trong phân khúc",
      "Sạc 27W quá chậm so với Android flagship cùng giá",
      "USB-C vẫn chỉ là USB 3.2, chưa lên USB4 như Pro max thế hệ trước kỳ vọng",
      "Nặng 227g — không thoải mái khi dùng một tay lâu",
    ],
    ratingBreakdown: [
      { label: "Thiết kế",   score: 9.5 },
      { label: "Màn hình",   score: 9.6 },
      { label: "Hiệu năng",  score: 9.8 },
      { label: "Camera",     score: 9.7 },
      { label: "Pin",        score: 8.8 },
    ],
    sections: [
      {
        title: "Thiết Kế & Xây Dựng",
        body: [
          "Apple giữ nguyên ngôn ngữ thiết kế từ iPhone 15 Pro Max nhưng tinh chỉnh đáng kể ở khung titanium mới — mỏng hơn 0,3mm và sử dụng hợp kim grade 5 cứng hơn. Cảm giác cầm vẫn rất chắc tay, dù 227g là con số không nhỏ với smartphone.",
          "Cụm camera sau giờ phẳng hơn một chút so với thế hệ trước, giảm bớt tình trạng lắc lư khi đặt xuống bàn. Màu \"Desert Titanium\" mới là lựa chọn đẹp nhất tôi thấy trong dòng iPhone Pro từ trước đến nay.",
          "Dynamic Island đã ổn định và các developer tận dụng nó tốt hơn. Nút Action Button và Camera Control là những bổ sung thực sự hữu ích khi quen tay — không còn cảm giác \"tính năng cho có\" như lúc mới ra mắt.",
        ],
      },
      {
        title: "Màn Hình",
        body: [
          "Panel OLED 6,9 inch với mật độ 460ppi là một trong những màn hình đẹp nhất tôi từng dùng trên smartphone. Độ sáng tối đa 2000 nit đủ để nhìn rõ kể cả dưới nắng trực tiếp, và chế độ Always-on Display tiêu thụ pin rất ít.",
          "ProMotion 120Hz hoạt động mượt mà trong mọi tình huống. True Tone và P3 wide color gamut làm cho ảnh và video trông tự nhiên hơn đáng kể so với màn hình thông thường.",
        ],
      },
      {
        title: "Hiệu Năng — Chip A18 Pro",
        body: [
          "A18 Pro được sản xuất trên tiến trình 3nm thế hệ 2 của TSMC, mang lại bước nhảy hiệu năng đáng kể so với A17 Pro. Trong các bài test tổng hợp, A18 Pro vượt qua mọi chip Android flagship hiện tại bao gồm Snapdragon 8 Elite.",
          "Điều tôi ấn tượng nhất không phải hiệu năng thô mà là khả năng duy trì hiệu năng đỉnh trong thời gian dài. Sau 20 phút benchmark liên tục, iPhone 16 Pro Max không throttle như hầu hết Android đối thủ.",
          "Neural Engine 16-core được nâng cấp đáng kể, phục vụ Apple Intelligence — các tính năng AI như Clean Up trong Photos, Writing Tools và Priority Notifications đều chạy on-device, không cần gửi dữ liệu lên cloud.",
        ],
      },
      {
        title: "Hệ Thống Camera",
        body: [
          "Camera chính 48MP với khẩu độ f/1.8 và chip xử lý Photonic Engine thế hệ 4 tạo ra ảnh có độ chi tiết và dải động ấn tượng. Đặc biệt trong điều kiện thiếu sáng, iPhone 16 Pro Max vẫn giữ được noise ở mức chấp nhận được trong khi nhiều đối thủ xử lý quá tay.",
          "Camera telephoto 12MP 5x (tương đương 120mm) là điểm sáng lớn nhất — ảnh zoom sắc nét và ít nhiễu, phù hợp cả cho chân dung lẫn chụp xa. Camera Control cho phép zoom bằng cách trượt ngón tay trên phím, thoải mái hơn zoom trên kính ngắm.",
          "Video 4K 120fps là tính năng mới đáng chú ý — chất lượng vượt trội, phù hợp cho slow motion đẹp. Log video và Apple ProRes vẫn là lựa chọn tốt nhất trên smartphone cho videographer.",
        ],
      },
      {
        title: "Pin & Sạc",
        body: [
          "Pin 4685mAh cộng với hiệu quả năng lượng của A18 Pro cho thời lượng dùng thực tế khoảng 7–8 giờ màn hình bật liên tục — tốt hơn iPhone 15 Pro Max khoảng 15%. Với người dùng bình thường, cắm sạc mỗi tối là đủ.",
          "Điểm yếu lớn nhất của iPhone 16 Pro Max vẫn là tốc độ sạc. 27W có dây đầy pin trong khoảng 90 phút — con số này kém xa Galaxy S25 Ultra sạc 45W hay Xiaomi sạc 120W. MagSafe 25W tiện lợi nhưng cũng không nhanh. Apple rõ ràng ưu tiên bảo vệ tuổi thọ pin hơn là tốc độ sạc.",
        ],
      },
    ],
    verdict:
      "iPhone 16 Pro Max là chiếc iPhone tốt nhất Apple từng làm — camera xuất sắc, hiệu năng vượt trội và Apple Intelligence thực sự hữu ích. Nếu bạn đang dùng iPhone 14 Pro Max trở xuống, đây là lý do chính đáng để nâng cấp. Điểm trừ duy nhất đáng kể là giá và tốc độ sạc. Với hơn 34 triệu đồng, đây là khoản đầu tư lớn — nhưng nếu hệ sinh thái Apple phù hợp với bạn, không có lựa chọn nào tốt hơn.",
  },

  "samsung-s25-ultra-review": {
    price: "32.999.000đ",
    specs: [
      { label: "Màn hình",       value: '6,9" Dynamic AMOLED 2X, 3088×1440, 1–120Hz LTPO' },
      { label: "Chip",           value: "Snapdragon 8 Elite (3nm), 8 nhân" },
      { label: "RAM / Bộ nhớ",   value: "12GB RAM / 256GB – 1TB" },
      { label: "Camera sau",     value: "200MP f/1.7 + 50MP ultrawide + 10MP 3x + 50MP 5x" },
      { label: "Camera trước",   value: "12MP f/2.2" },
      { label: "Pin",            value: "5000mAh, sạc 45W có dây, 15W wireless" },
      { label: "S Pen",          value: "Tích hợp, Bluetooth, độ trễ 2.8ms" },
      { label: "Hệ điều hành",   value: "Android 15, One UI 7" },
      { label: "Kích thước",     value: "162,8 × 79 × 8,2 mm, 218g" },
    ],
    pros: [
      "S Pen tích hợp vẫn là tính năng độc nhất vô nhị không Android nào khác có",
      "Hệ thống 4 camera linh hoạt nhất thị trường — zoom 3x và 5x đều xuất sắc",
      "Màn hình Dynamic AMOLED 2X sáng nhất lịch sử dòng Galaxy, tối đa 2600 nit",
      "Snapdragon 8 Elite mang lại hiệu năng đỉnh cao, xử lý AI on-device tốt",
      "Galaxy AI thực sự hữu ích — dịch thuật, tóm tắt, chỉnh ảnh AI rất thực dụng",
    ],
    cons: [
      "Thiết kế gần như không thay đổi so với S24 Ultra — khó phân biệt",
      "Samsung đã loại bỏ slot thẻ nhớ microSD",
      "Sạc 45W vẫn chậm so với đối thủ Trung Quốc cùng phân khúc",
      "One UI 7 vẫn có nhiều bloatware mặc định không cần thiết",
    ],
    ratingBreakdown: [
      { label: "Thiết kế",   score: 9.0 },
      { label: "Màn hình",   score: 9.7 },
      { label: "Hiệu năng",  score: 9.5 },
      { label: "Camera",     score: 9.3 },
      { label: "Pin",        score: 8.8 },
    ],
    sections: [
      {
        title: "Thiết Kế & S Pen",
        body: [
          "Samsung giữ nguyên form factor vuông vức quen thuộc của dòng Ultra. Khung titanium mới mỏng hơn và nhẹ hơn 218g — ít hơn 12g so với S24 Ultra. Mặt lưng Corning Gorilla Glass Armor 2 vẫn là lựa chọn chống trầy tốt nhất.",
          "S Pen với độ trễ 2.8ms và haptic feedback là thứ không thể thay thế cho dân ghi chú, ký tài liệu hay vẽ phác thảo. Samsung đã cải thiện nhận diện chữ viết tay đáng kể trong One UI 7 — giờ nó nhận cả chữ Việt khá tốt.",
        ],
      },
      {
        title: "Màn Hình",
        body: [
          "Dynamic AMOLED 2X 6,9 inch với độ sáng tối đa 2600 nit là màn hình sáng nhất tôi từng thấy trên smartphone. Dưới nắng gắt nhất Sài Gòn mùa hè, nội dung vẫn hoàn toàn đọc được.",
          "LTPO cho phép màn hình tự điều chỉnh từ 1Hz đến 120Hz — khi xem ảnh tĩnh pin tiêu thụ rất ít, khi cuộn trang mượt như lụa. Anti-reflection coating giảm chói sáng hiệu quả.",
        ],
      },
      {
        title: "Hiệu Năng",
        body: [
          "Snapdragon 8 Elite là chip Android mạnh nhất hiện tại. Trong benchmark đa nhân, nó vượt Dimensity 9400 của MediaTek và gần ngang A18 Pro của Apple — một bước nhảy lớn.",
          "12GB RAM LPDDR5X đủ để giữ nhiều app trong nền mà không reload. Tản nhiệt vapor chamber mới hiệu quả hơn — điện thoại nóng nhưng không gây khó chịu khi chơi game nặng liên tục 30 phút.",
        ],
      },
      {
        title: "Hệ Thống Camera",
        body: [
          "Camera 200MP f/1.7 với Generative Edit AI trong Gallery là combo mạnh. Ảnh ban ngày sắc nét với chi tiết tốt; trong điều kiện thiếu sáng Galaxy AI Nightography cải thiện rõ rệt nhưng đôi khi xử lý hơi quá tay làm ảnh trông giả.",
          "Điểm mạnh thực sự là hệ thống zoom — 3x và 5x đều cho ảnh sắc nét đáng ngạc nhiên, và Space Zoom 100x dù chỉ dùng được vài tình huống đặc biệt nhưng vẫn ấn tượng. Ultrawide 50MP cũng là camera rộng tốt nhất trong các flagship.",
        ],
      },
      {
        title: "Galaxy AI & Pin",
        body: [
          "Galaxy AI trong One UI 7 bao gồm Circle to Search (tìm kiếm bằng khoanh tay), Live Translate (dịch realtime khi gọi điện) và Note Assist (tóm tắt ghi chú). Đây là bộ tính năng AI thực dụng nhất tôi thấy trên Android.",
          "Pin 5000mAh với Snapdragon 8 Elite hiệu quả cho thời lượng khoảng 7 giờ màn hình bật. Sạc 45W đầy pin trong 65 phút — vừa phải. Wireless 15W và reverse wireless là bonus hữu ích.",
        ],
      },
    ],
    verdict:
      "Galaxy S25 Ultra là chiếc Android hoàn hảo nhất hiện tại nếu bạn cần S Pen. Hệ thống camera linh hoạt, màn hình tốt nhất thị trường, Galaxy AI thực sự hữu ích. Điểm yếu là thiết kế không thay đổi và sạc vẫn chậm. Nếu bạn không cần S Pen, Pixel 9 Pro hoặc iPhone 16 Pro Max có thể phù hợp hơn với mức giá tương đương.",
  },

  "lg-27uq850-4k-monitor-review": {
    price: "12.500.000đ",
    specs: [
      { label: "Kích thước",      value: '27 inch, IPS Nano, 16:9' },
      { label: "Độ phân giải",    value: "3840×2160 (4K UHD), 163ppi" },
      { label: "Tần số quét",     value: "60Hz" },
      { label: "Thời gian phản hồi", value: "5ms GTG" },
      { label: "Độ phủ màu",      value: "DCI-P3 98%, sRGB 135%" },
      { label: "Độ sáng",         value: "400 nit (SDR), 600 nit (HDR peak)" },
      { label: "Kết nối",         value: "USB-C 96W, 2× HDMI 2.0, 1× DP 1.4, 4× USB-A 3.0" },
      { label: "HDR",             value: "DisplayHDR 600" },
      { label: "Điều chỉnh",      value: "Độ cao 130mm, nghiêng, không xoay ngang" },
    ],
    pros: [
      "IPS Nano với DCI-P3 98% — màu sắc chính xác nhất trong phân khúc dưới 15 triệu",
      "USB-C 96W sạc laptop và truyền hình ảnh qua một cáp duy nhất",
      "4K 27 inch cho mật độ điểm ảnh 163ppi — sắc nét vượt trội so với Full HD",
      "HDR600 thực sự tạo ra sự khác biệt khi xem nội dung HDR",
      "Thiết kế thanh lịch, bezel mỏng, phù hợp cho workspace minimalist",
    ],
    cons: [
      "Chỉ 60Hz — không phù hợp gaming, đặc biệt game FPS",
      "Stand không xoay ngang (pivot) — bất tiện cho dân code cần xoay dọc",
      "Không có loa tích hợp",
      "Phản hồi 5ms GTG đủ dùng nhưng không xuất sắc",
    ],
    ratingBreakdown: [
      { label: "Màu sắc",      score: 9.5 },
      { label: "Độ sáng/HDR",  score: 8.8 },
      { label: "Kết nối",      score: 9.2 },
      { label: "Thiết kế",     score: 8.5 },
      { label: "Giá trị",      score: 9.0 },
    ],
    sections: [
      {
        title: "Thiết Kế & Xây Dựng",
        body: [
          "LG 27UQ850 có thiết kế clean với bezel 3 mặt rất mỏng. Stand Ergo cho phép điều chỉnh độ cao 130mm và nghiêng ±5°, nhưng thiếu pivot (xoay dọc) là điểm trừ đáng kể cho lập trình viên hay designer.",
          "Tích hợp OnScreen Control qua USB cho phép điều chỉnh settings trực tiếp từ macOS hoặc Windows — tiện hơn nhiều so với menu OSD thông thường.",
        ],
      },
      {
        title: "Chất Lượng Hình Ảnh",
        body: [
          "Đây là điểm mạnh nhất của 27UQ850. Panel IPS Nano với DCI-P3 98% cho màu sắc sống động và chính xác — sau khi calibrate, Delta E trung bình đo được là 1.8, đủ tiêu chuẩn cho công việc chỉnh màu cơ bản.",
          "Độ tương phản IPS native khoảng 1000:1 — không thể so với OLED hay VA, nhưng backlight local dimming giúp HDR trông tốt hơn đáng kể so với IPS thông thường.",
          "Góc nhìn 178° thực sự phẳng — màu sắc không thay đổi khi nhìn từ góc cạnh, điều mà nhiều VA panel không làm được.",
        ],
      },
      {
        title: "Kết Nối USB-C & Hệ Sinh Thái",
        body: [
          "USB-C 96W là lý do chính nhiều người chọn 27UQ850. Với một sợi cáp USB-C, MacBook Pro M4 vừa được sạc đầy vừa hiển thị 4K — sạch bàn làm việc và không cần adapter thêm.",
          "4 cổng USB-A 3.0 biến màn hình thành USB hub trên bàn làm việc. HDMI 2.0 (không phải 2.1) là hạn chế nhỏ nếu bạn có GPU mới hỗ trợ 4K 60Hz qua HDMI 2.1.",
        ],
      },
    ],
    verdict:
      "LG 27UQ850 là lựa chọn gần như hoàn hảo cho dân văn phòng, designer và developer cần màn hình 4K chất lượng cao với USB-C tiện lợi. Ở mức 12,5 triệu, bạn nhận được màu sắc chuyên nghiệp DCI-P3 98% mà ít màn hình cùng giá có được. Chỉ không phù hợp nếu bạn cần refresh rate cao cho gaming.",
  },

  "macbook-pro-m4-pro-review": {
    price: "52.990.000đ",
    specs: [
      { label: "Chip",           value: "Apple M4 Pro, 12-core CPU, 20-core GPU, 16-core Neural Engine" },
      { label: "RAM",            value: "24GB unified memory (nâng cấp lên 48GB)" },
      { label: "Lưu trữ",        value: "512GB SSD (nâng cấp lên 4TB)" },
      { label: "Màn hình",       value: '14,2" Liquid Retina XDR, 3024×1964, 254ppi, 120Hz ProMotion' },
      { label: "Độ sáng",        value: "1000 nit SDR, 1600 nit HDR, 1000 nit sustained" },
      { label: "Pin",            value: "72.4Wh, tuyên bố 22 giờ, thực tế 14–16 giờ" },
      { label: "Kết nối",        value: "3× Thunderbolt 5, HDMI 2.1, SD card, MagSafe 3, Wi-Fi 6E, BT 5.3" },
      { label: "Bàn phím",       value: "Magic Keyboard backlit, Touch ID, không Touch Bar" },
      { label: "Kích thước",     value: "312,6 × 221,2 × 15,5 mm, 1,55kg" },
    ],
    pros: [
      "Hiệu năng M4 Pro vượt qua tất cả laptop Windows cùng phân khúc — kể cả Core Ultra 9 + RTX 4090",
      "Pin thực tế 14–16 giờ làm việc thông thường — không laptop Windows nào đạt được",
      "Liquid Retina XDR 120Hz là màn hình laptop tốt nhất hiện tại",
      "Thunderbolt 5 với băng thông 120Gbps — tương lai-proof",
      "Build quality nhôm CNC không gì sánh bằng — cảm giác premium thực sự",
    ],
    cons: [
      "Giá khởi điểm 52,9 triệu — đắt hơn nhiều laptop Windows tương đương",
      "RAM và SSD hàn liền, không nâng cấp được sau khi mua",
      "GPU tích hợp không đủ cho gaming AAA — không phải lựa chọn cho game thủ",
      "Không có cổng ethernet hay USB-A",
      "macOS không tương thích với một số phần mềm chuyên ngành Windows",
    ],
    ratingBreakdown: [
      { label: "Hiệu năng",  score: 9.9 },
      { label: "Màn hình",   score: 9.8 },
      { label: "Pin",        score: 9.7 },
      { label: "Thiết kế",   score: 9.5 },
      { label: "Giá trị",    score: 9.0 },
    ],
    sections: [
      {
        title: "Chip M4 Pro — Khoảng Cách Với Windows",
        body: [
          "Chip M4 Pro 12-core CPU (8 P-core + 4 E-core) tiếp tục mở rộng khoảng cách hiệu năng/watt với kiến trúc x86. Trong Cinebench R24 multi-core, MacBook Pro 14 M4 Pro đạt điểm cao hơn nhiều laptop Windows dùng Core Ultra 9 185H — trong khi tiêu thụ điện ít hơn khoảng 40%.",
          "Điều quan trọng hơn benchmark là hiệu năng sustained — M4 Pro duy trì 100% hiệu năng đỉnh liên tục mà không throttle, trong khi hầu hết laptop Windows throttle xuống 60–70% sau vài phút full load. Với tác vụ render, compile code hay xử lý video, sự khác biệt này rất rõ ràng.",
          "20-core GPU xử lý Final Cut Pro 4K ProRes rất mượt, Xcode compile nhanh hơn khoảng 35% so với M3 Pro. Neural Engine 16-core chạy các tác vụ AI on-device, bao gồm Whisper transcription realtime.",
        ],
      },
      {
        title: "Màn Hình Liquid Retina XDR",
        body: [
          "14,2 inch với độ phân giải 3024×1964 cho mật độ 254ppi — văn bản và đồ họa sắc nét đến mức bạn không thể nhìn thấy pixel kể cả khi nhìn rất gần. ProMotion 120Hz thích ứng từ 1Hz đến 120Hz mượt mà.",
          "HDR với đỉnh 1600 nit local dimming miniLED thực sự tạo ra sự khác biệt khi xem phim HDR — điểm sáng rực trên nền tối mà không bloom. P3 wide color gamut và True Tone làm việc ảnh rất thoải mái.",
        ],
      },
      {
        title: "Pin — Kỳ Tích Thực Sự",
        body: [
          "Apple tuyên bố 22 giờ, thực tế tôi đo được 14–16 giờ khi làm việc thông thường (code, viết, duyệt web, video call). Đây là con số không laptop Windows nào cùng kích thước đạt được — Dell XPS 15 chỉ được 6–7 giờ trong cùng điều kiện.",
          "MagSafe 3 với adapter 96W đi kèm sạc đầy trong khoảng 2 giờ. Cũng có thể sạc qua bất kỳ cổng Thunderbolt 5 nào.",
        ],
      },
      {
        title: "Bàn Phím, Touchpad & Cổng Kết Nối",
        body: [
          "Magic Keyboard backlit với hành trình phím 1mm là bàn phím laptop tốt nhất hiện tại — click rõ, ít mỏi tay khi gõ nhiều. Force Touch trackpad lớn với haptic feedback rất tốt.",
          "Thunderbolt 5 cho băng thông 120Gbps — đủ để kết nối màn hình 8K, eGPU hay storage tốc độ cao. HDMI 2.1 và SD card reader UHS-II là những cổng hữu ích Apple cuối cùng đã thêm lại sau nhiều năm.",
        ],
      },
    ],
    verdict:
      "MacBook Pro M4 Pro 14 inch là laptop tốt nhất cho công việc sáng tạo, lập trình và xử lý dữ liệu hiện nay — không có ngoại lệ. Hiệu năng vượt trội, pin bền kinh ngạc và màn hình xuất sắc. Giá 52,9 triệu nghe đắt nhưng khi so với Dell XPS 15 hay Lenovo ThinkPad X1 Extreme cùng tầm giá, MacBook Pro tốt hơn ở hầu hết tiêu chí quan trọng. Không phù hợp nếu bạn cần gaming hoặc bị phụ thuộc vào phần mềm chỉ chạy trên Windows.",
  },

  "sony-wh1000xm6-review": {
    price: "9.290.000đ",
    specs: [
      { label: "Driver",          value: "40mm dynamic, Liquid Crystal Polymer diaphragm" },
      { label: "Chip",            value: "QN3 (Quantum Noise 3)" },
      { label: "Bluetooth",       value: "5.3, multipoint 2 thiết bị" },
      { label: "Codec",           value: "LDAC, AAC, SBC" },
      { label: "Pin",             value: "40 giờ (ANC on), sạc 10 phút dùng 3 giờ, USB-C" },
      { label: "Chống ồn",        value: "ANC với 8 microphone, Adaptive Sound Control" },
      { label: "Trọng lượng",     value: "254g" },
      { label: "Gấp gọn",         value: "Có, fold flat" },
      { label: "3.5mm jack",      value: "Không có" },
    ],
    pros: [
      "Chống ồn tốt nhất thị trường — chip QN3 lọc tiếng ồn tần số thấp (máy bay, điều hòa) xuất sắc",
      "Âm thanh cân bằng tự nhiên, LDAC cho chất lượng Hi-Res thực sự",
      "Pin 40 giờ — đủ cho chuyến bay dài nhất thế giới",
      "Sạc nhanh 10 phút = 3 giờ nghe là tính năng cứu nguy thực sự",
      "Gấp gọn tiện lợi, case nhỏ gọn hơn XM5",
    ],
    cons: [
      "Không có 3.5mm jack — bất tiện khi pin hết trên máy bay",
      "Foam ear cushion dễ tích bụi và bẩn hơn synthetic leather",
      "Không có aptX hay aptX HD — thiếu codec cho Android flagship",
      "Hơi nặng 254g khi đeo liên tục nhiều giờ",
    ],
    ratingBreakdown: [
      { label: "Chống ồn",   score: 9.8 },
      { label: "Âm thanh",   score: 9.3 },
      { label: "Pin",        score: 9.5 },
      { label: "Thoải mái",  score: 8.8 },
      { label: "Kết nối",    score: 9.0 },
    ],
    sections: [
      {
        title: "Thiết Kế & Sự Thoải Mái",
        body: [
          "WH-1000XM6 trông khá giống XM5 nhưng Sony đã tinh chỉnh ở các chi tiết quan trọng — headband mềm hơn và ear cushion dày hơn giúp đeo thoải mái hơn trong thời gian dài. Khớp xoay mới cho phép gấp tai nghe phẳng hơn khi bỏ vào case.",
          "Bề mặt matte mới ít bám vân tay hơn finish bóng của XM5. Trọng lượng 254g cảm thấy cân bằng tốt — không bị nặng đầu sau 4–5 giờ đeo.",
        ],
      },
      {
        title: "Chống Ồn — Đẳng Cấp Mới",
        body: [
          "Chip QN3 với 8 microphone (4 feedforward + 4 feedback) tạo ra ANC mạnh nhất tôi từng trải nghiệm trên tai nghe consumer. Trong chuyến bay thử nghiệm, tiếng động cơ máy bay giảm xuống mức gần như im lặng hoàn toàn.",
          "Adaptive Sound Control tự động điều chỉnh mức ANC theo tình huống — khi đang ngồi yên, ANC full power; khi đi bộ, transparency mode tự mở để nghe tiếng xung quanh. Cơ chế này hoạt động rất tự nhiên sau vài ngày sử dụng.",
          "Điểm yếu nhỏ: ANC vẫn không lọc được tiếng người nói ở tần số cao bằng giọng nói trực tiếp — chỉ giảm chứ không loại bỏ hoàn toàn.",
        ],
      },
      {
        title: "Chất Lượng Âm Thanh",
        body: [
          "Với LDAC ở 990kbps, XM6 cho chất lượng âm thanh Hi-Res thực sự — tốt hơn đáng kể so với AAC. Bass chắc nhưng không bùng; midrange rõ ràng; treble sáng mà không chói. Với nhạc pop, jazz và acoustic, đây là trải nghiệm tuyệt vời.",
          "So với Bose QC Ultra, Sony XM6 có âm bass nhiều hơn và midrange chi tiết hơn. Bose lại có soundstage rộng hơn và âm thanh tự nhiên hơn một chút. Cả hai đều xuất sắc — lựa chọn phụ thuộc vào gu âm nhạc.",
        ],
      },
    ],
    verdict:
      "Sony WH-1000XM6 vẫn giữ vị trí số 1 trong phân khúc tai nghe chống ồn. Chip QN3 mang ANC lên một tầm cao mới, âm thanh LDAC xuất sắc và pin 40 giờ không tai nghe nào sánh bằng. Giá 9,29 triệu không hề rẻ nhưng xứng đáng nếu bạn thường xuyên đi máy bay, làm việc ở quán cà phê hay cần tập trung trong văn phòng ồn ào.",
  },

  "google-pixel-9-pro-review": {
    price: "28.990.000đ",
    specs: [
      { label: "Màn hình",       value: '6,3" LTPO OLED, 2992×1344, 1–120Hz, 3000 nit peak' },
      { label: "Chip",           value: "Google Tensor G4, tiến trình 4nm Samsung" },
      { label: "RAM / Bộ nhớ",   value: "16GB LPDDR5 / 128GB – 1TB" },
      { label: "Camera sau",     value: "50MP f/1.68 main + 48MP ultrawide + 48MP 5x telephoto" },
      { label: "Camera trước",   value: "10.5MP f/2.2 autofocus" },
      { label: "Pin",            value: "5060mAh, sạc 27W có dây, 23W wireless" },
      { label: "Tính năng AI",   value: "Magic Eraser, Photo Unblur, Audio Magic Eraser, Gemini AI" },
      { label: "Hệ điều hành",   value: "Android 15, 7 năm cập nhật" },
      { label: "Kích thước",     value: "152,8 × 72 × 8,5 mm, 199g" },
    ],
    pros: [
      "Camera computational photography tốt nhất Android — Magic Eraser và ảnh đêm vẫn số 1",
      "Thiết kế hoàn toàn mới với bar camera ngang đẹp và độc đáo",
      "Cam kết 7 năm cập nhật OS và bảo mật — dài nhất thị trường Android",
      "Màn hình LTPO OLED 3000 nit đỉnh — sáng hơn cả Galaxy S25 Ultra",
      "Gemini AI tích hợp sâu vào toàn bộ hệ thống — thực dụng nhất trong Android",
    ],
    cons: [
      "Tensor G4 kém Snapdragon 8 Elite khoảng 20–25% hiệu năng CPU",
      "Sạc 27W vẫn chậm so với Android flagship cùng giá",
      "Chưa có đủ app AI ngoài hệ sinh thái Google",
      "Giá 28,9 triệu cao cho chip Tensor — thi phần cứng kém Galaxy và iPhone cùng giá",
    ],
    ratingBreakdown: [
      { label: "Camera",     score: 9.5 },
      { label: "Màn hình",   score: 9.4 },
      { label: "AI tính năng", score: 9.6 },
      { label: "Hiệu năng",  score: 8.5 },
      { label: "Pin",        score: 9.0 },
    ],
    sections: [
      {
        title: "Thiết Kế Mới Hoàn Toàn",
        body: [
          "Pixel 9 Pro là bước ngoặt thiết kế lớn nhất của Google từ khi ra mắt dòng Pixel. Thay vì cụm camera vuông quen thuộc, Pixel 9 Pro dùng camera bar ngang kéo dài từ cạnh này sang cạnh kia — nhìn rất độc đáo và ngay lập tức nhận ra là Pixel.",
          "Mặt lưng polished glass kết hợp với viền nhôm matte tạo cảm giác premium. 199g là trọng lượng lý tưởng — không nặng tay như Galaxy S25 Ultra hay iPhone 16 Pro Max.",
        ],
      },
      {
        title: "Camera — Nghệ Thuật Xử Lý Ảnh",
        body: [
          "Camera chính 50MP f/1.68 với sensor lớn nhất Pixel từ trước đến nay tạo ra ảnh với bokeh tự nhiên đẹp đến mức tôi nhiều lần nhầm tưởng ảnh chụp bằng máy mirrorless. Điều Google làm tốt nhất không phải độ sắc nét mà là cân bằng sáng tối — dải dynamic range của Pixel 9 Pro hầu như không có điểm yếu.",
          "Magic Eraser vẫn là công cụ xóa object trong ảnh tốt nhất hiện tại — xóa người qua lại ở nền trong 2 giây mà không để lại artifact. Photo Unblur làm sắc nét ảnh cũ bị mờ một cách đáng ngạc nhiên.",
          "Camera telephoto 48MP 5x là nâng cấp lớn từ Pixel 8 Pro — zoom sắc nét hơn và ít nhiễu hơn trong điều kiện thiếu sáng.",
        ],
      },
      {
        title: "Google AI & Gemini",
        body: [
          "Gemini tích hợp trực tiếp vào Assistant, Camera, Messages và nhiều app Google khác. Tính năng tôi dùng nhiều nhất là Gemini trong Google Messages — tóm tắt conversation dài và đề xuất trả lời rất thực dụng.",
          "Pixel Screenshots — app mới trong Android 15 trên Pixel — tự động phân tích và tag mọi screenshot theo nội dung, tạo search engine riêng cho ảnh chụp màn hình. Đây là tính năng tôi không biết mình cần cho đến khi dùng thử.",
        ],
      },
    ],
    verdict:
      "Pixel 9 Pro là điện thoại tốt nhất cho ai yêu nhiếp ảnh mobile và muốn AI thực sự hữu ích trong công việc hàng ngày. Camera computational photography vẫn là đỉnh cao của Android, và 7 năm cập nhật là cam kết dài nhất thị trường. Điểm yếu là Tensor G4 kém hiệu năng và sạc chậm. Ở mức 28,9 triệu, đây là chiếc điện thoại phù hợp cho người dùng nằm sâu trong hệ sinh thái Google.",
  },

  "dell-xps-15-2025-review": {
    price: "68.990.000đ",
    specs: [
      { label: "Chip",           value: "Intel Core Ultra 9 185H (Meteor Lake), 16 nhân" },
      { label: "GPU",            value: "NVIDIA GeForce RTX 4070 8GB GDDR6" },
      { label: "RAM",            value: "32GB LPDDR5X 7467MHz (nâng cấp lên 64GB)" },
      { label: "Lưu trữ",        value: "1TB PCIe 4.0 NVMe (nâng cấp lên 2TB)" },
      { label: "Màn hình",       value: '15,6" OLED 3456×2160, 120Hz, 400 nit SDR, DCI-P3 100%' },
      { label: "Pin",            value: "86Wh, sạc 130W USB-C" },
      { label: "Kết nối",        value: "2× Thunderbolt 4, 1× USB-C 3.2, SD card, 3.5mm" },
      { label: "Webcam",         value: "720p IR (FHD optional)" },
      { label: "Kích thước",     value: "344,4 × 230,1 × 18 mm, 1,86kg" },
    ],
    pros: [
      "Màn hình OLED 3.5K 120Hz — tốt nhất trong phân khúc laptop Windows premium",
      "Thiết kế nhôm CNC mỏng 18mm đẹp và cao cấp nhất trong Windows laptop",
      "RTX 4070 đủ mạnh cho creative work và gaming trung bình",
      "Cải thiện nhiệt độ đáng kể so với thế hệ trước nhờ vapor chamber mới",
    ],
    cons: [
      "Giá 68,9 triệu — đắt hơn MacBook Pro M4 Pro mà hiệu năng/watt kém hơn",
      "Pin chỉ 4–5 giờ khi dùng đầy đủ — tệ hơn nhiều so với MacBook",
      "Quạt tản nhiệt ồn khi load cao, đặc biệt khi GPU full power",
      "Chỉ có 2 cổng Thunderbolt 4 — ít cổng cho laptop giá này",
      "720p webcam mặc định — phải trả thêm cho FHD",
    ],
    ratingBreakdown: [
      { label: "Màn hình",   score: 9.6 },
      { label: "Thiết kế",   score: 9.4 },
      { label: "Hiệu năng",  score: 8.8 },
      { label: "Pin",        score: 6.5 },
      { label: "Giá trị",    score: 7.5 },
    ],
    sections: [
      {
        title: "Thiết Kế & Xây Dựng",
        body: [
          "XPS 15 (2025) là một trong những laptop đẹp nhất trên thị trường Windows — không thảo luận. Khung nhôm CNC nguyên khối với viền siêu mỏng và mặt carbon fiber matte ở phần gõ tạo cảm giác premium mà ít laptop Windows 15 inch nào có được.",
          "Độ mỏng 18mm cho laptop 15 inch với RTX 4070 là thành tích đáng nể — Dell đã phải hy sinh dung lượng pin và số lượng cổng để đạt được điều này.",
        ],
      },
      {
        title: "Màn Hình OLED 3.5K",
        body: [
          "Đây là lý do chính đáng nhất để mua XPS 15. OLED 3456×2160 với DCI-P3 100% và HDR là màn hình laptop tốt nhất trong phân khúc Windows — màu sắc sống động, đen tuyệt đối và 120Hz mượt mà.",
          "Một điểm trừ nhỏ: độ sáng tối đa 400 nit SDR khá thấp cho môi trường sáng. OLED HDR peak 600 nit tốt hơn nhưng chỉ kích hoạt với nội dung HDR.",
        ],
      },
      {
        title: "Hiệu Năng & Nhiệt Độ",
        body: [
          "Core Ultra 9 185H với RTX 4070 đủ mạnh cho video editing 4K, 3D rendering cơ bản và gaming ở 1080p-1440p. Tuy nhiên, sustained performance là điểm yếu — sau 10 phút full load, CPU throttle xuống khoảng 25W để kiểm soát nhiệt độ.",
          "Vapor chamber mới cải thiện đáng kể so với XPS 15 2023, nhưng quạt vẫn ồn đáng kể khi full load. Trong môi trường yên tĩnh (thư viện, họp), tiếng quạt có thể gây phiền.",
        ],
      },
      {
        title: "Pin — Điểm Yếu Nghiêm Trọng",
        body: [
          "Pin 86Wh nghe có vẻ lớn nhưng với OLED 3.5K và RTX 4070, thực tế chỉ được 4–5 giờ làm việc thông thường. So với MacBook Pro M4 cùng phân khúc giá, XPS 15 kém hơn 3 lần về thời lượng pin.",
          "Đây là trade-off chấp nhận được nếu bạn chủ yếu làm việc cắm điện, nhưng là dealbreaker nếu bạn cần dùng di động nhiều.",
        ],
      },
    ],
    verdict:
      "Dell XPS 15 (2025) là laptop Windows đẹp nhất với màn hình OLED xuất sắc và thiết kế premium không ai sánh bằng. Nhưng ở mức giá 68,9 triệu, nó thua MacBook Pro M4 Pro về hiệu năng, pin và giá trị tổng thể. Chọn XPS 15 nếu bạn cần Windows, màn hình OLED đẹp và không di chuyển nhiều. Chọn MacBook nếu hiệu năng và pin là ưu tiên.",
  },

  "asus-rog-swift-pg32ucdm-review": {
    price: "29.900.000đ",
    specs: [
      { label: "Panel",            value: "31,5\" OLED QD, 3840×2160 (4K)" },
      { label: "Tần số quét",      value: "240Hz (native), 480Hz (4K MBR)" },
      { label: "Thời gian phản hồi", value: "0,03ms GTG" },
      { label: "Độ sáng",          value: "250 nit SDR, 1000 nit HDR peak (True Black)" },
      { label: "Màu sắc",          value: "DCI-P3 99%, Delta E < 2" },
      { label: "HDR",              value: "DisplayHDR 1000 True Black" },
      { label: "Sync",             value: "NVIDIA G-Sync Ultimate, AMD FreeSync Premium Pro" },
      { label: "Kết nối",          value: "2× HDMI 2.1, 1× DP 1.4, USB-C 90W, 4× USB-A 3.2" },
      { label: "Kích thước",       value: "31,5\", stand ASUS ROG adjustable" },
    ],
    pros: [
      "OLED 4K ở 240Hz — sự kết hợp chưa từng có trên gaming monitor",
      "DisplayHDR 1000 True Black — độ tương phản vô hạn, đen tuyệt đối",
      "0,03ms response time — chuyển động mượt mà nhất có thể trên màn hình",
      "DCI-P3 99% phù hợp cả cho design work lẫn gaming",
      "G-Sync Ultimate + FreeSync — tương thích với cả NVIDIA và AMD GPU",
    ],
    cons: [
      "Giá 29,9 triệu — đắt nhất trong phân khúc gaming monitor",
      "OLED burn-in risk khi hiển thị nội dung tĩnh lâu dài (HUD game, taskbar)",
      "Độ sáng SDR 250 nit thấp — môi trường sáng cần điều chỉnh",
      "Stand ROG cồng kềnh và nặng — khó di chuyển",
      "Tiêu thụ điện cao hơn IPS tương đương",
    ],
    ratingBreakdown: [
      { label: "Chất lượng hình", score: 9.8 },
      { label: "Gaming perf",     score: 9.7 },
      { label: "Màu sắc",         score: 9.5 },
      { label: "Kết nối",         score: 9.2 },
      { label: "Giá trị",         score: 8.5 },
    ],
    sections: [
      {
        title: "OLED 4K 240Hz — Sự Kết Hợp Chưa Từng Có",
        body: [
          "Trước ROG Swift PG32UCDM, bạn phải chọn một trong hai: OLED với refresh rate cao (thường 1440p) hoặc 4K với refresh rate thấp (thường 144Hz IPS). PG32UCDM xóa bỏ trade-off này — 4K 240Hz trên OLED.",
          "Trong thực tế, sự khác biệt rõ rệt nhất khi chơi game racing và FPS. Chuyển động của xe trong Forza Horizon không có ghost hay blur — một điều tưởng chừng không thể trên màn hình 4K.",
          "Với GPU hiện tại (RTX 4080/4090), chạy game AAA ở 4K 240Hz là thách thức. Nhưng với esport titles như Valorant hay CS2, đây là trải nghiệm chưa từng có.",
        ],
      },
      {
        title: "Chất Lượng Hình Ảnh & HDR",
        body: [
          "QD-OLED (Quantum Dot OLED) cho màu sắc rực rỡ hơn W-OLED truyền thống — DCI-P3 99% không chỉ là con số, bạn thực sự thấy sự khác biệt khi xem phim HDR hoặc chỉnh ảnh.",
          "DisplayHDR 1000 True Black nghĩa là màn hình đạt 1000 nit peak trong khi điểm đen là 0 nit — tạo ra dải tương phản vô hạn chỉ OLED mới có được. Cảnh phim HDR trên màn hình này có chiều sâu không màn hình nào khác tái tạo được.",
        ],
      },
      {
        title: "Burn-In & Độ Bền Dài Hạn",
        body: [
          "OLED burn-in là rủi ro thực sự cần lưu ý. ASUS tích hợp pixel refresher tự động chạy khi không dùng màn hình và pixel shift nhẹ khi hiển thị nội dung tĩnh. Tuy nhiên, nếu bạn thường xuyên để taskbar hay HUD game cố định nhiều giờ, burn-in là nguy cơ dài hạn.",
          "Khuyến nghị: dùng screensaver, tắt màn hình khi không dùng và tránh để nội dung tĩnh quá 4 giờ liên tục.",
        ],
      },
    ],
    verdict:
      "ASUS ROG Swift PG32UCDM là đỉnh cao gaming monitor năm 2025 — OLED 4K 240Hz là thứ không màn hình nào khác cùng phân khúc có. Với game thủ nghiêm túc có GPU RTX 4080/4090, đây là khoản đầu tư xứng đáng. Nhưng cần cân nhắc burn-in risk và đảm bảo đủ GPU để tận dụng 240Hz ở 4K. Không phù hợp làm màn hình văn phòng 8 tiếng/ngày.",
  },

  "logitech-mx-master-4-review": {
    price: "3.790.000đ",
    specs: [
      { label: "Sensor",          value: "Darkfield 8000 DPI, 1–8000 DPI tùy chỉnh" },
      { label: "Scroll wheel",    value: "MagSpeed 2 electromagnetic, SmartShift tự động" },
      { label: "Pin",             value: "70 ngày (Logi Bolt), 40 ngày (Bluetooth), USB-C" },
      { label: "Kết nối",         value: "Logi Bolt USB receiver + Bluetooth 5.4 multipoint" },
      { label: "Số nút",          value: "7 nút có lập trình" },
      { label: "Đa thiết bị",     value: "Kết nối đồng thời 3 thiết bị, chuyển bằng nút" },
      { label: "Nền tảng",        value: "Windows, macOS, Linux, ChromeOS, iPadOS" },
      { label: "Tay thuận",       value: "Chỉ tay phải (ergonomic)" },
      { label: "Kích thước",      value: "124,9 × 84,3 × 51mm, 141g" },
    ],
    pros: [
      "MagSpeed 2 electromagnetic scroll — nhanh và mượt nhất trên bất kỳ chuột nào",
      "SmartShift tự động chuyển giữa click scroll và free spin — thông minh và tiện",
      "Pin 70 ngày qua Logi Bolt — sạc một lần dùng cả mùa",
      "Gesture button + thumb rest tạo ra workflow shortcuts rất linh hoạt",
      "Logi Options+ cho phép lập trình từng nút theo từng app cụ thể",
    ],
    cons: [
      "Chỉ dành tay phải — người thuận tay trái không dùng được",
      "141g khá nặng — không phù hợp với bàn nhỏ hay laptop bag chật",
      "Logi Bolt receiver chiếm cổng USB — không thể dùng trực tiếp không receiver",
      "Giá 3,79 triệu — đắt nhất cho chuột không gaming",
    ],
    ratingBreakdown: [
      { label: "Scroll wheel",   score: 9.9 },
      { label: "Thoải mái",      score: 9.5 },
      { label: "Pin",            score: 9.4 },
      { label: "Tính năng",      score: 9.3 },
      { label: "Giá trị",        score: 8.8 },
    ],
    sections: [
      {
        title: "MagSpeed 2 — Scroll Wheel Tốt Nhất Thế Giới",
        body: [
          "Nếu bạn chưa từng dùng MagSpeed electromagnetic scroll, rất khó để diễn tả cảm giác. MagSpeed 2 dùng lực từ trường để kiểm soát độ ma sát của bánh cuộn — ở chế độ free spin, cuộn một vòng nhẹ sẽ làm trang web chạy xuống với quán tính mượt mà không stop đột ngột. Ở chế độ click scroll, mỗi click rõ ràng và chính xác.",
          "SmartShift tự động nhận biết khi bạn cuộn nhanh và chuyển sang free spin, khi cuộn chậm chuyển về click mode. Sau vài ngày sử dụng, bạn sẽ không hiểu sao mình từng chịu đựng scroll wheel thông thường.",
          "MagSpeed 2 cải thiện so với MagSpeed thế hệ 1 ở điểm quan trọng: scroll chính xác hơn khi code hay chỉnh Excel — không còn bị overshoot dòng cần.",
        ],
      },
      {
        title: "Thiết Kế & Cầm Nắm",
        body: [
          "MX Master 4 có form factor ergonomic phù hợp bàn tay trung bình đến lớn. Thumb rest với texture bề mặt cao su không bị trơn ngay cả khi tay đổ mồ hôi. Nút gesture ở cạnh trái có thể lập trình theo từng app — tôi dùng để Mission Control trên macOS và Virtual Desktop switch trên Windows.",
          "141g là trọng lượng thực sự cảm nhận được — cầm tay thấy chắc chắn. Nhưng nếu bạn quen chuột nhẹ gaming dưới 80g, sẽ cần thời gian thích nghi.",
        ],
      },
      {
        title: "Kết Nối & Đa Thiết Bị",
        body: [
          "Logi Bolt cho độ trễ thấp hơn Bluetooth và ổn định hơn trong môi trường nhiều thiết bị không dây. Thực tế tôi không cảm nhận được sự khác biệt với Bluetooth 5.4, nhưng Logi Bolt có ưu thế ở môi trường văn phòng đông người.",
          "Chuyển đổi 3 thiết bị bằng nút dưới chuột diễn ra trong 1–2 giây — đủ nhanh cho workflow dùng cùng lúc máy tính bàn, laptop và iPad. Flow feature của Logi Options+ cho phép di chuyển chuột giữa 2 máy tính như một màn hình mở rộng — tính năng killer cho dân multi-device.",
        ],
      },
    ],
    verdict:
      "Logitech MX Master 4 vẫn là chuột văn phòng tốt nhất thế giới, và MagSpeed 2 đã làm nó càng tốt hơn. Ở mức 3,79 triệu, đây là khoản đầu tư xứng đáng nếu bạn làm việc nhiều giờ trên máy tính — năng suất thực sự cải thiện nhờ scroll wheel và gesture shortcuts. Chỉ không phù hợp nếu bạn thuận tay trái hoặc cần chuột nhẹ cho gaming.",
  },
}
