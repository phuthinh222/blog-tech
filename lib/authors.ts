import type { Locale } from "@/i18n/routing"

// Bút danh của đội ngũ biên tập Zero Technology — mỗi bút danh phụ trách một
// danh mục. Đây KHÔNG phải người thật riêng lẻ: trang tác giả và Editorial
// Policy nói rõ đây là bút danh, không gắn ảnh, chức danh hay kinh nghiệm bịa.
// Bài review lấy tác giả theo danh mục (authorForCategory).
export type Author = {
  slug: string
  name: string
  category: string
  bio: Record<Locale, string>
}

export const AUTHORS: Author[] = [
  {
    slug: "ethan-hale",
    name: "Ethan Hale",
    category: "gaming-gear",
    bio: {
      en: "Covers gaming mice, keyboards and headsets: sensors, weight, switches and what actually matters for competitive and casual play.",
      vi: "Phụ trách chuột, bàn phím và tai nghe gaming: cảm biến, trọng lượng, switch và điều thật sự quan trọng khi chơi game.",
      zh: "负责游戏鼠标、键盘和耳机：传感器、重量、轴体，以及对竞技和休闲玩家真正重要的因素。",
    },
  },
  {
    slug: "liam-archer",
    name: "Liam Archer",
    category: "pc-laptop",
    bio: {
      en: "Covers monitors, PCs and laptops: panels, refresh rates, ports and value for gaming and everyday work.",
      vi: "Phụ trách màn hình, PC và laptop: tấm nền, tần số quét, cổng kết nối và giá trị cho chơi game lẫn làm việc.",
      zh: "负责显示器、电脑和笔记本：面板、刷新率、接口，以及游戏和日常办公的性价比。",
    },
  },
  {
    slug: "nora-quinn",
    name: "Nora Quinn",
    category: "audio-video",
    bio: {
      en: "Covers earbuds, headphones and speakers: noise cancellation, battery life, codecs and how specs translate to real listening.",
      vi: "Phụ trách tai nghe và loa: chống ồn, thời lượng pin, codec và thông số phản ánh trải nghiệm nghe thực tế ra sao.",
      zh: "负责耳机和音箱：降噪、续航、编解码器，以及参数如何体现在实际聆听中。",
    },
  },
  {
    slug: "maya-ellison",
    name: "Maya Ellison",
    category: "desk-setup",
    bio: {
      en: "Covers desk setups: monitor arms, light bars and organisers that make a workspace tidier and more comfortable.",
      vi: "Phụ trách góc làm việc: arm màn hình, đèn treo màn hình và phụ kiện giúp bàn làm việc gọn gàng, thoải mái hơn.",
      zh: "负责桌面布置：显示器支架、屏幕挂灯和收纳配件，让工作区更整洁舒适。",
    },
  },
]

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug)
}

export function authorForCategory(category: string): Author | undefined {
  return AUTHORS.find((a) => a.category === category)
}
