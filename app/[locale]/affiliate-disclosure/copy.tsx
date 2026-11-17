import type { LegalCopy } from "@/components/layout/LegalPage"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { SITE_NAME } from "@/lib/constants"

export const AFFILIATE_DISCLOSURE_COPY: Record<Locale, LegalCopy> = {
  en: {
    title: "Affiliate Disclosure",
    description: `How ${SITE_NAME} makes money through affiliate links, including the Amazon Associates program, and why it does not affect our reviews.`,
    intro: (
      <p>
        {SITE_NAME} is reader-supported. We may earn a commission when you buy through links on our
        site, at no extra cost to you.
      </p>
    ),
    sections: [
      {
        title: "What affiliate links are",
        content: (
          <p>
            Some links on our reviews, buying guides and comparison pages are affiliate links. If
            you click one and make a purchase, the retailer may pay us a small commission. The price
            you pay does not change.
          </p>
        ),
      },
      {
        id: "amazon",
        title: "Amazon Associates",
        content: (
          <p>
            <strong>As an Amazon Associate, we earn from qualifying purchases.</strong> {SITE_NAME}{" "}
            participates in the Amazon Services LLC Associates Program and Amazon&apos;s associate
            programs in other regions, affiliate advertising programs designed to provide a means
            for sites to earn fees by linking to Amazon.
          </p>
        ),
      },
      {
        title: "Other affiliate partners",
        content: (
          <p>
            We may also work with other retailers and affiliate networks in the future. The same
            rules apply to every partner.
          </p>
        ),
      },
      {
        title: "Our reviews stay independent",
        content: (
          <p>
            Commissions never affect our scores, rankings or recommendations, and we include
            products that have no affiliate link when they are the better choice. Read more in our{" "}
            <Link href="/editorial-policy">Editorial Policy</Link> and{" "}
            <Link href="/how-we-review">How We Review</Link>.
          </p>
        ),
      },
      {
        title: "Social media and video",
        content: (
          <p>
            The same disclosure applies to links we share on social media and in video descriptions.
            Those posts link to our reviews on this site, where this disclosure is shown before any
            buy button.
          </p>
        ),
      },
    ],
  },
  vi: {
    title: "Công Bố Liên Kết Tiếp Thị",
    description: `${SITE_NAME} có thu nhập từ liên kết tiếp thị (affiliate) như thế nào và vì sao điều đó không ảnh hưởng tới bài đánh giá.`,
    intro: (
      <p>
        {SITE_NAME} hoạt động nhờ bạn đọc. Chúng tôi có thể nhận hoa hồng khi bạn mua qua liên kết
        trên site, giá bạn trả không đổi.
      </p>
    ),
    sections: [
      {
        title: "Liên kết tiếp thị là gì",
        content: (
          <p>
            Một số liên kết trong bài đánh giá, hướng dẫn chọn mua và bảng so sánh là liên kết tiếp
            thị. Khi bạn bấm và mua hàng, nhà bán có thể trả cho chúng tôi một khoản hoa hồng nhỏ;
            giá bạn trả không đổi.
          </p>
        ),
      },
      {
        id: "amazon",
        title: "Amazon Associates",
        content: (
          <p>
            Là thành viên Amazon Associates, {SITE_NAME} nhận hoa hồng từ các giao dịch mua hợp lệ
            qua liên kết Amazon.
          </p>
        ),
      },
      {
        title: "Đối tác khác",
        content: (
          <p>
            Sau này chúng tôi có thể hợp tác thêm với các sàn và mạng tiếp thị khác. Mọi đối tác đều
            theo cùng nguyên tắc.
          </p>
        ),
      },
      {
        title: "Bài đánh giá vẫn độc lập",
        content: (
          <p>
            Hoa hồng không bao giờ ảnh hưởng tới điểm số, thứ hạng hay khuyến nghị. Xem thêm{" "}
            <Link href="/editorial-policy">Chính sách biên tập</Link> và{" "}
            <Link href="/how-we-review">Cách chúng tôi đánh giá</Link>.
          </p>
        ),
      },
      {
        title: "Mạng xã hội và video",
        content: (
          <p>
            Công bố này áp dụng cả cho liên kết chúng tôi chia sẻ trên mạng xã hội và mô tả video;
            các bài đăng đó dẫn về bài đánh giá trên site, nơi công bố hiện trước mọi nút mua.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "联盟营销披露",
    description: `${SITE_NAME} 如何通过联盟链接（包括亚马逊联盟计划）获得收入，以及为何这不影响我们的评测。`,
    intro: (
      <p>{SITE_NAME} 由读者支持。当您通过本站链接购买时，我们可能获得佣金，您支付的价格不变。</p>
    ),
    sections: [
      {
        title: "什么是联盟链接",
        content: (
          <p>
            评测、选购指南和对比页面中的部分链接为联盟链接。您点击并购买后，零售商可能向我们支付少量佣金，您支付的价格不变。
          </p>
        ),
      },
      {
        id: "amazon",
        title: "亚马逊联盟",
        content: <p>作为亚马逊联盟成员，{SITE_NAME} 从符合条件的购买中获得收入。</p>,
      },
      {
        title: "其他合作伙伴",
        content: (
          <p>我们也可能与其他零售商和联盟网络合作（例如淘宝），所有合作伙伴适用相同规则。</p>
        ),
      },
      {
        title: "评测保持独立",
        content: (
          <p>
            佣金绝不影响评分、排名或推荐。详见<Link href="/editorial-policy">编辑政策</Link>和
            <Link href="/how-we-review">我们如何评测</Link>。
          </p>
        ),
      },
      {
        title: "社交媒体与视频",
        content: (
          <p>
            本披露同样适用于我们在社交媒体和视频简介中分享的链接；这些帖子会链接回本站评测，购买按钮前均显示本披露。
          </p>
        ),
      },
    ],
  },
}
