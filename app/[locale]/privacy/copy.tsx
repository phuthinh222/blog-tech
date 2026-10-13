import type { LegalCopy } from "@/components/layout/LegalPage"
import type { Locale } from "@/i18n/routing"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"

const mailto = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

export const PRIVACY_COPY: Record<Locale, LegalCopy> = {
  vi: {
    title: "Chính Sách Bảo Mật",
    description: `${SITE_NAME} thu thập những dữ liệu gì, dùng vào việc gì và quyền của bạn đối với dữ liệu cá nhân.`,
    intro: (
      <p>
        Chính sách này giải thích {SITE_NAME} (zerotech-lab.site) thu thập dữ liệu gì khi bạn sử
        dụng website, dùng vào việc gì và bạn có những quyền gì, theo tinh thần Nghị định
        13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
      </p>
    ),
    sections: [
      {
        title: "1. Khi bạn chỉ đọc bài",
        content: (
          <p>
            Bạn có thể đọc toàn bộ nội dung mà{" "}
            <strong>không cần đăng ký hay cung cấp thông tin cá nhân</strong>. Như mọi website, máy
            chủ lưu trữ (Vercel) có thể ghi lại nhật ký kỹ thuật như địa chỉ IP, loại trình duyệt và
            thời điểm truy cập để vận hành và bảo mật hệ thống.
          </p>
        ),
      },
      {
        title: "2. Khi bạn đăng nhập và bình luận",
        content: (
          <>
            <p>
              Đăng nhập được xử lý qua dịch vụ Auth0. Khi bạn đăng nhập, chúng tôi nhận từ Auth0 các
              thông tin: mã định danh tài khoản, tên hiển thị, email và ảnh đại diện (nếu có).
            </p>
            <p>
              Khi bạn bình luận, chúng tôi lưu nội dung bình luận cùng mã định danh, tên hiển thị và
              ảnh đại diện của bạn trên cơ sở dữ liệu Supabase. Tên, ảnh đại diện và nội dung bình
              luận được hiển thị công khai dưới bài viết.
            </p>
          </>
        ),
      },
      {
        id: "cookies",
        title: "3. Cookie và lưu trữ trên trình duyệt",
        content: (
          <>
            <p>{SITE_NAME} sử dụng:</p>
            <ul>
              <li>
                <strong>Cookie phiên đăng nhập</strong> (Auth0) — chỉ khi bạn đăng nhập, để giữ
                trạng thái đăng nhập.
              </li>
              <li>
                <strong>Cookie ngôn ngữ</strong> (NEXT_LOCALE) — ghi nhớ ngôn ngữ bạn đã chọn.
              </li>
              <li>
                <strong>Bộ nhớ trình duyệt (localStorage)</strong> — lưu lựa chọn giao diện sáng/tối
                và danh sách bài viết bạn đánh dấu. Dữ liệu này chỉ nằm trên máy của bạn, không gửi
                về máy chủ.
              </li>
            </ul>
            <p>
              Chúng tôi <strong>không dùng cookie quảng cáo</strong>. Nếu sau này bổ sung công cụ
              phân tích lưu lượng (ví dụ PostHog hoặc Vercel Analytics), chính sách này sẽ được cập
              nhật trước khi áp dụng.
            </p>
            <p>
              Bạn có thể xóa cookie và dữ liệu website bất cứ lúc nào trong cài đặt trình duyệt.
            </p>
          </>
        ),
      },
      {
        title: "4. Liên kết affiliate và website bên ngoài",
        content: (
          <>
            <p>
              Một số liên kết trên website là liên kết affiliate (ví dụ tới Shopee, có thể đi qua
              nền tảng AccessTrade). Khi bạn bấm vào, bạn rời khỏi {SITE_NAME}; nhà bán hàng và nền
              tảng affiliate có thể đặt cookie để ghi nhận đơn hàng đến từ chúng tôi, theo chính
              sách bảo mật riêng của họ.
            </p>
            <p>
              Chúng tôi không nhận được thông tin cá nhân hay thông tin thanh toán của bạn từ các
              giao dịch này — chỉ nhận số liệu tổng hợp về lượt bấm và đơn hàng.
            </p>
          </>
        ),
      },
      {
        title: "5. Mục đích sử dụng dữ liệu",
        content: (
          <ul>
            <li>Cho phép bạn đăng nhập, bình luận và quản lý bình luận của mình.</li>
            <li>Vận hành, bảo mật và chống lạm dụng (spam) website.</li>
            <li>Trả lời khi bạn liên hệ qua email.</li>
          </ul>
        ),
      },
      {
        title: "6. Chia sẻ dữ liệu",
        content: (
          <p>
            Chúng tôi <strong>không bán</strong> dữ liệu cá nhân. Dữ liệu chỉ được xử lý bởi các nhà
            cung cấp dịch vụ cần thiết để vận hành website: Vercel (lưu trữ), Auth0 (đăng nhập),
            Supabase (cơ sở dữ liệu). Các dịch vụ này có thể đặt máy chủ ngoài Việt Nam.
          </p>
        ),
      },
      {
        title: "7. Quyền của bạn",
        content: (
          <>
            <p>Theo Nghị định 13/2023/NĐ-CP, bạn có quyền:</p>
            <ul>
              <li>Được biết về việc xử lý dữ liệu cá nhân của mình.</li>
              <li>Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu (bao gồm bình luận đã đăng).</li>
              <li>Rút lại sự đồng ý và yêu cầu hạn chế xử lý dữ liệu.</li>
              <li>Khiếu nại nếu dữ liệu bị xử lý sai mục đích.</li>
            </ul>
            <p>
              Để thực hiện các quyền trên, hãy gửi email tới {mailto}. Chúng tôi phản hồi trong vòng
              72 giờ.
            </p>
          </>
        ),
      },
      {
        title: "8. Lưu trữ và thay đổi chính sách",
        content: (
          <p>
            Dữ liệu tài khoản và bình luận được lưu cho đến khi bạn yêu cầu xóa. Khi chính sách thay
            đổi, ngày &quot;Cập nhật lần cuối&quot; ở đầu trang sẽ được cập nhật.
          </p>
        ),
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    description: `What data ${SITE_NAME} collects, what it is used for and your rights over your personal data.`,
    intro: (
      <p>
        This policy explains what data {SITE_NAME} (zerotech-lab.site) collects when you use the
        website, what it is used for and what rights you have, in the spirit of Vietnam&apos;s
        Decree 13/2023/ND-CP on personal data protection.
      </p>
    ),
    sections: [
      {
        title: "1. When you only read articles",
        content: (
          <p>
            You can read all content <strong>without signing up or providing personal data</strong>.
            Like any website, our hosting provider (Vercel) may keep technical logs such as IP
            address, browser type and access time to operate and secure the service.
          </p>
        ),
      },
      {
        title: "2. When you sign in and comment",
        content: (
          <>
            <p>
              Sign-in is handled by Auth0. When you sign in, we receive from Auth0 your account
              identifier, display name, email and profile picture (if any).
            </p>
            <p>
              When you comment, we store the comment together with your identifier, display name and
              profile picture in our Supabase database. Your name, profile picture and comment are
              shown publicly below the article.
            </p>
          </>
        ),
      },
      {
        id: "cookies",
        title: "3. Cookies and browser storage",
        content: (
          <>
            <p>{SITE_NAME} uses:</p>
            <ul>
              <li>
                <strong>Session cookies</strong> (Auth0) — only when you sign in, to keep you signed
                in.
              </li>
              <li>
                <strong>Language cookie</strong> (NEXT_LOCALE) — remembers the language you chose.
              </li>
              <li>
                <strong>Browser storage (localStorage)</strong> — stores your light/dark theme
                choice and the articles you bookmark. This data stays on your device and is never
                sent to our servers.
              </li>
            </ul>
            <p>
              We <strong>do not use advertising cookies</strong>. If we add traffic analytics later
              (for example PostHog or Vercel Analytics), this policy will be updated before it takes
              effect.
            </p>
            <p>You can delete cookies and site data at any time in your browser settings.</p>
          </>
        ),
      },
      {
        title: "4. Affiliate links and external websites",
        content: (
          <>
            <p>
              Some links on the website are affiliate links (for example to Shopee, possibly via the
              AccessTrade platform). When you click one, you leave {SITE_NAME}; the retailer and
              affiliate platform may set cookies to attribute orders to us, under their own privacy
              policies.
            </p>
            <p>
              We never receive your personal or payment information from these transactions — only
              aggregated click and order statistics.
            </p>
          </>
        ),
      },
      {
        title: "5. How we use data",
        content: (
          <ul>
            <li>To let you sign in, comment and manage your comments.</li>
            <li>To operate and secure the website and prevent abuse (spam).</li>
            <li>To reply when you contact us by email.</li>
          </ul>
        ),
      },
      {
        title: "6. Data sharing",
        content: (
          <p>
            We <strong>do not sell</strong> personal data. Data is only processed by the service
            providers needed to run the website: Vercel (hosting), Auth0 (sign-in) and Supabase
            (database). These services may host servers outside Vietnam.
          </p>
        ),
      },
      {
        title: "7. Your rights",
        content: (
          <>
            <p>Under Decree 13/2023/ND-CP, you have the right to:</p>
            <ul>
              <li>Be informed about how your personal data is processed.</li>
              <li>
                Request to access, correct or delete your data (including published comments).
              </li>
              <li>Withdraw consent and request restricted processing.</li>
              <li>File a complaint if your data is processed for the wrong purpose.</li>
            </ul>
            <p>To exercise these rights, email {mailto}. We reply within 72 hours.</p>
          </>
        ),
      },
      {
        title: "8. Retention and policy changes",
        content: (
          <p>
            Account data and comments are kept until you ask us to delete them. When this policy
            changes, the &quot;Last updated&quot; date at the top of the page will be updated.
          </p>
        ),
      },
    ],
  },
  zh: {
    title: "隐私政策",
    description: `${SITE_NAME} 收集哪些数据、用于什么目的，以及您对个人数据享有的权利。`,
    intro: (
      <p>
        本政策依据越南关于个人数据保护的第 13/2023/NĐ-CP 号议定精神，说明 {SITE_NAME}
        （zerotech-lab.site）在您使用网站时收集哪些数据、用于什么目的，以及您享有哪些权利。
      </p>
    ),
    sections: [
      {
        title: "1. 仅阅读文章时",
        content: (
          <p>
            您<strong>无需注册或提供任何个人信息</strong>
            即可阅读全部内容。与所有网站一样，托管服务商（Vercel）可能会记录 IP
            地址、浏览器类型和访问时间等技术日志，用于系统运行和安全。
          </p>
        ),
      },
      {
        title: "2. 登录并发表评论时",
        content: (
          <>
            <p>
              登录由 Auth0 服务处理。当您登录时，我们会从 Auth0
              获得以下信息：账户标识、显示名称、电子邮件和头像（如有）。
            </p>
            <p>
              当您发表评论时，我们会将评论内容连同您的标识、显示名称和头像保存在 Supabase
              数据库中。您的名称、头像和评论内容会公开显示在文章下方。
            </p>
          </>
        ),
      },
      {
        id: "cookies",
        title: "3. Cookie 与浏览器存储",
        content: (
          <>
            <p>{SITE_NAME} 使用：</p>
            <ul>
              <li>
                <strong>登录会话 Cookie</strong>（Auth0）——仅在您登录时使用，用于保持登录状态。
              </li>
              <li>
                <strong>语言 Cookie</strong>（NEXT_LOCALE）——记住您选择的语言。
              </li>
              <li>
                <strong>浏览器存储（localStorage）</strong>
                ——保存您的浅色/深色主题选择和收藏的文章。这些数据只保存在您的设备上，不会发送到服务器。
              </li>
            </ul>
            <p>
              我们<strong>不使用广告 Cookie</strong>。如果今后增加流量分析工具（例如 PostHog 或
              Vercel Analytics），本政策会在启用前更新。
            </p>
            <p>您可以随时在浏览器设置中删除 Cookie 和网站数据。</p>
          </>
        ),
      },
      {
        title: "4. 联盟链接与外部网站",
        content: (
          <>
            <p>
              网站上的部分链接是联盟链接（例如前往 Shopee，可能经由 AccessTrade
              平台）。点击后您将离开 {SITE_NAME}
              ；商家和联盟平台可能会根据其各自的隐私政策设置 Cookie，以记录来自我们的订单。
            </p>
            <p>我们不会从这些交易中获得您的个人信息或支付信息，只会获得点击量和订单的汇总数据。</p>
          </>
        ),
      },
      {
        title: "5. 数据使用目的",
        content: (
          <ul>
            <li>让您能够登录、发表评论并管理自己的评论。</li>
            <li>运营和保护网站安全，防止滥用（垃圾信息）。</li>
            <li>在您通过电子邮件联系我们时进行回复。</li>
          </ul>
        ),
      },
      {
        title: "6. 数据共享",
        content: (
          <p>
            我们<strong>不出售</strong>
            个人数据。数据仅由运营网站所必需的服务商处理：Vercel（托管）、Auth0（登录）、Supabase（数据库）。这些服务的服务器可能位于越南境外。
          </p>
        ),
      },
      {
        title: "7. 您的权利",
        content: (
          <>
            <p>根据第 13/2023/NĐ-CP 号议定，您有权：</p>
            <ul>
              <li>了解您的个人数据如何被处理。</li>
              <li>要求查看、更正或删除您的数据（包括已发表的评论）。</li>
              <li>撤回同意并要求限制数据处理。</li>
              <li>在数据被用于不当目的时提出投诉。</li>
            </ul>
            <p>如需行使上述权利，请发送邮件至 {mailto}。我们会在 72 小时内回复。</p>
          </>
        ),
      },
      {
        title: "8. 数据保存与政策变更",
        content: (
          <p>
            账户数据和评论将保存至您要求删除为止。本政策变更时，页面顶部的“最后更新”日期会随之更新。
          </p>
        ),
      },
    ],
  },
}
