import type { LegalCopy } from "@/components/layout/LegalPage"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"

const mailto = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

export const EDITORIAL_POLICY_COPY: Record<Locale, LegalCopy> = {
  en: {
    title: "Editorial Policy",
    description: `The standards ${SITE_NAME} follows for independence, accuracy, sourcing, corrections and AI use.`,
    intro: (
      <p>
        {SITE_NAME} publishes independent tech reviews, buying guides and comparisons. These are the
        rules our editorial team works by.
      </p>
    ),
    sections: [
      {
        title: "Independence",
        content: (
          <>
            <p>
              Brands and retailers cannot pay for a review, a score, a ranking or a place in a
              buying guide, and they do not see reviews before publication.
            </p>
            <p>
              We may earn money through affiliate links. Whether a product has an affiliate link, or
              how much commission it pays, never affects its score.
            </p>
          </>
        ),
      },
      {
        title: "Accuracy and sourcing",
        content: (
          <ul>
            <li>Specifications are attributed to the manufacturer or another named source.</li>
            <li>Every review lists its sources at the end.</li>
            <li>When sources conflict, we report the conflict rather than choose a number.</li>
            <li>
              We clearly label research roundups and never imply hands-on use we have not done (see{" "}
              <Link href="/how-we-review">How We Review</Link>).
            </li>
            <li>
              We list a product&apos;s missing features and real downsides, not only its strengths.
            </li>
          </ul>
        ),
      },
      {
        title: "Who writes our content",
        content: (
          <p>
            Reviews are written and reviewed by the {SITE_NAME} editorial team. Each product
            category has a byline under an editorial pen name (for example Jordan Pike for gaming
            gear); pen names are not separate individuals, and their author pages say so. Before
            publishing, each review is checked against its sources for specs, model names and
            claims.
          </p>
        ),
      },
      {
        title: "Use of AI tools",
        content: (
          <p>
            We may use AI tools to help with translation, summaries and drafting. A human editor
            checks every published page against its sources and is responsible for its accuracy. AI
            is never used to invent test results or experiences.
          </p>
        ),
      },
      {
        title: "Corrections",
        content: (
          <p>
            If you find an error, email {mailto} or use our{" "}
            <Link href="/contact">contact page</Link>. We correct factual errors promptly and update
            the review&apos;s &quot;Last updated&quot; date.
          </p>
        ),
      },
    ],
  },
  vi: {
    title: "Chính Sách Biên Tập",
    description: `Các nguyên tắc ${SITE_NAME} tuân theo về độc lập, chính xác, nguồn tin, đính chính và sử dụng AI.`,
    intro: (
      <p>
        {SITE_NAME} đăng bài đánh giá, hướng dẫn chọn mua và so sánh sản phẩm công nghệ độc lập. Đây
        là những nguyên tắc đội ngũ biên tập làm theo.
      </p>
    ),
    sections: [
      {
        title: "Độc lập",
        content: (
          <>
            <p>
              Hãng và nhà bán lẻ không thể trả tiền để có bài đánh giá, điểm số, thứ hạng hay vị trí
              trong bài hướng dẫn, và không được xem bài trước khi đăng.
            </p>
            <p>
              Chúng tôi có thể nhận hoa hồng từ liên kết tiếp thị. Việc sản phẩm có link tiếp thị
              hay mức hoa hồng không bao giờ ảnh hưởng tới điểm số.
            </p>
          </>
        ),
      },
      {
        title: "Chính xác và nguồn tin",
        content: (
          <ul>
            <li>Thông số được ghi rõ là của hãng hoặc của nguồn có tên cụ thể.</li>
            <li>Mỗi bài liệt kê nguồn tham khảo ở cuối bài.</li>
            <li>Khi các nguồn mâu thuẫn, chúng tôi nói rõ thay vì tự chọn một con số.</li>
            <li>
              Bài tổng hợp được ghi nhãn rõ, không viết như đã tự dùng (xem{" "}
              <Link href="/how-we-review">Cách chúng tôi đánh giá</Link>).
            </li>
            <li>Bài nêu cả tính năng còn thiếu và nhược điểm thật, không chỉ ưu điểm.</li>
          </ul>
        ),
      },
      {
        title: "Ai viết bài",
        content: (
          <p>
            Bài được viết và duyệt bởi đội ngũ biên tập {SITE_NAME}. Mỗi danh mục đứng tên một bút
            danh biên tập (VD Jordan Pike cho gaming gear); bút danh không phải cá nhân riêng lẻ và
            trang tác giả có ghi rõ điều này. Trước khi đăng, thông số, tên phiên bản và các nhận
            định được đối chiếu lại với nguồn.
          </p>
        ),
      },
      {
        title: "Sử dụng công cụ AI",
        content: (
          <p>
            Chúng tôi có thể dùng AI hỗ trợ dịch, tóm tắt và soạn nháp. Người biên tập kiểm tra mọi
            trang trước khi đăng và chịu trách nhiệm về độ chính xác. AI không bao giờ được dùng để
            bịa kết quả thử nghiệm hay trải nghiệm.
          </p>
        ),
      },
      {
        title: "Đính chính",
        content: (
          <p>
            Thấy sai sót, hãy email {mailto} hoặc dùng <Link href="/contact">trang liên hệ</Link>.
            Chúng tôi sửa lỗi sớm và cập nhật ngày &quot;Cập nhật lần cuối&quot; của bài.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "编辑政策",
    description: `${SITE_NAME} 在独立性、准确性、信息来源、更正及 AI 使用方面遵循的准则。`,
    intro: (
      <p>{SITE_NAME} 发布独立的科技产品评测、选购指南和对比文章。以下是我们编辑团队遵循的准则。</p>
    ),
    sections: [
      {
        title: "独立性",
        content: (
          <>
            <p>
              品牌和零售商无法付费购买评测、评分、排名或指南中的位置，也不会在发布前看到评测内容。
            </p>
            <p>我们可能通过联盟链接获得收入。产品是否有联盟链接或佣金高低，绝不影响评分。</p>
          </>
        ),
      },
      {
        title: "准确性与来源",
        content: (
          <ul>
            <li>规格参数注明来自厂商或其他具名来源。</li>
            <li>每篇评测末尾列出参考来源。</li>
            <li>来源相互矛盾时，我们如实说明。</li>
            <li>
              资料汇总评测会明确标注，绝不暗示亲自使用（见
              <Link href="/how-we-review">我们如何评测</Link>）。
            </li>
            <li>我们会列出产品缺少的功能和真实缺点。</li>
          </ul>
        ),
      },
      {
        title: "内容作者",
        content: (
          <p>
            评测由 {SITE_NAME} 编辑团队撰写和审核。每个产品类别使用一个编辑笔名署名（例如游戏外设为
            Ethan
            Hale）；笔名并非独立个人，作者页面对此有明确说明。发布前会对照来源核实参数、型号和观点。
          </p>
        ),
      },
      {
        title: "AI 工具的使用",
        content: (
          <p>
            我们可能使用 AI
            辅助翻译、摘要和起草。每个发布的页面都由编辑对照来源审核并对准确性负责。AI
            绝不用于编造测试结果或使用体验。
          </p>
        ),
      },
      {
        title: "更正",
        content: (
          <p>
            如发现错误，请发送邮件至 {mailto} 或使用<Link href="/contact">联系页面</Link>
            。我们会及时更正并更新评测的“最后更新”日期。
          </p>
        ),
      },
    ],
  },
}
