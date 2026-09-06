"use client"

import { GitBranch, Mail, Cpu } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#f5f5f7]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* 左侧：品牌 */}
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#00b4a8]" />
            <span className="text-base font-semibold text-black">PC Builder Pro</span>
          </div>

          {/* 中间：作者信息 */}
          <div className="text-center text-sm text-black/60">
            <div className="flex items-center justify-center gap-1">
              <span>作者：</span>
              <a
                href="https://github.com/demo133"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-[#00b4a8] hover:underline"
              >
                <GitBranch className="h-3.5 w-3.5" />
                demo133
              </a>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a
                href="mailto:3053362391@qq.com"
                className="flex items-center gap-1 text-black/50 hover:text-[#00b4a8] transition-colors"
              >
                <Mail className="h-3 w-3" />
                3053362391@qq.com
              </a>
              <a
                href="mailto:haogu43@gmail.com"
                className="flex items-center gap-1 text-black/50 hover:text-[#00b4a8] transition-colors"
              >
                <Mail className="h-3 w-3" />
                haogu43@gmail.com
              </a>
            </div>
          </div>

          {/* 右侧：版权 */}
          <div className="text-xs text-black/40">
            © {new Date().getFullYear()} PC Builder Pro
            <br />
            价格仅供参考，以实际商城为准
          </div>
        </div>
      </div>
    </footer>
  )
}
