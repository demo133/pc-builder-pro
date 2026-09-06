import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-cyan-500 text-white hover:bg-cyan-600",
        secondary: "border-transparent bg-slate-700 text-slate-100 hover:bg-slate-600",
        destructive: "border-transparent bg-red-500/10 text-red-400 border-red-500/30",
        outline: "text-slate-300 border-slate-600",
        success: "border-transparent bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        warning: "border-transparent bg-amber-500/10 text-amber-400 border-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
