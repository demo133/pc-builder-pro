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
  Store,
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
        if (data.success) {
          setHardwareList(data.data.list)
        }
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

  // 统计
  const totalCount = hardwareList.length
  const withPriceCount = hardwareList.filter((h) => h.price).length
  const avgPrice =
    withPriceCount > 0
      ? hardwareList.reduce((sum, h) => sum + (h.price?.price || 0), 0) / withPriceCount
      : 0

  return (
    <div className="min-h-screen pb-20">
      {/* 页面标题 */}
      <div className="border-b border-slate-700/50 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">价格监控</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            实时追踪各平台硬件价格，当前展示京东参考价（爬虫接入后自动更新）
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-4">
        {/* 统计卡片 */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400">监控硬件</div>
              <div className="mt-1 text-2xl font-bold text-white">{totalCount}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400">有价格</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">{withPriceCount}</div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-4">
              <div className="text-xs text-slate-400">平均价格</div>
              <div className="mt-1 text-2xl font-bold text-cyan-400">{formatPrice(avgPrice)}</div>
            </CardContent>
          </Card>
        </div>

        {/* 分类筛选 + 搜索 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat.key
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              )
            })}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="搜索型号或品牌..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* 价格列表 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-12 text-center text-slate-400">
            没有找到匹配的硬件
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((hw) => (
              <Card
                key={hw.id}
                className="card-hover border-slate-700 bg-slate-800/50"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-700/50">
                    {hw.category === "CPU" && <Cpu className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "GPU" && <Monitor className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "MOBO" && <CircuitBoard className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "RAM" && <MemoryStick className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "SSD" && <HardDrive className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "PSU" && <Zap className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "CASE" && <Box className="h-5 w-5 text-cyan-400" />}
                    {hw.category === "COOLER" && <Fan className="h-5 w-5 text-cyan-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {hw.brand} {hw.model}
                      </span>
                      <Badge variant="outline" className="text-xs text-slate-400">
                        {hw.category}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
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
                        className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1 transition-colors hover:bg-red-500/20"
                      >
                        <span className="text-xs font-medium text-red-400">京东</span>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {formatPrice(hw.prices.jd.price)}
                        </span>
                      </a>
                    ) : (
                      <a
                        href={hw.prices?.jd?.productUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-slate-700/30 px-3 py-1 transition-colors hover:bg-slate-700/50"
                      >
                        <span className="text-xs text-slate-500">京东</span>
                        <span className="text-xs text-slate-500">去搜索 →</span>
                      </a>
                    )}
                    {/* 天猫价 */}
                    {hw.prices?.tmall?.price ? (
                      <a
                        href={hw.prices.tmall.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1 transition-colors hover:bg-orange-500/20"
                      >
                        <span className="text-xs font-medium text-orange-400">天猫</span>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          {formatPrice(hw.prices.tmall.price)}
                        </span>
                      </a>
                    ) : (
                      <a
                        href={hw.prices?.tmall?.productUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-slate-700/30 px-3 py-1 transition-colors hover:bg-slate-700/50"
                      >
                        <span className="text-xs text-slate-500">天猫</span>
                        <span className="text-xs text-slate-500">去搜索 →</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 爬虫状态提示 */}
        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <div>
              <div className="text-sm font-medium text-amber-400">价格数据说明</div>
              <p className="mt-1 text-xs text-slate-400">
                京东价为爬虫抓取的参考价，天猫价为估算参考价。点击价格标签可跳转到对应商城搜索结果页。运行 <code className="rounded bg-slate-700 px-1">python crawler/jd_crawler.py</code> 可更新京东实时价格。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
