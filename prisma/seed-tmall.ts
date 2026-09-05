// 补充淘宝参考价脚本
// 运行：node_modules\.bin\tsx prisma/seed-tmall.ts
// 给所有已有京东价的硬件添加一条淘宝参考价（京东价 * 0.97，模拟淘宝略便宜）

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("开始补充淘宝参考价...")

  // 查询所有有京东价的硬件
  const hardwareList = await prisma.hardware.findMany({
    include: {
      prices: {
        where: { platform: "jd" },
        orderBy: { crawledAt: "desc" },
        take: 1,
      },
    },
  })

  let added = 0
  let skipped = 0

  for (const hw of hardwareList) {
    const jdPrice = hw.prices[0]
    if (!jdPrice) {
      skipped++
      continue
    }

    // 检查是否已有淘宝价
    const existingTmall = await prisma.price.findFirst({
      where: { hardwareId: hw.id, platform: "tmall" },
    })
    if (existingTmall) {
      skipped++
      continue
    }

    // 淘宝参考价 = 京东价 * 0.97（向下取整到元）
    const tmallPrice = Math.floor((jdPrice.price * 0.97) / 100) * 100
    const keyword = `${hw.brand} ${hw.model}`

    await prisma.price.create({
      data: {
        hardwareId: hw.id,
        platform: "tmall",
        shopName: "天猫参考价",
        productUrl: `https://list.tmall.com/search_product.htm?q=${encodeURIComponent(keyword)}`,
        price: tmallPrice,
        originalPrice: jdPrice.originalPrice || null,
        inStock: true,
        crawledAt: new Date(),
      },
    })
    added++
    console.log(`  ✓ ${hw.brand} ${hw.model}: 京东 ¥${(jdPrice.price / 100).toFixed(0)} → 天猫 ¥${(tmallPrice / 100).toFixed(0)}`)
  }

  console.log(`\n完成：新增 ${added} 条淘宝价，跳过 ${skipped} 条（无京东价或已存在）`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
