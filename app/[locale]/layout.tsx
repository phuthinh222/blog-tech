import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Plus_Jakarta_Sans, Patrick_Hand } from "next/font/google"
import Script from "next/script"
import { Auth0Provider } from "@auth0/nextjs-auth0/client"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import "../globals.css"
import { routing, LOCALE_TAGS } from "@/i18n/routing"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { OG_LOCALES } from "@/lib/seo"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { LocaleSuggestBanner } from "@/components/layout/LocaleSuggestBanner"
import { SearchDialog } from "@/components/layout/SearchDialog"
import { ViewTransitions } from "@/components/layout/ViewTransitions"
import { BookmarksProvider } from "@/contexts/BookmarksContext"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  display: "swap",
})

const patrickHand = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  preload: false,
})

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme")==="light"?"light":"dark";document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.style.colorScheme=t}catch(e){}})()`

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const GA_INIT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}")`

// TikTok Pixel (Events Manager). Pixel ID là public, không phải bí mật.
const TIKTOK_PIXEL_ID = "DBUHL6RC77U4UD9J43RG"

// Snippet gốc của TikTok: tạo hàng đợi ttq, tải events.js rồi gửi PageView.
const TIKTOK_PIXEL_SCRIPT = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript";n.async=true;n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load("${TIKTOK_PIXEL_ID}");ttq.page()}(window,document,"ttq")`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALES[locale],
    },
    twitter: {
      card: "summary_large_image",
    },
    // Xác minh Google Search Console bằng thẻ meta (Vercel → Environment
    // Variables: GOOGLE_SITE_VERIFICATION = phần content của thẻ GSC đưa).
    // Đã xác minh bằng DNS thì bỏ trống.
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    }),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  // Cho phép render tĩnh (không phụ thuộc headers()) với next-intl.
  setRequestLocale(locale)

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      className={`${plusJakartaSans.variable} ${patrickHand.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Inline thay vì next/script beforeInteractive: bản đó chỉ chạy khi JS
            tải xong, nên trang hiện sáng rồi mới đổi sang tối. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Auth0Provider>
            <BookmarksProvider>
              <ViewTransitions />
              <LocaleSuggestBanner />
              <Header />
              <SearchDialog />
              <main className="flex-1">{children}</main>
              <Footer />
            </BookmarksProvider>
          </Auth0Provider>
        </NextIntlClientProvider>
        {/* Core Web Vitals từ người dùng thật (Vercel → Speed Insights). */}
        <SpeedInsights />
      </body>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="ga-init" strategy="lazyOnload">
            {GA_INIT_SCRIPT}
          </Script>
        </>
      )}
      {/* lazyOnload như GA: không tranh băng thông với nội dung (giữ LCP/INP). */}
      <Script id="tiktok-pixel" strategy="lazyOnload">
        {TIKTOK_PIXEL_SCRIPT}
      </Script>
    </html>
  )
}
