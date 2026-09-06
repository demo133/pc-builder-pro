"use client"

export interface ParsedHardware {
  category: string
  rawText: string
  matchedModel?: string
  matchedId?: number
  confidence: number // 0-100
}

export interface ParseResult {
  items: ParsedHardware[]
  rawText: string
}

// 品类关键词映射
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  CPU: ["cpu", "处理器", "u ", "u：", "u:", "intel", "amd", "i3", "i5", "i7", "i9", "r3", "r5", "r7", "r9", "锐龙", "酷睿"],
  GPU: ["gpu", "显卡", "显示卡", "nvidia", "rtx", "gtx", "rx", "radeon", "geforce"],
  MOBO: ["主板", "mobo", "motherboard", "板U", "板u", "华硕", "微星", "技嘉", "b760", "b650", "z790", "x670", "h610", "a620"],
  RAM: ["内存", "ram", "内存条", "ddr4", "ddr5", "金士顿", "威刚", "芝奇", "海盗船", "英睿达"],
  SSD: ["固态", "ssd", "硬盘", "nvme", "m.2", "m2", "三星", "西数", "铠侠", "致态", "长江存储"],
  PSU: ["电源", "psu", "power", "瓦", "w ", "w：", "w:", "金牌", "铜牌", "白金", "钛金", "海韵", "振华", "酷冷"],
  CASE: ["机箱", "case", "机箱", "先马", "爱国者", "联力", "追风者", "乔思伯", "分型工艺"],
  COOLER: ["散热", "cooler", "风冷", "水冷", "散热器", "利民", "猫头鹰", "九州风神", "酷冷至尊", "240", "360"],
}

// 计算字符串相似度（编辑距离）
function similarity(a: string, b: string): number {
  const shorter = a.length < b.length ? a : b
  const longer = a.length < b.length ? b : a
  if (longer.length === 0) return 1.0

  const costs: number[] = []
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[shorter.length] = lastValue
  }
  return (longer.length - costs[shorter.length]) / longer.length
}

// 从文本行中提取型号名称
function extractModelFromLine(line: string): string {
  // 移除常见前缀
  let model = line.trim()
  // 移除品类标签
  const prefixes = [
    /^[【\[]?[\s]*(cpu|处理器|显卡|gpu|主板|内存|固态|ssd|硬盘|电源|机箱|散热|散热器)[\s]*[】\]:：]?/i,
    /^[\d]+[\.、\s]+/,
    /^[一二三四五六七八九十]+[\.、\s]+/,
  ]
  for (const re of prefixes) {
    model = model.replace(re, "")
  }
  // 移除价格、链接等后缀
  model = model.split(/[¥￥$]/)[0]
  model = model.split(/https?:\/\//)[0]
  model = model.split(/\d+元/)[0]
  model = model.trim()
  return model
}

// 判断一行属于哪个品类
function detectCategory(line: string): string | null {
  const lower = line.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return category
      }
    }
  }
  return null
}

// 在硬件库中模糊匹配
function matchHardware(
  modelText: string,
  category: string,
  hardwareList: { id: number; category: string; brand: string; model: string; fullName: string }[]
): { matchedModel: string; matchedId: number; confidence: number } | null {
  const candidates = hardwareList.filter((h) => h.category === category)
  if (candidates.length === 0) return null

  const query = modelText.toLowerCase().replace(/\s+/g, "")
  let bestMatch: { matchedModel: string; matchedId: number; confidence: number } | null = null

  for (const hw of candidates) {
    const target = (hw.brand + " " + hw.model).toLowerCase().replace(/\s+/g, "")
    const modelOnly = hw.model.toLowerCase().replace(/\s+/g, "")

    // 精确包含匹配
    if (target.includes(query) || query.includes(target)) {
      const conf = Math.min(95, 70 + Math.min(query.length, target.length) * 2)
      if (!bestMatch || conf > bestMatch.confidence) {
        bestMatch = { matchedModel: hw.brand + " " + hw.model, matchedId: hw.id, confidence: conf }
      }
      continue
    }

    // 型号部分匹配
    if (modelOnly.includes(query) || query.includes(modelOnly)) {
      const conf = Math.min(90, 60 + Math.min(query.length, modelOnly.length) * 2)
      if (!bestMatch || conf > bestMatch.confidence) {
        bestMatch = { matchedModel: hw.brand + " " + hw.model, matchedId: hw.id, confidence: conf }
      }
      continue
    }

    // 相似度匹配
    const sim = similarity(query, target)
    if (sim > 0.6) {
      const conf = Math.round(sim * 80)
      if (!bestMatch || conf > bestMatch.confidence) {
        bestMatch = { matchedModel: hw.brand + " " + hw.model, matchedId: hw.id, confidence: conf }
      }
    }
  }

  return bestMatch
}

/**
 * 从文本中解析硬件配置
 * @param text 用户粘贴的配置文本
 * @param hardwareList 硬件库列表（用于匹配）
 */
export function parseConfigText(
  text: string,
  hardwareList: { id: number; category: string; brand: string; model: string; fullName: string }[]
): ParseResult {
  const lines = text.split(/[\n\r]+/).filter((l) => l.trim().length > 0)
  const items: ParsedHardware[] = []
  const usedCategories = new Set<string>()

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length < 2) continue

    // 跳过纯标题行
    if (/^(配置单|配置清单|电脑配置|装机配置|我的配置)/.test(trimmed)) continue

    const category = detectCategory(trimmed)
    if (!category) continue
    if (usedCategories.has(category)) continue // 每个品类只取第一个

    const modelText = extractModelFromLine(trimmed)
    if (modelText.length < 2) continue

    const match = matchHardware(modelText, category, hardwareList)

    items.push({
      category,
      rawText: trimmed,
      matchedModel: match?.matchedModel,
      matchedId: match?.matchedId,
      confidence: match?.confidence ?? 0,
    })
    usedCategories.add(category)
  }

  return { items, rawText: text }
}

/**
 * 导出配置为多种格式
 */
export function exportConfig(
  components: Record<string, { brand: string; model: string; specs: Record<string, any>; price?: { price: number } | null } | undefined>,
  totalPrice: number,
  format: "txt" | "json" | "csv" | "md"
): { content: string; filename: string; mimeType: string } {
  const categoryLabels: Record<string, string> = {
    CPU: "CPU 处理器",
    GPU: "显卡",
    MOBO: "主板",
    RAM: "内存",
    SSD: "固态硬盘",
    PSU: "电源",
    CASE: "机箱",
    COOLER: "散热器",
  }

  const date = new Date().toISOString().slice(0, 10)
  const formatPrice = (cents?: number) => (cents ? `¥${(cents / 100).toFixed(2)}` : "暂无价")

  if (format === "json") {
    const data = {
      generatedAt: new Date().toISOString(),
      totalPrice: totalPrice,
      components: Object.entries(components).map(([key, hw]) => ({
        category: key,
        categoryLabel: categoryLabels[key] || key,
        brand: hw?.brand,
        model: hw?.model,
        specs: hw?.specs,
        price: hw?.price?.price,
      })),
    }
    return {
      content: JSON.stringify(data, null, 2),
      filename: `PC配置_${date}.json`,
      mimeType: "application/json",
    }
  }

  if (format === "csv") {
    const rows = ["品类,品牌,型号,价格"]
    for (const [key, hw] of Object.entries(components)) {
      if (!hw) continue
      rows.push(`${categoryLabels[key] || key},${hw.brand},${hw.model},${hw.price?.price ? (hw.price.price / 100).toFixed(2) : ""}`)
    }
    rows.push(`合计,,,${(totalPrice / 100).toFixed(2)}`)
    return {
      content: "\uFEFF" + rows.join("\n"), // BOM for Excel
      filename: `PC配置_${date}.csv`,
      mimeType: "text/csv",
    }
  }

  if (format === "md") {
    let md = `# PC 配置清单\n\n`
    md += `> 生成时间：${new Date().toLocaleString("zh-CN")}\n\n`
    md += `| 品类 | 型号 | 价格 |\n`
    md += `|------|------|------|\n`
    for (const [key, hw] of Object.entries(components)) {
      if (!hw) continue
      md += `| ${categoryLabels[key] || key} | ${hw.brand} ${hw.model} | ${formatPrice(hw.price?.price)} |\n`
    }
    md += `| **合计** | | **${formatPrice(totalPrice)}** |\n\n`
    md += `---\n*价格仅供参考，以实际商城为准*\n`
    return {
      content: md,
      filename: `PC配置_${date}.md`,
      mimeType: "text/markdown",
    }
  }

  // TXT 默认
  const lines: string[] = []
  lines.push("=" .repeat(40))
  lines.push("         PC 配置清单")
  lines.push("=" .repeat(40))
  lines.push("")
  for (const [key, hw] of Object.entries(components)) {
    if (!hw) continue
    lines.push(`【${categoryLabels[key] || key}】`)
    lines.push(`  型号: ${hw.brand} ${hw.model}`)
    if (hw.price?.price) lines.push(`  价格: ${formatPrice(hw.price.price)}`)
    lines.push("")
  }
  lines.push("-".repeat(40))
  lines.push(`  配置总价: ${formatPrice(totalPrice)}`)
  lines.push("-".repeat(40))
  lines.push("")
  lines.push(`生成时间: ${new Date().toLocaleString("zh-CN")}`)
  lines.push("价格仅供参考，以实际商城为准")

  return {
    content: lines.join("\n"),
    filename: `PC配置_${date}.txt`,
    mimeType: "text/plain",
  }
}
