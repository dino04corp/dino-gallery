"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Square, Trash2, RefreshCw, BarChart3, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BulkOperationsToolbarProps {
  selectedIds: string[]
  totalCount: number
  onSelectAll: (checked: boolean) => void
  onBulkEnable: () => void
  onBulkDisable: () => void
  onBulkSync: () => void
  onBulkDelete: () => void
  onBulkAnalytics: () => void
}

export function BulkOperationsToolbar({
  selectedIds,
  totalCount,
  onSelectAll,
  onBulkEnable,
  onBulkDisable,
  onBulkSync,
  onBulkDelete,
  onBulkAnalytics,
}: BulkOperationsToolbarProps) {
  const selectedCount = selectedIds.length
  const isAllSelected = selectedCount === totalCount && totalCount > 0

  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
        <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
        <span className="text-xs sm:text-sm text-muted-foreground">Select storages to perform bulk operations</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
      <Badge variant="secondary" className="text-xs">
        {selectedCount} selected
      </Badge>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-4">
        <Separator orientation="vertical" className="h-6" />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onBulkEnable}>
            <Play className="w-4 h-4 mr-1" />
            Enable
          </Button>
          <Button size="sm" variant="outline" onClick={onBulkDisable}>
            <Square className="w-4 h-4 mr-1" />
            Disable
          </Button>
          <Button size="sm" variant="outline" onClick={onBulkSync}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Sync
          </Button>
          <Button size="sm" variant="outline" onClick={onBulkAnalytics}>
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onBulkDelete}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet Actions */}
      <div className="flex lg:hidden items-center gap-2 ml-auto">
        <Button size="sm" variant="outline" onClick={onBulkEnable} className="hidden sm:flex bg-transparent">
          <Play className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onBulkDisable} className="hidden sm:flex bg-transparent">
          <Square className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onBulkEnable} className="sm:hidden">
              <Play className="w-4 h-4 mr-2" />
              Enable All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkDisable} className="sm:hidden">
              <Square className="w-4 h-4 mr-2" />
              Disable All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkSync}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkAnalytics}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkDelete} className="text-red-600 focus:text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
