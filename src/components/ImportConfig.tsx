"use client"

import { useState } from "react"
import { X, Upload, Sparkles, Check, AlertCircle } from "lucide-react"
import { parseConfigText, type ParsedHardware } from "@/lib/configParser"

interface HardwareLite {
  id: number
  category: string
  brand: string
  model: string
  fullName: string
}

interface Props {
  hardwareList: HardwareLite[]
  onImport: (items: { category: string; hardwareId: number }[]) => void
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  CPU: "CPU 处理器",
  GPU: "显卡",
  MOBO: "主板",
  RAM: "内存",
  SSD: "固态硬盘",
  PSU: "电源",
  CASE: "机箱",
  COOLER: "散热器",
}

export default function ImportConfig({ hardwareList, onImport, onClose }: Props) {
  const [text, setText] = useState("")
  const [parsed, setParsed] = useState<ParsedHardware[] | null>(null)
  const [parsing, setParsing] = useState(false)

  const handleParse = () => {
    if (!text.trim()) return
    setParsing(true)
    // 模拟 AI 识别延迟
    setTimeout(() => {
      const result = parseConfigText(text, hardwareList)
      setParsed(result.items)
      setParsing(false)
    }, 600)
  }

  const handleImport = () => {
    if (!parsed) return
    const items = parsed
      .filter((p) => p.matchedId)
      .map((p) => ({ category: p.category, hardwareId: p.matchedId! }))
    onImport(items)
    onClose()
  }

  const matchedCount = parsed?.filter((p) => p.matchedId).length || 0
  const totalCount = parsed?.length || 0

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-5 border-b border-black/10">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#00b4a8]" />
            <h3 className="text-lg font-semibold text-black">导入配置</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-black/50" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* 输入区 */}
          <div>
            <label className="block text-sm font-medium text-black/70 mb-2">
              粘贴配置文本（支持从贴吧、小红书、知乎等复制的配置清单）
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"例如：\nCPU：i5-12400F\n显卡：RTX 4060\n主板：B760M\n内存：16G DDR4\n固态：1TB NVMe\n电源：650W金牌"}
              className="w-full h-36 rounded-xl border border-black/10 bg-[#f5f5f7] p-3 text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#00b4a8]/30 focus:border-[#00b4a8]"
            />
          </div>

          {/* 识别按钮 */}
          <button
            onClick={handleParse}
            disabled={!text.trim() || parsing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#00b4a8] text-white font-medium hover:bg-[#00a094] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {parsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI 识别中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                智能识别硬件
              </>
            )}
          </button>

          {/* 解析结果 */}
          {parsed && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black/70">
                  识别结果（{matchedCount}/{totalCount} 匹配成功）
                </span>
                {matchedCount < totalCount && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    部分硬件未匹配，可手动选择
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {parsed.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 ${
                      item.matchedId
                        ? "border-[#00b4a8]/30 bg-[#00b4a8]/5"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-black/60">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </span>
                          {item.matchedId ? (
                            <span className="flex items-center gap-1 text-xs text-[#00b4a8]">
                              <Check className="w-3 h-3" />
                              匹配 {item.confidence}%
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600">未匹配</span>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-black/50 truncate">
                          原文：{item.rawText}
                        </div>
                        {item.matchedModel && (
                          <div className="mt-0.5 text-sm font-medium text-black">
                            → {item.matchedModel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        {parsed && matchedCount > 0 && (
          <div className="p-5 border-t border-black/10">
            <button
              onClick={handleImport}
              className="w-full py-2.5 rounded-full bg-black text-white font-medium hover:bg-black/80 transition-colors"
            >
              导入 {matchedCount} 件硬件到配置
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
