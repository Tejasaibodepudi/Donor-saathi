import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateDonorMetrics } from "@/frontend/lib/donor-metrics"
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react"

interface DonorMetricsBadgeProps {
  trustScore: number
  variant?: "compact" | "detailed"
}

export function DonorMetricsBadge({ trustScore, variant = "compact" }: DonorMetricsBadgeProps) {
  const metrics = calculateDonorMetrics(trustScore)

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Badge variant={metrics.responseProbability >= 75 ? "default" : "secondary"} className="text-xs">
                {metrics.responseProbability}% likely
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">Response Probability:</span>
                <span>{metrics.responseProbability}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                <span className="font-medium">Fulfillment:</span>
                <span>{metrics.fulfillmentConfidence}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Expected ETA:</span>
                <span>{metrics.expectedETA}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Detailed variant
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Response Probability:</span>
        <Badge variant={metrics.responseProbability >= 75 ? "default" : "secondary"}>
          {metrics.responseProbability}%
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Fulfillment Confidence:</span>
        <Badge variant={
          metrics.fulfillmentConfidence === "Very High" || metrics.fulfillmentConfidence === "High" 
            ? "default" 
            : "secondary"
        }>
          {metrics.fulfillmentConfidence}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Expected ETA:</span>
        <span className="text-sm font-medium">{metrics.expectedETA}</span>
      </div>
    </div>
  )
}
