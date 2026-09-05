import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ScrollReveal"
import { Counter } from "@/components/Counter"
import { ParallaxGlow } from "@/components/ParallaxGlow"
import {
  Cpu,
  Monitor,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  MousePointerClick,
  Sliders,
  Zap,
} from "lucide-react"

const FEATURES = [
  {
    icon: Cpu,
    title: "硬件选择切换",
    desc: "8大硬件分类自由搭配，实时总价计算，所见即所得",
    color: "cyan",
    href: "/builder",
  },
  {
    icon: DollarSign,
    title: "实时价格监控",
    desc: "京东天猫价格对比，历史价格曲线，帮你判断最佳入手时机",
    color: "emerald",
    href: "/prices",
  },
  {
    icon: Sparkles,
    title: "预算配置推荐",
    desc: "输入预算和用途，智能推荐最优配置方案，小白也不踩坑",
    color: "violet",
    href: "/recommend",
  },
  {
    icon: ShieldCheck,
    title: "兼容性分析",
    desc: "15项兼容性检查，0-100分评分，高U低显一键识别",
    color: "amber",
    href: "/builder",
  },
]

const STEPS = [
  {
    icon: Sliders,
    title: "设定预算",
    desc: "输入你的预算金额和主要用途",
  },
  {
    icon: MousePointerClick,
    title: "选择硬件",
    desc: "从8大分类中挑选心仪硬件",
  },
  {
    icon: ShieldCheck,
    title: "兼容性检测",
    desc: "系统自动检查配置是否合理",
  },
  {
    icon: Zap,
    title: "一键装机",
    desc: "导出配置清单，直接下单购买",
  },
]

const colorMap: Record<string, string> = {
  cyan: "bg-cyan-500/10 text-cyan-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  violet: "bg-violet-500/10 text-violet-400",
  amber: "bg-amber-500/10 text-amber-400",
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero区域 */}
      <section className="relative overflow-hidden">
        {/* 视差背景光晕 */}
        <ParallaxGlow />

        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            <Monitor className="h-4 w-4" />
            DIY 装机，从这里开始
          </div>
          <h1 className="animate-fade-in-up delay-100 mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            专业的 <span className="gradient-text">PC 硬件</span> 选型助手
          </h1>
          <p className="animate-fade-in-up delay-200 mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            智能兼容性检查、实时价格监控、预算配置推荐——让每一分钱都花在刀刃上
          </p>
          <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25">
              <Link href="/builder">
                开始装机
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover:bg-slate-800">
              <Link href="/recommend">按预算推荐</Link>
            </Button>
          </div>

          {/* 数据统计 - 数字计数动画 */}
          <div className="animate-fade-in-up delay-400 mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-white">
                <Counter end={88} suffix="+" />
              </div>
              <div className="mt-1 text-sm text-slate-400">硬件型号</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                <Counter end={15} />
              </div>
              <div className="mt-1 text-sm text-slate-400">兼容性检查项</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                <Counter end={3} />
              </div>
              <div className="mt-1 text-sm text-slate-400">预置配置方案</div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white">核心功能</h2>
            <p className="mt-2 text-sm text-slate-400">四大核心能力，覆盖装机全流程</p>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollReveal key={feature.title} delay={index * 100}>
                <Link href={feature.href}>
                  <Card className="card-hover h-full border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[feature.color]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-400">
                      {feature.desc}
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* 使用流程 */}
      <section className="border-y border-slate-700/50 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-white">四步完成装机</h2>
              <p className="mt-2 text-sm text-slate-400">简单流程，小白也能轻松上手</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={step.title} delay={index * 100}>
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-xs text-slate-400">
                        步骤 {index + 1}
                      </Badge>
                    </div>
                    <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{step.desc}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 热门配置推荐 */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <ScrollReveal>
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">热门配置方案</h2>
              <p className="mt-2 text-sm text-slate-400">经过验证的高性价比配置</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/recommend">
                查看更多
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "3000元办公主机",
              price: "¥3,033",
              desc: "i5-14400核显方案，日常办公网课绰绰有余",
              tag: "办公",
            },
            {
              name: "6000元游戏主机",
              price: "¥5,932",
              desc: "R5 7500F + RTX 4060，1080P高画质畅玩",
              tag: "游戏",
            },
            {
              name: "10000元高端游戏",
              price: "¥10,282",
              desc: "7800X3D + RTX 4070 Super，2K电竞无压力",
              tag: "高端",
            },
          ].map((config, index) => (
            <ScrollReveal key={config.name} delay={index * 100}>
              <Card className="card-hover h-full border-slate-700 bg-slate-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-cyan-500/10 text-cyan-400">{config.tag}</Badge>
                    <div className="text-xl font-bold text-emerald-400">{config.price}</div>
                  </div>
                  <h3 className="mt-3 font-semibold text-white">{config.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{config.desc}</p>
                  <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                    <Link href="/recommend">查看详情</Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ScrollReveal>
          <Card className="card-hover border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-8 sm:flex-row">
              <div>
                <h3 className="text-xl font-bold text-white">准备好开始装机了吗？</h3>
                <p className="mt-1 text-sm text-slate-400">
                  立即使用智能选型工具，打造属于你的完美配置
                </p>
              </div>
              <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25">
                <Link href="/builder">
                  立即开始
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* 底部 */}
      <footer className="border-t border-slate-700/50 py-8 text-center text-sm text-slate-500">
        <p>PC Builder Pro — 让 DIY 装机更简单</p>
        <p className="mt-1 text-xs text-slate-600">价格数据仅供参考，下单前请以实际平台为准</p>
      </footer>
    </div>
  )
}
