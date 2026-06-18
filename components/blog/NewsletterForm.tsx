"use client"

import { useState } from "react"

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Có lỗi xảy ra, thử lại sau.")
      } else {
        setStatus("success")
        setEmail("")
      }
    } catch {
      setStatus("error")
      setMessage("Không thể kết nối, thử lại sau.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-5 text-center backdrop-blur-sm">
        <span className="text-2xl">🎉</span>
        <p className="text-sm font-semibold text-white">Đăng ký thành công!</p>
        <p className="text-xs text-white/60">Email xác nhận đã được gửi đến hộp thư của bạn.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setStatus("idle")
          }}
          placeholder="email@example.com"
          required
          disabled={status === "loading"}
          className="h-11 flex-1 rounded-xl border border-white/25 bg-white/10 px-4 text-sm text-white backdrop-blur-sm transition-colors outline-none placeholder:text-white/50 focus:border-white/50 focus:bg-white/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-bold text-violet-700 shadow-xl shadow-black/20 transition-all hover:bg-white/90 active:scale-95 disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Đăng Ký"}
        </button>
      </div>
      {status === "error" && <p className="text-center text-xs text-red-300">{message}</p>}
    </form>
  )
}
