import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Plus_Jakarta_Sans, Patrick_Hand } from "next/font/google"
import Script from "next/script"
import { Auth0Provider } from "@auth0/nextjs-auth0/client"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import "../globals.css"
import { routing, LOCALE_TAGS } from "@/i18n/routing"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { OG_LOCALES } from "@/lib/seo"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
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
              <Header />
              <SearchDialog />
              <main className="flex-1">{children}</main>
              <Footer />
            </BookmarksProvider>
          </Auth0Provider>
        </NextIntlClientProvider>
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
    </html>
  )
}
