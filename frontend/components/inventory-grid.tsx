"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BloodGroupBadge } from "@/components/blood-group-badge"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/lib/data/types"

interface InventoryGridProps {
  items: InventoryItem[]
  onAdjust?: (bloodGroup: string, units: number) => void
  editable?: boolean
}

function getStockLevel(units: number): { label: string; color: string } {
  if (units <= 5) return { label: "Critical", color: "text-red-600 dark:text-red-400" }
  if (units <= 15) return { label: "Low", color: "text-amber-600 dark:text-amber-400" }
  return { label: "Adequate", color: "text-emerald-600 dark:text-emerald-400" }
}

export function InventoryGrid({ items, onAdjust, editable }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(item => {
        const stock = getStockLevel(item.units)
        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4 text-center">
              <BloodGroupBadge group={item.bloodGroup} size="lg" className="mb-2" />
              <p className="text-2xl font-bold mt-2">{item.units}</p>
              <p className="text-xs text-muted-foreground">units</p>
              <p className={cn("text-xs font-medium mt-1", stock.color)}>{stock.label}</p>
              {editable && onAdjust && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <button
                    onClick={() => onAdjust(item.bloodGroup, Math.max(0, item.units - 1))}
                    className="h-6 w-6 rounded bg-muted text-foreground flex items-center justify-center text-sm hover:bg-accent transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onAdjust(item.bloodGroup, item.units + 1)}
                    className="h-6 w-6 rounded bg-muted text-foreground flex items-center justify-center text-sm hover:bg-accent transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
