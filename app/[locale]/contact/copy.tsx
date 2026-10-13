import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LegalCopy } from "@/components/layout/LegalPage"
import type { Locale } from "@/i18n/routing"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"

function EmailButton({ label }: { label: string }) {
  return (
    <div>
      <Button asChild>
        <a href={`mailto:${CONTACT_EMAIL}`}>
          <Mail className="size-4" /> {label}
        </a>
      </Button>
    </div>
  )
}

const mailto = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

export const CONTACT_COPY: Record<Locale, LegalCopy> = {
  vi: {
    title: "Liên Hệ",
    description: `Liên hệ ${SITE_NAME} để góp ý bài đánh giá, báo lỗi thông tin sản phẩm hoặc trao đổi hợp tác.`,
    intro: (
      <p>
        Bạn thấy thông tin sai, muốn chúng tôi đánh giá thêm sản phẩm hay có câu hỏi khác? Gửi email
        cho {SITE_NAME}, chúng tôi đọc mọi thư và phản hồi trong vòng 2 ngày làm việc.
      </p>
    ),
    sections: [
      {
        title: "Email",
        content: (
          <>
            <p>Cách nhanh nhất để liên lạc với chúng tôi là qua email: {mailto}</p>
            <EmailButton label="Gửi Email" />
          </>
        ),
      },
      {
        title: "Bạn có thể liên hệ về",
        content: (
          <ul>
            <li>
              <strong>Góp ý, báo lỗi:</strong> thông số, giá hoặc nội dung bài đánh giá chưa chính
              xác.
            </li>
            <li>
              <strong>Đề xuất sản phẩm:</strong> sản phẩm bạn muốn chúng tôi đánh giá hoặc so sánh.
            </li>
            <li>
              <strong>Hợp tác:</strong> nhà sản xuất, nhà bán hàng hoặc đối tác nội dung. Mọi hợp
              tác đều không ảnh hưởng đến điểm số đánh giá.
            </li>
          </ul>
        ),
      },
      {
        title: "Lưu ý",
        content: (
          <p>
            {SITE_NAME} không bán hàng trực tiếp. Với các câu hỏi về đơn hàng, giao hàng, bảo hành
            hay đổi trả, vui lòng liên hệ trực tiếp nơi bạn đã mua sản phẩm (ví dụ Shopee).
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Contact",
    description: `Contact ${SITE_NAME} to give feedback on a review, report incorrect product information or discuss a partnership.`,
    intro: (
      <p>
        Spotted a mistake, want us to review another product or have a different question? Email{" "}
        {SITE_NAME} — we read every message and reply within 2 business days.
      </p>
    ),
    sections: [
      {
        title: "Email",
        content: (
          <>
            <p>The fastest way to reach us is by email: {mailto}</p>
            <EmailButton label="Send Email" />
          </>
        ),
      },
      {
        title: "What you can contact us about",
        content: (
          <ul>
            <li>
              <strong>Feedback and corrections:</strong> specs, prices or review content that are
              not accurate.
            </li>
            <li>
              <strong>Product suggestions:</strong> products you would like us to review or compare.
            </li>
            <li>
              <strong>Partnerships:</strong> manufacturers, retailers or content partners. No
              partnership ever affects our review scores.
            </li>
          </ul>
        ),
      },
      {
        title: "Please note",
        content: (
          <p>
            {SITE_NAME} does not sell products directly. For questions about orders, shipping,
            warranty or returns, please contact the store where you bought the product (for example
            Shopee).
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "联系我们",
    description: `联系 ${SITE_NAME}，反馈评测意见、报告产品信息错误或洽谈合作。`,
    intro: (
      <p>
        发现信息有误、希望我们评测更多产品，或有其他问题？请发送邮件给 {SITE_NAME}
        ，我们会阅读每一封来信，并在 2 个工作日内回复。
      </p>
    ),
    sections: [
      {
        title: "电子邮件",
        content: (
          <>
            <p>联系我们最快的方式是发送电子邮件：{mailto}</p>
            <EmailButton label="发送邮件" />
          </>
        ),
      },
      {
        title: "您可以联系我们的事项",
        content: (
          <ul>
            <li>
              <strong>意见与纠错：</strong>评测中的参数、价格或内容不准确。
            </li>
            <li>
              <strong>产品建议：</strong>您希望我们评测或对比的产品。
            </li>
            <li>
              <strong>合作：</strong>
              制造商、零售商或内容合作伙伴。任何合作都不会影响评测评分。
            </li>
          </ul>
        ),
      },
      {
        title: "注意事项",
        content: (
          <p>
            {SITE_NAME}
            不直接销售商品。有关订单、配送、保修或退换货的问题，请直接联系您购买产品的商家（例如
            Shopee）。
          </p>
        ),
      },
    ],
  },
}
