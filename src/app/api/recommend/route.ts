import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 预算分配建议（按用途）
const BUDGET_ALLOCATION: Record<string, Record<string, number>> = {
  gaming: { CPU: 20, GPU: 42, MOBO: 12, RAM: 8, SSD: 8, PSU: 6, CASE: 3, COOLER: 1 },
  office: { CPU: 30, GPU: 10, MOBO: 18, RAM: 15, SSD: 15, PSU: 7, CASE: 5, COOLER: 0 },
  content: { CPU: 28, GPU: 25, MOBO: 12, RAM: 15, SSD: 12, PSU: 5, CASE: 2, COOLER: 1 },
  "3d": { CPU: 22, GPU: 35, MOBO: 10, RAM: 15, SSD: 10, PSU: 5, CASE: 2, COOLER: 1 },
  dev: { CPU: 35, GPU: 15, MOBO: 15, RAM: 18, SSD: 10, PSU: 4, CASE: 2, COOLER: 1 },
  mixed: { CPU: 25, GPU: 30, MOBO: 15, RAM: 12, SSD: 10, PSU: 5, CASE: 2, COOLER: 1 },
}

const USE_CASE_LABELS: Record<string, string> = {
  gaming: "游戏",
  office: "办公",
  content: "视频剪辑",
  "3d": "3D建模",
  dev: "编程开发",
  mixed: "综合",
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const budget = parseInt(searchParams.get("budget") || "6000", 10)
    const useCase = searchParams.get("useCase") || "gaming"
    const priority = searchParams.get("priority") || "value"

    const budgetCents = budget * 100

    // 1. 查询预算范围内的方案
    let configs = await prisma.presetConfig.findMany({
      where: {
        budgetMin: { lte: budgetCents },
        budgetMax: { gte: budgetCents },
        isVerified: true,
      },
      orderBy: { totalPrice: "asc" },
    })

    // 2. 按useCase过滤
    let filtered = configs.filter((c) => c.useCase === useCase)

    // 3. 按priority过滤（如果有）
    if (priority && priority !== "value") {
      const priorityFiltered = filtered.filter((c) => c.priority === priority)
      if (priorityFiltered.length > 0) {
        filtered = priorityFiltered
      }
    }

    // 4. 如果没有匹配的，放宽useCase
    if (filtered.length === 0) {
      filtered = configs
    }

    // 5. 如果还是没有，放宽预算范围，找最接近的
    if (filtered.length === 0) {
      const allConfigs = await prisma.presetConfig.findMany({
        where: { isVerified: true },
      })
      filtered = allConfigs
    }

    // 6. 按与预算的差值绝对值排序，取前3
    filtered.sort((a, b) => {
      const diffA = Math.abs(a.totalPrice - budgetCents)
      const diffB = Math.abs(b.totalPrice - budgetCents)
      return diffA - diffB
    })
    const top3 = filtered.slice(0, 3)

    // 7. 获取每套方案的完整硬件信息
    const configsWithDetails = await Promise.all(
      top3.map(async (config) => {
        const components = JSON.parse(config.components) as Record<string, number>
        const hardwareIds = Object.values(components).filter(Boolean)

        const hardwareList = await prisma.hardware.findMany({
          where: { id: { in: hardwareIds } },
          include: {
            prices: {
              where: { platform: "jd" },
              orderBy: { crawledAt: "desc" },
              take: 1,
            },
          },
        })

        const hardwareMap = new Map(hardwareList.map((h) => [h.id, h]))

        const detailedComponents: Record<string, any> = {}
        let actualTotal = 0
        for (const [key, id] of Object.entries(components)) {
          const hw = hardwareMap.get(id)
          if (hw) {
            const price = hw.prices[0]?.price || 0
            actualTotal += price
            detailedComponents[key] = {
              id: hw.id,
              category: hw.category,
              brand: hw.brand,
              model: hw.model,
              fullName: hw.fullName,
              specs: hw.specs ? JSON.parse(hw.specs) : {},
              tdp: hw.tdp,
              price: price,
              shopName: hw.prices[0]?.shopName,
            }
          }
        }

        return {
          id: config.id,
          name: config.name,
          useCase: config.useCase,
          useCaseLabel: USE_CASE_LABELS[config.useCase] || config.useCase,
          priority: config.priority,
          totalPrice: config.totalPrice,
          actualTotalPrice: actualTotal,
          budgetDiff: actualTotal - budgetCents,
          description: config.description,
          source: config.source,
          components: detailedComponents,
        }
      })
    )

    // 8. 预算分配建议
    const budgetAllocation = BUDGET_ALLOCATION[useCase] || BUDGET_ALLOCATION.mixed

    return NextResponse.json({
      success: true,
      data: {
        configs: configsWithDetails,
        budgetAllocation,
        budget,
        useCase,
        useCaseLabel: USE_CASE_LABELS[useCase] || useCase,
        priority,
      },
    })
  } catch (error) {
    console.error("推荐配置查询失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    )
  }
}
