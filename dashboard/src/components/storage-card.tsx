"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import type { StorageConfig } from "@/types/storage";
import { StorageIcon } from "./storage-icon";
import { Settings, Trash2, RefreshCw, BarChart3, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StorageHealthBadge } from "./storage-health-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface StorageHealth {
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
}

interface StorageAnalytics {
  totalFiles: number;
  totalSize: number;
}

interface StorageCardProps {
  storage: StorageConfig;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSync: (id: string) => void;
  health?: StorageHealth;
  analytics?: StorageAnalytics;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onViewAnalytics?: (id: string) => void;
}

export function StorageCard({
  storage,
  onToggle,
  onEdit,
  onDelete,
  onSync,
  health,
  analytics,
  isSelected,
  onSelect,
  onViewAnalytics,
}: StorageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    await onSync(storage.id);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStorageTypeLabel = (type: string) => {
    const labels = {
      s3: "Amazon S3",
      gcs: "Google Cloud",
      azure: "Azure Blob",
      local: "Local Storage",
      dropbox: "Dropbox",
      cloudinary: "Cloudinary",
    };
    return labels[type as keyof typeof labels] || type.toUpperCase();
  };

  const getUsagePercentage = () => {
    if (!storage.usage) return 0;
    return (storage.usage.used / storage.usage.total) * 100;
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="relative overflow-hidden w-full">
      <CardHeader className="pb-3">
        {/* Mobile-First Header Layout */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {onSelect && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect(storage.id, !!checked)}
                  className="flex-shrink-0"
                />
              )}
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  storage.isActive
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                }`}
              >
                <StorageIcon type={storage.type} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg truncate">{storage.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{getStorageTypeLabel(storage.type)}</p>
              </div>
            </div>
            <Switch
              checked={storage.isActive}
              onCheckedChange={(checked) => onToggle(storage.id, checked)}
              className="flex-shrink-0"
            />
          </div>

          {/* Mobile-Optimized Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={storage.isActive ? "default" : "secondary"} className="text-xs">
              {storage.isActive ? "Active" : "Inactive"}
            </Badge>
            {health && <StorageHealthBadge status={health.status} responseTime={health.responseTime} />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Information */}
        {storage.usage && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Usage</span>
              <span className="font-medium text-xs sm:text-sm">
                {storage.usage.used} / {storage.usage.total} {storage.usage.unit}
              </span>
            </div>
            <Progress value={getUsagePercentage()} className="h-2" />
          </div>
        )}

        {/* Configuration Details - Mobile Optimized */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Configuration</h4>
          <div className="space-y-1">
            {Object.entries(storage.config)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-muted-foreground capitalize text-xs sm:text-sm">{key}:</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                    {value.length > 15 ? `${value.substring(0, 15)}...` : value}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Last Sync */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last sync:</span>
          <span className="font-medium text-xs sm:text-sm">{formatLastSync(storage.lastSync)}</span>
        </div>

        {/* Mobile-First Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={!storage.isActive || isLoading}
            className="flex-1 text-xs sm:text-sm bg-transparent"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </Button>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(storage.id)}>
              <Settings className="w-4 h-4" />
            </Button>
            {onViewAnalytics && (
              <Button variant="outline" size="sm" onClick={() => onViewAnalytics(storage.id)}>
                <BarChart3 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onDelete(storage.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(storage.id)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {onViewAnalytics && (
                <DropdownMenuItem onClick={() => onViewAnalytics(storage.id)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(storage.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
