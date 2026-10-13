"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Global click interceptor: wraps internal navigations in the native View
// Transitions API so page changes crossfade instead of hard-cutting.
// Pure progressive enhancement — unsupported browsers, external links,
// modified clicks, and new-tab opens all fall through to normal <a> behavior.
export function ViewTransitions() {
  const router = useRouter()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (!document.startViewTransition) return

      const anchor = (e.target as HTMLElement)?.closest?.("a")
      if (!anchor || !anchor.href) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // Same-page anchor jumps (e.g. the article TOC) — let smooth-scroll handle those
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return
      }

      // Capture phase + stopPropagation: Next's own <Link> click handler
      // (bubble phase, attached near the React root) would otherwise run
      // first, call preventDefault(), and navigate before we get a chance
      // to wrap the transition — leaving this listener a no-op.
      e.preventDefault()
      e.stopPropagation()
      document.startViewTransition(() => {
        router.push(url.pathname + url.search + url.hash)
      })
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [router])

  return null
}
