import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BloodGroup } from "@/lib/data/types"

const groupColors: Record<BloodGroup, string> = {
  "A+": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "A-": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  "B+": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "B-": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  "AB+": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "AB-": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "O+": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "O-": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
}

interface BloodGroupBadgeProps {
  group: BloodGroup | string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BloodGroupBadge({ group, className, size = "md" }: BloodGroupBadgeProps) {
  const color = groupColors[group as BloodGroup] || "bg-muted text-muted-foreground"
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0" : size === "lg" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5"

  return (
    <Badge variant="secondary" className={cn("font-bold border-0", color, sizeClass, className)}>
      {group}
    </Badge>
  )
}
