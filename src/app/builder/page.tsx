"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
  X,
  Trash2,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CompatibilityReport } from "@/components/CompatibilityReport"
import type { Components } from "@/lib/compatibility"

// 8个硬件分类配置
const CATEGORIES = [
  { key: "CPU", label: "CPU 处理器", icon: Cpu },
  { key: "GPU", label: "显卡", icon: Monitor },
  { key: "MOBO", label: "主板", icon: CircuitBoard },
  { key: "RAM", label: "内存", icon: MemoryStick },
  { key: "SSD", label: "固态硬盘", icon: HardDrive },
  { key: "PSU", label: "电源", icon: Zap },
  { key: "CASE", label: "机箱", icon: Box },
  { key: "COOLER", label: "散热器", icon: Fan },
] as const

type CategoryKey = (typeof CATEGORIES)[number]["key"]

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
  } | null
}

interface SelectedHardware {
  [key: string]: Hardware
}

function BuilderPageContent() {
  const [selected, setSelected] = useState<SelectedHardware>({})
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [hardwareList, setHardwareList] = useState<Hardware[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("all")
  const [showExport, setShowExport] = useState(false)
  const [copied, setCopied] = useState(false)

  // 获取某分类的硬件列表
  useEffect(() => {
    if (!activeCategory) return
    setLoading(true)
    fetch(`/api/hardware?category=${activeCategory}&pageSize=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHardwareList(data.data.list)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCategory])

  // 计算总价（单位：分）
  const totalPrice = useMemo(() => {
    return Object.values(selected).reduce((sum, item) => {
      return sum + (item.price?.price || 0)
    }, 0)
  }, [selected])

  // 已选硬件数量
  const selectedCount = Object.keys(selected).length

  // 筛选后的列表
  const filteredList = hardwareList.filter((item) => {
    const matchSearch =
      !searchTerm ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchBrand = brandFilter === "all" || item.brand === brandFilter
    return matchSearch && matchBrand
  })

  // 获取该分类的所有品牌
  const brands = useMemo(() => {
    const set = new Set(hardwareList.map((h) => h.brand))
    return Array.from(set)
  }, [hardwareList])

  // 选择硬件
  const handleSelect = (hardware: Hardware) => {
    if (activeCategory) {
      setSelected((prev) => ({ ...prev, [activeCategory]: hardware }))
    }
    setActiveCategory(null)
    setSearchTerm("")
    setBrandFilter("all")
  }

  // 删除已选硬件
  const handleRemove = (category: string) => {
    setSelected((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  // 从URL参数读取配置并自动填入
  const searchParams = useSearchParams()
  useEffect(() => {
    const categoryMap: Record<string, string> = {
      cpu: "CPU",
      gpu: "GPU",
      mobo: "MOBO",
      ram: "RAM",
      ssd: "SSD",
      psu: "PSU",
      case: "CASE",
      cooler: "COOLER",
    }

    const idsToFetch: { category: string; id: number }[] = []
    for (const [param, category] of Object.entries(categoryMap)) {
      const idStr = searchParams.get(param)
      if (idStr) {
        const id = parseInt(idStr, 10)
        if (!isNaN(id)) {
          idsToFetch.push({ category, id })
        }
      }
    }

    if (idsToFetch.length === 0) return

    // 批量获取硬件详情
    Promise.all(
      idsToFetch.map(({ category, id }) =>
        fetch(`/api/hardware?category=${category}&pageSize=200`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const hw = data.data.list.find((h: Hardware) => h.id === id)
              return hw ? { category, hardware: hw } : null
            }
            return null
          })
      )
    ).then((results) => {
      const newSelected: SelectedHardware = {}
      results.forEach((r) => {
        if (r) newSelected[r.category] = r.hardware
      })
      if (Object.keys(newSelected).length > 0) {
        setSelected(newSelected)
      }
    })
  }, [searchParams])

  // 格式化价格（分→元）
  const formatPrice = (cents: number) => `¥${(cents / 100).toFixed(2)}`

  // 生成配置清单文本
  const generateConfigText = () => {
    const lines: string[] = []
    lines.push("=" .repeat(40))
    lines.push("       PC Builder Pro 配置清单")
    lines.push("=" .repeat(40))
    lines.push("")

    let total = 0
    for (const cat of CATEGORIES) {
      const item = selected[cat.key]
      if (item) {
        const price = item.price?.price || 0
        total += price
        lines.push(`【${cat.label}】`)
        lines.push(`  型号: ${item.brand} ${item.model}`)
        lines.push(`  参数: ${getKeySpecs(item)}`)
        lines.push(`  价格: ${formatPrice(price)}`)
        if (item.prices?.jd?.productUrl) {
          lines.push(`  京东: ${item.prices.jd.productUrl}`)
        }
        lines.push("")
      }
    }

    lines.push("-".repeat(40))
    lines.push(`  配置总价: ${formatPrice(total)}`)
    lines.push(`  已选硬件: ${selectedCount}/8 件`)
    lines.push("-".repeat(40))
    lines.push("")
    lines.push("生成时间: " + new Date().toLocaleString("zh-CN"))
    lines.push("价格仅供参考，以实际商城为准")

    return lines.join("\n")
  }

  // 复制到剪贴板
  const handleCopy = async () => {
    const text = generateConfigText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级方案
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 下载配置文件
  const handleDownload = () => {
    const text = generateConfigText()
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `PC配置清单_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 提取硬件关键参数显示
  const getKeySpecs = (hw: Hardware): string => {
    const s = hw.specs || {}
    if (hw.category === "CPU") {
      return `${s.cores || "?"}核${s.threads || "?"}线程 / ${s.boostClock || "?"}GHz`
    }
    if (hw.category === "GPU") {
      return `${s.vram || "?"} / ${s.bitWidth || "?"}bit`
    }
    if (hw.category === "MOBO") {
      return `${s.chipset || "?"} / ${s.memoryType || "?"}`
    }
    if (hw.category === "RAM") {
      return `${s.capacity || "?"} / ${s.speed || "?"}MHz`
    }
    if (hw.category === "SSD") {
      return `${s.capacity || "?"} / 读${s.readSpeed || "?"}MB/s`
    }
    if (hw.category === "PSU") {
      return `${s.wattage || "?"}W / ${s.certification || "?"}`
    }
    if (hw.category === "CASE") {
      return `${s.formFactor?.join("/") || "?"} / 限长${s.maxGpuLength || "?"}mm`
    }
    if (hw.category === "COOLER") {
      return `${s.type || "?"} / ${s.tdpRating || "?"}W`
    }
    return ""
  }

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部固定总价栏 */}
      <div className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-white">配置选择器</span>
            <Badge variant="secondary" className="ml-2">
              已选 {selectedCount}/8
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">配置总价</div>
              <div className="text-xl font-bold text-cyan-400">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={selectedCount === 0}
              onClick={() => setShowExport(true)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              导出配置
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左侧：硬件选择列表 */}
          <div className="flex-1 space-y-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const selectedItem = selected[cat.key]
              return (
                <Card
                  key={cat.key}
                  className="card-hover border-slate-700 bg-slate-800/50"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-700/50">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-400">
                        {cat.label}
                      </div>
                      {selectedItem ? (
                        <div className="mt-0.5">
                          <div className="truncate font-semibold text-white">
                            {selectedItem.brand} {selectedItem.model}
                          </div>
                          <div className="text-xs text-slate-400">
                            {getKeySpecs(selectedItem)}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-0.5 text-sm text-slate-500">
                          请选择
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedItem?.price && (
                        <div className="font-mono font-semibold text-emerald-400">
                          {formatPrice(selectedItem.price.price)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {selectedItem ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(cat.key)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant={selectedItem ? "outline" : "default"}
                        onClick={() => setActiveCategory(cat.key)}
                      >
                        {selectedItem ? "更换" : "选择"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 右侧：配置摘要 */}
          <div className="w-full lg:w-80">
            <div className="sticky top-20">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">配置摘要</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCount === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">
                      还未选择任何硬件
                      <br />
                      点击左侧"选择"按钮开始配置
                    </div>
                  ) : (
                    <>
                      {CATEGORIES.map((cat) => {
                        const item = selected[cat.key]
                        if (!item) return null
                        return (
                          <div
                            key={cat.key}
                            className="flex items-center justify-between border-b border-slate-700/50 pb-2 text-sm last:border-0"
                          >
                            <div className="min-w-0">
                              <div className="text-xs text-slate-400">
                                {cat.label}
                              </div>
                              <div className="truncate text-white">
                                {item.brand} {item.model}
                              </div>
                            </div>
                            <div className="ml-2 shrink-0 font-mono text-emerald-400">
                              {item.price
                                ? formatPrice(item.price.price)
                                : "暂无价"}
                            </div>
                          </div>
                        )
                      })}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-600 pt-3">
                        <span className="font-medium text-white">合计</span>
                        <span className="text-xl font-bold text-cyan-400">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 兼容性体检报告 */}
              <div className="mt-4">
                <CompatibilityReport
                  components={
                    {
                      CPU: selected.CPU,
                      GPU: selected.GPU,
                      MOBO: selected.MOBO,
                      RAM: selected.RAM,
                      SSD: selected.SSD,
                      PSU: selected.PSU,
                      CASE: selected.CASE,
                      COOLER: selected.COOLER,
                    } as Components
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 硬件选择弹窗 */}
      <Dialog
        open={activeCategory !== null}
        onOpenChange={(open) => !open && setActiveCategory(null)}
      >
        <DialogContent className="max-w-2xl border-slate-700 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>
              选择{CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </DialogTitle>
          </DialogHeader>

          {/* 搜索和筛选 */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="搜索型号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">全部品牌</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 硬件列表 */}
          <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </>
            ) : filteredList.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                没有找到匹配的硬件
              </div>
            ) : (
              filteredList.map((hw) => (
                <div
                  key={hw.id}
                  onClick={() => handleSelect(hw)}
                  className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 p-3 transition-colors hover:border-cyan-500/50 hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        {hw.brand} {hw.model}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {getKeySpecs(hw)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {/* 京东价 */}
                      {hw.prices?.jd?.price ? (
                        <a
                          href={hw.prices.jd.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-xs hover:bg-red-500/20"
                        >
                          <span className="text-red-400">京东</span>
                          <span className="font-mono font-semibold text-emerald-400">
                            {formatPrice(hw.prices.jd.price)}
                          </span>
                        </a>
                      ) : (
                        <a
                          href={hw.prices?.jd?.productUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded bg-slate-700/30 px-2 py-0.5 text-xs hover:bg-slate-700/50"
                        >
                          <span className="text-slate-500">京东</span>
                          <span className="text-slate-500">去搜索</span>
                        </a>
                      )}
                      {/* 淘宝价 */}
                      {hw.prices?.tmall?.price ? (
                        <a
                          href={hw.prices.tmall.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-xs hover:bg-orange-500/20"
                        >
                          <span className="text-orange-400">天猫</span>
                          <span className="font-mono font-semibold text-emerald-400">
                            {formatPrice(hw.prices.tmall.price)}
                          </span>
                        </a>
                      ) : (
                        <a
                          href={hw.prices?.tmall?.productUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded bg-slate-700/30 px-2 py-0.5 text-xs hover:bg-slate-700/50"
                        >
                          <span className="text-slate-500">天猫</span>
                          <span className="text-slate-500">去搜索</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 导出配置弹窗 */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-lg border-slate-700 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>导出配置清单</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 配置预览 */}
            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300">
                {generateConfigText()}
              </pre>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              >
                {copied ? "已复制 ✓" : "复制到剪贴板"}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                下载 TXT 文件
              </Button>
            </div>

            <p className="text-center text-xs text-slate-500">
              配置清单包含硬件型号、参数、价格及购买链接
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-400">
          加载中...
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  )
}
