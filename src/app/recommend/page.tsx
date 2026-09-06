"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Cpu,
  Monitor,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  ArrowRight,
  Sparkles,
  Wallet,
} from "lucide-react"

const USE_CASES = [
  { value: "gaming", label: "游戏" },
  { value: "office", label: "办公" },
  { value: "content", label: "视频剪辑" },
  { value: "3d", label: "3D建模" },
  { value: "dev", label: "编程开发" },
  { value: "mixed", label: "综合" },
]

const PRIORITIES = [
  { value: "value", label: "性价比优先" },
  { value: "performance", label: "性能优先" },
  { value: "silent", label: "静音优先" },
  { value: "rgb", label: "灯效优先" },
]

const CATEGORY_LABELS: Record<string, string> = {
  CPU: "CPU", GPU: "显卡", MOBO: "主板", RAM: "内存",
  SSD: "固态", PSU: "电源", CASE: "机箱", COOLER: "散热",
}

const CATEGORY_ICONS: Record<string, any> = {
  CPU: Cpu, GPU: Monitor, MOBO: CircuitBoard, RAM: MemoryStick,
  SSD: HardDrive, PSU: Zap, CASE: Box, COOLER: Fan,
}

const PIE_COLORS = [
  "#1d1d1f", "#86868b", "#0071e3", "#34c759",
  "#ff9500", "#ff3b30", "#af52de", "#5ac8fa",
]

interface HardwareItem {
  id: number
  brand: string
  model: string
  price: number
}

interface ConfigResult {
  id: number
  name: string
  useCaseLabel: string
  totalPrice: number
  actualTotalPrice: number
  budgetDiff: number
  description: string | null
  components: Record<string, HardwareItem>
}

const QUICK_BUDGETS = [3000, 5000, 6000, 8000, 10000, 15000]

export default function RecommendPage() {
  const router = useRouter()
  const [budget, setBudget] = useState(6000)
  const [budgetInput, setBudgetInput] = useState("6000")
  const [useCase, setUseCase] = useState("gaming")
  const [priority, setPriority] = useState("value")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ConfigResult[]>([])
  const [budgetAllocation, setBudgetAllocation] = useState<Record<string, number>>({})
  const [hasSearched, setHasSearched] = useState(false)

  const formatPrice = (cents: number) => `¥${(cents / 100).toFixed(0)}`

  const handleSliderChange = (value: number[]) => {
    const v = value[0]
    setBudget(v)
    setBudgetInput(String(v))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "")
    setBudgetInput(val)
  }

  const handleInputBlur = () => {
    let v = parseInt(budgetInput) || 6000
    v = Math.max(2000, Math.min(20000, v))
    v = Math.round(v / 100) * 100
    setBudget(v)
    setBudgetInput(String(v))
  }

  const handleQuickBudget = (v: number) => {
    setBudget(v)
    setBudgetInput(String(v))
  }

  const handleGenerate = async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(
        `/api/recommend?budget=${budget}&useCase=${useCase}&priority=${priority}`
      )
      const data = await res.json()
      if (data.success) {
        setResults(data.data.configs)
        setBudgetAllocation(data.data.budgetAllocation)
      }
    } catch (error) {
      console.error("获取推荐失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseConfig = (config: ConfigResult) => {
    const params = new URLSearchParams()
    for (const [key, hw] of Object.entries(config.components)) {
      if (hw?.id) params.set(key.toLowerCase(), String(hw.id))
    }
    router.push(`/builder?${params.toString()}`)
  }

  const pieData = Object.entries(budgetAllocation).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    value,
  }))

  return (
    <div className="page-enter min-h-screen bg-white pb-20">
      {/* 顶部标题 */}
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-black" />
            <h1 className="text-3xl font-bold tracking-tight text-black">预算配置推荐</h1>
          </div>
          <p className="mt-2 text-black/70">
            输入预算和用途，智能推荐最优配置方案
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-6">
        {/* 输入区 */}
        <Card className="border-0 bg-[#f5f5f7] shadow-none">
          <CardContent className="space-y-8 p-8">
            {/* 预算滑块 */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-black">
                  <Wallet className="h-4 w-4 text-black" />
                  预算金额
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black/60">¥</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={budgetInput}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="w-32 rounded-full border-black/10 bg-white text-center font-mono text-lg font-bold text-black focus-visible:ring-black"
                  />
                </div>
              </div>
              <Slider
                value={[budget]}
                onValueChange={handleSliderChange}
                min={2000}
                max={20000}
                step={100}
              />
              <div className="mt-1 flex justify-between text-xs text-black/60">
                <span>¥2,000</span>
                <span>¥20,000</span>
              </div>
              {/* 快捷预算按钮 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_BUDGETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleQuickBudget(v)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                      budget === v
                        ? "bg-black text-white"
                        : "bg-white text-black/70 hover:bg-black/10"
                    }`}
                  >
                    ¥{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途选择 */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                主要用途
              </label>
              <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc) => (
                  <Button
                    key={uc.value}
                    size="sm"
                    variant={useCase === uc.value ? "default" : "outline"}
                    onClick={() => setUseCase(uc.value)}
                    className={useCase === uc.value
                      ? "rounded-full bg-black text-white hover:bg-black/80"
                      : "rounded-full border-black/20 bg-white text-black/70 hover:bg-black/10 hover:text-black"
                    }
                  >
                    {uc.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 偏好选择 */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                偏好倾向
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <Button
                    key={p.value}
                    size="sm"
                    variant={priority === p.value ? "secondary" : "outline"}
                    onClick={() => setPriority(p.value)}
                    className={priority === p.value
                      ? "rounded-full bg-black text-white hover:bg-black/80"
                      : "rounded-full border-black/20 bg-white text-black/70 hover:bg-black/10 hover:text-black"
                    }
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded-full bg-black text-white hover:bg-black/80"
              size="lg"
            >
              {loading ? "生成中..." : "生成推荐配置"}
            </Button>
          </CardContent>
        </Card>

        {/* 结果区 */}
        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-black/5 bg-[#f5f5f7] p-12 text-center">
            <p className="text-black/70">没有找到匹配的配置方案，试试调整预算或用途</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <h2 className="mt-10 mb-6 text-xl font-semibold text-black">
              为你推荐 {results.length} 套方案
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {results.map((config, index) => {
                const labels = ["丐版方案", "均衡方案", "加钱方案"]
                const isRecommended = index === 1
                return (
                  <Card
                    key={config.id}
                    className={`card-hover relative border-0 bg-[#f5f5f7] shadow-none ${
                      isRecommended ? "ring-2 ring-black" : ""
                    }`}
                  >
                    {isRecommended && (
                      <Badge className="absolute -top-2 left-4 rounded-full bg-black text-white">
                        推荐
                      </Badge>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-black">{config.name}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-black">
                          {formatPrice(config.actualTotalPrice)}
                        </span>
                        <span
                          className={`text-xs ${
                            config.budgetDiff > 0 ? "text-amber-600" : "text-black/70"
                          }`}
                        >
                          {config.budgetDiff > 0
                            ? `超预算 ${formatPrice(config.budgetDiff)}`
                            : `省 ${formatPrice(Math.abs(config.budgetDiff))}`}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(config.components).map(([key, hw]) => {
                        if (!hw) return null
                        const Icon = CATEGORY_ICONS[key.toUpperCase()] || Cpu
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between border-b border-black/5 pb-2 text-sm last:border-0"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0 text-black/60" />
                              <span className="text-xs text-black/60">
                                {CATEGORY_LABELS[key.toUpperCase()] || key}
                              </span>
                              <span className="truncate text-black">
                                {hw.brand} {hw.model}
                              </span>
                            </div>
                            <span className="ml-2 shrink-0 font-mono text-xs text-black">
                              {formatPrice(hw.price)}
                            </span>
                          </div>
                        )
                      })}
                      {config.description && (
                        <p className="mt-3 rounded-xl bg-white p-3 text-xs text-black/60">
                          {config.description}
                        </p>
                      )}
                      <Button
                        onClick={() => handleUseConfig(config)}
                        className="mt-3 w-full rounded-full bg-black text-white hover:bg-black/80"
                        size="sm"
                      >
                        用这套装机
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* 预算分配饼图 */}
            {pieData.length > 0 && (
              <Card className="mt-8 border-0 bg-[#f5f5f7] shadow-none">
                <CardHeader>
                  <CardTitle className="text-black">预算分配建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e5e7",
                            borderRadius: "12px",
                            color: "#1d1d1f",
                          }}
                          formatter={(value: any) => [`${value}%`, "占比"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
