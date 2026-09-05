// 硬件兼容性检查引擎
// 检查级别：fatal（致命，必须修）、warning（警告，建议改）、info（提示，可选）

export interface Hardware {
  id: number
  category: string
  brand: string
  model: string
  fullName: string
  specs: Record<string, any>
  tdp: number | null
  price: { price: number; shopName: string } | null
}

export interface Components {
  CPU?: Hardware
  GPU?: Hardware
  MOBO?: Hardware
  RAM?: Hardware
  SSD?: Hardware
  PSU?: Hardware
  CASE?: Hardware
  COOLER?: Hardware
}

export interface Issue {
  level: "fatal" | "warning" | "info"
  category: string
  message: string
  suggestion?: string
}

export interface CompatibilityResult {
  score: number
  issues: Issue[]
  summary: string
}

// CPU档位划分（用于高U低显判断）
function getCpuTier(hw: Hardware): number {
  const model = hw.model.toLowerCase()
  if (model.includes("i9") || model.includes("9950") || model.includes("9900") || model.includes("7950")) return 5
  if (model.includes("i7") || model.includes("9800") || model.includes("9700") || model.includes("7800") || model.includes("7700")) return 4
  if (model.includes("i5") || model.includes("9600") || model.includes("7600") || model.includes("7500")) return 3
  if (model.includes("i3") || model.includes("7400") || model.includes("7300")) return 2
  return 2
}

// GPU档位划分
function getGpuTier(hw: Hardware): number {
  const model = hw.model.toLowerCase()
  if (model.includes("4090") || model.includes("5090") || model.includes("7900 xtx")) return 5
  if (model.includes("4080") || model.includes("5080") || model.includes("7900 xt")) return 4
  if (model.includes("4070") || model.includes("5070") || model.includes("7800")) return 3
  if (model.includes("4060") || model.includes("5060") || model.includes("7700") || model.includes("7600")) return 2
  return 1
}

export function checkCompatibility(components: Components): CompatibilityResult {
  const issues: Issue[] = []
  const { CPU, GPU, MOBO, RAM, SSD, PSU, CASE, COOLER } = components

  // ========== 致命检查（fatal） ==========

  // 1. CPU与主板插槽匹配
  if (CPU && MOBO) {
    const cpuSocket = CPU.specs?.socket
    const moboSocket = MOBO.specs?.socket
    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      issues.push({
        level: "fatal",
        category: "插槽兼容",
        message: `CPU插槽（${cpuSocket}）与主板（${moboSocket}）不匹配，无法安装`,
        suggestion: `请选择 ${cpuSocket} 插槽的主板`,
      })
    }
  }

  // 2. 内存类型匹配
  if (RAM && MOBO) {
    const ramType = RAM.specs?.type
    const moboMemoryType = MOBO.specs?.memoryType
    if (ramType && moboMemoryType && ramType !== moboMemoryType) {
      issues.push({
        level: "fatal",
        category: "内存兼容",
        message: `主板支持 ${moboMemoryType} 内存，但你选了 ${ramType}`,
        suggestion: `请选择 ${moboMemoryType} 内存`,
      })
    }
  }

  // 3. 内存条数不超过主板插槽数
  if (RAM && MOBO) {
    const moduleCount = RAM.specs?.moduleCount || 1
    const memorySlots = MOBO.specs?.memorySlots || 4
    if (moduleCount > memorySlots) {
      issues.push({
        level: "fatal",
        category: "内存插槽",
        message: `主板只有 ${memorySlots} 个内存槽，你选了 ${moduleCount} 条内存`,
        suggestion: "减少内存条数或更换更多插槽的主板",
      })
    }
  }

  // 4. 电源功率
  if (PSU) {
    const cpuTdp = CPU?.tdp || 0
    const gpuTdp = GPU?.tdp || 0
    const otherTdp = 50 // 主板/内存/SSD/风扇等
    const totalTdp = cpuTdp + gpuTdp + otherTdp
    const requiredWattage = Math.ceil((totalTdp * 1.3) / 50) * 50 // 向上取整到50W
    const psuWattage = PSU.specs?.wattage || 0

    if (psuWattage < requiredWattage) {
      issues.push({
        level: "fatal",
        category: "电源功率",
        message: `整机满载约 ${totalTdp}W，建议 ${requiredWattage}W 以上电源，当前 ${psuWattage}W 不足`,
        suggestion: `更换为 ${requiredWattage}W 以上电源`,
      })
    }
  }

  // 5. 显卡长度 ≤ 机箱限长
  if (GPU && CASE) {
    const gpuLength = GPU.specs?.length || 0
    const maxGpuLength = CASE.specs?.maxGpuLength || 400
    if (gpuLength > maxGpuLength) {
      issues.push({
        level: "fatal",
        category: "机箱尺寸",
        message: `显卡长 ${gpuLength}mm，机箱限长 ${maxGpuLength}mm，装不下`,
        suggestion: "更换更长限长的机箱或更短的显卡",
      })
    }
  }

  // 6. 散热器高度 ≤ 机箱限高
  if (COOLER && CASE) {
    const coolerHeight = COOLER.specs?.height || 0
    const maxCoolerHeight = CASE.specs?.maxCoolerHeight || 160
    if (coolerHeight > maxCoolerHeight) {
      issues.push({
        level: "fatal",
        category: "机箱尺寸",
        message: `散热器高 ${coolerHeight}mm，机箱限高 ${maxCoolerHeight}mm，侧板盖不上`,
        suggestion: "更换更矮的散热器或更大的机箱",
      })
    }
  }

  // 7. 散热器支持CPU插槽
  if (COOLER && CPU) {
    const cpuSocket = CPU.specs?.socket
    const coolerSockets: string[] = COOLER.specs?.sockets || []
    if (cpuSocket && coolerSockets.length > 0 && !coolerSockets.includes(cpuSocket)) {
      issues.push({
        level: "fatal",
        category: "散热器兼容",
        message: `散热器不支持 ${cpuSocket} 插槽`,
        suggestion: `选择支持 ${cpuSocket} 的散热器`,
      })
    }
  }

  // 8. 无核显CPU必须配显卡
  if (CPU && !GPU) {
    const hasGraphics = CPU.specs?.hasGraphics
    if (hasGraphics === false) {
      issues.push({
        level: "fatal",
        category: "核显检查",
        message: `${CPU.brand} ${CPU.model} 无核显，必须搭配独立显卡才能开机`,
        suggestion: "选择一款独立显卡，或更换带核显的CPU",
      })
    }
  }

  // ========== 警告检查（warning） ==========

  // 9. 高U低显 / 低U高显
  if (CPU && GPU) {
    const cpuTier = getCpuTier(CPU)
    const gpuTier = getGpuTier(GPU)
    if (cpuTier - gpuTier >= 2) {
      issues.push({
        level: "warning",
        category: "搭配合理性",
        message: "高端CPU搭配低端显卡，存在高U低显，游戏性能受显卡限制",
        suggestion: "如果主要玩游戏，建议提升显卡预算",
      })
    }
    if (gpuTier - cpuTier >= 2) {
      issues.push({
        level: "warning",
        category: "搭配合理性",
        message: "高端显卡搭配低端CPU，可能存在CPU瓶颈",
        suggestion: "建议提升CPU档次以发挥显卡性能",
      })
    }
  }

  // 10. 散热器TDP不足
  if (COOLER && CPU) {
    const coolerTdp = COOLER.specs?.tdpRating || 0
    const cpuTdp = CPU.tdp || 0
    if (coolerTdp > 0 && cpuTdp > 0 && coolerTdp < cpuTdp) {
      issues.push({
        level: "warning",
        category: "散热能力",
        message: `散热器标称TDP（${coolerTdp}W）低于CPU TDP（${cpuTdp}W），高负载可能过热`,
        suggestion: `更换 TDP ≥ ${cpuTdp}W 的散热器`,
      })
    }
  }

  // 11. 高端配置电源品质
  if (PSU) {
    const totalPrice = Object.values(components).reduce((sum, h) => sum + (h?.price?.price || 0), 0)
    const certification = PSU.specs?.certification || ""
    if (totalPrice > 800000 && (certification.includes("White") || certification === "")) {
      issues.push({
        level: "warning",
        category: "电源品质",
        message: "高端配置建议使用 80+ Gold 以上电源，当前电源品质偏低",
        suggestion: "更换为 80+ Gold 及以上认证的电源",
      })
    }
  }

  // 12. M.2插槽不足
  if (SSD && MOBO) {
    const formFactor = SSD.specs?.formFactor || ""
    const m2Slots = MOBO.specs?.m2Slots || 2
    if (formFactor.includes("M.2") && m2Slots < 1) {
      issues.push({
        level: "warning",
        category: "存储接口",
        message: "主板M.2插槽数量不足",
        suggestion: "更换有更多M.2插槽的主板",
      })
    }
  }

  // ========== 提示检查（info） ==========

  // 13. 内存频率超过CPU支持
  if (RAM && CPU) {
    const ramSpeed = RAM.specs?.speed || 0
    const maxMemorySpeed = CPU.specs?.maxMemorySpeed || 0
    if (ramSpeed > 0 && maxMemorySpeed > 0 && ramSpeed > maxMemorySpeed) {
      issues.push({
        level: "info",
        category: "内存频率",
        message: `CPU最高支持 ${maxMemorySpeed}MHz 内存，当前 ${ramSpeed}MHz 会自动降频运行`,
        suggestion: "可在BIOS中开启XMP/EXPO尝试超频",
      })
    }
  }

  // 14. 电源余量偏小
  if (PSU) {
    const cpuTdp = CPU?.tdp || 0
    const gpuTdp = GPU?.tdp || 0
    const totalTdp = cpuTdp + gpuTdp + 50
    const requiredWattage = Math.ceil((totalTdp * 1.3) / 50) * 50
    const psuWattage = PSU.specs?.wattage || 0
    const margin = psuWattage - requiredWattage
    if (psuWattage >= requiredWattage && margin < 100) {
      issues.push({
        level: "info",
        category: "升级空间",
        message: `电源余量较小（仅 ${margin}W），未来升级高端显卡可能需要换电源`,
        suggestion: "如果计划未来升级，建议选更大功率电源",
      })
    }
  }

  // 15. 未选满8件
  const selectedCount = Object.values(components).filter(Boolean).length
  if (selectedCount > 0 && selectedCount < 8) {
    issues.push({
      level: "info",
      category: "配置完整度",
      message: `已选 ${selectedCount}/8 件硬件`,
      suggestion: "建议选齐所有硬件以获得完整兼容性报告",
    })
  }

  // ========== 计算评分 ==========
  const fatalCount = issues.filter((i) => i.level === "fatal").length
  const warningCount = issues.filter((i) => i.level === "warning").length
  const infoCount = issues.filter((i) => i.level === "info").length

  let score = 100 - fatalCount * 30 - warningCount * 10 - infoCount * 3
  score = Math.max(0, score)

  // 生成总评
  let summary = ""
  if (fatalCount > 0) {
    summary = `存在 ${fatalCount} 个致命问题，必须修改后才能正常使用`
  } else if (warningCount > 0) {
    summary = `配置基本兼容，有 ${warningCount} 个建议优化项`
  } else if (selectedCount === 8) {
    summary = "配置兼容性良好，可以放心装机"
  } else {
    summary = "继续选择硬件以获得完整评估"
  }

  return { score, issues, summary }
}
