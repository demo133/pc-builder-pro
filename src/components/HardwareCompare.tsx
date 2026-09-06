"use client"

import { parseSpecs, getCompareParams } from "@/lib/performance"
import { X } from "lucide-react"

export interface CompareHardware {
  id: number
  brand: string
  model: string
  fullName: string
  specs: string | null
  price?: number
  category: string
}

interface Props {
  itemA: CompareHardware
  itemB: CompareHardware
  onClose: () => void
  onSelect: (item: CompareHardware) => void
}

// 判断数值型参数哪个更优
function compareNumeric(
  valA: string,
  valB: string,
  label: string
): "A" | "B" | "tie" | null {
  // 提取数字
  const numA = parseFloat(valA.replace(/[^\d.]/g, ""))
  const numB = parseFloat(valB.replace(/[^\d.]/g, ""))

  if (isNaN(numA) || isNaN(numB)) return null

  // 这些参数越小越好
  const smallerIsBetter = ["TDP", "噪音", "电压", "时序", "长度"]
  const smaller = smallerIsBetter.some((k) => label.includes(k))

  if (numA === numB) return "tie"
  if (smaller) return numA < numB ? "A" : "B"
  return numA > numB ? "A" : "B"
}

export default function HardwareCompare({ itemA, itemB, onClose, onSelect }: Props) {
  const specsA = parseSpecs(itemA.specs)
  const specsB = parseSpecs(itemB.specs)

  const paramsA = getCompareParams(itemA.category, specsA)
  const paramsB = getCompareParams(itemB.category, specsB)

  // 合并所有参数标签
  const allLabels = [...new Set([...paramsA.map((p) => p.label), ...paramsB.map((p) => p.label)])]

  const getValue = (params: { label: string; value: string }[], label: string) =>
    params.find((p) => p.label === label)?.value || "-"

  const priceA = itemA.price ? `¥${(itemA.price / 100).toFixed(0)}` : "-"
  const priceB = itemB.price ? `¥${(itemB.price / 100).toFixed(0)}` : "-"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-5 border-b border-black/10">
          <h3 className="text-lg font-semibold text-black/90">硬件对比</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-black/50" />
          </button>
        </div>

        {/* 对比表格 */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-black/10">
                <th className="text-left p-4 text-sm font-medium text-black/40 w-28">参数</th>
                <th className="text-left p-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-black/90 text-sm">{itemA.brand} {itemA.model}</p>
                    <p className="text-lg font-bold text-black">{priceA}</p>
                  </div>
                </th>
                <th className="text-left p-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-black/90 text-sm">{itemB.brand} {itemB.model}</p>
                    <p className="text-lg font-bold text-black">{priceB}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {allLabels.map((label) => {
                const valA = getValue(paramsA, label)
                const valB = getValue(paramsB, label)
                const winner = compareNumeric(valA, valB, label)

                return (
                  <tr key={label} className="border-b border-black/5 hover:bg-black/[0.02]">
                    <td className="p-4 text-sm text-black/50">{label}</td>
                    <td
                      className={`p-4 text-sm ${
                        winner === "A"
                          ? "font-semibold text-green-700 bg-green-50/50"
                          : "text-black/70"
                      }`}
                    >
                      {valA}
                      {winner === "A" && <span className="ml-1 text-xs">✓</span>}
                    </td>
                    <td
                      className={`p-4 text-sm ${
                        winner === "B"
                          ? "font-semibold text-green-700 bg-green-50/50"
                          : "text-black/70"
                      }`}
                    >
                      {valB}
                      {winner === "B" && <span className="ml-1 text-xs">✓</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 底部选择按钮 */}
        <div className="flex gap-3 p-5 border-t border-black/10 bg-black/[0.02]">
          <button
            onClick={() => onSelect(itemA)}
            className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors active:scale-[0.98]"
          >
            选择 {itemA.model}
          </button>
          <button
            onClick={() => onSelect(itemB)}
            className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors active:scale-[0.98]"
          >
            选择 {itemB.model}
          </button>
        </div>
      </div>
    </div>
  )
}
