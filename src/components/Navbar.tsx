"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/builder", label: "装机" },
  { href: "/recommend", label: "推荐" },
  { href: "/prices", label: "价格" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-[#00b4a8]" />
          <span className="text-base font-semibold tracking-tight text-black">
            PC Builder
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-[#00b4a8] text-white shadow-sm"
                    : "text-black/70 hover:bg-[#00b4a8]/10 hover:text-[#00b4a8]"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
