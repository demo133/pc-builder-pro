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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00b4a8]"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-[#00b4a8]"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  const renderIssue = (issue: Issue, index: number) => {
    const config = {
      fatal: {
        icon: XCircle,
        bg: "bg-red-50 border-red-200",
        text: "text-red-600",
        label: "致命",
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-600",
        label: "警告",
      },
      info: {
        icon: Info,
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-600",
        label: "提示",
      },
    }[issue.level]

    const Icon = config.icon
    return (
      <div
        key={index}
        className={`rounded-xl border p-3 ${config.bg}`}
      >
        <div className="flex items-start gap-2">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.text}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${config.text} border-current`}>
                {config.label}
              </Badge>
              <span className="text-xs text-black/60">{issue.category}</span>
            </div>
            <p className="mt-1 text-sm text-black/80">{issue.message}</p>
            {issue.suggestion && (
              <p className="mt-1 text-xs text-black/70">
                建议：{issue.suggestion}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 bg-[#f5f5f7] shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-black">
          <ShieldCheck className="h-5 w-5 text-black" />
          兼容性体检
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 评分 */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}
          </div>
          <div className="text-xs text-black/60">综合评分 / 100</div>
          <Progress
            value={result.score}
            className={`mt-2 h-1.5 ${getScoreBg(result.score)}`}
          />
        </div>

        {/* 总评 */}
        <div className="rounded-xl bg-white p-3 text-center text-sm text-black/60">
          {result.summary}
        </div>

        {/* 统计 */}
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-red-600">致命 {fatalIssues.length}</span>
          <span className="text-amber-600">警告 {warningIssues.length}</span>
          <span className="text-blue-600">提示 {infoIssues.length}</span>
        </div>

        {/* 问题列表 */}
        {selectedCount === 0 ? (
          <div className="py-4 text-center text-sm text-black/70">
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
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-black">
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
