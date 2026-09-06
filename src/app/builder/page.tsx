"use client"

import { useState, useMemo, useEffect, useCallback, Suspense, memo } from "react"
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
import PerformanceScore from "@/components/PerformanceScore"
import GameBenchmark from "@/components/GameBenchmark"
import HardwareCompare, { type CompareHardware } from "@/components/HardwareCompare"
import { evaluatePerformance, predictGameFPS } from "@/lib/performance"
import type { Components } from "@/lib/compatibility"
import { GitCompare } from "lucide-react"

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
    platform: string
    shopName: string
    productUrl: string
    price: number
    crawledAt?: string
  } | null
  prices?: {
    jd: { price: number | null; productUrl: string; shopName: string; crawledAt?: string }
    tmall: { price: number | null; productUrl: string; shopName: string; crawledAt?: string }
  }
}

interface SelectedHardware {
  [key: string]: Hardware
}

// 提取硬件关键参数显示
const getKeySpecs = (hw: Hardware): string => {
  const s = hw.specs || {}
  if (hw.category === "CPU") {
    return `${s.cores || "?"}核${s.threads || "?"}线程 / ${s.boostClock || "?"}GHz`
  }
  if (hw.category === "GPU") {
    return `${s.vram || "?"} / ${s.cudaCores || s.streamProcessors || "?"}流处理器`
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
    return `${s.formFactor || "?"} / 限长${s.maxGpuLength || "?"}mm`
  }
  if (hw.category === "COOLER") {
    return `${s.type || "?"} / ${s.tdp || "?"}W`
  }
  return ""
}

// memo化的硬件列表项
const HardwareListItem = memo(function HardwareListItem({
  hw,
  onSelect,
  onCompare,
  isComparing,
}: {
  hw: Hardware
  onSelect: (hw: Hardware) => void
  onCompare?: (hw: Hardware) => void
  isComparing?: boolean
}) {
  const formatPrice = (cents: number) => `¥${(cents / 100).toFixed(2)}`
  return (
    <div
      className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${
        isComparing
          ? "border-black bg-white shadow-sm"
          : "border-black/5 bg-[#f5f5f7] hover:border-black/10 hover:bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1" onClick={() => onSelect(hw)}>
          <div className="font-medium text-black">
            {hw.brand} {hw.model}
          </div>
          <div className="mt-0.5 text-xs text-black/70">
            {getKeySpecs(hw)}
          </div>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            {hw.prices?.jd?.price ? (
              <a
                href={hw.prices.jd.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 text-xs hover:bg-black/10"
              >
                <span className="text-black/60">京东</span>
                <span className="font-mono font-semibold text-black">
                  {formatPrice(hw.prices.jd.price)}
                </span>
              </a>
            ) : (
              <a
                href={hw.prices?.jd?.productUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 text-xs hover:bg-black/10"
              >
                <span className="text-black/60">京东</span>
                <span className="text-black/60">去搜索</span>
              </a>
            )}
            {hw.prices?.tmall?.price ? (
              <a
                href={hw.prices.tmall.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 text-xs hover:bg-black/10"
              >
                <span className="text-black/60">天猫</span>
                <span className="font-mono font-semibold text-black">
                  {formatPrice(hw.prices.tmall.price)}
                </span>
              </a>
            ) : (
              <a
                href={hw.prices?.tmall?.productUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 text-xs hover:bg-black/10"
              >
                <span className="text-black/60">天猫</span>
                <span className="text-black/60">去搜索</span>
              </a>
            )}
          </div>
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCompare(hw)
              }}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                isComparing
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/70 hover:bg-black/10"
              }`}
              title="加入对比"
            >
              <GitCompare className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

function BuilderPageContent() {
  const [selected, setSelected] = useState<SelectedHardware>({})
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [hardwareList, setHardwareList] = useState<Hardware[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("all")
  const [showExport, setShowExport] = useState(false)
  const [copied, setCopied] = useState(false)
  const [compareList, setCompareList] = useState<CompareHardware[]>([])
  const [pendingCompare, setPendingCompare] = useState<CompareHardware[] | null>(null)

  // 获取某分类的硬件列表
  useEffect(() => {
    if (!activeCategory) {
      setHardwareList([])
      return
    }
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/hardware?category=${activeCategory}&pageSize=100`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHardwareList(data.data.list)
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [activeCategory])

  // 计算总价
  const totalPrice = useMemo(() => {
    return Object.values(selected).reduce((sum, item) => {
      return sum + (item.price?.price || 0)
    }, 0)
  }, [selected])

  const selectedCount = Object.keys(selected).length

  // 筛选后的列表
  const filteredList = useMemo(() => {
    const result = hardwareList.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchBrand = brandFilter === "all" || item.brand === brandFilter
      return matchSearch && matchBrand
    })
    return result.slice(0, 30)
  }, [hardwareList, searchTerm, brandFilter])

  const brands = useMemo(() => {
    const set = new Set(hardwareList.map((h) => h.brand))
    return Array.from(set)
  }, [hardwareList])

  const handleRemove = (category: string) => {
    setSelected((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  // 从URL参数读取配置
  const searchParams = useSearchParams()
  useEffect(() => {
    const categoryMap: Record<string, string> = {
      cpu: "CPU", gpu: "GPU", mobo: "MOBO", ram: "RAM",
      ssd: "SSD", psu: "PSU", case: "CASE", cooler: "COOLER",
    }
    const idsToFetch: { category: string; id: number }[] = []
    for (const [param, category] of Object.entries(categoryMap)) {
      const idStr = searchParams.get(param)
      if (idStr) {
        const id = parseInt(idStr, 10)
        if (!isNaN(id)) idsToFetch.push({ category, id })
      }
    }
    if (idsToFetch.length === 0) return
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
      results.forEach((r) => { if (r) newSelected[r.category] = r.hardware })
      if (Object.keys(newSelected).length > 0) setSelected(newSelected)
    })
  }, [searchParams])

  const formatPrice = (cents: number) => `¥${(cents / 100).toFixed(2)}`

  const generateConfigText = () => {
    const lines: string[] = []
    lines.push("=".repeat(40))
    lines.push("       PC Builder 配置清单")
    lines.push("=".repeat(40))
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
        if (item.prices?.jd?.productUrl) lines.push(`  京东: ${item.prices.jd.productUrl}`)
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

  const handleCopy = async () => {
    const text = generateConfigText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
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

  const compatibilityComponents = useMemo(
    () =>
      ({
        CPU: selected.CPU, GPU: selected.GPU, MOBO: selected.MOBO, RAM: selected.RAM,
        SSD: selected.SSD, PSU: selected.PSU, CASE: selected.CASE, COOLER: selected.COOLER,
      }) as Components,
    [selected]
  )

  // 性能评分
  const performance = useMemo(() => {
    return evaluatePerformance({
      cpu: selected.CPU ? { specs: JSON.stringify(selected.CPU.specs), model: selected.CPU.model } : null,
      gpu: selected.GPU ? { specs: JSON.stringify(selected.GPU.specs), model: selected.GPU.model } : null,
      ram: selected.RAM ? { specs: JSON.stringify(selected.RAM.specs), model: selected.RAM.model } : null,
      ssd: selected.SSD ? { specs: JSON.stringify(selected.SSD.specs), model: selected.SSD.model } : null,
    })
  }, [selected])

  // 游戏帧数预测
  const gameBenchmarks = useMemo(() => {
    return predictGameFPS(performance.cpu, performance.gpu, !!selected.GPU)
  }, [performance, selected.GPU])

  // 对比功能
  const toggleCompare = (hw: Hardware) => {
    setCompareList((prev) => {
      const exists = prev.find((h) => h.id === hw.id)
      if (exists) {
        return prev.filter((h) => h.id !== hw.id)
      }
      if (prev.length >= 2) {
        return [prev[1], {
          id: hw.id, brand: hw.brand, model: hw.model, fullName: hw.fullName,
          specs: JSON.stringify(hw.specs), price: hw.price?.price, category: hw.category,
        }]
      }
      return [...prev, {
        id: hw.id, brand: hw.brand, model: hw.model, fullName: hw.fullName,
        specs: JSON.stringify(hw.specs), price: hw.price?.price, category: hw.category,
      }]
    })
  }

  const handleCompareSelect = (item: CompareHardware) => {
    const category = pendingCompare?.[0]?.category as keyof typeof selected | undefined
    if (category) {
      const hw = hardwareList.find((h) => h.id === item.id)
      if (hw) {
        setSelected((prev) => ({ ...prev, [category]: hw }))
      }
    }
    setPendingCompare(null)
    setCompareList([])
    setSearchTerm("")
    setBrandFilter("all")
  }

  const handleSelect = useCallback((hardware: Hardware) => {
    if (activeCategory) {
      setSelected((prev) => ({ ...prev, [activeCategory]: hardware }))
    }
    setActiveCategory(null)
    setSearchTerm("")
    setBrandFilter("all")
  }, [activeCategory])

  return (
    <div className="page-enter min-h-screen bg-white pb-20">
      {/* 顶部固定总价栏 */}
      <div className="sticky top-[57px] z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-black">配置选择器</span>
            <Badge variant="secondary" className="rounded-full bg-black/5 text-black/60">
              已选 {selectedCount}/8
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-black/60">配置总价</div>
              <div className="text-xl font-bold text-black">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={selectedCount === 0}
              onClick={() => setShowExport(true)}
              className="rounded-full border-black/15 text-black/70 hover:bg-black hover:text-white hover:border-black"
            >
              <Share2 className="mr-2 h-4 w-4" />
              导出
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 左侧：硬件选择列表 + 性能评分 */}
          <div className="flex-1">
            <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const selectedItem = selected[cat.key]
              return (
                <Card
                  key={cat.key}
                  className="card-hover border-0 bg-[#f5f5f7] shadow-none"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-black/60">
                        {cat.label}
                      </div>
                      {selectedItem ? (
                        <div className="mt-0.5">
                          <div className="truncate font-semibold text-black">
                            {selectedItem.brand} {selectedItem.model}
                          </div>
                          <div className="text-xs text-black/60">
                            {getKeySpecs(selectedItem)}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-0.5 text-sm text-black/70">
                          未选择
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedItem?.price && (
                        <div className="font-mono font-semibold text-black">
                          {formatPrice(selectedItem.price.price)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {selectedItem && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(cat.key)}
                          className="text-black/60 hover:text-black"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveCategory(cat.key)}
                        className={selectedItem
                          ? "rounded-full border-black/15 text-black/70 hover:bg-black hover:text-white hover:border-black"
                          : "rounded-full border-[#00b4a8]/40 text-[#00b4a8] hover:bg-[#00b4a8] hover:text-white hover:border-[#00b4a8]"
                        }
                      >
                        {selectedItem ? "更换" : "选择"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            </div>

            {/* 性能评分 + 游戏帧数 */}
            {selectedCount > 0 && (
              <div className="mt-8 space-y-6">
                <PerformanceScore score={performance} />
                <GameBenchmark benchmarks={gameBenchmarks} hasGPU={!!selected.GPU} />
              </div>
            )}
          </div>
          <div className="w-full lg:w-80">
            <div className="sticky top-28 space-y-4">
              <Card className="border-0 bg-[#f5f5f7] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-black">配置摘要</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedCount === 0 ? (
                    <div className="py-8 text-center text-sm text-black/60">
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
                            className="flex items-center justify-between border-b border-black/5 pb-2 text-sm last:border-0"
                          >
                            <div className="min-w-0">
                              <div className="text-xs text-black/60">{cat.label}</div>
                              <div className="truncate text-black">{item.brand} {item.model}</div>
                            </div>
                            <div className="ml-2 shrink-0 font-mono text-black">
                              {item.price ? formatPrice(item.price.price) : "暂无价"}
                            </div>
                          </div>
                        )
                      })}
                      <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="font-medium text-black">合计</span>
                        <span className="text-xl font-bold text-black">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <CompatibilityReport components={compatibilityComponents} />
            </div>
          </div>
        </div>
      </div>

      {/* 硬件选择弹窗 */}
      <Dialog
        open={activeCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCategory(null)
            setCompareList([])
          }
        }}
      >
        <DialogContent className="max-w-2xl border-0 bg-white text-black shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              选择{CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/70" />
              <Input
                placeholder="搜索型号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-full border-black/10 bg-[#f5f5f7] pl-9 focus-visible:ring-black"
              />
            </div>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-full border border-black/10 bg-[#f5f5f7] px-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">全部品牌</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* 对比状态条 */}
          {compareList.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-black/5 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm">
                <GitCompare className="h-4 w-4 text-black/60" />
                <span className="text-black/70">
                  已选 {compareList.length}/2 款对比
                  {compareList.length === 2 && "：点击右侧按钮开始对比"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareList([])}
                  className="text-xs text-black/70 hover:text-black/80"
                >
                  清空
                </button>
                {compareList.length === 2 && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setPendingCompare([...compareList])
                      setActiveCategory(null)
                    }}
                    className="rounded-full bg-black text-white hover:bg-black/80"
                  >
                    开始对比
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </>
            ) : filteredList.length === 0 ? (
              <div className="py-8 text-center text-sm text-black/60">
                没有找到匹配的硬件
              </div>
            ) : (
              <>
                {filteredList.map((hw) => (
                  <HardwareListItem
                    key={hw.id}
                    hw={hw}
                    onSelect={handleSelect}
                    onCompare={toggleCompare}
                    isComparing={!!compareList.find((h) => h.id === hw.id)}
                  />
                ))}
                {filteredList.length === 30 && hardwareList.length > 30 && (
                  <div className="py-2 text-center text-xs text-black/60">
                    仅显示前30条，使用搜索或品牌筛选缩小范围
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 硬件对比弹窗 */}
      {pendingCompare && pendingCompare.length === 2 && (
        <HardwareCompare
          itemA={pendingCompare[0]}
          itemB={pendingCompare[1]}
          onClose={() => setPendingCompare(null)}
          onSelect={handleCompareSelect}
        />
      )}

      {/* 导出配置弹窗 */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-lg border-0 bg-white text-black shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">导出配置清单</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto rounded-xl border border-black/5 bg-[#f5f5f7] p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs text-black/70">
                {generateConfigText()}
              </pre>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 rounded-full bg-black text-white hover:bg-black/80"
              >
                {copied ? "已复制 ✓" : "复制到剪贴板"}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 rounded-full border-black/10 hover:bg-black hover:text-white"
              >
                下载 TXT
              </Button>
            </div>
            <p className="text-center text-xs text-black/60">
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
        <div className="flex min-h-screen items-center justify-center text-black/60">
          加载中...
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  )
}
