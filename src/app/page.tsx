import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollReveal } from "@/components/ScrollReveal"
import { Counter } from "@/components/Counter"
import {
  ArrowRight,
  Cpu,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Sliders,
  MousePointerClick,
  Zap,
  ChevronDown,
} from "lucide-react"

const FEATURES = [
  {
    icon: Cpu,
    title: "硬件选择",
    desc: "8大硬件分类自由搭配，实时总价计算",
  },
  {
    icon: DollarSign,
    title: "价格监控",
    desc: "京东天猫双平台价格对比，一键跳转",
  },
  {
    icon: Sparkles,
    title: "智能推荐",
    desc: "输入预算和用途，推荐最优配置方案",
  },
  {
    icon: ShieldCheck,
    title: "兼容性检测",
    desc: "15项检查，0-100分评分，高U低显一键识别",
  },
]

const STEPS = [
  { icon: Sliders, title: "设定预算", desc: "输入预算金额和主要用途" },
  { icon: MousePointerClick, title: "选择硬件", desc: "从8大分类中挑选心仪硬件" },
  { icon: ShieldCheck, title: "兼容性检测", desc: "系统自动检查配置是否合理" },
  { icon: Zap, title: "一键装机", desc: "导出配置清单，直接下单购买" },
]

const CONFIGS = [
  {
    name: "办公主机",
    price: "¥3,033",
    desc: "i5-14400 核显方案",
    tag: "3000元",
  },
  {
    name: "游戏主机",
    price: "¥5,932",
    desc: "R5 7500F + RTX 4060",
    tag: "6000元",
  },
  {
    name: "高端游戏",
    price: "¥10,282",
    desc: "7800X3D + RTX 4070 Super",
    tag: "10000元",
  },
]

export default function Home() {
  return (
    <div className="page-enter min-h-screen bg-white text-black">
      {/* Hero - 苹果风格大标题 */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-32 text-center">
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium text-black/60">
            DIY 装机，从这里开始
          </div>
          <h1 className="animate-fade-in-up delay-100 headline-xl mb-6 text-black">
            专业的 PC 硬件
            <br />
            <span className="gradient-text">选型助手</span>
          </h1>
          <p className="animate-fade-in-up delay-200 mx-auto mb-10 max-w-xl text-lg text-black/70">
            智能兼容性检查、实时价格监控、预算配置推荐
            <br />
            让每一分钱都花在刀刃上
          </p>
          <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-black px-8 text-white hover:bg-black/80 hover:shadow-lg hover:shadow-black/10"
            >
              <Link href="/builder">
                开始装机
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-black/10 bg-white px-8 text-black hover:bg-black/5"
            >
              <Link href="/recommend">按预算推荐</Link>
            </Button>
          </div>

          {/* 向下滚动提示 */}
          <div className="animate-fade-in-up delay-500 mt-20 flex justify-center">
            <ChevronDown className="h-6 w-6 animate-bounce text-black/70" />
          </div>
        </div>
      </section>

      {/* 数据统计 - 极简数字 */}
      <section className="border-y border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-black/5">
          {[
            { num: 241, suffix: "+", label: "硬件型号" },
            { num: 15, suffix: "", label: "兼容性检查" },
            { num: 3, suffix: "", label: "预置方案" },
          ].map((item, i) => (
            <div key={i} className="px-6 py-16 text-center">
              <div className="headline-lg text-black">
                <Counter end={item.num} suffix={item.suffix} />
              </div>
              <div className="mt-2 text-sm text-black/70">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 核心功能 - 大卡片 */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="headline-lg mb-4 text-black">四大核心能力</h2>
              <p className="text-black/70">覆盖装机全流程</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <Link href={index % 2 === 0 ? "/builder" : "/recommend"}>
                    <Card className="card-hover h-full border-0 bg-[#f5f5f7] shadow-none">
                      <CardContent className="p-10">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-black">
                          {feature.title}
                        </h3>
                        <p className="text-black/70">{feature.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 使用流程 - 横向步骤 */}
      <section className="bg-[#f5f5f7] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="headline-lg mb-4 text-black">四步完成装机</h2>
              <p className="text-black/70">简单流程，小白也能轻松上手</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={step.title} delay={index * 100}>
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-black/60">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-black">
                      {step.title}
                    </h3>
                    <p className="text-sm text-black/70">{step.desc}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 热门配置 - 三列卡片 */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="headline-lg mb-4 text-black">热门配置方案</h2>
              <p className="text-black/70">经过验证的高性价比配置</p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-3">
            {CONFIGS.map((config, index) => (
              <ScrollReveal key={config.name} delay={index * 100}>
                <Card className="card-hover h-full border-0 bg-[#f5f5f7] shadow-none">
                  <CardContent className="p-8">
                    <div className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      {config.tag}
                    </div>
                    <h3 className="mb-1 text-xl font-semibold text-black">
                      {config.name}
                    </h3>
                    <p className="mb-4 text-sm text-black/70">{config.desc}</p>
                    <div className="mb-6 text-2xl font-bold text-black">
                      {config.price}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-black/10 hover:bg-black hover:text-white"
                    >
                      <Link href="/recommend">查看详情</Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - 全屏黑色区块 */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <ScrollReveal>
            <h2 className="headline-lg mb-6 text-white">
              准备好开始装机了吗？
            </h2>
            <p className="mb-10 text-white/50">
              立即使用智能选型工具，打造属于你的完美配置
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-8 text-black hover:bg-white/90"
            >
              <Link href="/builder">
                立即开始
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* 底部 */}
      <footer className="border-t border-black/5 bg-[#f5f5f7] py-10 text-center text-sm text-black/60">
        <p>PC Builder — 让 DIY 装机更简单</p>
        <p className="mt-1 text-xs">价格数据仅供参考，下单前请以实际平台为准</p>
      </footer>
    </div>
  )
}
