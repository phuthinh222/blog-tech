import type { LegalCopy } from "@/components/layout/LegalPage"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { SITE_NAME } from "@/lib/constants"

export const HOW_WE_REVIEW_COPY: Record<Locale, LegalCopy> = {
  en: {
    title: "How We Review",
    description: `How ${SITE_NAME} researches, scores and updates its tech reviews, and how to tell a hands-on review from a research-based one.`,
    intro: (
      <p>
        Every {SITE_NAME} review follows the same process, so you can compare products fairly and
        know exactly where each claim comes from.
      </p>
    ),
    sections: [
      {
        id: "review-types",
        title: "1. Two kinds of review, always labelled",
        content: (
          <>
            <p>
              <strong>Hands-on tested</strong>: we bought or borrowed the product and used it
              ourselves. Photos in these reviews are our own.
            </p>
            <p>
              <strong>Research roundup</strong>: we have <strong>not</strong> used the product
              ourselves. We compile the manufacturer&apos;s specifications, manuals, independent
              measurements and published reviews from other outlets, then add our own analysis of
              who the product suits. Most reviews on the site today are research roundups.
            </p>
            <p>
              The label appears at the top of every review. We never write &quot;we tested&quot; or
              &quot;in our testing&quot; in a research roundup.
            </p>
          </>
        ),
      },
      {
        id: "sources",
        title: "2. Where our information comes from",
        content: (
          <>
            <p>We rank sources in this order:</p>
            <ul>
              <li>Manufacturer product pages, spec sheets and manuals (for specifications).</li>
              <li>Independent measurements and benchmarks.</li>
              <li>Hands-on reviews from established publications and verified buyer feedback.</li>
            </ul>
            <p>
              Key specs are attributed in the text (&quot;Logitech lists…&quot;, &quot;according to
              the manufacturer…&quot;) and every review ends with a <strong>Sources</strong> list.
              When sources disagree, we say so instead of picking the most flattering number.
            </p>
          </>
        ),
      },
      {
        id: "scoring",
        title: "3. How we score",
        content: (
          <>
            <p>Each product gets a score out of 10 based on four criteria:</p>
            <ul>
              <li>
                <strong>Design</strong>: build quality, materials, size, weight, everyday
                practicality.
              </li>
              <li>
                <strong>Performance</strong>: how well it does its main job.
              </li>
              <li>
                <strong>Battery &amp; durability</strong>: battery life where relevant, expected
                durability and warranty terms.
              </li>
              <li>
                <strong>Value</strong>: what you get for the money compared with alternatives in the
                same price range.
              </li>
            </ul>
            <p>
              Scores are meant to spread out: a good product typically lands around 7–8, and a 9+ is
              rare.
            </p>
          </>
        ),
      },
      {
        id: "prices",
        title: "4. Prices, availability and warranty",
        content: (
          <p>
            Prices change daily and differ by country, so we do not print exact prices. Reviews link
            to retailers in several regions (for example Amazon US, UK and Germany) where you can
            see the current price. Warranty length and even model names vary by region — check the
            local retailer or manufacturer before you buy.
          </p>
        ),
      },
      {
        id: "updates",
        title: "5. Updates and corrections",
        content: (
          <p>
            Each review shows a &quot;Last updated&quot; date. We revise reviews when a product
            changes, a better alternative appears or a reader reports an error. Found a mistake?{" "}
            <Link href="/contact">Tell us</Link> and we will correct it. See also our{" "}
            <Link href="/editorial-policy">Editorial Policy</Link> and{" "}
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
          </p>
        ),
      },
    ],
  },
  vi: {
    title: "Cách Chúng Tôi Đánh Giá",
    description: `${SITE_NAME} nghiên cứu, chấm điểm và cập nhật bài đánh giá như thế nào; cách phân biệt bài trải nghiệm thực tế và bài tổng hợp.`,
    intro: (
      <p>
        Mọi bài đánh giá của {SITE_NAME} đi theo cùng một quy trình, để bạn so sánh sản phẩm công
        bằng và biết rõ mỗi thông tin lấy từ đâu.
      </p>
    ),
    sections: [
      {
        id: "review-types",
        title: "1. Hai loại bài, luôn được ghi rõ",
        content: (
          <>
            <p>
              <strong>Trải nghiệm thực tế</strong>: chúng tôi đã mua hoặc mượn và tự dùng sản phẩm;
              ảnh trong bài do chúng tôi tự chụp.
            </p>
            <p>
              <strong>Tổng hợp</strong>: chúng tôi <strong>chưa</strong> trực tiếp sử dụng sản phẩm.
              Bài tổng hợp thông số của hãng, sách hướng dẫn, số đo độc lập và đánh giá đã đăng của
              các trang khác, kèm phân tích riêng về việc sản phẩm hợp với ai. Phần lớn bài hiện nay
              là bài tổng hợp.
            </p>
            <p>
              Nhãn loại bài hiện ở đầu mỗi bài. Bài tổng hợp không bao giờ viết như đã tự dùng hay
              tự đo.
            </p>
          </>
        ),
      },
      {
        id: "sources",
        title: "2. Nguồn thông tin",
        content: (
          <>
            <p>Thứ tự ưu tiên nguồn:</p>
            <ul>
              <li>Trang sản phẩm, bảng thông số, sách hướng dẫn của hãng (cho thông số).</li>
              <li>Số đo và benchmark độc lập.</li>
              <li>Bài trải nghiệm của các trang uy tín và phản hồi đã xác minh của người mua.</li>
            </ul>
            <p>
              Thông số quan trọng được ghi rõ nguồn trong bài và cuối bài có mục{" "}
              <strong>Nguồn tham khảo</strong>. Khi các nguồn ghi khác nhau, chúng tôi nói rõ thay
              vì chọn con số đẹp nhất.
            </p>
          </>
        ),
      },
      {
        id: "scoring",
        title: "3. Cách chấm điểm",
        content: (
          <>
            <p>Mỗi sản phẩm được chấm trên thang 10 theo bốn tiêu chí:</p>
            <ul>
              <li>
                <strong>Thiết kế</strong>: độ hoàn thiện, chất liệu, kích thước, trọng lượng.
              </li>
              <li>
                <strong>Hiệu năng</strong>: làm tốt việc chính đến đâu.
              </li>
              <li>
                <strong>Pin &amp; độ bền</strong>: thời lượng pin (nếu có), độ bền, bảo hành.
              </li>
              <li>
                <strong>Giá trị</strong>: đáng tiền tới đâu so với lựa chọn cùng tầm giá.
              </li>
            </ul>
            <p>Điểm có phân hoá thật: sản phẩm tốt thường ở khoảng 7–8, 9+ là hiếm.</p>
          </>
        ),
      },
      {
        id: "prices",
        title: "4. Giá, nơi bán và bảo hành",
        content: (
          <p>
            Giá thay đổi liên tục nên bài chỉ ghi khoảng giá tham khảo; giá cụ thể xem khi bấm nút
            sang sàn. Thời hạn bảo hành và tên phiên bản có thể khác nhau theo nơi bán — hãy kiểm
            tra với nhà bán lẻ trước khi mua.
          </p>
        ),
      },
      {
        id: "updates",
        title: "5. Cập nhật và đính chính",
        content: (
          <p>
            Mỗi bài có ngày &quot;Cập nhật lần cuối&quot;. Chúng tôi sửa bài khi sản phẩm thay đổi,
            có lựa chọn tốt hơn hoặc bạn đọc báo lỗi. Thấy sai sót?{" "}
            <Link href="/contact">Báo cho chúng tôi</Link>. Xem thêm{" "}
            <Link href="/editorial-policy">Chính sách biên tập</Link> và{" "}
            <Link href="/affiliate-disclosure">Công bố liên kết tiếp thị</Link>.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "我们如何评测",
    description: `${SITE_NAME} 如何调研、评分和更新评测，以及如何区分亲测评测与资料汇总评测。`,
    intro: <p>{SITE_NAME} 的每篇评测都遵循同一流程，便于您公平比较产品，并清楚每条信息的来源。</p>,
    sections: [
      {
        id: "review-types",
        title: "1. 两类评测，均明确标注",
        content: (
          <>
            <p>
              <strong>亲测评测</strong>：我们购买或借用并亲自使用过产品，文中图片为我们自行拍摄。
            </p>
            <p>
              <strong>资料汇总评测</strong>：我们<strong>未</strong>
              亲自使用该产品，内容汇总自厂商规格、说明书、独立测量数据及其他媒体已发表的评测，并加入我们对适用人群的分析。目前网站上的大部分评测属于此类。
            </p>
            <p>每篇评测顶部都会显示类型标签。资料汇总评测绝不会写成亲自测试。</p>
          </>
        ),
      },
      {
        id: "sources",
        title: "2. 信息来源",
        content: (
          <>
            <p>来源优先级：</p>
            <ul>
              <li>厂商产品页、规格表和说明书（用于规格参数）。</li>
              <li>独立测量与基准测试。</li>
              <li>知名媒体的上手评测及经核实的买家反馈。</li>
            </ul>
            <p>
              关键参数在正文中注明出处，每篇评测末尾附有<strong>参考来源</strong>
              。来源说法不一致时，我们会如实说明。
            </p>
          </>
        ),
      },
      {
        id: "scoring",
        title: "3. 评分方式",
        content: (
          <>
            <p>每款产品按以下四项标准以 10 分制评分：</p>
            <ul>
              <li>
                <strong>设计</strong>：做工、材质、尺寸、重量。
              </li>
              <li>
                <strong>性能</strong>：完成主要用途的表现。
              </li>
              <li>
                <strong>续航与耐用性</strong>：续航（如适用）、耐用性与保修。
              </li>
              <li>
                <strong>性价比</strong>：与同价位产品相比是否物有所值。
              </li>
            </ul>
            <p>评分有真实区分：优秀产品通常在 7–8 分，9 分以上很少见。</p>
          </>
        ),
      },
      {
        id: "prices",
        title: "4. 价格、购买渠道与保修",
        content: (
          <p>
            价格每天变化且因地区而异，因此我们不标注具体价格。保修期限和型号名称也可能因地区不同，购买前请向当地零售商或厂商确认。
          </p>
        ),
      },
      {
        id: "updates",
        title: "5. 更新与更正",
        content: (
          <p>
            每篇评测都显示“最后更新”日期。发现错误？<Link href="/contact">请告诉我们</Link>
            。另请参阅<Link href="/editorial-policy">编辑政策</Link>和
            <Link href="/affiliate-disclosure">联盟营销披露</Link>。
          </p>
        ),
      },
    ],
  },
}
