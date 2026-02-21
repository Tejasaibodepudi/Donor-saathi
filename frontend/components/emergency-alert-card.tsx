import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BloodGroupBadge } from "@/components/blood-group-badge"
import { AlertTriangle, Clock, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EmergencyRequest } from "@/lib/data/types"
import { formatDistanceToNow } from "date-fns"

const priorityStyles = {
  critical: "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
  urgent: "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20",
  normal: "border-border",
}

const priorityBadge = {
  critical: "bg-red-600 text-white hover:bg-red-600",
  urgent: "bg-amber-600 text-white hover:bg-amber-600",
  normal: "bg-muted text-muted-foreground hover:bg-muted",
}

interface EmergencyAlertCardProps {
  emergency: EmergencyRequest
  actions?: React.ReactNode
}

export function EmergencyAlertCard({ emergency, actions }: EmergencyAlertCardProps) {
  const isExpired = new Date(emergency.expiresAt) < new Date()
  const progress = emergency.unitsNeeded > 0 ? (emergency.unitsFulfilled / emergency.unitsNeeded) * 100 : 0

  return (
    <Card className={cn("transition-colors", priorityStyles[emergency.priority])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-4 w-4",
              emergency.priority === "critical" ? "text-red-600" : emergency.priority === "urgent" ? "text-amber-600" : "text-muted-foreground"
            )} />
            <Badge className={priorityBadge[emergency.priority]}>{emergency.priority}</Badge>
            <BloodGroupBadge group={emergency.bloodGroup} />
          </div>
          {(isExpired || emergency.status === "fulfilled") && (
            <Badge variant="secondary">{isExpired ? "Expired" : "Fulfilled"}</Badge>
          )}
        </div>

        <div className="mt-3 space-y-1.5">
          <p className="font-medium text-sm">{emergency.reason}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{emergency.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{emergency.contactPhone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(emergency.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Units fulfilled</span>
            <span className="font-medium">{emergency.unitsFulfilled} / {emergency.unitsNeeded}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", progress >= 100 ? "bg-emerald-500" : "bg-primary")}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {actions && <div className="mt-3 flex gap-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
