import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 硬件数据：8个品类，每类11款，共88款
const hardwareData = [
  // CPU (11款)
  { category: "CPU", brand: "Intel", model: "i3-12100F", fullName: "Intel Core i3-12100F", specs: JSON.stringify({ cores: 4, threads: 8, baseClock: "3.3GHz", boostClock: "4.3GHz", socket: "LGA1700", tdp: 58 }), tdp: 58, msrp: 599 },
  { category: "CPU", brand: "Intel", model: "i5-12400F", fullName: "Intel Core i5-12400F", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "2.5GHz", boostClock: "4.4GHz", socket: "LGA1700", tdp: 65 }), tdp: 65, msrp: 999 },
  { category: "CPU", brand: "Intel", model: "i5-14400", fullName: "Intel Core i5-14400", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "2.5GHz", boostClock: "4.7GHz", socket: "LGA1700", tdp: 65, igpu: "UHD730" }), tdp: 65, msrp: 1299 },
  { category: "CPU", brand: "Intel", model: "i5-14600KF", fullName: "Intel Core i5-14600KF", specs: JSON.stringify({ cores: 14, threads: 20, baseClock: "3.5GHz", boostClock: "5.3GHz", socket: "LGA1700", tdp: 125 }), tdp: 125, msrp: 1999 },
  { category: "CPU", brand: "Intel", model: "i7-14700KF", fullName: "Intel Core i7-14700KF", specs: JSON.stringify({ cores: 20, threads: 28, baseClock: "3.4GHz", boostClock: "5.6GHz", socket: "LGA1700", tdp: 125 }), tdp: 125, msrp: 2999 },
  { category: "CPU", brand: "Intel", model: "i9-14900KF", fullName: "Intel Core i9-14900KF", specs: JSON.stringify({ cores: 24, threads: 32, baseClock: "3.2GHz", boostClock: "6.0GHz", socket: "LGA1700", tdp: 125 }), tdp: 125, msrp: 4299 },
  { category: "CPU", brand: "AMD", model: "R5 5600", fullName: "AMD Ryzen 5 5600", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.5GHz", boostClock: "4.4GHz", socket: "AM4", tdp: 65 }), tdp: 65, msrp: 699 },
  { category: "CPU", brand: "AMD", model: "R5 7500F", fullName: "AMD Ryzen 5 7500F", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.7GHz", boostClock: "5.0GHz", socket: "AM5", tdp: 65 }), tdp: 65, msrp: 949 },
  { category: "CPU", brand: "AMD", model: "R7 7800X3D", fullName: "AMD Ryzen 7 7800X3D", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "4.2GHz", boostClock: "5.0GHz", socket: "AM5", tdp: 120, cache: "96MB 3D V-Cache" }), tdp: 120, msrp: 2299 },
  { category: "CPU", brand: "AMD", model: "R7 9800X3D", fullName: "AMD Ryzen 7 9800X3D", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "4.7GHz", boostClock: "5.2GHz", socket: "AM5", tdp: 120, cache: "96MB 3D V-Cache" }), tdp: 120, msrp: 3299 },
  { category: "CPU", brand: "AMD", model: "R9 7950X", fullName: "AMD Ryzen 9 7950X", specs: JSON.stringify({ cores: 16, threads: 32, baseClock: "4.5GHz", boostClock: "5.7GHz", socket: "AM5", tdp: 170 }), tdp: 170, msrp: 3999 },

  // GPU (11款)
  { category: "GPU", brand: "NVIDIA", model: "RTX 3050", fullName: "NVIDIA GeForce RTX 3050", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 2560, baseClock: "1552MHz", boostClock: "1777MHz", tdp: 130, interface: "PCIe 4.0" }), tdp: 130, msrp: 1499 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4060", fullName: "NVIDIA GeForce RTX 4060", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 3072, baseClock: "1830MHz", boostClock: "2460MHz", tdp: 115, interface: "PCIe 4.0" }), tdp: 115, msrp: 2399 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4060 Ti", fullName: "NVIDIA GeForce RTX 4060 Ti", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 4352, baseClock: "2310MHz", boostClock: "2535MHz", tdp: 160, interface: "PCIe 4.0" }), tdp: 160, msrp: 3199 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4070 Super", fullName: "NVIDIA GeForce RTX 4070 Super", specs: JSON.stringify({ vram: "12GB GDDR6X", cudaCores: 7168, baseClock: "1980MHz", boostClock: "2475MHz", tdp: 220, interface: "PCIe 4.0" }), tdp: 220, msrp: 4799 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4070 Ti Super", fullName: "NVIDIA GeForce RTX 4070 Ti Super", specs: JSON.stringify({ vram: "16GB GDDR6X", cudaCores: 8448, baseClock: "2340MHz", boostClock: "2610MHz", tdp: 285, interface: "PCIe 4.0" }), tdp: 285, msrp: 6299 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5070", fullName: "NVIDIA GeForce RTX 5070", specs: JSON.stringify({ vram: "12GB GDDR7", cudaCores: 6144, baseClock: "2200MHz", boostClock: "2700MHz", tdp: 250, interface: "PCIe 5.0" }), tdp: 250, msrp: 4499 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5080", fullName: "NVIDIA GeForce RTX 5080", specs: JSON.stringify({ vram: "16GB GDDR7", cudaCores: 10752, baseClock: "2370MHz", boostClock: "2820MHz", tdp: 360, interface: "PCIe 5.0" }), tdp: 360, msrp: 8299 },
  { category: "GPU", brand: "AMD", model: "RX 6750 GRE", fullName: "AMD Radeon RX 6750 GRE", specs: JSON.stringify({ vram: "12GB GDDR6", streamProcessors: 2560, baseClock: "1700MHz", boostClock: "2581MHz", tdp: 190, interface: "PCIe 4.0" }), tdp: 190, msrp: 2099 },
  { category: "GPU", brand: "AMD", model: "RX 7700 XT", fullName: "AMD Radeon RX 7700 XT", specs: JSON.stringify({ vram: "12GB GDDR6", streamProcessors: 3456, baseClock: "2100MHz", boostClock: "2544MHz", tdp: 245, interface: "PCIe 4.0" }), tdp: 245, msrp: 3299 },
  { category: "GPU", brand: "AMD", model: "RX 7800 XT", fullName: "AMD Radeon RX 7800 XT", specs: JSON.stringify({ vram: "16GB GDDR6", streamProcessors: 3840, baseClock: "1295MHz", boostClock: "2430MHz", tdp: 263, interface: "PCIe 4.0" }), tdp: 263, msrp: 3999 },
  { category: "GPU", brand: "AMD", model: "RX 7900 XTX", fullName: "AMD Radeon RX 7900 XTX", specs: JSON.stringify({ vram: "24GB GDDR6", streamProcessors: 6144, baseClock: "1900MHz", boostClock: "2500MHz", tdp: 355, interface: "PCIe 4.0" }), tdp: 355, msrp: 6999 },

  // 主板 (11款)
  { category: "MOBO", brand: "华硕", model: "H610M-K", fullName: "华硕 PRIME H610M-K D4", specs: JSON.stringify({ socket: "LGA1700", chipset: "H610", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 549 },
  { category: "MOBO", brand: "微星", model: "B760M-K", fullName: "微星 PRO B760M-K DDR4", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 699 },
  { category: "MOBO", brand: "技嘉", model: "B760M AORUS", fullName: "技嘉 B760M AORUS ELITE AX DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1099 },
  { category: "MOBO", brand: "华硕", model: "B760M-AYW", fullName: "华硕 TUF GAMING B760M-AYW WIFI D5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1199 },
  { category: "MOBO", brand: "微星", model: "Z790-A", fullName: "微星 PRO Z790-A WIFI DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1799 },
  { category: "MOBO", brand: "华硕", model: "ROG B650E-E", fullName: "华硕 ROG STRIX B650E-E GAMING WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650E", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1899 },
  { category: "MOBO", brand: "微星", model: "B650M MORTAR", fullName: "微星 MAG B650M MORTAR WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1199 },
  { category: "MOBO", brand: "技嘉", model: "B650M AORUS", fullName: "技嘉 B650M AORUS ELITE AX", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1099 },
  { category: "MOBO", brand: "华硕", model: "A620M-K", fullName: "华硕 PRIME A620M-K", specs: JSON.stringify({ socket: "AM5", chipset: "A620", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 2, maxMemory: "64GB", pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 599 },
  { category: "MOBO", brand: "微星", model: "X670E ACE", fullName: "微星 MEG X670E ACE", specs: JSON.stringify({ socket: "AM5", chipset: "X670E", formFactor: "E-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 4999 },
  { category: "MOBO", brand: "华硕", model: "ROG X670E HERO", fullName: "华硕 ROG CROSSHAIR X670E HERO", specs: JSON.stringify({ socket: "AM5", chipset: "X670E", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 4499 },

  // 内存 (11款)
  { category: "RAM", brand: "金士顿", model: "FURY 16G DDR4", fullName: "金士顿 FURY Beast 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 299 },
  { category: "RAM", brand: "威刚", model: "XPG 32G DDR4", fullName: "威刚 XPG 龙耀 32GB(16Gx2) DDR4 3600", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3600MHz", kit: "2x16GB", latency: "CL18", voltage: "1.35V", rgb: true }), tdp: null, msrp: 499 },
  { category: "RAM", brand: "金士顿", model: "FURY 32G DDR5", fullName: "金士顿 FURY Beast 32GB(16Gx2) DDR5 5600", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "5600MHz", kit: "2x16GB", latency: "CL36", voltage: "1.25V" }), tdp: null, msrp: 599 },
  { category: "RAM", brand: "芝奇", model: "幻锋戟 32G DDR5", fullName: "芝奇 幻锋戟 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 699 },
  { category: "RAM", brand: "海盗船", model: "复仇者 32G DDR5", fullName: "海盗船 复仇者 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 649 },
  { category: "RAM", brand: "金士顿", model: "FURY 64G DDR5", fullName: "金士顿 FURY Renegade 64GB(32Gx2) DDR5 6400", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6400MHz", kit: "2x32GB", latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 1299 },
  { category: "RAM", brand: "芝奇", model: "皇家戟 32G DDR4", fullName: "芝奇 皇家戟 32GB(16Gx2) DDR4 3600", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3600MHz", kit: "2x16GB", latency: "CL18", voltage: "1.35V", rgb: true }), tdp: null, msrp: 549 },
  { category: "RAM", brand: "光威", model: "天策 16G DDR4", fullName: "光威 天策 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 199 },
  { category: "RAM", brand: "金百达", model: "银爵 32G DDR5", fullName: "金百达 银爵 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 499 },
  { category: "RAM", brand: "威刚", model: "XPG 64G DDR5", fullName: "威刚 XPG 龙耀 64GB(32Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6000MHz", kit: "2x32GB", latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 1199 },
  { category: "RAM", brand: "海盗船", model: "统治者 64G DDR5", fullName: "海盗船 统治者铂金 64GB(32Gx2) DDR5 6600", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6600MHz", kit: "2x32GB", latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 1599 },

  // SSD (11款)
  { category: "SSD", brand: "铠侠", model: "RC20 1TB", fullName: "铠侠 RC20 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", protocol: "NVMe", readSpeed: "2100MB/s", writeSpeed: "1700MB/s", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "SSD", brand: "西数", model: "SN570 1TB", fullName: "西部数据 SN570 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 429 },
  { category: "SSD", brand: "三星", model: "980 1TB", fullName: "三星 980 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "西数", model: "SN770 1TB", fullName: "西部数据 SN770 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "5150MB/s", writeSpeed: "4900MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "三星", model: "990 Pro 1TB", fullName: "三星 990 Pro 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7450MB/s", writeSpeed: "6900MB/s", warranty: "5年" }), tdp: null, msrp: 699 },
  { category: "SSD", brand: "致态", model: "TiPlus7100 1TB", fullName: "致态 TiPlus7100 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7000MB/s", writeSpeed: "6000MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "铠侠", model: "SE10 1TB", fullName: "铠侠 SE10 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6400MB/s", warranty: "5年" }), tdp: null, msrp: 549 },
  { category: "SSD", brand: "西数", model: "SN850X 2TB", fullName: "西部数据 SN850X 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6600MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "三星", model: "990 Pro 2TB", fullName: "三星 990 Pro 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7450MB/s", writeSpeed: "6900MB/s", warranty: "5年" }), tdp: null, msrp: 1299 },
  { category: "SSD", brand: "致态", model: "TiPro7000 2TB", fullName: "致态 TiPro7000 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", protocol: "NVMe", readSpeed: "7400MB/s", writeSpeed: "6700MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "海盗船", model: "MP700 2TB", fullName: "海盗船 MP700 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 5.0 x4", protocol: "NVMe", readSpeed: "10000MB/s", writeSpeed: "8500MB/s", warranty: "5年" }), tdp: null, msrp: 1799 },

  // 电源 (11款)
  { category: "PSU", brand: "航嘉", model: "WD500K", fullName: "航嘉 WD500K 500W 金牌全模组", specs: JSON.stringify({ wattage: 500, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 299 },
  { category: "PSU", brand: "长城", model: "X6", fullName: "长城 X6 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "PSU", brand: "振华", model: "LEADEX III 650", fullName: "振华 LEADEX III 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 449 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-650", fullName: "海韵 FOCUS GX-650 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 549 },
  { category: "PSU", brand: "海盗船", model: "RM750e", fullName: "海盗船 RM750e 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 599 },
  { category: "PSU", brand: "华硕", model: "TUF 750W", fullName: "华硕 TUF GAMING 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 599 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-850", fullName: "海韵 FOCUS GX-850 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 699 },
  { category: "PSU", brand: "海盗船", model: "RM850x", fullName: "海盗船 RM850x 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 749 },
  { category: "PSU", brand: "振华", model: "LEADEX VP 1000", fullName: "振华 LEADEX VP 1000W 白金全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "5年" }), tdp: null, msrp: 899 },
  { category: "PSU", brand: "海韵", model: "PRIME TX-1000", fullName: "海韵 PRIME TX-1000 1000W 钛金全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS钛金", modular: "全模组", fanSize: "135mm", warranty: "12年" }), tdp: null, msrp: 1599 },
  { category: "PSU", brand: "华硕", model: "ROG THOR 1200", fullName: "华硕 ROG THOR 1200P2 1200W 白金全模组", specs: JSON.stringify({ wattage: 1200, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "10年", oled: true }), tdp: null, msrp: 2299 },

  // 机箱 (11款)
  { category: "CASE", brand: "先马", model: "平头哥M1", fullName: "先马 平头哥M1 电竞版", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "350mm", maxCoolerHeight: "160mm", fanSlots: 6, color: "黑色" }), tdp: null, msrp: 159 },
  { category: "CASE", brand: "航嘉", model: "GS400C", fullName: "航嘉 GS400C 暗夜猎手5", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "340mm", maxCoolerHeight: "165mm", fanSlots: 6, color: "黑色" }), tdp: null, msrp: 199 },
  { category: "CASE", brand: "爱国者", model: "YOGO M2", fullName: "爱国者 YOGO M2 钛灰色", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: "350mm", maxCoolerHeight: "160mm", fanSlots: 6, color: "钛灰" }), tdp: null, msrp: 219 },
  { category: "CASE", brand: "九州风神", model: "魔方310", fullName: "九州风神 魔方310", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "360mm", maxCoolerHeight: "170mm", fanSlots: 7, color: "黑色" }), tdp: null, msrp: 299 },
  { category: "CASE", brand: "追风者", model: "P300A", fullName: "追风者 P300A", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "330mm", maxCoolerHeight: "160mm", fanSlots: 6, color: "黑色" }), tdp: null, msrp: 349 },
  { category: "CASE", brand: "联力", model: "包豪斯O11D", fullName: "联力 包豪斯 O11D 纯白", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "双面钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: "420mm", maxCoolerHeight: "167mm", fanSlots: 10, color: "白色" }), tdp: null, msrp: 699 },
  { category: "CASE", brand: "分形工艺", model: "Meshify C", fullName: "分形工艺 Meshify C", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "315mm", maxCoolerHeight: "172mm", fanSlots: 5, color: "黑色" }), tdp: null, msrp: 499 },
  { category: "CASE", brand: "恩杰", model: "H510", fullName: "恩杰 H510", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "纯色", maxGpuLength: "381mm", maxCoolerHeight: "165mm", fanSlots: 7, color: "黑色" }), tdp: null, msrp: 399 },
  { category: "CASE", brand: "酷冷至尊", model: "NR600", fullName: "酷冷至尊 NR600", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: "410mm", maxCoolerHeight: "167mm", fanSlots: 7, color: "黑色" }), tdp: null, msrp: 349 },
  { category: "CASE", brand: "迎广", model: "303", fullName: "迎广 303 白色", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: "420mm", maxCoolerHeight: "160mm", fanSlots: 6, color: "白色" }), tdp: null, msrp: 599 },
  { category: "CASE", brand: "联力", model: "包豪斯O11D EVO", fullName: "联力 包豪斯 O11D EVO", specs: JSON.stringify({ formFactor: "E-ATX", sidePanel: "双面钢化玻璃", frontPanel: "Mesh", maxGpuLength: "422mm", maxCoolerHeight: "167mm", fanSlots: 10, color: "黑色" }), tdp: null, msrp: 899 },

  // 散热器 (11款)
  { category: "COOLER", brand: "九州风神", model: "玄冰400", fullName: "九州风神 玄冰400 V5", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm", fanSpeed: "500-1800RPM", noise: "27dB", height: "155mm", tdp: 180 }), tdp: 180, msrp: 89 },
  { category: "COOLER", brand: "利民", model: "AX120 R SE", fullName: "利民 AX120 R SE ARGB", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm", fanSpeed: "1500RPM", noise: "25.6dB", height: "148mm", tdp: 200, rgb: true }), tdp: 200, msrp: 99 },
  { category: "COOLER", brand: "雅浚", model: "B3 PRO", fullName: "雅浚 B3 PRO ARGB", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm", fanSpeed: "500-2000RPM", noise: "28dB", height: "155mm", tdp: 220, rgb: true }), tdp: 220, msrp: 149 },
  { category: "COOLER", brand: "九州风神", model: "大霜塔", fullName: "九州风神 大霜塔 V5", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm x2", fanSpeed: "500-1800RPM", noise: "27dB", height: "160mm", tdp: 260 }), tdp: 260, msrp: 199 },
  { category: "COOLER", brand: "利民", model: "PA120 SE", fullName: "利民 PA120 SE AGHP", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", height: "157mm", tdp: 265 }), tdp: 265, msrp: 179 },
  { category: "COOLER", brand: "猫头鹰", model: "NH-U12A", fullName: "猫头鹰 NH-U12A", specs: JSON.stringify({ type: "风冷", socket: "Intel/AMD通用", fanSize: "120mm x2", fanSpeed: "300-2000RPM", noise: "22.6dB", height: "158mm", tdp: 220 }), tdp: 220, msrp: 799 },
  { category: "COOLER", brand: "九州风神", model: "冰堡垒240", fullName: "九州风神 冰堡垒 240 数显版", specs: JSON.stringify({ type: "水冷", socket: "Intel/AMD通用", radiator: "240mm", fanSize: "120mm x2", fanSpeed: "500-2250RPM", noise: "32.6dB", tdp: 280, display: true }), tdp: 280, msrp: 399 },
  { category: "COOLER", brand: "利民", model: "Frozen Magic 240", fullName: "利民 Frozen Magic 240 ARGB", specs: JSON.stringify({ type: "水冷", socket: "Intel/AMD通用", radiator: "240mm", fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", tdp: 280, rgb: true }), tdp: 280, msrp: 299 },
  { category: "COOLER", brand: "瓦尔基里", model: "C240", fullName: "瓦尔基里 C240 ARGB", specs: JSON.stringify({ type: "水冷", socket: "Intel/AMD通用", radiator: "240mm", fanSize: "120mm x2", fanSpeed: "800-2200RPM", noise: "30dB", tdp: 300, rgb: true }), tdp: 300, msrp: 349 },
  { category: "COOLER", brand: "九州风神", model: "冰魔方360", fullName: "九州风神 冰魔方 360", specs: JSON.stringify({ type: "水冷", socket: "Intel/AMD通用", radiator: "360mm", fanSize: "120mm x3", fanSpeed: "500-2250RPM", noise: "32.6dB", tdp: 350, rgb: true }), tdp: 350, msrp: 599 },
  { category: "COOLER", brand: "恩杰", model: "Kraken X73", fullName: "恩杰 Kraken X73 360mm", specs: JSON.stringify({ type: "水冷", socket: "Intel/AMD通用", radiator: "360mm", fanSize: "120mm x3", fanSpeed: "500-2000RPM", noise: "38dB", tdp: 350, display: true }), tdp: 350, msrp: 1299 },
]

// 预置配置
const presetConfigs = [
  {
    name: "3000元办公主机",
    budgetMin: 2500,
    budgetMax: 3500,
    useCase: "office",
    priority: "value",
    components: JSON.stringify({ cpu: "i5-14400", mobo: "H610M-K", ram: "FURY 16G DDR4", ssd: "RC20 1TB", psu: "WD500K", case: "平头哥M1", cooler: "玄冰400" }),
    totalPrice: 303300,
    description: "i5-14400核显方案，日常办公网课绰绰有余",
    source: "贴吧配置吧",
    sourceUrl: "https://tieba.baidu.com/f?kw=配置",
    isVerified: true,
  },
  {
    name: "6000元游戏主机",
    budgetMin: 5000,
    budgetMax: 7000,
    useCase: "gaming",
    priority: "value",
    components: JSON.stringify({ cpu: "R5 7500F", gpu: "RTX 4060", mobo: "B650M AORUS", ram: "FURY 32G DDR5", ssd: "SN770 1TB", psu: "X6", case: "YOGO M2", cooler: "AX120 R SE" }),
    totalPrice: 593200,
    description: "R5 7500F + RTX 4060，1080P高画质通杀3A大作",
    source: "小红书装机攻略",
    sourceUrl: "https://www.xiaohongshu.com",
    isVerified: true,
  },
  {
    name: "10000元高端游戏主机",
    budgetMin: 9000,
    budgetMax: 11000,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "R7 7800X3D", gpu: "RTX 4070 Super", mobo: "B650M MORTAR", ram: "幻锋戟 32G DDR5", ssd: "990 Pro 1TB", psu: "RM750e", case: "包豪斯O11D", cooler: "冰堡垒240" }),
    totalPrice: 1028200,
    description: "7800X3D + RTX 4070 Super，2K高刷游戏无压力",
    source: "知乎装机指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
]

function jdPrice(msrpYuan: number, variance = 0.05): number {
  // 京东参考价 = msrp * (0.95 ~ 1.05)，单位分
  const factor = 1 + (Math.random() * 2 - 1) * variance
  return Math.round(msrpYuan * factor) * 100
}

async function main() {
  console.log("开始清空旧数据...")
  await prisma.price.deleteMany()
  await prisma.hardware.deleteMany()
  await prisma.presetConfig.deleteMany()
  await prisma.crawlTask.deleteMany()

  console.log(`开始导入 ${hardwareData.length} 款硬件...`)
  let priceCount = 0
  for (const hw of hardwareData) {
    const created = await prisma.hardware.create({ data: hw })
    // 每款硬件添加1-2条京东价
    const priceCountForHw = Math.random() > 0.5 ? 2 : 1
    for (let i = 0; i < priceCountForHw; i++) {
      const price = jdPrice(hw.msrp || 1000)
      const keyword = `${hw.brand} ${hw.model}`
      await prisma.price.create({
        data: {
          hardwareId: created.id,
          platform: "jd",
          shopName: "京东参考价",
          productUrl: `https://search.jd.com/Search?keyword=${encodeURIComponent(keyword)}`,
          price,
          originalPrice: Math.round(price * 1.1),
          inStock: true,
          crawledAt: new Date(),
        },
      })
      priceCount++
    }
    // 添加一条天猫参考价（京东价 * 0.97）
    const jdPriceVal = jdPrice(hw.msrp || 1000)
    const tmallPrice = Math.floor((jdPriceVal * 0.97) / 100) * 100
    const keyword = `${hw.brand} ${hw.model}`
    await prisma.price.create({
      data: {
        hardwareId: created.id,
        platform: "tmall",
        shopName: "天猫参考价",
        productUrl: `https://list.tmall.com/search_product.htm?q=${encodeURIComponent(keyword)}`,
        price: tmallPrice,
        originalPrice: Math.round(tmallPrice * 1.1),
        inStock: true,
        crawledAt: new Date(),
      },
    })
    priceCount++
    console.log(`  ✓ ${hw.category} ${hw.brand} ${hw.model}`)
  }

  console.log(`\n开始导入 ${presetConfigs.length} 套预置配置...`)
  for (const config of presetConfigs) {
    await prisma.presetConfig.create({ data: config })
    console.log(`  ✓ ${config.name}`)
  }

  // 创建爬取任务
  console.log("\n创建爬取任务...")
  const allHardware = await prisma.hardware.findMany()
  for (const hw of allHardware) {
    for (const platform of ["jd", "tmall"]) {
      await prisma.crawlTask.create({
        data: {
          hardwareId: hw.id,
          platform,
          status: "success",
          lastSuccessAt: new Date(),
          nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })
    }
  }

  console.log(`\n完成！`)
  console.log(`  硬件: ${hardwareData.length} 款`)
  console.log(`  价格: ${priceCount} 条`)
  console.log(`  配置: ${presetConfigs.length} 套`)
  console.log(`  爬取任务: ${allHardware.length * 2} 个`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
