import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 硬件数据：8个品类，每类30款，共240款
const hardwareData = [
  // ==================== CPU (30款) ====================
  { category: "CPU", brand: "Intel", model: "i3-12100F", fullName: "Intel Core i3-12100F", specs: JSON.stringify({ cores: 4, threads: 8, baseClock: "3.3GHz", boostClock: "4.3GHz", socket: "LGA1700", tdp: 58, hasGraphics: false }), tdp: 58, msrp: 599 },
  { category: "CPU", brand: "Intel", model: "i3-13100F", fullName: "Intel Core i3-13100F", specs: JSON.stringify({ cores: 4, threads: 8, baseClock: "3.4GHz", boostClock: "4.5GHz", socket: "LGA1700", tdp: 58, hasGraphics: false }), tdp: 58, msrp: 699 },
  { category: "CPU", brand: "Intel", model: "i5-12400F", fullName: "Intel Core i5-12400F", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "2.5GHz", boostClock: "4.4GHz", socket: "LGA1700", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 999 },
  { category: "CPU", brand: "Intel", model: "i5-12400", fullName: "Intel Core i5-12400", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "2.5GHz", boostClock: "4.4GHz", socket: "LGA1700", tdp: 65, hasGraphics: true, igpu: "UHD730" }), tdp: 65, msrp: 1099 },
  { category: "CPU", brand: "Intel", model: "i5-12600KF", fullName: "Intel Core i5-12600KF", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "3.7GHz", boostClock: "4.9GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 1499 },
  { category: "CPU", brand: "Intel", model: "i5-13400F", fullName: "Intel Core i5-13400F", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "2.5GHz", boostClock: "4.6GHz", socket: "LGA1700", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 1199 },
  { category: "CPU", brand: "Intel", model: "i5-13490F", fullName: "Intel Core i5-13490F", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "2.5GHz", boostClock: "4.8GHz", socket: "LGA1700", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 1299 },
  { category: "CPU", brand: "Intel", model: "i5-13600KF", fullName: "Intel Core i5-13600KF", specs: JSON.stringify({ cores: 14, threads: 20, baseClock: "3.5GHz", boostClock: "5.1GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 1899 },
  { category: "CPU", brand: "Intel", model: "i5-14400", fullName: "Intel Core i5-14400", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "2.5GHz", boostClock: "4.7GHz", socket: "LGA1700", tdp: 65, hasGraphics: true, igpu: "UHD730" }), tdp: 65, msrp: 1299 },
  { category: "CPU", brand: "Intel", model: "i5-14400F", fullName: "Intel Core i5-14400F", specs: JSON.stringify({ cores: 10, threads: 16, baseClock: "2.5GHz", boostClock: "4.7GHz", socket: "LGA1700", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 1199 },
  { category: "CPU", brand: "Intel", model: "i5-14600KF", fullName: "Intel Core i5-14600KF", specs: JSON.stringify({ cores: 14, threads: 20, baseClock: "3.5GHz", boostClock: "5.3GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 1999 },
  { category: "CPU", brand: "Intel", model: "i7-13700KF", fullName: "Intel Core i7-13700KF", specs: JSON.stringify({ cores: 16, threads: 24, baseClock: "3.4GHz", boostClock: "5.4GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 2799 },
  { category: "CPU", brand: "Intel", model: "i7-14700KF", fullName: "Intel Core i7-14700KF", specs: JSON.stringify({ cores: 20, threads: 28, baseClock: "3.4GHz", boostClock: "5.6GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 2999 },
  { category: "CPU", brand: "Intel", model: "i7-14700K", fullName: "Intel Core i7-14700K", specs: JSON.stringify({ cores: 20, threads: 28, baseClock: "3.4GHz", boostClock: "5.6GHz", socket: "LGA1700", tdp: 125, hasGraphics: true, igpu: "UHD770" }), tdp: 125, msrp: 3199 },
  { category: "CPU", brand: "Intel", model: "i9-13900KF", fullName: "Intel Core i9-13900KF", specs: JSON.stringify({ cores: 24, threads: 32, baseClock: "3.0GHz", boostClock: "5.8GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 3999 },
  { category: "CPU", brand: "Intel", model: "i9-14900KF", fullName: "Intel Core i9-14900KF", specs: JSON.stringify({ cores: 24, threads: 32, baseClock: "3.2GHz", boostClock: "6.0GHz", socket: "LGA1700", tdp: 125, hasGraphics: false }), tdp: 125, msrp: 4299 },
  { category: "CPU", brand: "Intel", model: "i9-14900K", fullName: "Intel Core i9-14900K", specs: JSON.stringify({ cores: 24, threads: 32, baseClock: "3.2GHz", boostClock: "6.0GHz", socket: "LGA1700", tdp: 125, hasGraphics: true, igpu: "UHD770" }), tdp: 125, msrp: 4499 },
  { category: "CPU", brand: "AMD", model: "R3 4100", fullName: "AMD Ryzen 3 4100", specs: JSON.stringify({ cores: 4, threads: 8, baseClock: "3.8GHz", boostClock: "4.0GHz", socket: "AM4", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 499 },
  { category: "CPU", brand: "AMD", model: "R5 5500", fullName: "AMD Ryzen 5 5500", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.6GHz", boostClock: "4.2GHz", socket: "AM4", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 599 },
  { category: "CPU", brand: "AMD", model: "R5 5600", fullName: "AMD Ryzen 5 5600", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.5GHz", boostClock: "4.4GHz", socket: "AM4", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 699 },
  { category: "CPU", brand: "AMD", model: "R5 5600G", fullName: "AMD Ryzen 5 5600G", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.9GHz", boostClock: "4.4GHz", socket: "AM4", tdp: 65, hasGraphics: true, igpu: "Vega 7" }), tdp: 65, msrp: 799 },
  { category: "CPU", brand: "AMD", model: "R5 5600X", fullName: "AMD Ryzen 5 5600X", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.7GHz", boostClock: "4.6GHz", socket: "AM4", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 899 },
  { category: "CPU", brand: "AMD", model: "R7 5700X", fullName: "AMD Ryzen 7 5700X", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "3.4GHz", boostClock: "4.6GHz", socket: "AM4", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 1099 },
  { category: "CPU", brand: "AMD", model: "R7 5800X3D", fullName: "AMD Ryzen 7 5800X3D", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "3.4GHz", boostClock: "4.5GHz", socket: "AM4", tdp: 105, hasGraphics: false, cache: "96MB 3D V-Cache" }), tdp: 105, msrp: 1699 },
  { category: "CPU", brand: "AMD", model: "R5 7500F", fullName: "AMD Ryzen 5 7500F", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.7GHz", boostClock: "5.0GHz", socket: "AM5", tdp: 65, hasGraphics: false }), tdp: 65, msrp: 949 },
  { category: "CPU", brand: "AMD", model: "R5 7600", fullName: "AMD Ryzen 5 7600", specs: JSON.stringify({ cores: 6, threads: 12, baseClock: "3.8GHz", boostClock: "5.1GHz", socket: "AM5", tdp: 65, hasGraphics: true, igpu: "RDNA 2" }), tdp: 65, msrp: 1199 },
  { category: "CPU", brand: "AMD", model: "R7 7700X", fullName: "AMD Ryzen 7 7700X", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "4.5GHz", boostClock: "5.4GHz", socket: "AM5", tdp: 105, hasGraphics: true, igpu: "RDNA 2" }), tdp: 105, msrp: 1999 },
  { category: "CPU", brand: "AMD", model: "R7 7800X3D", fullName: "AMD Ryzen 7 7800X3D", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "4.2GHz", boostClock: "5.0GHz", socket: "AM5", tdp: 120, hasGraphics: false, cache: "96MB 3D V-Cache" }), tdp: 120, msrp: 2299 },
  { category: "CPU", brand: "AMD", model: "R7 9800X3D", fullName: "AMD Ryzen 7 9800X3D", specs: JSON.stringify({ cores: 8, threads: 16, baseClock: "4.7GHz", boostClock: "5.2GHz", socket: "AM5", tdp: 120, hasGraphics: false, cache: "96MB 3D V-Cache" }), tdp: 120, msrp: 3299 },
  { category: "CPU", brand: "AMD", model: "R9 7900X", fullName: "AMD Ryzen 9 7900X", specs: JSON.stringify({ cores: 12, threads: 24, baseClock: "4.7GHz", boostClock: "5.6GHz", socket: "AM5", tdp: 170, hasGraphics: true, igpu: "RDNA 2" }), tdp: 170, msrp: 2999 },
  { category: "CPU", brand: "AMD", model: "R9 7950X", fullName: "AMD Ryzen 9 7950X", specs: JSON.stringify({ cores: 16, threads: 32, baseClock: "4.5GHz", boostClock: "5.7GHz", socket: "AM5", tdp: 170, hasGraphics: true, igpu: "RDNA 2" }), tdp: 170, msrp: 3999 },

  // ==================== GPU (30款) ====================
  { category: "GPU", brand: "NVIDIA", model: "RTX 3050", fullName: "NVIDIA GeForce RTX 3050", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 2560, baseClock: "1552MHz", boostClock: "1777MHz", tdp: 130, interface: "PCIe 4.0", length: 242 }), tdp: 130, msrp: 1499 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 3060", fullName: "NVIDIA GeForce RTX 3060", specs: JSON.stringify({ vram: "12GB GDDR6", cudaCores: 3584, baseClock: "1320MHz", boostClock: "1777MHz", tdp: 170, interface: "PCIe 4.0", length: 242 }), tdp: 170, msrp: 1899 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 3060 Ti", fullName: "NVIDIA GeForce RTX 3060 Ti", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 4864, baseClock: "1410MHz", boostClock: "1665MHz", tdp: 200, interface: "PCIe 4.0", length: 267 }), tdp: 200, msrp: 2499 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 3070", fullName: "NVIDIA GeForce RTX 3070", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 5888, baseClock: "1500MHz", boostClock: "1725MHz", tdp: 220, interface: "PCIe 4.0", length: 267 }), tdp: 220, msrp: 2999 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4060", fullName: "NVIDIA GeForce RTX 4060", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 3072, baseClock: "1830MHz", boostClock: "2460MHz", tdp: 115, interface: "PCIe 4.0", length: 244 }), tdp: 115, msrp: 2399 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4060 Ti 8G", fullName: "NVIDIA GeForce RTX 4060 Ti 8GB", specs: JSON.stringify({ vram: "8GB GDDR6", cudaCores: 4352, baseClock: "2310MHz", boostClock: "2535MHz", tdp: 160, interface: "PCIe 4.0", length: 241 }), tdp: 160, msrp: 3199 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4060 Ti 16G", fullName: "NVIDIA GeForce RTX 4060 Ti 16GB", specs: JSON.stringify({ vram: "16GB GDDR6", cudaCores: 4352, baseClock: "2310MHz", boostClock: "2535MHz", tdp: 165, interface: "PCIe 4.0", length: 241 }), tdp: 165, msrp: 3899 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4070", fullName: "NVIDIA GeForce RTX 4070", specs: JSON.stringify({ vram: "12GB GDDR6X", cudaCores: 5888, baseClock: "1920MHz", boostClock: "2475MHz", tdp: 200, interface: "PCIe 4.0", length: 244 }), tdp: 200, msrp: 4299 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4070 Super", fullName: "NVIDIA GeForce RTX 4070 Super", specs: JSON.stringify({ vram: "12GB GDDR6X", cudaCores: 7168, baseClock: "1980MHz", boostClock: "2475MHz", tdp: 220, interface: "PCIe 4.0", length: 244 }), tdp: 220, msrp: 4799 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4070 Ti Super", fullName: "NVIDIA GeForce RTX 4070 Ti Super", specs: JSON.stringify({ vram: "16GB GDDR6X", cudaCores: 8448, baseClock: "2340MHz", boostClock: "2610MHz", tdp: 285, interface: "PCIe 4.0", length: 285 }), tdp: 285, msrp: 6299 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4080 Super", fullName: "NVIDIA GeForce RTX 4080 Super", specs: JSON.stringify({ vram: "16GB GDDR6X", cudaCores: 10240, baseClock: "2295MHz", boostClock: "2550MHz", tdp: 320, interface: "PCIe 4.0", length: 304 }), tdp: 320, msrp: 8099 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 4090", fullName: "NVIDIA GeForce RTX 4090", specs: JSON.stringify({ vram: "24GB GDDR6X", cudaCores: 16384, baseClock: "2235MHz", boostClock: "2520MHz", tdp: 450, interface: "PCIe 4.0", length: 336 }), tdp: 450, msrp: 12999 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5060", fullName: "NVIDIA GeForce RTX 5060", specs: JSON.stringify({ vram: "8GB GDDR7", cudaCores: 4608, baseClock: "2200MHz", boostClock: "2700MHz", tdp: 180, interface: "PCIe 5.0", length: 250 }), tdp: 180, msrp: 2999 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5070", fullName: "NVIDIA GeForce RTX 5070", specs: JSON.stringify({ vram: "12GB GDDR7", cudaCores: 6144, baseClock: "2200MHz", boostClock: "2700MHz", tdp: 250, interface: "PCIe 5.0", length: 260 }), tdp: 250, msrp: 4499 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5070 Ti", fullName: "NVIDIA GeForce RTX 5070 Ti", specs: JSON.stringify({ vram: "16GB GDDR7", cudaCores: 8960, baseClock: "2300MHz", boostClock: "2800MHz", tdp: 300, interface: "PCIe 5.0", length: 280 }), tdp: 300, msrp: 5999 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5080", fullName: "NVIDIA GeForce RTX 5080", specs: JSON.stringify({ vram: "16GB GDDR7", cudaCores: 10752, baseClock: "2370MHz", boostClock: "2820MHz", tdp: 360, interface: "PCIe 5.0", length: 300 }), tdp: 360, msrp: 8299 },
  { category: "GPU", brand: "NVIDIA", model: "RTX 5090", fullName: "NVIDIA GeForce RTX 5090", specs: JSON.stringify({ vram: "32GB GDDR7", cudaCores: 21760, baseClock: "2500MHz", boostClock: "3000MHz", tdp: 575, interface: "PCIe 5.0", length: 340 }), tdp: 575, msrp: 16499 },
  { category: "GPU", brand: "AMD", model: "RX 6600", fullName: "AMD Radeon RX 6600", specs: JSON.stringify({ vram: "8GB GDDR6", streamProcessors: 1792, baseClock: "1626MHz", boostClock: "2491MHz", tdp: 132, interface: "PCIe 4.0", length: 230 }), tdp: 132, msrp: 1499 },
  { category: "GPU", brand: "AMD", model: "RX 6650 XT", fullName: "AMD Radeon RX 6650 XT", specs: JSON.stringify({ vram: "8GB GDDR6", streamProcessors: 2048, baseClock: "2055MHz", boostClock: "2635MHz", tdp: 176, interface: "PCIe 4.0", length: 240 }), tdp: 176, msrp: 1899 },
  { category: "GPU", brand: "AMD", model: "RX 6750 GRE 10G", fullName: "AMD Radeon RX 6750 GRE 10GB", specs: JSON.stringify({ vram: "10GB GDDR6", streamProcessors: 2240, baseClock: "1700MHz", boostClock: "2581MHz", tdp: 190, interface: "PCIe 4.0", length: 260 }), tdp: 190, msrp: 1999 },
  { category: "GPU", brand: "AMD", model: "RX 6750 GRE 12G", fullName: "AMD Radeon RX 6750 GRE 12GB", specs: JSON.stringify({ vram: "12GB GDDR6", streamProcessors: 2560, baseClock: "1700MHz", boostClock: "2581MHz", tdp: 190, interface: "PCIe 4.0", length: 260 }), tdp: 190, msrp: 2099 },
  { category: "GPU", brand: "AMD", model: "RX 7600", fullName: "AMD Radeon RX 7600", specs: JSON.stringify({ vram: "8GB GDDR6", streamProcessors: 2048, baseClock: "1720MHz", boostClock: "2655MHz", tdp: 165, interface: "PCIe 4.0", length: 240 }), tdp: 165, msrp: 1799 },
  { category: "GPU", brand: "AMD", model: "RX 7600 XT", fullName: "AMD Radeon RX 7600 XT", specs: JSON.stringify({ vram: "16GB GDDR6", streamProcessors: 2048, baseClock: "1720MHz", boostClock: "2755MHz", tdp: 190, interface: "PCIe 4.0", length: 250 }), tdp: 190, msrp: 2499 },
  { category: "GPU", brand: "AMD", model: "RX 7700 XT", fullName: "AMD Radeon RX 7700 XT", specs: JSON.stringify({ vram: "12GB GDDR6", streamProcessors: 3456, baseClock: "2100MHz", boostClock: "2544MHz", tdp: 245, interface: "PCIe 4.0", length: 267 }), tdp: 245, msrp: 3299 },
  { category: "GPU", brand: "AMD", model: "RX 7800 XT", fullName: "AMD Radeon RX 7800 XT", specs: JSON.stringify({ vram: "16GB GDDR6", streamProcessors: 3840, baseClock: "1295MHz", boostClock: "2430MHz", tdp: 263, interface: "PCIe 4.0", length: 267 }), tdp: 263, msrp: 3999 },
  { category: "GPU", brand: "AMD", model: "RX 7900 GRE", fullName: "AMD Radeon RX 7900 GRE", specs: JSON.stringify({ vram: "16GB GDDR6", streamProcessors: 5120, baseClock: "1500MHz", boostClock: "2395MHz", tdp: 260, interface: "PCIe 4.0", length: 287 }), tdp: 260, msrp: 4999 },
  { category: "GPU", brand: "AMD", model: "RX 7900 XT", fullName: "AMD Radeon RX 7900 XT", specs: JSON.stringify({ vram: "20GB GDDR6", streamProcessors: 5376, baseClock: "1500MHz", boostClock: "2400MHz", tdp: 315, interface: "PCIe 4.0", length: 287 }), tdp: 315, msrp: 5999 },
  { category: "GPU", brand: "AMD", model: "RX 7900 XTX", fullName: "AMD Radeon RX 7900 XTX", specs: JSON.stringify({ vram: "24GB GDDR6", streamProcessors: 6144, baseClock: "1900MHz", boostClock: "2500MHz", tdp: 355, interface: "PCIe 4.0", length: 287 }), tdp: 355, msrp: 6999 },
  { category: "GPU", brand: "Intel", model: "Arc A750", fullName: "Intel Arc A750", specs: JSON.stringify({ vram: "8GB GDDR6", streamProcessors: 28, baseClock: "2050MHz", boostClock: "2400MHz", tdp: 225, interface: "PCIe 4.0", length: 240 }), tdp: 225, msrp: 1299 },
  { category: "GPU", brand: "Intel", model: "Arc A770", fullName: "Intel Arc A770 16GB", specs: JSON.stringify({ vram: "16GB GDDR6", streamProcessors: 32, baseClock: "2100MHz", boostClock: "2400MHz", tdp: 225, interface: "PCIe 4.0", length: 240 }), tdp: 225, msrp: 1999 },

  // ==================== 主板 (30款) ====================
  { category: "MOBO", brand: "华硕", model: "H610M-K", fullName: "华硕 PRIME H610M-K D4", specs: JSON.stringify({ socket: "LGA1700", chipset: "H610", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 549 },
  { category: "MOBO", brand: "微星", model: "H610M-B", fullName: "微星 PRO H610M-B DDR4", specs: JSON.stringify({ socket: "LGA1700", chipset: "H610", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 499 },
  { category: "MOBO", brand: "技嘉", model: "H610M S2H", fullName: "技嘉 H610M S2H DDR4", specs: JSON.stringify({ socket: "LGA1700", chipset: "H610", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 499 },
  { category: "MOBO", brand: "华硕", model: "B660M-K", fullName: "华硕 PRIME B660M-K D4", specs: JSON.stringify({ socket: "LGA1700", chipset: "B660", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 699 },
  { category: "MOBO", brand: "微星", model: "B760M-K", fullName: "微星 PRO B760M-K DDR4", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 2, maxMemory: "64GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 699 },
  { category: "MOBO", brand: "技嘉", model: "B760M D2H", fullName: "技嘉 B760M D2H DDR4", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 4, maxMemory: "128GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 799 },
  { category: "MOBO", brand: "华硕", model: "B760M-AYW", fullName: "华硕 TUF GAMING B760M-AYW WIFI D5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 3, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1199 },
  { category: "MOBO", brand: "技嘉", model: "B760M AORUS", fullName: "技嘉 B760M AORUS ELITE AX DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 3, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1099 },
  { category: "MOBO", brand: "微星", model: "B760M MORTAR", fullName: "微星 MAG B760M MORTAR WIFI DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1299 },
  { category: "MOBO", brand: "华硕", model: "B760-G", fullName: "华硕 ROG STRIX B760-G GAMING WIFI D5", specs: JSON.stringify({ socket: "LGA1700", chipset: "B760", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 3, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1499 },
  { category: "MOBO", brand: "微星", model: "Z790-A", fullName: "微星 PRO Z790-A WIFI DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1799 },
  { category: "MOBO", brand: "华硕", model: "Z790-A", fullName: "华硕 ROG STRIX Z790-A GAMING WIFI D5", specs: JSON.stringify({ socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 2499 },
  { category: "MOBO", brand: "技嘉", model: "Z790 AORUS", fullName: "技嘉 Z790 AORUS ELITE AX DDR5", specs: JSON.stringify({ socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1999 },
  { category: "MOBO", brand: "华硕", model: "ROG Z790 HERO", fullName: "华硕 ROG MAXIMUS Z790 HERO", specs: JSON.stringify({ socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 5, pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 4999 },
  { category: "MOBO", brand: "华硕", model: "A620M-K", fullName: "华硕 PRIME A620M-K", specs: JSON.stringify({ socket: "AM5", chipset: "A620", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 599 },
  { category: "MOBO", brand: "微星", model: "A620M-E", fullName: "微星 PRO A620M-E", specs: JSON.stringify({ socket: "AM5", chipset: "A620", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 549 },
  { category: "MOBO", brand: "技嘉", model: "A620M S2H", fullName: "技嘉 A620M S2H", specs: JSON.stringify({ socket: "AM5", chipset: "A620", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 2, maxMemory: "64GB", m2Slots: 1, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 549 },
  { category: "MOBO", brand: "华硕", model: "B650M-K", fullName: "华硕 PRIME B650M-K", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 2, maxMemory: "96GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 799 },
  { category: "MOBO", brand: "技嘉", model: "B650M AORUS", fullName: "技嘉 B650M AORUS ELITE AX", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1099 },
  { category: "MOBO", brand: "微星", model: "B650M MORTAR", fullName: "微星 MAG B650M MORTAR WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1199 },
  { category: "MOBO", brand: "华硕", model: "B650M-AYW", fullName: "华硕 TUF GAMING B650M-AYW WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "M-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 3, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1299 },
  { category: "MOBO", brand: "华硕", model: "ROG B650E-E", fullName: "华硕 ROG STRIX B650E-E GAMING WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650E", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1899 },
  { category: "MOBO", brand: "微星", model: "B650 GAMING", fullName: "微星 MAG B650 TOMAHAWK WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "B650", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16", wifi: true }), tdp: null, msrp: 1499 },
  { category: "MOBO", brand: "技嘉", model: "X670 AORUS", fullName: "技嘉 X670 AORUS ELITE AX", specs: JSON.stringify({ socket: "AM5", chipset: "X670", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "1xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 1999 },
  { category: "MOBO", brand: "华硕", model: "ROG X670E-A", fullName: "华硕 ROG STRIX X670E-A GAMING WIFI", specs: JSON.stringify({ socket: "AM5", chipset: "X670E", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 4, pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 2999 },
  { category: "MOBO", brand: "微星", model: "X670E ACE", fullName: "微星 MEG X670E ACE", specs: JSON.stringify({ socket: "AM5", chipset: "X670E", formFactor: "E-ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 5, pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 4999 },
  { category: "MOBO", brand: "华硕", model: "ROG X670E HERO", fullName: "华硕 ROG CROSSHAIR X670E HERO", specs: JSON.stringify({ socket: "AM5", chipset: "X670E", formFactor: "ATX", memoryType: "DDR5", memorySlots: 4, maxMemory: "192GB", m2Slots: 5, pcieSlots: "2xPCIe5.0 x16", wifi: true }), tdp: null, msrp: 4499 },
  { category: "MOBO", brand: "华硕", model: "B550M-K", fullName: "华硕 PRIME B550M-K", specs: JSON.stringify({ socket: "AM4", chipset: "B550", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 4, maxMemory: "128GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 599 },
  { category: "MOBO", brand: "微星", model: "B550M MORTAR", fullName: "微星 MAG B550M MORTAR", specs: JSON.stringify({ socket: "AM4", chipset: "B550", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 4, maxMemory: "128GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 699 },
  { category: "MOBO", brand: "技嘉", model: "B550M AORUS", fullName: "技嘉 B550M AORUS ELITE", specs: JSON.stringify({ socket: "AM4", chipset: "B550", formFactor: "M-ATX", memoryType: "DDR4", memorySlots: 4, maxMemory: "128GB", m2Slots: 2, pcieSlots: "1xPCIe4.0 x16" }), tdp: null, msrp: 649 },

  // ==================== 内存 (30款) ====================
  { category: "RAM", brand: "光威", model: "天策 16G DDR4", fullName: "光威 天策 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 199 },
  { category: "RAM", brand: "金百达", model: "银爵 16G DDR4", fullName: "金百达 银爵 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 189 },
  { category: "RAM", brand: "金士顿", model: "FURY 16G DDR4", fullName: "金士顿 FURY Beast 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 299 },
  { category: "RAM", brand: "威刚", model: "万紫千红 16G DDR4", fullName: "威刚 万紫千红 16GB(8Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3200MHz", kit: "2x8GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 219 },
  { category: "RAM", brand: "芝奇", model: "皇家戟 16G DDR4", fullName: "芝奇 皇家戟 16GB(8Gx2) DDR4 3600", specs: JSON.stringify({ capacity: "16GB", type: "DDR4", speed: "3600MHz", kit: "2x8GB", moduleCount: 2, latency: "CL18", voltage: "1.35V", rgb: true }), tdp: null, msrp: 349 },
  { category: "RAM", brand: "金士顿", model: "FURY 32G DDR4", fullName: "金士顿 FURY Beast 32GB(16Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3200MHz", kit: "2x16GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 399 },
  { category: "RAM", brand: "威刚", model: "XPG 32G DDR4", fullName: "威刚 XPG 龙耀 32GB(16Gx2) DDR4 3600", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3600MHz", kit: "2x16GB", moduleCount: 2, latency: "CL18", voltage: "1.35V", rgb: true }), tdp: null, msrp: 499 },
  { category: "RAM", brand: "芝奇", model: "皇家戟 32G DDR4", fullName: "芝奇 皇家戟 32GB(16Gx2) DDR4 3600", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3600MHz", kit: "2x16GB", moduleCount: 2, latency: "CL18", voltage: "1.35V", rgb: true }), tdp: null, msrp: 549 },
  { category: "RAM", brand: "海盗船", model: "复仇者 32G DDR4", fullName: "海盗船 复仇者LPX 32GB(16Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3200MHz", kit: "2x16GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 429 },
  { category: "RAM", brand: "金士顿", model: "FURY 64G DDR4", fullName: "金士顿 FURY Beast 64GB(32Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "64GB", type: "DDR4", speed: "3200MHz", kit: "2x32GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 799 },
  { category: "RAM", brand: "金百达", model: "银爵 32G DDR5", fullName: "金百达 银爵 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 499 },
  { category: "RAM", brand: "光威", model: "神武 32G DDR5", fullName: "光威 神武 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 479 },
  { category: "RAM", brand: "金士顿", model: "FURY 32G DDR5", fullName: "金士顿 FURY Beast 32GB(16Gx2) DDR5 5600", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "5600MHz", kit: "2x16GB", moduleCount: 2, latency: "CL36", voltage: "1.25V" }), tdp: null, msrp: 599 },
  { category: "RAM", brand: "金士顿", model: "FURY 32G DDR5 6000", fullName: "金士顿 FURY Beast 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 649 },
  { category: "RAM", brand: "芝奇", model: "幻锋戟 32G DDR5", fullName: "芝奇 幻锋戟 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 699 },
  { category: "RAM", brand: "芝奇", model: "幻锋戟 32G DDR5 6400", fullName: "芝奇 幻锋戟 32GB(16Gx2) DDR5 6400", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6400MHz", kit: "2x16GB", moduleCount: 2, latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 899 },
  { category: "RAM", brand: "海盗船", model: "复仇者 32G DDR5", fullName: "海盗船 复仇者 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 649 },
  { category: "RAM", brand: "威刚", model: "XPG 32G DDR5", fullName: "威刚 XPG 龙耀 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 629 },
  { category: "RAM", brand: "宏碁", model: "掠夺者 32G DDR5", fullName: "宏碁 掠夺者 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 549 },
  { category: "RAM", brand: "阿斯加特", model: "女武神 32G DDR5", fullName: "阿斯加特 女武神 32GB(16Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "32GB", type: "DDR5", speed: "6000MHz", kit: "2x16GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 529 },
  { category: "RAM", brand: "金士顿", model: "FURY 64G DDR5", fullName: "金士顿 FURY Renegade 64GB(32Gx2) DDR5 6400", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6400MHz", kit: "2x32GB", moduleCount: 2, latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 1299 },
  { category: "RAM", brand: "芝奇", model: "幻锋戟 64G DDR5", fullName: "芝奇 幻锋戟 64GB(32Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6000MHz", kit: "2x32GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 1199 },
  { category: "RAM", brand: "威刚", model: "XPG 64G DDR5", fullName: "威刚 XPG 龙耀 64GB(32Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6000MHz", kit: "2x32GB", moduleCount: 2, latency: "CL30", voltage: "1.35V", rgb: true }), tdp: null, msrp: 1149 },
  { category: "RAM", brand: "海盗船", model: "统治者 64G DDR5", fullName: "海盗船 统治者铂金 64GB(32Gx2) DDR5 6600", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6600MHz", kit: "2x32GB", moduleCount: 2, latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 1599 },
  { category: "RAM", brand: "金士顿", model: "FURY 16G DDR5", fullName: "金士顿 FURY Beast 16GB(8Gx2) DDR5 5600", specs: JSON.stringify({ capacity: "16GB", type: "DDR5", speed: "5600MHz", kit: "2x8GB", moduleCount: 2, latency: "CL36", voltage: "1.25V" }), tdp: null, msrp: 349 },
  { category: "RAM", brand: "金百达", model: "银爵 16G DDR5", fullName: "金百达 银爵 16GB(8Gx2) DDR5 5600", specs: JSON.stringify({ capacity: "16GB", type: "DDR5", speed: "5600MHz", kit: "2x8GB", moduleCount: 2, latency: "CL36", voltage: "1.25V" }), tdp: null, msrp: 299 },
  { category: "RAM", brand: "光威", model: "天策 32G DDR4", fullName: "光威 天策 32GB(16Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3200MHz", kit: "2x16GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 329 },
  { category: "RAM", brand: "金百达", model: "银爵 64G DDR5", fullName: "金百达 银爵 64GB(32Gx2) DDR5 6000", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6000MHz", kit: "2x32GB", moduleCount: 2, latency: "CL30", voltage: "1.35V" }), tdp: null, msrp: 999 },
  { category: "RAM", brand: "阿斯加特", model: "弗雷 32G DDR4", fullName: "阿斯加特 弗雷 32GB(16Gx2) DDR4 3200", specs: JSON.stringify({ capacity: "32GB", type: "DDR4", speed: "3200MHz", kit: "2x16GB", moduleCount: 2, latency: "CL16", voltage: "1.35V" }), tdp: null, msrp: 349 },
  { category: "RAM", brand: "宏碁", model: "掠夺者 64G DDR5", fullName: "宏碁 掠夺者 64GB(32Gx2) DDR5 6400", specs: JSON.stringify({ capacity: "64GB", type: "DDR5", speed: "6400MHz", kit: "2x32GB", moduleCount: 2, latency: "CL32", voltage: "1.4V", rgb: true }), tdp: null, msrp: 1399 },

  // ==================== SSD (30款) ====================
  { category: "SSD", brand: "铠侠", model: "RC20 500G", fullName: "铠侠 RC20 500GB NVMe SSD", specs: JSON.stringify({ capacity: "500GB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "1700MB/s", writeSpeed: "1600MB/s", warranty: "5年" }), tdp: null, msrp: 249 },
  { category: "SSD", brand: "铠侠", model: "RC20 1TB", fullName: "铠侠 RC20 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "2100MB/s", writeSpeed: "1700MB/s", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "SSD", brand: "西数", model: "SN570 1TB", fullName: "西部数据 SN570 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 429 },
  { category: "SSD", brand: "三星", model: "980 1TB", fullName: "三星 980 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "致态", model: "TiPlus5000 1TB", fullName: "致态 TiPlus5000 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "SSD", brand: "西数", model: "SN770 500G", fullName: "西部数据 SN770 500GB NVMe SSD", specs: JSON.stringify({ capacity: "500GB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "4000MB/s", writeSpeed: "3600MB/s", warranty: "5年" }), tdp: null, msrp: 299 },
  { category: "SSD", brand: "西数", model: "SN770 1TB", fullName: "西部数据 SN770 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "5150MB/s", writeSpeed: "4900MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "西数", model: "SN770 2TB", fullName: "西部数据 SN770 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "5150MB/s", writeSpeed: "4900MB/s", warranty: "5年" }), tdp: null, msrp: 899 },
  { category: "SSD", brand: "三星", model: "990 Pro 1TB", fullName: "三星 990 Pro 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7450MB/s", writeSpeed: "6900MB/s", warranty: "5年" }), tdp: null, msrp: 699 },
  { category: "SSD", brand: "三星", model: "990 Pro 2TB", fullName: "三星 990 Pro 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7450MB/s", writeSpeed: "6900MB/s", warranty: "5年" }), tdp: null, msrp: 1299 },
  { category: "SSD", brand: "三星", model: "990 Pro 4TB", fullName: "三星 990 Pro 4TB NVMe SSD", specs: JSON.stringify({ capacity: "4TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7450MB/s", writeSpeed: "6900MB/s", warranty: "5年" }), tdp: null, msrp: 2499 },
  { category: "SSD", brand: "致态", model: "TiPlus7100 1TB", fullName: "致态 TiPlus7100 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7000MB/s", writeSpeed: "6000MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "致态", model: "TiPlus7100 2TB", fullName: "致态 TiPlus7100 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7000MB/s", writeSpeed: "6000MB/s", warranty: "5年" }), tdp: null, msrp: 899 },
  { category: "SSD", brand: "致态", model: "TiPro7000 1TB", fullName: "致态 TiPro7000 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7400MB/s", writeSpeed: "5500MB/s", warranty: "5年" }), tdp: null, msrp: 599 },
  { category: "SSD", brand: "致态", model: "TiPro7000 2TB", fullName: "致态 TiPro7000 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7400MB/s", writeSpeed: "6700MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "铠侠", model: "SE10 1TB", fullName: "铠侠 SE10 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6400MB/s", warranty: "5年" }), tdp: null, msrp: 549 },
  { category: "SSD", brand: "西数", model: "SN850X 1TB", fullName: "西部数据 SN850X 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6300MB/s", warranty: "5年" }), tdp: null, msrp: 599 },
  { category: "SSD", brand: "西数", model: "SN850X 2TB", fullName: "西部数据 SN850X 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6600MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "西数", model: "SN850X 4TB", fullName: "西部数据 SN850X 4TB NVMe SSD", specs: JSON.stringify({ capacity: "4TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7300MB/s", writeSpeed: "6600MB/s", warranty: "5年" }), tdp: null, msrp: 1999 },
  { category: "SSD", brand: "海盗船", model: "MP700 1TB", fullName: "海盗船 MP700 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 5.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "10000MB/s", writeSpeed: "7500MB/s", warranty: "5年" }), tdp: null, msrp: 899 },
  { category: "SSD", brand: "海盗船", model: "MP700 2TB", fullName: "海盗船 MP700 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 5.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "10000MB/s", writeSpeed: "8500MB/s", warranty: "5年" }), tdp: null, msrp: 1799 },
  { category: "SSD", brand: "三星", model: "990 EVO 1TB", fullName: "三星 990 EVO 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "5000MB/s", writeSpeed: "4200MB/s", warranty: "5年" }), tdp: null, msrp: 549 },
  { category: "SSD", brand: "三星", model: "990 EVO 2TB", fullName: "三星 990 EVO 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "5000MB/s", writeSpeed: "4200MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "英睿达", model: "P3 1TB", fullName: "英睿达 P3 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 3.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "3500MB/s", writeSpeed: "3000MB/s", warranty: "5年" }), tdp: null, msrp: 349 },
  { category: "SSD", brand: "英睿达", model: "P3 Plus 1TB", fullName: "英睿达 P3 Plus 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "5000MB/s", writeSpeed: "3600MB/s", warranty: "5年" }), tdp: null, msrp: 429 },
  { category: "SSD", brand: "金士顿", model: "KC3000 1TB", fullName: "金士顿 KC3000 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7000MB/s", writeSpeed: "6000MB/s", warranty: "5年" }), tdp: null, msrp: 549 },
  { category: "SSD", brand: "金士顿", model: "KC3000 2TB", fullName: "金士顿 KC3000 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7000MB/s", writeSpeed: "6000MB/s", warranty: "5年" }), tdp: null, msrp: 999 },
  { category: "SSD", brand: "威刚", model: "S70B 1TB", fullName: "威刚 XPG S70B 1TB NVMe SSD", specs: JSON.stringify({ capacity: "1TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7400MB/s", writeSpeed: "5500MB/s", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "SSD", brand: "爱国者", model: "P7000Z 2TB", fullName: "爱国者 P7000Z 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7400MB/s", writeSpeed: "6500MB/s", warranty: "5年" }), tdp: null, msrp: 799 },
  { category: "SSD", brand: "宏碁", model: "GM7 2TB", fullName: "宏碁 掠夺者 GM7 2TB NVMe SSD", specs: JSON.stringify({ capacity: "2TB", interface: "PCIe 4.0 x4", formFactor: "M.2 2280", protocol: "NVMe", readSpeed: "7200MB/s", writeSpeed: "6200MB/s", warranty: "5年" }), tdp: null, msrp: 799 },

  // ==================== 电源 (30款) ====================
  { category: "PSU", brand: "航嘉", model: "WD400K", fullName: "航嘉 WD400K 400W 金牌", specs: JSON.stringify({ wattage: 400, certification: "80PLUS金牌", modular: "直出", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 249 },
  { category: "PSU", brand: "航嘉", model: "WD500K", fullName: "航嘉 WD500K 500W 金牌全模组", specs: JSON.stringify({ wattage: 500, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 299 },
  { category: "PSU", brand: "长城", model: "X5", fullName: "长城 X5 550W 金牌全模组", specs: JSON.stringify({ wattage: 550, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 349 },
  { category: "PSU", brand: "长城", model: "X6", fullName: "长城 X6 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "PSU", brand: "长城", model: "X7", fullName: "长城 X7 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 499 },
  { category: "PSU", brand: "振华", model: "LEADEX III 550", fullName: "振华 LEADEX III 550W 金牌全模组", specs: JSON.stringify({ wattage: 550, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 399 },
  { category: "PSU", brand: "振华", model: "LEADEX III 650", fullName: "振华 LEADEX III 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 449 },
  { category: "PSU", brand: "振华", model: "LEADEX III 750", fullName: "振华 LEADEX III 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "5年" }), tdp: null, msrp: 549 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-550", fullName: "海韵 FOCUS GX-550 550W 金牌全模组", specs: JSON.stringify({ wattage: 550, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 499 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-650", fullName: "海韵 FOCUS GX-650 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 549 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-750", fullName: "海韵 FOCUS GX-750 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 649 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-850", fullName: "海韵 FOCUS GX-850 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 699 },
  { category: "PSU", brand: "海韵", model: "FOCUS GX-1000", fullName: "海韵 FOCUS GX-1000 1000W 金牌全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 999 },
  { category: "PSU", brand: "海盗船", model: "RM650e", fullName: "海盗船 RM650e 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 549 },
  { category: "PSU", brand: "海盗船", model: "RM750e", fullName: "海盗船 RM750e 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 599 },
  { category: "PSU", brand: "海盗船", model: "RM850e", fullName: "海盗船 RM850e 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 699 },
  { category: "PSU", brand: "海盗船", model: "RM850x", fullName: "海盗船 RM850x 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 749 },
  { category: "PSU", brand: "海盗船", model: "RM1000x", fullName: "海盗船 RM1000x 1000W 金牌全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS金牌", modular: "全模组", fanSize: "120mm", warranty: "10年" }), tdp: null, msrp: 999 },
  { category: "PSU", brand: "华硕", model: "TUF 650W", fullName: "华硕 TUF GAMING 650W 金牌全模组", specs: JSON.stringify({ wattage: 650, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 499 },
  { category: "PSU", brand: "华硕", model: "TUF 750W", fullName: "华硕 TUF GAMING 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 599 },
  { category: "PSU", brand: "华硕", model: "TUF 850W", fullName: "华硕 TUF GAMING 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 699 },
  { category: "PSU", brand: "华硕", model: "ROG STRIX 750W", fullName: "华硕 ROG STRIX 750W 金牌全模组", specs: JSON.stringify({ wattage: 750, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 799 },
  { category: "PSU", brand: "华硕", model: "ROG STRIX 850W", fullName: "华硕 ROG STRIX 850W 金牌全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS金牌", modular: "全模组", fanSize: "135mm", warranty: "10年" }), tdp: null, msrp: 899 },
  { category: "PSU", brand: "振华", model: "LEADEX VP 850", fullName: "振华 LEADEX VP 850W 白金全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "5年" }), tdp: null, msrp: 799 },
  { category: "PSU", brand: "振华", model: "LEADEX VP 1000", fullName: "振华 LEADEX VP 1000W 白金全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "5年" }), tdp: null, msrp: 899 },
  { category: "PSU", brand: "海韵", model: "PRIME TX-850", fullName: "海韵 PRIME TX-850 850W 钛金全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS钛金", modular: "全模组", fanSize: "135mm", warranty: "12年" }), tdp: null, msrp: 1299 },
  { category: "PSU", brand: "海韵", model: "PRIME TX-1000", fullName: "海韵 PRIME TX-1000 1000W 钛金全模组", specs: JSON.stringify({ wattage: 1000, certification: "80PLUS钛金", modular: "全模组", fanSize: "135mm", warranty: "12年" }), tdp: null, msrp: 1599 },
  { category: "PSU", brand: "华硕", model: "ROG THOR 850", fullName: "华硕 ROG THOR 850P2 850W 白金全模组", specs: JSON.stringify({ wattage: 850, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "10年", oled: true }), tdp: null, msrp: 1699 },
  { category: "PSU", brand: "华硕", model: "ROG THOR 1200", fullName: "华硕 ROG THOR 1200P2 1200W 白金全模组", specs: JSON.stringify({ wattage: 1200, certification: "80PLUS白金", modular: "全模组", fanSize: "135mm", warranty: "10年", oled: true }), tdp: null, msrp: 2299 },
  { category: "PSU", brand: "海盗船", model: "HX1500i", fullName: "海盗船 HX1500i 1500W 白金全模组", specs: JSON.stringify({ wattage: 1500, certification: "80PLUS白金", modular: "全模组", fanSize: "140mm", warranty: "10年" }), tdp: null, msrp: 2999 },

  // ==================== 机箱 (30款) ====================
  { category: "CASE", brand: "先马", model: "平头哥M1", fullName: "先马 平头哥M1 电竞版", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 350, maxCoolerHeight: 160, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 159 },
  { category: "CASE", brand: "先马", model: "趣造I'm", fullName: "先马 趣造I'm 钛灰", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 320, maxCoolerHeight: 155, fanSlots: 5, color: "钛灰" }), tdp: null, msrp: 199 },
  { category: "CASE", brand: "航嘉", model: "GS400C", fullName: "航嘉 GS400C 暗夜猎手5", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 340, maxCoolerHeight: 165, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 199 },
  { category: "CASE", brand: "爱国者", model: "YOGO M2", fullName: "爱国者 YOGO M2 钛灰色", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: 350, maxCoolerHeight: 160, fanSlots: 6, color: "钛灰" }), tdp: null, msrp: 219 },
  { category: "CASE", brand: "爱国者", model: "YOGO M3", fullName: "爱国者 YOGO M3 黑色", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 350, maxCoolerHeight: 160, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 249 },
  { category: "CASE", brand: "鑫谷", model: "图灵N5", fullName: "鑫谷 图灵N5", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 330, maxCoolerHeight: 160, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 179 },
  { category: "CASE", brand: "九州风神", model: "魔方310", fullName: "九州风神 魔方310", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 360, maxCoolerHeight: 170, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 299 },
  { category: "CASE", brand: "九州风神", model: "魔方550", fullName: "九州风神 魔方550", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 370, maxCoolerHeight: 170, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 399 },
  { category: "CASE", brand: "追风者", model: "P300A", fullName: "追风者 P300A", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 330, maxCoolerHeight: 160, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 349 },
  { category: "CASE", brand: "追风者", model: "P400A", fullName: "追风者 P400A", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 360, maxCoolerHeight: 160, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 449 },
  { category: "CASE", brand: "追风者", model: "P500A", fullName: "追风者 P500A", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 435, maxCoolerHeight: 170, fanSlots: 10, color: "黑色" }), tdp: null, msrp: 599 },
  { category: "CASE", brand: "恩杰", model: "H510", fullName: "恩杰 H510", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "纯色", maxGpuLength: 381, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 399 },
  { category: "CASE", brand: "恩杰", model: "H510 Flow", fullName: "恩杰 H510 Flow", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 381, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 449 },
  { category: "CASE", brand: "恩杰", model: "H7 Flow", fullName: "恩杰 H7 Flow", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 400, maxCoolerHeight: 185, fanSlots: 9, color: "黑色" }), tdp: null, msrp: 699 },
  { category: "CASE", brand: "分形工艺", model: "Meshify C", fullName: "分形工艺 Meshify C", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 315, maxCoolerHeight: 172, fanSlots: 5, color: "黑色" }), tdp: null, msrp: 499 },
  { category: "CASE", brand: "分形工艺", model: "Pop Air", fullName: "分形工艺 Pop Air", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 360, maxCoolerHeight: 170, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 549 },
  { category: "CASE", brand: "分形工艺", model: "Define 7", fullName: "分形工艺 Define 7", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "纯色", maxGpuLength: 491, maxCoolerHeight: 185, fanSlots: 9, color: "黑色" }), tdp: null, msrp: 899 },
  { category: "CASE", brand: "酷冷至尊", model: "NR600", fullName: "酷冷至尊 NR600", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 410, maxCoolerHeight: 167, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 349 },
  { category: "CASE", brand: "酷冷至尊", model: "TD500 Mesh", fullName: "酷冷至尊 TD500 Mesh V2", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 410, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 449 },
  { category: "CASE", brand: "联力", model: "包豪斯O11D", fullName: "联力 包豪斯 O11D 纯白", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "双面钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: 420, maxCoolerHeight: 167, fanSlots: 10, color: "白色" }), tdp: null, msrp: 699 },
  { category: "CASE", brand: "联力", model: "包豪斯O11D EVO", fullName: "联力 包豪斯 O11D EVO", specs: JSON.stringify({ formFactor: "E-ATX", sidePanel: "双面钢化玻璃", frontPanel: "Mesh", maxGpuLength: 422, maxCoolerHeight: 167, fanSlots: 10, color: "黑色" }), tdp: null, msrp: 899 },
  { category: "CASE", brand: "联力", model: "包豪斯Mini", fullName: "联力 包豪斯 O11D Mini", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "双面钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: 380, maxCoolerHeight: 170, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 599 },
  { category: "CASE", brand: "迎广", model: "303", fullName: "迎广 303 白色", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: 420, maxCoolerHeight: 160, fanSlots: 6, color: "白色" }), tdp: null, msrp: 599 },
  { category: "CASE", brand: "迎广", model: "A1 Plus", fullName: "迎广 A1 Plus 黑色", specs: JSON.stringify({ formFactor: "ITX", sidePanel: "钢化玻璃", frontPanel: "钢化玻璃", maxGpuLength: 320, maxCoolerHeight: 120, fanSlots: 4, color: "黑色" }), tdp: null, msrp: 899 },
  { category: "CASE", brand: "乔思伯", model: "D30", fullName: "乔思伯 D30 黑色", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 360, maxCoolerHeight: 165, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 349 },
  { category: "CASE", brand: "乔思伯", model: "D40", fullName: "乔思伯 D40 黑色", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 380, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 399 },
  { category: "CASE", brand: "银欣", model: "ALTA G1M", fullName: "银欣 ALTA G1M", specs: JSON.stringify({ formFactor: "M-ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 350, maxCoolerHeight: 170, fanSlots: 6, color: "黑色" }), tdp: null, msrp: 499 },
  { category: "CASE", brand: "普力魔", model: "620Q", fullName: "普力魔 620Q 黑色", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 420, maxCoolerHeight: 175, fanSlots: 9, color: "黑色" }), tdp: null, msrp: 549 },
  { category: "CASE", brand: "骨伽", model: "影武者X5", fullName: "骨伽 影武者X5", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 370, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 299 },
  { category: "CASE", brand: "长城", model: "魔镜M25", fullName: "长城 魔镜M25 黑色", specs: JSON.stringify({ formFactor: "ATX", sidePanel: "钢化玻璃", frontPanel: "Mesh", maxGpuLength: 360, maxCoolerHeight: 165, fanSlots: 7, color: "黑色" }), tdp: null, msrp: 249 },

  // ==================== 散热器 (30款) ====================
  { category: "COOLER", brand: "九州风神", model: "玄冰400", fullName: "九州风神 玄冰400 V5", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "500-1800RPM", noise: "27dB", height: 155, tdpRating: 180 }), tdp: 180, msrp: 89 },
  { category: "COOLER", brand: "九州风神", model: "玄冰500", fullName: "九州风神 玄冰500", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "500-1850RPM", noise: "27dB", height: 158, tdpRating: 200 }), tdp: 200, msrp: 129 },
  { category: "COOLER", brand: "利民", model: "AX120 R SE", fullName: "利民 AX120 R SE ARGB", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "1500RPM", noise: "25.6dB", height: 148, tdpRating: 200, rgb: true }), tdp: 200, msrp: 99 },
  { category: "COOLER", brand: "利民", model: "AX120 R", fullName: "利民 AX120 R", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "1500RPM", noise: "25.6dB", height: 148, tdpRating: 200 }), tdp: 200, msrp: 89 },
  { category: "COOLER", brand: "雅浚", model: "B3 PRO", fullName: "雅浚 B3 PRO ARGB", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "500-2000RPM", noise: "28dB", height: 155, tdpRating: 220, rgb: true }), tdp: 220, msrp: 149 },
  { category: "COOLER", brand: "雅浚", model: "G5", fullName: "雅浚 G5 ARGB", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm", fanSpeed: "500-2000RPM", noise: "28dB", height: 158, tdpRating: 250, rgb: true }), tdp: 250, msrp: 199 },
  { category: "COOLER", brand: "九州风神", model: "大霜塔", fullName: "九州风神 大霜塔 V5", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm x2", fanSpeed: "500-1800RPM", noise: "27dB", height: 160, tdpRating: 260 }), tdp: 260, msrp: 199 },
  { category: "COOLER", brand: "利民", model: "PA120 SE", fullName: "利民 PA120 SE AGHP", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", height: 157, tdpRating: 265 }), tdp: 265, msrp: 179 },
  { category: "COOLER", brand: "利民", model: "PA120", fullName: "利民 PA120 AGHP", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", height: 157, tdpRating: 280 }), tdp: 280, msrp: 219 },
  { category: "COOLER", brand: "利民", model: "FC140", fullName: "利民 FC140", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "140mm+120mm", fanSpeed: "1500RPM", noise: "25.6dB", height: 160, tdpRating: 280 }), tdp: 280, msrp: 299 },
  { category: "COOLER", brand: "猫头鹰", model: "NH-U12A", fullName: "猫头鹰 NH-U12A", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "120mm x2", fanSpeed: "300-2000RPM", noise: "22.6dB", height: 158, tdpRating: 220 }), tdp: 220, msrp: 799 },
  { category: "COOLER", brand: "猫头鹰", model: "NH-D15", fullName: "猫头鹰 NH-D15", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700", "AM5", "AM4"], fanSize: "140mm x2", fanSpeed: "300-1500RPM", noise: "24.6dB", height: 165, tdpRating: 250 }), tdp: 250, msrp: 899 },
  { category: "COOLER", brand: "猫头鹰", model: "NH-L9i", fullName: "猫头鹰 NH-L9i chromax", specs: JSON.stringify({ type: "风冷", sockets: ["LGA1700"], fanSize: "92mm", fanSpeed: "300-2500RPM", noise: "23.6dB", height: 37, tdpRating: 95 }), tdp: 95, msrp: 399 },
  { category: "COOLER", brand: "九州风神", model: "冰堡垒240", fullName: "九州风神 冰堡垒 240 数显版", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "500-2250RPM", noise: "32.6dB", tdpRating: 280, display: true }), tdp: 280, msrp: 399 },
  { category: "COOLER", brand: "九州风神", model: "冰堡垒360", fullName: "九州风神 冰堡垒 360 数显版", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "500-2250RPM", noise: "32.6dB", tdpRating: 350, display: true }), tdp: 350, msrp: 549 },
  { category: "COOLER", brand: "九州风神", model: "冰魔方240", fullName: "九州风神 冰魔方 240", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "500-2250RPM", noise: "32.6dB", tdpRating: 280, rgb: true }), tdp: 280, msrp: 349 },
  { category: "COOLER", brand: "九州风神", model: "冰魔方360", fullName: "九州风神 冰魔方 360", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "500-2250RPM", noise: "32.6dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 599 },
  { category: "COOLER", brand: "利民", model: "Frozen Magic 240", fullName: "利民 Frozen Magic 240 ARGB", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", tdpRating: 280, rgb: true }), tdp: 280, msrp: 299 },
  { category: "COOLER", brand: "利民", model: "Frozen Magic 360", fullName: "利民 Frozen Magic 360 ARGB", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "1500RPM", noise: "25.6dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 449 },
  { category: "COOLER", brand: "利民", model: "Frozen Notte 240", fullName: "利民 Frozen Notte 240", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "1500RPM", noise: "25.6dB", tdpRating: 280 }), tdp: 280, msrp: 259 },
  { category: "COOLER", brand: "瓦尔基里", model: "C240", fullName: "瓦尔基里 C240 ARGB", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "800-2200RPM", noise: "30dB", tdpRating: 300, rgb: true }), tdp: 300, msrp: 349 },
  { category: "COOLER", brand: "瓦尔基里", model: "C360", fullName: "瓦尔基里 C360 ARGB", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "800-2200RPM", noise: "30dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 499 },
  { category: "COOLER", brand: "瓦尔基里", model: "GL360", fullName: "瓦尔基里 GL360 ARGB", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "800-2200RPM", noise: "30dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 599 },
  { category: "COOLER", brand: "恩杰", model: "Kraken X53", fullName: "恩杰 Kraken X53 240mm", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "500-2000RPM", noise: "38dB", tdpRating: 280, display: true }), tdp: 280, msrp: 899 },
  { category: "COOLER", brand: "恩杰", model: "Kraken X63", fullName: "恩杰 Kraken X63 280mm", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "280mm", fanSize: "140mm x2", fanSpeed: "500-2000RPM", noise: "38dB", tdpRating: 300, display: true }), tdp: 300, msrp: 999 },
  { category: "COOLER", brand: "恩杰", model: "Kraken X73", fullName: "恩杰 Kraken X73 360mm", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "500-2000RPM", noise: "38dB", tdpRating: 350, display: true }), tdp: 350, msrp: 1299 },
  { category: "COOLER", brand: "海盗船", model: "H100i", fullName: "海盗船 H100i Elite Capellix 240mm", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "2400RPM", noise: "36dB", tdpRating: 280, rgb: true }), tdp: 280, msrp: 899 },
  { category: "COOLER", brand: "海盗船", model: "H150i", fullName: "海盗船 H150i Elite Capellix 360mm", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "2400RPM", noise: "36dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 1299 },
  { category: "COOLER", brand: "华硕", model: "ROG 龙神240", fullName: "华硕 ROG STRIX LC II 240", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "240mm", fanSize: "120mm x2", fanSpeed: "800-2500RPM", noise: "37dB", tdpRating: 280, rgb: true }), tdp: 280, msrp: 799 },
  { category: "COOLER", brand: "华硕", model: "ROG 龙神360", fullName: "华硕 ROG STRIX LC II 360", specs: JSON.stringify({ type: "水冷", sockets: ["LGA1700", "AM5", "AM4"], radiator: "360mm", fanSize: "120mm x3", fanSpeed: "800-2500RPM", noise: "37dB", tdpRating: 350, rgb: true }), tdp: 350, msrp: 1099 },
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
    name: "4000元入门游戏主机",
    budgetMin: 3500,
    budgetMax: 4500,
    useCase: "gaming",
    priority: "value",
    components: JSON.stringify({ cpu: "i3-12100F", gpu: "RTX 3050", mobo: "H610M-K", ram: "FURY 16G DDR4", ssd: "RC20 1TB", psu: "X5", case: "平头哥M1", cooler: "玄冰400" }),
    totalPrice: 398000,
    description: "i3-12100F + RTX 3050，1080P中低画质流畅玩网游",
    source: "小红书装机攻略",
    sourceUrl: "https://www.xiaohongshu.com",
    isVerified: true,
  },
  {
    name: "5000元主流游戏主机",
    budgetMin: 4500,
    budgetMax: 5500,
    useCase: "gaming",
    priority: "value",
    components: JSON.stringify({ cpu: "R5 5600", gpu: "RTX 4060", mobo: "B660M-K", ram: "FURY 16G DDR4", ssd: "SN570 1TB", psu: "X6", case: "YOGO M2", cooler: "AX120 R SE" }),
    totalPrice: 498000,
    description: "R5 5600 + RTX 4060，1080P高画质通杀大部分游戏",
    source: "知乎装机指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
  {
    name: "6000元游戏主机",
    budgetMin: 5500,
    budgetMax: 6500,
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
    name: "7000元2K游戏主机",
    budgetMin: 6500,
    budgetMax: 7500,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "i5-12400F", gpu: "RTX 4060 Ti 8G", mobo: "B760M-K", ram: "FURY 32G DDR5", ssd: "SN770 1TB", psu: "LEADEX III 650", case: "YOGO M3", cooler: "AX120 R" }),
    totalPrice: 698000,
    description: "i5-12400F + RTX 4060 Ti，2K中高画质流畅游戏",
    source: "贴吧配置吧",
    sourceUrl: "https://tieba.baidu.com/f?kw=配置",
    isVerified: true,
  },
  {
    name: "8000元高性能游戏主机",
    budgetMin: 7500,
    budgetMax: 8500,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "R5 7500F", gpu: "RTX 4070", mobo: "B650M AORUS", ram: "幻锋戟 32G DDR5", ssd: "SN770 1TB", psu: "FOCUS GX-750", case: "P400A", cooler: "PA120 SE" }),
    totalPrice: 798000,
    description: "R5 7500F + RTX 4070，2K高画质无压力，4K可玩",
    source: "知乎装机指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
  {
    name: "9000元高端游戏主机",
    budgetMin: 8500,
    budgetMax: 9500,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "i5-13600KF", gpu: "RTX 4070 Super", mobo: "B760M MORTAR", ram: "幻锋戟 32G DDR5", ssd: "990 Pro 1TB", psu: "RM750e", case: "P400A", cooler: "PA120" }),
    totalPrice: 898000,
    description: "i5-13600KF + RTX 4070 Super，2K高刷电竞级体验",
    source: "B站装机视频",
    sourceUrl: "https://www.bilibili.com",
    isVerified: true,
  },
  {
    name: "10000元高端游戏主机",
    budgetMin: 9500,
    budgetMax: 10500,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "R7 7800X3D", gpu: "RTX 4070 Super", mobo: "B650M MORTAR", ram: "幻锋戟 32G DDR5", ssd: "990 Pro 1TB", psu: "RM750e", case: "包豪斯O11D", cooler: "冰堡垒240" }),
    totalPrice: 1028200,
    description: "7800X3D + RTX 4070 Super，2K高刷游戏无压力",
    source: "知乎装机指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
  {
    name: "12000元旗舰游戏主机",
    budgetMin: 11000,
    budgetMax: 13000,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "i7-13700KF", gpu: "RTX 4070 Ti Super", mobo: "Z790-A", ram: "幻锋戟 32G DDR5 6400", ssd: "990 Pro 2TB", psu: "RM850e", case: "包豪斯O11D", cooler: "冰堡垒360" }),
    totalPrice: 1198000,
    description: "i7-13700KF + RTX 4070 Ti Super，4K高画质流畅游戏",
    source: "B站装机视频",
    sourceUrl: "https://www.bilibili.com",
    isVerified: true,
  },
  {
    name: "15000元顶级游戏主机",
    budgetMin: 13500,
    budgetMax: 16000,
    useCase: "gaming",
    priority: "performance",
    components: JSON.stringify({ cpu: "i9-14900KF", gpu: "RTX 4080 Super", mobo: "Z790 AORUS", ram: "幻锋戟 32G DDR5 6400", ssd: "990 Pro 2TB", psu: "RM1000x", case: "包豪斯O11D", cooler: "冰堡垒360" }),
    totalPrice: 1498000,
    description: "i9-14900KF + RTX 4080 Super，4K高刷旗舰级体验",
    source: "知乎装机指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
  {
    name: "6000元视频剪辑主机",
    budgetMin: 5500,
    budgetMax: 6500,
    useCase: "content",
    priority: "value",
    components: JSON.stringify({ cpu: "i5-13400F", gpu: "RTX 4060", mobo: "B760M-K", ram: "FURY 32G DDR5", ssd: "SN770 1TB", psu: "X7", case: "YOGO M2", cooler: "AX120 R" }),
    totalPrice: 598000,
    description: "i5-13400F + RTX 4060 + 32G内存，PR/AE剪辑流畅",
    source: "小红书创作攻略",
    sourceUrl: "https://www.xiaohongshu.com",
    isVerified: true,
  },
  {
    name: "10000元3D建模主机",
    budgetMin: 9000,
    budgetMax: 11000,
    useCase: "3d",
    priority: "performance",
    components: JSON.stringify({ cpu: "i7-14700KF", gpu: "RTX 4070 Super", mobo: "B760M MORTAR", ram: "FURY 64G DDR4", ssd: "990 Pro 2TB", psu: "RM850e", case: "P500A", cooler: "冰堡垒360" }),
    totalPrice: 998000,
    description: "i7-14700KF + RTX 4070 Super + 64G内存，Blender/C4D流畅",
    source: "知乎设计指南",
    sourceUrl: "https://www.zhihu.com",
    isVerified: true,
  },
]

function jdPrice(msrpYuan: number): number {
  const factor = 0.95 + Math.random() * 0.1
  return Math.round(msrpYuan * factor) * 100
}

async function main() {
  console.log("开始清空旧数据...")
  await prisma.price.deleteMany()
  await prisma.crawlTask.deleteMany()
  await prisma.hardware.deleteMany()
  await prisma.presetConfig.deleteMany()

  console.log(`批量创建 ${hardwareData.length} 款硬件...`)
  const createdHardware = await prisma.hardware.createMany({
    data: hardwareData,
  })
  console.log(`  硬件创建完成: ${createdHardware.count} 款`)

  // 按品类统计
  const categoryCount: Record<string, number> = {}
  for (const hw of hardwareData) {
    categoryCount[hw.category] = (categoryCount[hw.category] || 0) + 1
  }
  console.log("  各品类数量:", JSON.stringify(categoryCount))

  // 查询所有硬件获取ID
  const allHardware = await prisma.hardware.findMany({ select: { id: true, brand: true, model: true, msrp: true } })
  console.log(`  获取到 ${allHardware.length} 个硬件ID`)

  // 批量创建价格
  console.log("批量创建价格记录...")
  const priceData: any[] = []
  for (const hw of allHardware) {
    const msrp = hw.msrp || 1000
    const jd = jdPrice(msrp)
    const keyword = `${hw.brand} ${hw.model}`
    priceData.push({
      hardwareId: hw.id,
      platform: "jd",
      shopName: "京东参考价",
      productUrl: `https://search.jd.com/Search?keyword=${encodeURIComponent(keyword)}`,
      price: jd,
      originalPrice: Math.round(jd * 1.1),
      inStock: true,
      crawledAt: new Date(),
    })
    const tmall = Math.floor((jd * 0.97) / 100) * 100
    priceData.push({
      hardwareId: hw.id,
      platform: "tmall",
      shopName: "天猫参考价",
      productUrl: `https://list.tmall.com/search_product.htm?q=${encodeURIComponent(keyword)}`,
      price: tmall,
      originalPrice: Math.round(tmall * 1.1),
      inStock: true,
      crawledAt: new Date(),
    })
  }
  await prisma.price.createMany({ data: priceData })
  console.log(`  价格创建完成: ${priceData.length} 条`)

  // 批量创建预置配置
  console.log("批量创建预置配置...")
  await prisma.presetConfig.createMany({ data: presetConfigs })
  console.log(`  配置创建完成: ${presetConfigs.length} 套`)

  // 批量创建爬取任务
  console.log("批量创建爬取任务...")
  const crawlData: any[] = []
  for (const hw of allHardware) {
    for (const platform of ["jd", "tmall"]) {
      crawlData.push({
        hardwareId: hw.id,
        platform,
        status: "success",
        lastSuccessAt: new Date(),
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
    }
  }
  await prisma.crawlTask.createMany({ data: crawlData })
  console.log(`  爬取任务创建完成: ${crawlData.length} 个`)

  console.log("\n全部完成！")
  console.log(`  硬件: ${hardwareData.length} 款`)
  console.log(`  价格: ${priceData.length} 条`)
  console.log(`  配置: ${presetConfigs.length} 套`)
  console.log(`  爬取任务: ${crawlData.length} 个`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
