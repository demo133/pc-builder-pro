"use client"

import { PerformanceScore as PerformanceScoreType } from "@/lib/performance"

interface Props {
  score: PerformanceScoreType
}

const levelColors: Record<string, string> = {
  入门: "text-gray-500",
  主流: "text-blue-600",
  中高端: "text-green-600",
  高端: "text-orange-600",
  旗舰: "text-red-600",
}

function ScoreBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-black/60 flex items-center gap-1.5">
          <span>{icon}</span>
          {label}
        </span>
        <span className="font-semibold text-black/80">{value}</span>
      </div>
      <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function PerformanceScore({ score }: Props) {
  const { overall, cpu, gpu, memory, storage, level, bottleneck } = score

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black/90">性能估测</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full bg-black/5 ${levelColors[level]}`}>
          {level}
        </span>
      </div>

      {/* 综合评分 */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f0f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(overall / 100) * 264} 264`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-black/90">{overall}</span>
            <span className="text-xs text-black/40">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <ScoreBar label="处理器" value={cpu} icon="⚡" />
          <ScoreBar label="显卡" value={gpu} icon="🎮" />
          <ScoreBar label="内存" value={memory} icon="💾" />
          <ScoreBar label="存储" value={storage} icon="📀" />
        </div>
      </div>

      {/* 瓶颈提示 */}
      {bottleneck && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-amber-600 flex-shrink-0">⚠️</span>
          <p className="text-sm text-amber-800">{bottleneck}</p>
        </div>
      )}

      <p className="text-xs text-black/40">
        * 基于硬件规格的估算评分，仅供参考，实际性能因驱动、优化、散热等因素而异
      </p>
    </div>
  )
}
