import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { DonorMetricsBadge } from "@/frontend/components/donor-metrics-badge"

const statusStyles: Record<string, string> = {
  booked: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  checked_in: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelled: "bg-muted text-muted-foreground",
}

interface AppointmentCardProps {
  appointment: {
    id: string
    status: string
    qrCode: string
    slotDate?: string
    slotTime?: string
    bloodBankName?: string
    donorName?: string
    donorBloodGroup?: string
    donorTrustScore?: number
  }
  showDonor?: boolean
  showMetrics?: boolean
  actions?: React.ReactNode
}

export function AppointmentCard({ appointment, showDonor, showMetrics, actions }: AppointmentCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {showDonor && appointment.donorName && (
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{appointment.donorName}</p>
                {showMetrics && appointment.donorTrustScore !== undefined && (
                  <DonorMetricsBadge trustScore={appointment.donorTrustScore} variant="compact" />
                )}
              </div>
            )}
            {!showDonor && appointment.bloodBankName && (
              <p className="font-medium text-sm">{appointment.bloodBankName}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {appointment.slotDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {appointment.slotDate}
                </span>
              )}
              {appointment.slotTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.slotTime}
                </span>
              )}
              <span className="flex items-center gap-1">
                <QrCode className="h-3 w-3" />
                {appointment.qrCode}
              </span>
            </div>
            {showDonor && appointment.donorBloodGroup && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Blood Group: {appointment.donorBloodGroup}
              </div>
            )}
          </div>
          <Badge variant="secondary" className={cn("border-0 shrink-0", statusStyles[appointment.status] || "")}>
            {appointment.status.replace("_", " ")}
          </Badge>
        </div>
        {actions && <div className="mt-3 flex gap-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
