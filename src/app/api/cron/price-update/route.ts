import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Vercel Cron 密钥（在 Vercel 环境变量中配置 CRON_SECRET）
const CRON_SECRET = process.env.CRON_SECRET || "pc-builder-cron-secret-2024"

// 每次 Cron 运行处理的硬件数量（Serverless 执行时间有限）
const BATCH_SIZE = 5

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // 验证 Cron 调用
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const startTime = Date.now()
  const results: any[] = []

  try {
    // 1. 查询最久未更新价格的硬件
    const hardwareList = await prisma.hardware.findMany({
      where: { status: "active" },
      orderBy: {
        prices: {
          _count: "asc",
        },
      },
      take: BATCH_SIZE,
      include: {
        prices: {
          where: { platform: "jd" },
          orderBy: { crawledAt: "desc" },
          take: 1,
        },
      },
    })

    console.log(`[Cron] 本次处理 ${hardwareList.length} 款硬件`)

    // 2. 逐个尝试获取京东价格
    for (const hw of hardwareList) {
      try {
        const keyword = encodeURIComponent(`${hw.brand} ${hw.model}`)
        const searchUrl = `https://search.jd.com/Search?keyword=${keyword}&enc=utf-8`

        // 用 fetch 请求京东搜索页（Serverless 环境）
        const response = await fetch(searchUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9",
          },
          signal: AbortSignal.timeout(8000),
        })

        const html = await response.text()

        // 检查是否被反爬
        if (html.includes("访问频繁") || html.includes("无法搜索")) {
          results.push({ model: hw.model, status: "blocked", message: "京东反爬拦截" })
          continue
        }

        // 用正则提取第一个商品的价格
        // 京东价格格式：<i data-price="1234.56">¥1234.56</i> 或 <strong class="J_price">1234.56</strong>
        const priceMatch =
          html.match(/<i[^>]*data-price="([\d.]+)"[^>]*>/) ||
          html.match(/<strong[^>]*class="[^"]*J_price[^"]*"[^>]*>([\d.]+)<\/strong>/) ||
          html.match(/¥\s*([\d.]+)/)

        if (priceMatch && priceMatch[1]) {
          const priceYuan = parseFloat(priceMatch[1])
          const priceFen = Math.round(priceYuan * 100)

          if (priceFen > 0 && priceFen < 10000000) {
            // 删除旧京东价，插入新价格
            await prisma.price.deleteMany({
              where: { hardwareId: hw.id, platform: "jd" },
            })
            await prisma.price.create({
              data: {
                hardwareId: hw.id,
                platform: "jd",
                shopName: "京东实时价",
                productUrl: `https://search.jd.com/Search?keyword=${keyword}`,
                price: priceFen,
                inStock: true,
                crawledAt: new Date(),
              },
            })

            // 更新爬取任务状态
            await prisma.crawlTask.updateMany({
              where: { hardwareId: hw.id, platform: "jd" },
              data: {
                status: "success",
                lastSuccessAt: new Date(),
                lastError: null,
                nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              },
            })

            results.push({
              model: hw.model,
              status: "success",
              price: priceYuan,
              oldPrice: hw.prices[0]?.price ? hw.prices[0].price / 100 : null,
            })
          } else {
            results.push({ model: hw.model, status: "invalid_price", price: priceYuan })
          }
        } else {
          results.push({ model: hw.model, status: "no_price_found" })
        }
      } catch (err: any) {
        results.push({
          model: hw.model,
          status: "error",
          message: err.message?.substring(0, 100),
        })
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    const successCount = results.filter((r) => r.status === "success").length

    console.log(`[Cron] 完成：成功 ${successCount}/${results.length}，耗时 ${duration}s`)

    return NextResponse.json({
      success: true,
      data: {
        processed: results.length,
        success: successCount,
        duration: `${duration}s`,
        results,
      },
    })
  } catch (error: any) {
    console.error("[Cron] 执行失败:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
