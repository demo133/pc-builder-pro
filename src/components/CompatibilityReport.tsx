"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import {
  checkCompatibility,
  type Components,
  type Issue,
} from "@/lib/compatibility"

interface CompatibilityReportProps {
  components: Components
}

export function CompatibilityReport({ components }: CompatibilityReportProps) {
  const result = useMemo(() => checkCompatibility(components), [components])

  const fatalIssues = result.issues.filter((i) => i.level === "fatal")
  const warningIssues = result.issues.filter((i) => i.level === "warning")
  const infoIssues = result.issues.filter((i) => i.level === "info")

  const selectedCount = Object.values(components).filter(Boolean).length

  // 评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  const renderIssue = (issue: Issue, index: number) => {
    const config = {
      fatal: {
        icon: XCircle,
        bg: "bg-red-500/10 border-red-500/30",
        text: "text-red-400",
        label: "致命",
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-amber-500/10 border-amber-500/30",
        text: "text-amber-400",
        label: "警告",
      },
      info: {
        icon: Info,
        bg: "bg-blue-500/10 border-blue-500/30",
        text: "text-blue-400",
        label: "提示",
      },
    }[issue.level]

    const Icon = config.icon
    return (
      <div
        key={index}
        className={`rounded-lg border p-3 ${config.bg}`}
      >
        <div className="flex items-start gap-2">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.text}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${config.text} border-current`}>
                {config.label}
              </Badge>
              <span className="text-xs text-slate-500">{issue.category}</span>
            </div>
            <p className="mt-1 text-sm text-slate-200">{issue.message}</p>
            {issue.suggestion && (
              <p className="mt-1 text-xs text-slate-400">
                建议：{issue.suggestion}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          兼容性体检
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 评分 */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}
          </div>
          <div className="text-xs text-slate-400">综合评分 / 100</div>
          <Progress
            value={result.score}
            className={`mt-2 h-2 ${getScoreBg(result.score)}`}
          />
        </div>

        {/* 总评 */}
        <div className="rounded-lg bg-slate-700/30 p-3 text-center text-sm text-slate-300">
          {result.summary}
        </div>

        {/* 统计 */}
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-red-400">致命 {fatalIssues.length}</span>
          <span className="text-amber-400">警告 {warningIssues.length}</span>
          <span className="text-blue-400">提示 {infoIssues.length}</span>
        </div>

        {/* 问题列表 */}
        {selectedCount === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500">
            选择硬件后自动检测兼容性
          </div>
        ) : (
          <div className="space-y-2">
            {fatalIssues.map((issue, i) => renderIssue(issue, i))}
            {warningIssues.map((issue, i) =>
              renderIssue(issue, i + fatalIssues.length)
            )}
            {infoIssues.map((issue, i) =>
              renderIssue(issue, i + fatalIssues.length + warningIssues.length)
            )}
            {result.issues.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                全部通过，无兼容性问题
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
