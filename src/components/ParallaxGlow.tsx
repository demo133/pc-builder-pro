"use client"

import { useEffect, useRef } from "react"

export function ParallaxGlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const glows = container.querySelectorAll<HTMLDivElement>("[data-parallax]")

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      glows.forEach((glow, index) => {
        const speed = (index + 1) * 15
        glow.style.transform = `translate(calc(-50% + ${x * speed}px), calc(${y * speed}px))`
      })
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        data-parallax
        className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl transition-transform duration-300 ease-out"
      />
      <div
        data-parallax
        className="absolute top-20 right-20 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl transition-transform duration-300 ease-out"
      />
      <div
        data-parallax
        className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl transition-transform duration-300 ease-out"
      />
    </div>
  )
}
