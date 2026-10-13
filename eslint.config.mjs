import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // app/[locale]/[...rest] (catch-all 404) khiến rule này coi MỌI đường
      // dẫn là trang Next, kể cả /auth/login — vốn bắt buộc dùng <a> (Auth0).
      // Link nội bộ đã đi qua Link của next-intl (i18n/navigation.ts).
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig
