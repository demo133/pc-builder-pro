"use client"

import { GameBenchmark as GameBenchmarkType } from "@/lib/performance"

interface Props {
  benchmarks: GameBenchmarkType[]
  hasGPU: boolean
}

function getFPSLevel(fps: number): { label: string; color: string; bg: string } {
  if (fps >= 144) return { label: "电竞级", color: "text-green-700", bg: "bg-green-100" }
  if (fps >= 100) return { label: "非常流畅", color: "text-blue-700", bg: "bg-blue-100" }
  if (fps >= 60) return { label: "流畅", color: "text-black/70", bg: "bg-black/5" }
  if (fps >= 30) return { label: "可玩", color: "text-amber-700", bg: "bg-amber-100" }
  return { label: "卡顿", color: "text-red-700", bg: "bg-red-100" }
}

function FPSBar({ fps, max }: { fps: number; max: number }) {
  const width = Math.min((fps / max) * 100, 100)
  return (
    <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#00b4a8] rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export default function GameBenchmark({ benchmarks, hasGPU }: Props) {
  if (!hasGPU) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <h3 className="text-lg font-semibold text-black/90 mb-4">游戏帧数预测</h3>
        <div className="text-center py-8 text-black/60">
          <p className="text-4xl mb-2">🎮</p>
          <p className="text-sm">请先选择独立显卡以预测游戏帧数</p>
        </div>
      </div>
    )
  }

  const maxFPS = Math.max(...benchmarks.map((b) => Math.max(b.fps1080p, b.fps2k)), 1)

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-black/90">游戏帧数预测</h3>
        <span className="text-xs text-black/60">高画质 · 估算值</span>
      </div>

      <div className="space-y-4">
        {benchmarks.map((game) => {
          const level1080 = getFPSLevel(game.fps1080p)
          const level2k = getFPSLevel(game.fps2k)
          return (
            <div key={game.game} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{game.icon}</span>
                  <span className="font-medium text-black/80 text-sm">{game.game}</span>
                  <span className="text-xs text-black/60">{game.setting}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 1080p */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-black/70">1080P</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-black/80">{game.fps1080p}</span>
                      <span className="text-xs text-black/60">FPS</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${level1080.bg} ${level1080.color}`}>
                        {level1080.label}
                      </span>
                    </div>
                  </div>
                  <FPSBar fps={game.fps1080p} max={maxFPS} />
                </div>

                {/* 2K */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-black/70">2K</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-black/80">{game.fps2k}</span>
                      <span className="text-xs text-black/60">FPS</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${level2k.bg} ${level2k.color}`}>
                        {level2k.label}
                      </span>
                    </div>
                  </div>
                  <FPSBar fps={game.fps2k} max={maxFPS} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-black/60 mt-5 pt-4 border-t border-black/5">
        * 基于硬件规格的估算帧数，实际表现因驱动版本、游戏更新、后台程序、散热等因素而异
      </p>
    </div>
  )
}
