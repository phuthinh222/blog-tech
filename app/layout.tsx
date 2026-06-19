import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google"
import { Auth0Provider } from "@auth0/nextjs-auth0/client"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { SearchDialog } from "@/components/layout/SearchDialog"
import { BookmarksProvider } from "@/contexts/BookmarksContext"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "The Zero Tech — Đánh Giá Sản Phẩm Công Nghệ",
  description:
    "Đánh giá trung thực về điện thoại, màn hình, laptop và phụ kiện công nghệ — giúp bạn chọn đúng sản phẩm, không lãng phí tiền bạc.",
  openGraph: {
    siteName: "The Zero Tech",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Auth0Provider>
          <BookmarksProvider>
            <Header />
            <SearchDialog />
            <main className="flex-1">{children}</main>
            <Footer />
          </BookmarksProvider>
        </Auth0Provider>
      </body>
    </html>
  )
}
