import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Dùng các bản này thay cho next/link, next/navigation — tự gắn tiền tố locale.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
