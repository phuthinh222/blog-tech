"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, RotateCcw, Maximize2 } from "lucide-react"

type Props = {
  images: string[]
  title: string
}

function Lightbox({
  images,
  title,
  initialIdx,
  onClose,
}: {
  images: string[]
  title: string
  initialIdx: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(initialIdx)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const resetView = useCallback(() => {
    setZoom(1)
    setPos({ x: 0, y: 0 })
  }, [])

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + images.length) % images.length)
    resetView()
  }, [images.length, resetView])

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % images.length)
    resetView()
  }, [images.length, resetView])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, prev, next])

  // Non-passive wheel for zoom (passive: false required to call preventDefault)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoom((z) => {
        const next = Math.min(4, Math.max(1, +(z + (e.deltaY < 0 ? 0.3 : -0.3)).toFixed(1)))
        if (next <= 1) setPos({ x: 0, y: 0 })
        return next
      })
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y }
    setDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return
    setPos({
      x: dragRef.current.px + (e.clientX - dragRef.current.sx),
      y: dragRef.current.py + (e.clientY - dragRef.current.sy),
    })
  }

  const stopDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  const zoomIn = () => setZoom((z) => Math.min(+(z + 0.5).toFixed(1), 4))
  const zoomOut = () =>
    setZoom((z) => {
      const n = Math.max(+(z - 0.5).toFixed(1), 1)
      if (n <= 1) setPos({ x: 0, y: 0 })
      return n
    })

  const isReset = zoom === 1 && pos.x === 0 && pos.y === 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 py-3">
        <p className="truncate pr-4 text-sm text-white/60">{title}</p>
        <span className="shrink-0 text-sm font-medium text-white/80">
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="ml-4 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Đóng"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: "min(92vw, 960px)",
            height: "min(72vh, 680px)",
            cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.2s ease",
            }}
          >
            <Image
              key={idx}
              src={images[idx]}
              alt={`${title} - ảnh ${idx + 1}`}
              fill
              className="object-contain select-none"
              sizes="960px"
              priority
              draggable={false}
            />
          </div>
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Footer: zoom controls + thumbnails */}
      <div className="flex shrink-0 flex-col items-center gap-3 px-5 py-4">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="size-4" />
          </button>
          <button
            onClick={resetView}
            className="min-w-13 text-center text-sm font-medium text-white/90 transition-colors hover:text-white"
            title="Click để reset về 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= 4}
            className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            aria-label="Phóng to"
          >
            <ZoomIn className="size-4" />
          </button>
          <span className="mx-1 h-4 w-px bg-white/20" />
          <button
            onClick={resetView}
            disabled={isReset}
            className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:opacity-30"
            aria-label="Reset"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setIdx(i)
                  resetView()
                }}
                className={`relative size-14 overflow-hidden rounded-lg border-2 transition-all ${
                  i === idx
                    ? "scale-105 border-white opacity-100"
                    : "border-white/30 opacity-50 hover:opacity-75"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-white/30">Scroll để zoom · Kéo để di chuyển · ESC để đóng</p>
      </div>
    </div>
  )
}

export function ArticleGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (images.length === 0) return null

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const next = () => setActive((i) => (i + 1) % images.length)

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          className="group bg-muted relative aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-2xl"
          onClick={() => setLightboxIdx(active)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setLightboxIdx(active)
          }}
          aria-label="Xem ảnh lớn"
        >
          <Image
            key={active}
            src={images[active]}
            alt={`${title} - ảnh ${active + 1}`}
            fill
            className="object-contain transition-opacity duration-200"
            sizes="(max-width: 1024px) 100vw, 700px"
            priority={active === 0}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60"
                aria-label="Ảnh tiếp"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          {/* Zoom hint + counter */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <Maximize2 className="size-3" />
              <span>Phóng to</span>
            </div>
            {images.length > 1 && (
              <div className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {active + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:opacity-90 ${
                  i === active
                    ? "border-primary ring-primary/20 opacity-100 ring-2"
                    : "border-border opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          title={title}
          initialIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
