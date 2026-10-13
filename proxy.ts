import type { NextRequest } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { auth0 } from "./lib/auth0"
import { routing } from "./i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /auth/* (login, logout, callback, profile) do Auth0 xử lý trọn vẹn, /api/*
  // không phụ thuộc ngôn ngữ — cả hai không gắn locale.
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    if (!process.env.AUTH0_DOMAIN) return
    return await auth0.middleware(request)
  }

  // Trang: next-intl quyết định locale (redirect/rewrite), sau đó để Auth0 gia
  // hạn session (rolling) trên chính response đó — giữ hành vi cũ khi chưa có
  // i18n (mọi request đều đi qua auth0.middleware).
  const intlResponse = intlMiddleware(request)
  if (!process.env.AUTH0_DOMAIN) return intlResponse

  const authResponse = await auth0.middleware(request)
  for (const cookie of authResponse.headers.getSetCookie()) {
    intlResponse.headers.append("set-cookie", cookie)
  }
  return intlResponse
}

export const config = {
  // Bỏ qua file tĩnh (có dấu chấm, VD icon.png, logo.png) và asset của Next.
  matcher: ["/((?!_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
}
