"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Cpu,
  Monitor,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Search,
  TrendingUp,
  Clock,
} from "lucide-react"

const CATEGORIES = [
  { key: "all", label: "全部", icon: TrendingUp },
  { key: "CPU", label: "CPU", icon: Cpu },
  { key: "GPU", label: "显卡", icon: Monitor },
  { key: "MOBO", label: "主板", icon: CircuitBoard },
  { key: "RAM", label: "内存", icon: MemoryStick },
  { key: "SSD", label: "固态", icon: HardDrive },
  { key: "PSU", label: "电源", icon: Zap },
  { key: "CASE", label: "机箱", icon: Box },
  { key: "COOLER", label: "散热", icon: Fan },
]

interface Hardware {
  id: number
  category: string
  brand: string
  model: string
  fullName: string
  specs: Record<string, any>
  tdp: number | null
  price: {
    price: number
    shopName: string
    crawledAt: string
  } | null
  prices?: {
    jd: { price: number | null; productUrl: string; shopName: string; crawledAt?: string }
    tmall: { price: number | null; productUrl: string; shopName: string; crawledAt?: string }
  }
}

const CATEGORY_ICONS: Record<string, any> = {
  CPU: Cpu, GPU: Monitor, MOBO: CircuitBoard, RAM: MemoryStick,
  SSD: HardDrive, PSU: Zap, CASE: Box, COOLER: Fan,
}

export default function PricesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [hardwareList, setHardwareList] = useState<Hardware[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const categoryParam = activeCategory === "all" ? "" : `&category=${activeCategory}`
    fetch(`/api/hardware?pageSize=200${categoryParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHardwareList(data.data.list)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory])

  const filteredList = hardwareList.filter((item) => {
    if (!searchTerm) return true
    return (
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const formatPrice = (cents: number) => `¥${(cents / 100).toFixed(2)}`

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`
    } catch {
      return "-"
    }
  }

  const totalCount = hardwareList.length
  const withPriceCount = hardwareList.filter((h) => h.price).length
  const avgPrice =
    withPriceCount > 0
      ? hardwareList.reduce((sum, h) => sum + (h.price?.price || 0), 0) / withPriceCount
      : 0

  return (
    <div className="page-enter min-h-screen bg-white pb-20">
      {/* 页面标题 */}
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-black" />
            <h1 className="text-3xl font-bold tracking-tight text-black">价格监控</h1>
          </div>
          <p className="mt-2 text-black/50">
            实时追踪各平台硬件价格，当前展示京东参考价（爬虫接入后自动更新）
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-6">
        {/* 统计卡片 */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <Card className="border-0 bg-[#f5f5f7] shadow-none">
            <CardContent className="p-5">
              <div className="text-xs text-black/40">监控硬件</div>
              <div className="mt-1 text-2xl font-bold text-black">{totalCount}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[#f5f5f7] shadow-none">
            <CardContent className="p-5">
              <div className="text-xs text-black/40">有价格</div>
              <div className="mt-1 text-2xl font-bold text-black">{withPriceCount}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[#f5f5f7] shadow-none">
            <CardContent className="p-5">
              <div className="text-xs text-black/40">平均价格</div>
              <div className="mt-1 text-2xl font-bold text-black">{formatPrice(avgPrice)}</div>
            </CardContent>
          </Card>
        </div>

        {/* 分类筛选 + 搜索 */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === cat.key
                      ? "bg-black text-white"
                      : "text-black/60 hover:bg-black/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
            <Input
              placeholder="搜索型号或品牌..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full border-black/10 bg-[#f5f5f7] pl-9 focus-visible:ring-black"
            />
          </div>
        </div>

        {/* 价格列表 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-[#f5f5f7] p-12 text-center text-black/40">
            没有找到匹配的硬件
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((hw) => {
              const Icon = CATEGORY_ICONS[hw.category] || Cpu
              return (
                <Card
                  key={hw.id}
                  className="card-hover border-0 bg-[#f5f5f7] shadow-none"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black">
                          {hw.brand} {hw.model}
                        </span>
                        <Badge variant="outline" className="rounded-full text-xs text-black/40 border-black/10">
                          {hw.category}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-black/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {hw.prices?.jd?.crawledAt ? formatDate(hw.prices.jd.crawledAt) : "未更新"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {/* 京东价 */}
                      {hw.prices?.jd?.price ? (
                        <a
                          href={hw.prices.jd.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-white px-3 py-1 transition-colors hover:bg-black/5"
                        >
                          <span className="text-xs font-medium text-black/60">京东</span>
                          <span className="font-mono text-sm font-bold text-black">
                            {formatPrice(hw.prices.jd.price)}
                          </span>
                        </a>
                      ) : (
                        <a
                          href={hw.prices?.jd?.productUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-white px-3 py-1 transition-colors hover:bg-black/5"
                        >
                          <span className="text-xs text-black/40">京东</span>
                          <span className="text-xs text-black/40">去搜索 →</span>
                        </a>
                      )}
                      {/* 天猫价 */}
                      {hw.prices?.tmall?.price ? (
                        <a
                          href={hw.prices.tmall.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-white px-3 py-1 transition-colors hover:bg-black/5"
                        >
                          <span className="text-xs font-medium text-black/60">天猫</span>
                          <span className="font-mono text-sm font-bold text-black">
                            {formatPrice(hw.prices.tmall.price)}
                          </span>
                        </a>
                      ) : (
                        <a
                          href={hw.prices?.tmall?.productUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-white px-3 py-1 transition-colors hover:bg-black/5"
                        >
                          <span className="text-xs text-black/40">天猫</span>
                          <span className="text-xs text-black/40">去搜索 →</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* 价格数据说明 */}
        <div className="mt-8 rounded-2xl border border-black/5 bg-[#f5f5f7] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/40" />
            <div>
              <div className="text-sm font-medium text-black">价格数据说明</div>
              <p className="mt-1 text-xs text-black/50">
                京东价为爬虫抓取的参考价，天猫价为估算参考价。点击价格标签可跳转到对应商城搜索结果页。运行 <code className="rounded bg-white px-1.5 py-0.5 text-black/70">python crawler/jd_crawler.py</code> 可更新京东实时价格。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
