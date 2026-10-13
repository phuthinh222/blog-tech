"use client"

import { useEffect, useState } from "react"

export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const update = () => {
      const { top, height } = target.getBoundingClientRect()
      const scrollable = height - window.innerHeight
      const pct = scrollable > 0 ? (-top / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [targetId])

  return (
    <div className="bg-border/40 sticky top-16 z-40 h-0.5 w-full" aria-hidden="true">
      <div
        className="h-full bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
