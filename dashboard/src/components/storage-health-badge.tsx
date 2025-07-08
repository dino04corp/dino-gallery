import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react"
import type { StorageStatus } from "@/types/storage"

interface StorageHealthBadgeProps {
  status: StorageStatus
  responseTime?: number
}

export function StorageHealthBadge({ status, responseTime }: StorageHealthBadgeProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      label: "Healthy",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    error: {
      icon: XCircle,
      label: "Error",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    },
    syncing: {
      icon: Loader2,
      label: "Syncing",
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className={`w-3 h-3 mr-1 ${status === "syncing" ? "animate-spin" : ""}`} />
      {config.label}
      {responseTime && status === "healthy" && <span className="ml-1 text-xs">({responseTime}ms)</span>}
    </Badge>
  )
}
