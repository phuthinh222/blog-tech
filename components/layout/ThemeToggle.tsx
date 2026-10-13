"use client"

import { useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

type Listener = () => void
const listeners = new Set<Listener>()

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Reads the live DOM class so it's always the source of truth — the
// anti-FOUC script in layout.tsx is what actually sets it before paint.
function getSnapshot() {
  return document.documentElement.classList.contains("dark")
}

// Matches the dark-first default set by the anti-FOUC script in layout.tsx
function getServerSnapshot() {
  return true
}

function setDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next)
  document.documentElement.style.colorScheme = next ? "dark" : "light"
  localStorage.setItem("theme", next ? "dark" : "light")
  listeners.forEach((listener) => listener())
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("Theme")
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-xl ${className}`}
      aria-label={isDark ? t("toLight") : t("toDark")}
      onClick={() => setDark(!isDark)}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
