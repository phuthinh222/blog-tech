import type { LegalCopy } from "@/components/layout/LegalPage"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { AFFILIATE_LINKS_ENABLED, SITE_NAME } from "@/lib/constants"

// Trang công bố liên kết tiếp thị. Nội dung đổi theo AFFILIATE_LINKS_ENABLED:
// - false (hiện tại): nói rõ site chưa dùng link affiliate và sẽ báo trước khi dùng.
// - true: câu chuẩn của Amazon Associates. Chỉ bật sau khi được Amazon duyệt.
// Khi đổi trạng thái, cập nhật UPDATED_AT trong page.tsx.

const ACTIVE = AFFILIATE_LINKS_ENABLED

export const AFFILIATE_DISCLOSURE_COPY: Record<Locale, LegalCopy> = {
  en: {
    title: "Affiliate Disclosure",
    description: ACTIVE
      ? `How ${SITE_NAME} earns money through affiliate links, including the Amazon Associates program, and why it doesn't affect our reviews.`
      : `${SITE_NAME} doesn't use affiliate links yet. Here's how we'll tell you before that changes, and why it won't affect our reviews.`,
    intro: ACTIVE ? (
      <p>
        {SITE_NAME} is reader-supported. We may earn a commission when you buy through some links on
        our site, at no extra cost to you.
      </p>
    ) : (
      <p>
        {SITE_NAME} doesn&apos;t use affiliate links right now. We earn nothing when you click a
        store link on this site or buy something through it.
      </p>
    ),
    sections: [
      ACTIVE
        ? {
            title: "What affiliate links are",
            content: (
              <p>
                Some links in our reviews and buying guides are affiliate links. If you click one
                and buy something, the retailer may pay us a small commission. The price you pay
                doesn&apos;t change. We show a disclosure on the page before the first such link.
              </p>
            ),
          }
        : {
            title: "Where links on this site go",
            content: (
              <p>
                Store and manufacturer links in our reviews and guides are plain links to the
                product page, so you can check the current model, price and availability. They carry
                no tracking code that pays us.
              </p>
            ),
          },
      ACTIVE
        ? {
            id: "amazon",
            title: "Amazon Associates",
            content: (
              <p>
                <strong>As an Amazon Associate I earn from qualifying purchases.</strong>{" "}
                {SITE_NAME} takes part in the Amazon Services LLC Associates Program, an affiliate
                advertising program that lets sites earn fees by linking to Amazon.
              </p>
            ),
          }
        : {
            id: "before-we-add-affiliate-links",
            title: "Before we add affiliate links",
            content: (
              <>
                <p>We may join affiliate programs such as Amazon Associates later. If we do:</p>
                <ul>
                  <li>We&apos;ll update this page first and name every program we use.</li>
                  <li>
                    Every page with an affiliate link will say so before the first link, not only in
                    the footer.
                  </li>
                  <li>Affiliate links will be labelled and open the retailer in a new tab.</li>
                </ul>
              </>
            ),
          },
      {
        title: "Our reviews stay independent",
        content: (
          <p>
            Commissions will never change our scores, rankings or recommendations. We&apos;ll keep
            recommending products without an affiliate link when they&apos;re the better choice.
            Read more in our <Link href="/editorial-policy">Editorial Policy</Link> and{" "}
            <Link href="/how-we-review">How We Review</Link>.
          </p>
        ),
      },
      {
        title: "Social media and newsletter",
        content: (
          <p>
            Our social posts and newsletter link to articles on this site, not straight to stores.
            The disclosure on each article applies.
          </p>
        ),
      },
    ],
  },
  vi: {
    title: "Công Bố Liên Kết Tiếp Thị",
    description: ACTIVE
      ? `${SITE_NAME} có thu nhập từ liên kết tiếp thị (affiliate), gồm Amazon Associates, như thế nào và vì sao điều đó không ảnh hưởng tới bài đánh giá.`
      : `${SITE_NAME} hiện chưa dùng liên kết tiếp thị (affiliate). Cách chúng tôi thông báo trước khi thay đổi và vì sao bài đánh giá vẫn độc lập.`,
    intro: ACTIVE ? (
      <p>
        {SITE_NAME} hoạt động nhờ bạn đọc. Chúng tôi có thể nhận hoa hồng khi bạn mua qua một số
        liên kết trên site; giá bạn trả không đổi.
      </p>
    ) : (
      <p>
        {SITE_NAME} hiện chưa dùng liên kết tiếp thị. Chúng tôi không nhận tiền khi bạn bấm vào link
        cửa hàng hay mua hàng qua link trên site.
      </p>
    ),
    sections: [
      ACTIVE
        ? {
            title: "Liên kết tiếp thị là gì",
            content: (
              <p>
                Một số liên kết trong bài đánh giá và hướng dẫn chọn mua là liên kết tiếp thị. Khi
                bạn bấm và mua hàng, nhà bán có thể trả cho chúng tôi một khoản hoa hồng nhỏ; giá
                bạn trả không đổi. Trang có liên kết như vậy sẽ ghi rõ trước liên kết đầu tiên.
              </p>
            ),
          }
        : {
            title: "Các liên kết trên site dẫn tới đâu",
            content: (
              <p>
                Link cửa hàng và trang hãng trong bài đánh giá, hướng dẫn là link thường tới trang
                sản phẩm, để bạn xem đúng model, giá và tình trạng hàng hiện tại. Các link này không
                gắn mã theo dõi để trả tiền cho chúng tôi.
              </p>
            ),
          },
      ACTIVE
        ? {
            id: "amazon",
            title: "Amazon Associates",
            content: (
              <p>
                <strong>As an Amazon Associate I earn from qualifying purchases.</strong> (Là thành
                viên Amazon Associates, {SITE_NAME} nhận hoa hồng từ các giao dịch mua hợp lệ qua
                liên kết Amazon.)
              </p>
            ),
          }
        : {
            id: "before-we-add-affiliate-links",
            title: "Trước khi thêm liên kết tiếp thị",
            content: (
              <>
                <p>
                  Sau này chúng tôi có thể tham gia chương trình tiếp thị như Amazon Associates. Khi
                  đó:
                </p>
                <ul>
                  <li>Chúng tôi sẽ cập nhật trang này trước và nêu tên từng chương trình.</li>
                  <li>
                    Mọi trang có liên kết tiếp thị sẽ ghi rõ trước liên kết đầu tiên, không chỉ ở
                    footer.
                  </li>
                  <li>Liên kết tiếp thị sẽ được ghi nhãn và mở cửa hàng trong tab mới.</li>
                </ul>
              </>
            ),
          },
      {
        title: "Bài đánh giá vẫn độc lập",
        content: (
          <p>
            Hoa hồng sẽ không bao giờ thay đổi điểm số, thứ hạng hay khuyến nghị. Chúng tôi vẫn gợi
            ý sản phẩm không có liên kết tiếp thị khi đó là lựa chọn tốt hơn. Xem thêm{" "}
            <Link href="/editorial-policy">Chính sách biên tập</Link> và{" "}
            <Link href="/how-we-review">Cách chúng tôi đánh giá</Link>.
          </p>
        ),
      },
      {
        title: "Mạng xã hội và bản tin",
        content: (
          <p>
            Bài đăng mạng xã hội và bản tin dẫn về bài viết trên site, không dẫn thẳng tới cửa hàng.
            Công bố trên từng bài viết được áp dụng.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "联盟营销披露",
    description: ACTIVE
      ? `${SITE_NAME} 如何通过联盟链接（包括亚马逊联盟计划）获得收入，以及为何这不影响我们的评测。`
      : `${SITE_NAME} 目前未使用联盟链接。在此之前我们会如何告知您，以及为何评测保持独立。`,
    intro: ACTIVE ? (
      <p>
        {SITE_NAME} 由读者支持。当您通过本站部分链接购买时，我们可能获得佣金，您支付的价格不变。
      </p>
    ) : (
      <p>{SITE_NAME} 目前未使用联盟链接。您点击本站的商店链接或通过其购买，我们都不会获得收入。</p>
    ),
    sections: [
      ACTIVE
        ? {
            title: "什么是联盟链接",
            content: (
              <p>
                评测和选购指南中的部分链接为联盟链接。您点击并购买后，零售商可能向我们支付少量佣金，您支付的价格不变。含此类链接的页面会在第一个链接之前注明。
              </p>
            ),
          }
        : {
            title: "本站链接指向哪里",
            content: (
              <p>
                评测和指南中的商店及厂商链接是指向产品页的普通链接，方便您查看当前型号、价格和库存，不带任何为我们带来收入的追踪代码。
              </p>
            ),
          },
      ACTIVE
        ? {
            id: "amazon",
            title: "亚马逊联盟",
            content: (
              <p>
                <strong>As an Amazon Associate I earn from qualifying purchases.</strong>
                （作为亚马逊联盟成员，{SITE_NAME} 从符合条件的购买中获得收入。）
              </p>
            ),
          }
        : {
            id: "before-we-add-affiliate-links",
            title: "添加联盟链接之前",
            content: (
              <>
                <p>我们以后可能加入亚马逊联盟等联盟计划。届时：</p>
                <ul>
                  <li>我们会先更新本页，并列出所使用的每个计划。</li>
                  <li>每个含联盟链接的页面都会在第一个链接之前注明，而不只是在页脚。</li>
                  <li>联盟链接会加以标注，并在新标签页中打开商店。</li>
                </ul>
              </>
            ),
          },
      {
        title: "评测保持独立",
        content: (
          <p>
            佣金绝不会改变评分、排名或推荐。若没有联盟链接的产品更合适，我们依然会推荐它。详见
            <Link href="/editorial-policy">编辑政策</Link>和
            <Link href="/how-we-review">我们如何评测</Link>。
          </p>
        ),
      },
      {
        title: "社交媒体与电子报",
        content: (
          <p>
            我们的社交媒体帖子和电子报链接到本站文章，而不是直接链接到商店，适用各文章上的披露。
          </p>
        ),
      },
    ],
  },
}
