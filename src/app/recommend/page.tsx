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
  Legend,
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
  CPU: "CPU",
  GPU: "显卡",
  MOBO: "主板",
  RAM: "内存",
  SSD: "固态",
  PSU: "电源",
  CASE: "机箱",
  COOLER: "散热",
}

const CATEGORY_ICONS: Record<string, any> = {
  CPU: Cpu,
  GPU: Monitor,
  MOBO: CircuitBoard,
  RAM: MemoryStick,
  SSD: HardDrive,
  PSU: Zap,
  CASE: Box,
  COOLER: Fan,
}

const PIE_COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#6366f1",
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

  // 滑块拖动：实时更新预算和输入框
  const handleSliderChange = (value: number[]) => {
    const v = value[0]
    setBudget(v)
    setBudgetInput(String(v))
  }

  // 输入框：自由输入，不限制
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "")
    setBudgetInput(val)
  }

  // 输入框失焦：限制范围并同步
  const handleInputBlur = () => {
    let v = parseInt(budgetInput) || 6000
    v = Math.max(2000, Math.min(20000, v))
    // 对齐到100的整数倍
    v = Math.round(v / 100) * 100
    setBudget(v)
    setBudgetInput(String(v))
  }

  // 快捷预算按钮
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

  // 用这套装机：跳转builder并传硬件ID
  const handleUseConfig = (config: ConfigResult) => {
    const params = new URLSearchParams()
    for (const [key, hw] of Object.entries(config.components)) {
      if (hw?.id) {
        params.set(key.toLowerCase(), String(hw.id))
      }
    }
    router.push(`/builder?${params.toString()}`)
  }

  // 饼图数据
  const pieData = Object.entries(budgetAllocation).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    value,
  }))

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部标题 */}
      <div className="border-b border-slate-700/50 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">预算配置推荐</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            输入预算和用途，智能推荐最优配置方案
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4">
        {/* 输入区 */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="space-y-6 p-6">
            {/* 预算滑块 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Wallet className="h-4 w-4 text-cyan-400" />
                  预算金额
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">¥</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={budgetInput}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="w-32 text-center font-mono text-lg font-bold text-cyan-400"
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
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>¥2,000</span>
                <span>¥20,000</span>
              </div>
              {/* 快捷预算按钮 */}
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_BUDGETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleQuickBudget(v)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      budget === v
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    ¥{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途选择 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                主要用途
              </label>
              <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc) => (
                  <Button
                    key={uc.value}
                    size="sm"
                    variant={useCase === uc.value ? "default" : "outline"}
                    onClick={() => setUseCase(uc.value)}
                  >
                    {uc.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 偏好选择 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                偏好倾向
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <Button
                    key={p.value}
                    size="sm"
                    variant={priority === p.value ? "secondary" : "outline"}
                    onClick={() => setPriority(p.value)}
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
              className="w-full bg-cyan-500 hover:bg-cyan-600"
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
              <Skeleton key={i} className="h-96 w-full rounded-xl" />
            ))}
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/50 p-12 text-center">
            <p className="text-slate-400">没有找到匹配的配置方案，试试调整预算或用途</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <h2 className="mt-8 mb-4 text-lg font-semibold text-white">
              为你推荐 {results.length} 套方案
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {results.map((config, index) => {
                const labels = ["丐版方案", "均衡方案", "加钱方案"]
                const isRecommended = index === 1
                return (
                  <Card
                    key={config.id}
                    className={`card-hover relative border-slate-700 bg-slate-800/50 ${
                      isRecommended ? "ring-2 ring-cyan-500/50" : ""
                    }`}
                  >
                    {isRecommended && (
                      <Badge className="absolute -top-2 left-4 bg-cyan-500 text-white">
                        推荐
                      </Badge>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white">{config.name}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-cyan-400">
                          {formatPrice(config.actualTotalPrice)}
                        </span>
                        <span
                          className={`text-xs ${
                            config.budgetDiff > 0 ? "text-amber-400" : "text-emerald-400"
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
                            className="flex items-center justify-between border-b border-slate-700/30 pb-2 text-sm last:border-0"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="text-xs text-slate-400">
                                {CATEGORY_LABELS[key.toUpperCase()] || key}
                              </span>
                              <span className="truncate text-white">
                                {hw.brand} {hw.model}
                              </span>
                            </div>
                            <span className="ml-2 shrink-0 font-mono text-xs text-emerald-400">
                              {formatPrice(hw.price)}
                            </span>
                          </div>
                        )
                      })}
                      {config.description && (
                        <p className="mt-3 rounded-lg bg-slate-700/30 p-2 text-xs text-slate-300">
                          {config.description}
                        </p>
                      )}
                      <Button
                        onClick={() => handleUseConfig(config)}
                        className="mt-3 w-full bg-cyan-500 hover:bg-cyan-600"
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
              <Card className="mt-8 border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">预算分配建议</CardTitle>
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
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
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
