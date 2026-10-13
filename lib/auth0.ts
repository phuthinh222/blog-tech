import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  // Chưa đăng nhập thì /auth/profile trả 204 thay vì 401 — useUser() vẫn ra
  // user = null nhưng console không còn báo lỗi đỏ.
  noContentProfileResponseWhenUnauthenticated: true,
})
