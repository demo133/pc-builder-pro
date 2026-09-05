import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 生成商城搜索链接
function buildSearchUrl(platform: string, keyword: string): string {
  const encoded = encodeURIComponent(keyword)
  if (platform === "jd") {
    return `https://search.jd.com/Search?keyword=${encoded}&enc=utf-8`
  }
  if (platform === "tmall") {
    return `https://list.tmall.com/search_product.htm?q=${encoded}`
  }
  if (platform === "pdd") {
    return `https://mobile.yangkeduo.com/search_result.html?search_key=${encoded}`
  }
  return "#"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10)

    // 构建查询条件
    const where: any = {}
    if (category) where.category = category
    if (brand) where.brand = brand

    // 价格过滤：基于京东最新价格
    let priceFilteredIds: number[] | null = null
    if (minPrice || maxPrice) {
      const allHardware = await prisma.hardware.findMany({
        where: category ? { category } : undefined,
        include: {
          prices: {
            where: { platform: "jd" },
            orderBy: { crawledAt: "desc" },
            take: 1,
            select: { price: true },
          },
        },
      })
      priceFilteredIds = allHardware
        .filter((h) => {
          const latestPrice = h.prices[0]?.price
          if (!latestPrice) return false
          if (minPrice && latestPrice < parseInt(minPrice) * 100) return false
          if (maxPrice && latestPrice > parseInt(maxPrice) * 100) return false
          return true
        })
        .map((h) => h.id)
      where.id = { in: priceFilteredIds }
    }

    // 查询总数
    const total = await prisma.hardware.count({ where })

    // 分页查询硬件列表，关联京东和淘宝价格
    const list = await prisma.hardware.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: "asc" },
      include: {
        prices: {
          where: { platform: { in: ["jd", "tmall"] } },
          orderBy: { crawledAt: "desc" },
        },
      },
    })

    // 格式化输出
    const formattedList = list.map((item) => {
      // 按平台分组，取每个平台最新一条
      const byPlatform: Record<string, any> = {}
      for (const p of item.prices) {
        if (!byPlatform[p.platform]) {
          byPlatform[p.platform] = p
        }
      }

      const jdPrice = byPlatform["jd"] || null
      const tmallPrice = byPlatform["tmall"] || null

      // 搜索关键词
      const keyword = `${item.brand} ${item.model}`

      // 取最低价作为主价格（兼容旧字段）
      const allPrices = [jdPrice?.price, tmallPrice?.price].filter(Boolean) as number[]
      const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : null
      const lowestPlatform =
        lowestPrice === jdPrice?.price ? "jd" :
        lowestPrice === tmallPrice?.price ? "tmall" : null

      return {
        id: item.id,
        category: item.category,
        brand: item.brand,
        model: item.model,
        fullName: item.fullName,
        specs: item.specs ? JSON.parse(item.specs) : {},
        tdp: item.tdp,
        msrp: item.msrp,
        status: item.status,
        // 兼容旧字段：取最低价
        price: lowestPrice
          ? {
              platform: lowestPlatform,
              shopName: lowestPlatform === "jd" ? jdPrice?.shopName : tmallPrice?.shopName,
              productUrl:
                lowestPlatform === "jd"
                  ? jdPrice?.productUrl || buildSearchUrl("jd", keyword)
                  : tmallPrice?.productUrl || buildSearchUrl("tmall", keyword),
              price: lowestPrice,
              crawledAt:
                lowestPlatform === "jd" ? jdPrice?.crawledAt : tmallPrice?.crawledAt,
            }
          : null,
        // 多平台价格
        prices: {
          jd: jdPrice
            ? {
                shopName: jdPrice.shopName,
                productUrl: jdPrice.productUrl || buildSearchUrl("jd", keyword),
                price: jdPrice.price,
                originalPrice: jdPrice.originalPrice,
                inStock: jdPrice.inStock,
                crawledAt: jdPrice.crawledAt,
              }
            : {
                shopName: "京东搜索",
                productUrl: buildSearchUrl("jd", keyword),
                price: null,
                crawledAt: null,
              },
          tmall: tmallPrice
            ? {
                shopName: tmallPrice.shopName,
                productUrl: tmallPrice.productUrl || buildSearchUrl("tmall", keyword),
                price: tmallPrice.price,
                originalPrice: tmallPrice.originalPrice,
                inStock: tmallPrice.inStock,
                crawledAt: tmallPrice.crawledAt,
              }
            : {
                shopName: "天猫搜索",
                productUrl: buildSearchUrl("tmall", keyword),
                price: null,
                crawledAt: null,
              },
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        list: formattedList,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("硬件列表查询失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "服务器内部错误",
        },
      },
      { status: 500 }
    )
  }
}
