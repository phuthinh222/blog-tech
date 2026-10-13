import type { LegalCopy } from "@/components/layout/LegalPage"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"

const mailto = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

export const TERMS_COPY: Record<Locale, LegalCopy> = {
  vi: {
    title: "Điều Khoản Sử Dụng",
    description: `Điều khoản khi truy cập và sử dụng website ${SITE_NAME}.`,
    intro: (
      <p>
        Khi truy cập hoặc sử dụng {SITE_NAME} (zerotech-lab.site), bạn đồng ý với các điều khoản
        dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.
      </p>
    ),
    sections: [
      {
        title: `1. ${SITE_NAME} là gì`,
        content: (
          <p>
            {SITE_NAME} là website đánh giá sản phẩm công nghệ (điện thoại, màn hình, laptop, phụ
            kiện). Chúng tôi <strong>không bán hàng trực tiếp</strong>. Mọi giao dịch mua bán diễn
            ra tại website của nhà bán hàng (ví dụ Shopee) và chịu sự điều chỉnh của điều khoản nơi
            đó.
          </p>
        ),
      },
      {
        title: "2. Thông tin trên website",
        content: (
          <>
            <p>
              Bài đánh giá, điểm số và thông số được biên soạn cẩn thận nhưng mang tính tham khảo.
              Chúng tôi không bảo đảm thông tin luôn đầy đủ, chính xác hoặc cập nhật.
            </p>
            <p>
              <strong>Giá sản phẩm có thể thay đổi</strong> bất cứ lúc nào và có thể khác với giá
              hiển thị. Giá cuối cùng là giá trên trang của nhà bán hàng tại thời điểm bạn đặt mua.
            </p>
          </>
        ),
      },
      {
        title: "3. Liên kết affiliate",
        content: (
          <p>
            Website chứa liên kết tới nhà bán hàng, trong đó một số là liên kết affiliate. Chúng tôi
            có thể nhận hoa hồng khi bạn mua qua các liên kết này, giá bạn trả không đổi.{" "}
            {SITE_NAME}
            không chịu trách nhiệm về sản phẩm, giao hàng, bảo hành hay chính sách của nhà bán hàng.
          </p>
        ),
      },
      {
        title: "4. Bình luận của người dùng",
        content: (
          <>
            <p>Khi bình luận, bạn đồng ý không đăng nội dung:</p>
            <ul>
              <li>Vi phạm pháp luật Việt Nam, xúc phạm, quấy rối hoặc phân biệt đối xử.</li>
              <li>Spam, quảng cáo hoặc chứa liên kết độc hại.</li>
              <li>Xâm phạm quyền riêng tư hoặc quyền sở hữu trí tuệ của người khác.</li>
            </ul>
            <p>
              Chúng tôi có quyền ẩn hoặc xóa bình luận vi phạm mà không cần báo trước. Bạn chịu
              trách nhiệm về nội dung mình đăng.
            </p>
          </>
        ),
      },
      {
        title: "5. Quyền sở hữu nội dung",
        content: (
          <p>
            Nội dung do {SITE_NAME} tạo ra (bài viết, điểm số, hình ảnh tự chụp, giao diện) thuộc
            quyền sở hữu của {SITE_NAME}. Bạn có thể trích dẫn ngắn kèm liên kết về bài gốc. Sao
            chép toàn bộ hoặc phần lớn nội dung khi chưa được đồng ý bằng văn bản là không được
            phép. Tên và logo sản phẩm thuộc về chủ sở hữu tương ứng.
          </p>
        ),
      },
      {
        title: "6. Giới hạn trách nhiệm",
        content: (
          <p>
            Website được cung cấp &quot;nguyên trạng&quot;. Trong phạm vi pháp luật cho phép,{" "}
            {SITE_NAME} không chịu trách nhiệm cho thiệt hại phát sinh từ việc sử dụng thông tin
            trên website hoặc từ giao dịch với bên thứ ba.
          </p>
        ),
      },
      {
        title: "7. Thay đổi điều khoản",
        content: (
          <p>
            Chúng tôi có thể cập nhật điều khoản này. Việc bạn tiếp tục sử dụng website sau khi cập
            nhật đồng nghĩa với việc chấp nhận điều khoản mới. Câu hỏi về điều khoản, vui lòng gửi
            tới {mailto}. Xem thêm <Link href="/privacy">Chính sách bảo mật</Link>.
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Terms of Use",
    description: `Terms for accessing and using the ${SITE_NAME} website.`,
    intro: (
      <p>
        By accessing or using {SITE_NAME} (zerotech-lab.site), you agree to the terms below. If you
        do not agree, please stop using the website.
      </p>
    ),
    sections: [
      {
        title: `1. What ${SITE_NAME} is`,
        content: (
          <p>
            {SITE_NAME} is a tech product review website (phones, monitors, laptops, accessories).
            We <strong>do not sell products directly</strong>. All purchases take place on the
            retailer&apos;s website (for example Shopee) and are governed by that retailer&apos;s
            terms.
          </p>
        ),
      },
      {
        title: "2. Information on the website",
        content: (
          <>
            <p>
              Reviews, scores and specs are prepared carefully but are for reference only. We do not
              guarantee that the information is always complete, accurate or up to date.
            </p>
            <p>
              <strong>Product prices may change</strong> at any time and may differ from the price
              shown. The final price is the one on the retailer&apos;s page when you place your
              order.
            </p>
          </>
        ),
      },
      {
        title: "3. Affiliate links",
        content: (
          <p>
            The website contains links to retailers, some of which are affiliate links. We may earn
            a commission when you buy through these links, at no extra cost to you. {SITE_NAME} is
            not responsible for retailers&apos; products, delivery, warranty or policies.
          </p>
        ),
      },
      {
        title: "4. User comments",
        content: (
          <>
            <p>When commenting, you agree not to post content that:</p>
            <ul>
              <li>Breaks Vietnamese law, or is insulting, harassing or discriminatory.</li>
              <li>Is spam, advertising or contains malicious links.</li>
              <li>Violates other people&apos;s privacy or intellectual property rights.</li>
            </ul>
            <p>
              We may hide or remove violating comments without notice. You are responsible for the
              content you post.
            </p>
          </>
        ),
      },
      {
        title: "5. Content ownership",
        content: (
          <p>
            Content created by {SITE_NAME} (articles, scores, our own photos, design) belongs to{" "}
            {SITE_NAME}. You may quote short excerpts with a link back to the original article.
            Copying all or most of the content without written permission is not allowed. Product
            names and logos belong to their respective owners.
          </p>
        ),
      },
      {
        title: "6. Limitation of liability",
        content: (
          <p>
            The website is provided &quot;as is&quot;. To the extent permitted by law, {SITE_NAME}{" "}
            is not liable for damages arising from the use of information on the website or from
            transactions with third parties.
          </p>
        ),
      },
      {
        title: "7. Changes to these terms",
        content: (
          <p>
            We may update these terms. Continuing to use the website after an update means you
            accept the new terms. For questions about the terms, please email {mailto}. See also our{" "}
            <Link href="/privacy">Privacy policy</Link>.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "使用条款",
    description: `访问和使用 ${SITE_NAME} 网站的条款。`,
    intro: (
      <p>
        访问或使用 {SITE_NAME}
        （zerotech-lab.site）即表示您同意以下条款。如不同意，请停止使用本网站。
      </p>
    ),
    sections: [
      {
        title: `1. ${SITE_NAME} 是什么`,
        content: (
          <p>
            {SITE_NAME} 是一个科技产品评测网站（手机、显示器、笔记本电脑、配件）。我们
            <strong>不直接销售商品</strong>
            。所有交易均在商家网站（例如 Shopee）上进行，并受该商家条款的约束。
          </p>
        ),
      },
      {
        title: "2. 网站上的信息",
        content: (
          <>
            <p>评测、评分和参数均经过认真编写，但仅供参考。我们不保证信息始终完整、准确或最新。</p>
            <p>
              <strong>产品价格可能随时变动</strong>
              ，并可能与显示的价格不同。最终价格以您下单时商家页面上的价格为准。
            </p>
          </>
        ),
      },
      {
        title: "3. 联盟链接",
        content: (
          <p>
            本网站包含前往商家的链接，其中部分为联盟链接。当您通过这些链接购买时，我们可能获得佣金，您支付的价格不变。
            {SITE_NAME}
            不对商家的产品、配送、保修或政策承担责任。
          </p>
        ),
      },
      {
        title: "4. 用户评论",
        content: (
          <>
            <p>发表评论时，您同意不发布以下内容：</p>
            <ul>
              <li>违反越南法律，或带有侮辱、骚扰、歧视性质的内容。</li>
              <li>垃圾信息、广告或包含恶意链接的内容。</li>
              <li>侵犯他人隐私或知识产权的内容。</li>
            </ul>
            <p>我们有权在不另行通知的情况下隐藏或删除违规评论。您需对自己发布的内容负责。</p>
          </>
        ),
      },
      {
        title: "5. 内容所有权",
        content: (
          <p>
            由 {SITE_NAME} 创作的内容（文章、评分、自拍图片、界面设计）归 {SITE_NAME}{" "}
            所有。您可以简短引用并附上原文链接。未经书面同意，不得复制全部或大部分内容。产品名称和标志归其各自所有者所有。
          </p>
        ),
      },
      {
        title: "6. 责任限制",
        content: (
          <p>
            本网站按“现状”提供。在法律允许的范围内，{SITE_NAME}{" "}
            不对因使用网站信息或与第三方交易而产生的损失承担责任。
          </p>
        ),
      },
      {
        title: "7. 条款变更",
        content: (
          <p>
            我们可能会更新本条款。更新后继续使用本网站即表示您接受新条款。如对条款有疑问，请发送邮件至{" "}
            {mailto}。另请参阅<Link href="/privacy">隐私政策</Link>。
          </p>
        ),
      },
    ],
  },
}
