// 性能评估引擎：硬件评分 + 游戏帧数预测
// 基于硬件规格的简化估算模型，仅供参考

export interface HardwareSpec {
  [key: string]: any
}

export interface PerformanceScore {
  overall: number
  cpu: number
  gpu: number
  memory: number
  storage: number
  level: "入门" | "主流" | "中高端" | "高端" | "旗舰"
  bottleneck: string | null
}

export interface GameBenchmark {
  game: string
  icon: string
  fps1080p: number
  fps2k: number
  setting: string
}

// 解析硬件 specs（JSON 字符串）
export function parseSpecs(specsStr: string | null): HardwareSpec {
  if (!specsStr) return {}
  try {
    return JSON.parse(specsStr)
  } catch {
    return {}
  }
}

// CPU 评分（0-100）
export function scoreCPU(specs: HardwareSpec, model: string): number {
  let score = 0

  // 基础分：核心数
  const cores = specs.cores || 4
  score += Math.min(cores * 4, 40)

  // 线程数加成
  const threads = specs.threads || cores * 2
  score += Math.min((threads - cores) * 1.5, 15)

  // 睿频加成
  const boostStr = specs.boostClock || ""
  const boostMatch = boostStr.match(/([\d.]+)/)
  if (boostMatch) {
    const boost = parseFloat(boostMatch[1])
    score += Math.min((boost - 3.0) * 8, 20)
  }

  // TDP 加成（代表性能释放）
  const tdp = specs.tdp || 65
  if (tdp >= 125) score += 10
  else if (tdp >= 105) score += 8
  else if (tdp >= 65) score += 5
  else score += 3

  // 3D缓存加成（游戏性能）
  if (specs.cache && specs.cache.includes("3D")) score += 8

  // 型号关键词微调
  if (model.includes("X3D")) score += 5
  if (model.includes("K") || model.includes("X")) score += 3
  if (model.includes("i9") || model.includes("R9")) score += 5
  if (model.includes("i3") || model.includes("R3")) score -= 5

  return Math.min(100, Math.max(10, Math.round(score)))
}

// GPU 评分（0-100）
export function scoreGPU(specs: HardwareSpec, model: string): number {
  let score = 0

  // CUDA核心/流处理器
  const cuda = specs.cudaCores || specs.streamProcessors || 1024
  score += Math.min((cuda / 256) * 3, 35)

  // 显存
  const vramStr = specs.vram || "8GB"
  const vramMatch = vramStr.match(/([\d.]+)/)
  if (vramMatch) {
    const vram = parseFloat(vramMatch[1])
    score += Math.min(vram * 2.5, 20)
  }

  // 显存类型
  if (vramStr.includes("GDDR7")) score += 8
  else if (vramStr.includes("GDDR6X")) score += 6
  else if (vramStr.includes("GDDR6")) score += 4

  // TDP
  const tdp = specs.tdp || 150
  score += Math.min(tdp / 15, 15)

  // 睿频
  const boostStr = specs.boostClock || ""
  const boostMatch = boostStr.match(/([\d.]+)/)
  if (boostMatch) {
    const boost = parseFloat(boostMatch[1])
    score += Math.min((boost - 1.5) * 5, 12)
  }

  // 型号代际微调
  if (model.includes("5090") || model.includes("5080")) score += 8
  if (model.includes("4090") || model.includes("7900 XTX")) score += 6
  if (model.includes("4080") || model.includes("7900 XT")) score += 4
  if (model.includes("3050") || model.includes("6600") || model.includes("A750")) score -= 5

  return Math.min(100, Math.max(10, Math.round(score)))
}

// 内存评分
export function scoreMemory(specs: HardwareSpec): number {
  let score = 0

  // 容量
  const capStr = specs.capacity || "16GB"
  const capMatch = capStr.match(/([\d.]+)/)
  if (capMatch) {
    const cap = parseFloat(capMatch[1])
    score += Math.min(cap * 2, 40)
  }

  // 频率
  const speedStr = specs.speed || "3200MHz"
  const speedMatch = speedStr.match(/([\d.]+)/)
  if (speedMatch) {
    const speed = parseFloat(speedMatch[1])
    if (speed >= 6000) score += 35
    else if (speed >= 5600) score += 30
    else if (speed >= 4800) score += 25
    else if (speed >= 3600) score += 20
    else if (speed >= 3200) score += 15
    else score += 10
  }

  // 双通道
  if (specs.kit && specs.kit.includes("2x")) score += 15
  else if (specs.moduleCount && specs.moduleCount >= 2) score += 15

  // DDR5 加成
  if (specs.type === "DDR5") score += 10

  return Math.min(100, Math.max(10, Math.round(score)))
}

// 存储评分
export function scoreStorage(specs: HardwareSpec): number {
  let score = 0

  // 容量
  const capStr = specs.capacity || "1TB"
  const capMatch = capStr.match(/([\d.]+)/)
  if (capMatch) {
    const cap = parseFloat(capMatch[1])
    score += Math.min(cap * 15, 35)
  }

  // 接口代次
  const iface = specs.interface || "PCIe 3.0"
  if (iface.includes("5.0")) score += 35
  else if (iface.includes("4.0")) score += 28
  else if (iface.includes("3.0")) score += 20

  // 读写速度
  const readStr = specs.readSpeed || ""
  const readMatch = readStr.match(/([\d.]+)/)
  if (readMatch) {
    const read = parseFloat(readMatch[1])
    score += Math.min(read / 200, 20)
  }

  return Math.min(100, Math.max(10, Math.round(score)))
}

// 综合性能评分
export function evaluatePerformance(components: {
  cpu?: { specs: string | null; model: string } | null
  gpu?: { specs: string | null; model: string } | null
  ram?: { specs: string | null; model: string } | null
  ssd?: { specs: string | null; model: string } | null
}): PerformanceScore {
  const cpuSpecs = parseSpecs(components.cpu?.specs || null)
  const gpuSpecs = parseSpecs(components.gpu?.specs || null)
  const ramSpecs = parseSpecs(components.ram?.specs || null)
  const ssdSpecs = parseSpecs(components.ssd?.specs || null)

  const cpu = components.cpu ? scoreCPU(cpuSpecs, components.cpu.model) : 0
  const gpu = components.gpu ? scoreGPU(gpuSpecs, components.gpu.model) : 0
  const memory = components.ram ? scoreMemory(ramSpecs) : 0
  const storage = components.ssd ? scoreStorage(ssdSpecs) : 0

  // 加权综合：游戏向配置 GPU 权重最高
  const hasGPU = components.gpu !== null && components.gpu !== undefined
  const weights = hasGPU
    ? { cpu: 0.25, gpu: 0.45, memory: 0.15, storage: 0.15 }
    : { cpu: 0.5, gpu: 0, memory: 0.25, storage: 0.25 }

  const overall = Math.round(
    cpu * weights.cpu + gpu * weights.gpu + memory * weights.memory + storage * weights.storage
  )

  // 等级判定
  let level: PerformanceScore["level"] = "入门"
  if (overall >= 85) level = "旗舰"
  else if (overall >= 70) level = "高端"
  else if (overall >= 55) level = "中高端"
  else if (overall >= 40) level = "主流"

  // 瓶颈检测
  let bottleneck: string | null = null
  if (hasGPU && cpu > 0 && gpu > 0) {
    if (cpu - gpu > 25) bottleneck = "GPU 偏弱，高U低显，游戏性能受显卡限制"
    else if (gpu - cpu > 25) bottleneck = "CPU 偏弱，低U高显，游戏帧数受处理器限制"
  }
  if (components.ram && memory < 40 && overall > 50) {
    bottleneck = bottleneck ? bottleneck + "；内存容量/频率偏低" : "内存容量/频率偏低，建议升级"
  }

  return { overall, cpu, gpu, memory, storage, level, bottleneck }
}

// 热门游戏基准数据（基于参考配置 RTX 4060 + i5-12400F 的估算帧数）
const GAME_BASELINES = [
  {
    game: "CS2",
    icon: "🎯",
    setting: "高画质",
    base1080p: 280,
    base2k: 180,
    cpuWeight: 0.55, // CS 系列非常吃 CPU
    gpuWeight: 0.45,
  },
  {
    game: "无畏契约",
    icon: "⚡",
    setting: "高画质",
    base1080p: 350,
    base2k: 220,
    cpuWeight: 0.5,
    gpuWeight: 0.5,
  },
  {
    game: "英雄联盟",
    icon: "⚔️",
    setting: "极高画质",
    base1080p: 400,
    base2k: 300,
    cpuWeight: 0.4,
    gpuWeight: 0.6,
  },
  {
    game: "原神",
    icon: "✨",
    setting: "高画质",
    base1080p: 90,
    base2k: 60,
    cpuWeight: 0.35,
    gpuWeight: 0.65,
  },
  {
    game: "绝地求生",
    icon: "🔫",
    setting: "高画质",
    base1080p: 140,
    base2k: 90,
    cpuWeight: 0.45,
    gpuWeight: 0.55,
  },
  {
    game: "赛博朋克2077",
    icon: "🌆",
    setting: "高画质（无光追）",
    base1080p: 75,
    base2k: 45,
    cpuWeight: 0.3,
    gpuWeight: 0.7,
  },
  {
    game: "永劫无间",
    icon: "🗡️",
    setting: "高画质",
    base1080p: 110,
    base2k: 70,
    cpuWeight: 0.4,
    gpuWeight: 0.6,
  },
  {
    game: "APEX英雄",
    icon: "🎮",
    setting: "高画质",
    base1080p: 160,
    base2k: 100,
    cpuWeight: 0.45,
    gpuWeight: 0.55,
  },
]

// 参考配置评分（RTX 4060 + i5-12400F）
const REF_CPU_SCORE = 55
const REF_GPU_SCORE = 50

// 预测游戏帧数
export function predictGameFPS(
  cpuScore: number,
  gpuScore: number,
  hasGPU: boolean
): GameBenchmark[] {
  if (!hasGPU || cpuScore === 0) {
    return GAME_BASELINES.map((g) => ({
      game: g.game,
      icon: g.icon,
      fps1080p: 0,
      fps2k: 0,
      setting: g.setting,
    }))
  }

  return GAME_BASELINES.map((g) => {
    // 相对参考配置的性能比例
    const cpuRatio = cpuScore / REF_CPU_SCORE
    const gpuRatio = gpuScore / REF_GPU_SCORE

    // 加权性能比（非线性，边际递减）
    const perfRatio1080p = Math.pow(cpuRatio, g.cpuWeight) * Math.pow(gpuRatio, g.gpuWeight)
    const perfRatio2k = Math.pow(cpuRatio, g.cpuWeight * 0.7) * Math.pow(gpuRatio, g.gpuWeight * 1.1)

    // 2K 分辨率对显卡要求更高
    let fps1080p = Math.round(g.base1080p * perfRatio1080p)
    let fps2k = Math.round(g.base2k * perfRatio2k)

    // 上限限制（避免不切实际的高帧数）
    fps1080p = Math.min(fps1080p, g.base1080p * 2.5)
    fps2k = Math.min(fps2k, g.base2k * 2.5)

    return {
      game: g.game,
      icon: g.icon,
      fps1080p,
      fps2k,
      setting: g.setting,
    }
  })
}

// 硬件对比参数提取
export function getCompareParams(category: string, specs: HardwareSpec): { label: string; value: string }[] {
  const params: { label: string; value: string }[] = []

  switch (category) {
    case "CPU":
      params.push({ label: "核心/线程", value: `${specs.cores || "-"}核${specs.threads || "-"}线程` })
      params.push({ label: "基础频率", value: specs.baseClock || "-" })
      params.push({ label: "睿频", value: specs.boostClock || "-" })
      params.push({ label: "TDP", value: specs.tdp ? `${specs.tdp}W` : "-" })
      params.push({ label: "插槽", value: specs.socket || "-" })
      params.push({ label: "核显", value: specs.hasGraphics ? specs.igpu || "有" : "无" })
      if (specs.cache) params.push({ label: "缓存", value: specs.cache })
      break

    case "GPU":
      params.push({ label: "显存", value: specs.vram || "-" })
      params.push({ label: "核心数", value: specs.cudaCores ? `${specs.cudaCores} CUDA` : specs.streamProcessors ? `${specs.streamProcessors} SP` : "-" })
      params.push({ label: "基础频率", value: specs.baseClock || "-" })
      params.push({ label: "睿频", value: specs.boostClock || "-" })
      params.push({ label: "TDP", value: specs.tdp ? `${specs.tdp}W` : "-" })
      params.push({ label: "接口", value: specs.interface || "-" })
      params.push({ label: "长度", value: specs.length ? `${specs.length}mm` : "-" })
      break

    case "MOBO":
      params.push({ label: "芯片组", value: specs.chipset || "-" })
      params.push({ label: "插槽", value: specs.socket || "-" })
      params.push({ label: "板型", value: specs.formFactor || "-" })
      params.push({ label: "内存类型", value: specs.memoryType || "-" })
      params.push({ label: "内存插槽", value: specs.memorySlots ? `${specs.memorySlots}个` : "-" })
      params.push({ label: "M.2接口", value: specs.m2Slots ? `${specs.m2Slots}个` : "-" })
      params.push({ label: "WiFi", value: specs.wifi ? "有" : "无" })
      break

    case "RAM":
      params.push({ label: "容量", value: specs.capacity || "-" })
      params.push({ label: "类型", value: specs.type || "-" })
      params.push({ label: "频率", value: specs.speed || "-" })
      params.push({ label: "套装", value: specs.kit || "-" })
      params.push({ label: "时序", value: specs.latency || "-" })
      params.push({ label: "电压", value: specs.voltage || "-" })
      params.push({ label: "RGB", value: specs.rgb ? "有" : "无" })
      break

    case "SSD":
      params.push({ label: "容量", value: specs.capacity || "-" })
      params.push({ label: "接口", value: specs.interface || "-" })
      params.push({ label: "协议", value: specs.protocol || "-" })
      params.push({ label: "读取速度", value: specs.readSpeed || "-" })
      params.push({ label: "写入速度", value: specs.writeSpeed || "-" })
      params.push({ label: "质保", value: specs.warranty || "-" })
      break

    case "PSU":
      params.push({ label: "额定功率", value: specs.wattage ? `${specs.wattage}W` : "-" })
      params.push({ label: "认证", value: specs.certification || "-" })
      params.push({ label: "模组", value: specs.modular || "-" })
      params.push({ label: "风扇", value: specs.fanSize || "-" })
      params.push({ label: "质保", value: specs.warranty || "-" })
      break

    case "CASE":
      params.push({ label: "支持板型", value: specs.formFactor || "-" })
      params.push({ label: "显卡限长", value: specs.maxGpuLength ? `${specs.maxGpuLength}mm` : "-" })
      params.push({ label: "散热器限高", value: specs.maxCoolerHeight ? `${specs.maxCoolerHeight}mm` : "-" })
      params.push({ label: "风扇位", value: specs.fanSlots ? `${specs.fanSlots}个` : "-" })
      params.push({ label: "侧板", value: specs.sidePanel || "-" })
      params.push({ label: "颜色", value: specs.color || "-" })
      break

    case "COOLER":
      params.push({ label: "类型", value: specs.type || "-" })
      params.push({ label: "支持插槽", value: specs.sockets ? specs.sockets.join("/") : "-" })
      params.push({ label: "风扇尺寸", value: specs.fanSize || "-" })
      params.push({ label: "转速", value: specs.fanSpeed || "-" })
      params.push({ label: "噪音", value: specs.noise || "-" })
      if (specs.radiator) params.push({ label: "冷排", value: specs.radiator })
      params.push({ label: "解热能力", value: specs.tdpRating ? `${specs.tdpRating}W` : "-" })
      break
  }

  return params
}
