"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { StorageIcon } from "./storage-icon"
import type { StorageConfig } from "@/types/storage"

interface EditStorageModalProps {
  storage: StorageConfig | null
  open: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<StorageConfig>) => void
}

export function EditStorageModal({ storage, open, onClose, onSave }: EditStorageModalProps) {
  const [formData, setFormData] = useState<Partial<StorageConfig>>({})

  useEffect(() => {
    if (storage) {
      setFormData({
        name: storage.name,
        config: { ...storage.config },
      })
    }
  }, [storage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (storage) {
      onSave(storage.id, formData)
      onClose()
    }
  }

  const updateConfig = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }))
  }

  const getStorageTypeLabel = (type: string) => {
    const labels = {
      s3: "Amazon S3",
      gcs: "Google Cloud Storage",
      azure: "Azure Blob Storage",
      local: "Local Storage",
      dropbox: "Dropbox",
      cloudinary: "Cloudinary",
    }
    return labels[type as keyof typeof labels] || type.toUpperCase()
  }

  if (!storage) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <StorageIcon type={storage.type} className="w-5 h-5" />
            Edit Storage
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Storage Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getStorageTypeLabel(storage.type)}
            </Badge>
            <Badge variant={storage.isActive ? "default" : "secondary"} className="text-xs">
              {storage.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Storage Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Storage Name
            </Label>
            <Input
              id="edit-name"
              value={formData.name || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Configuration Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Configuration</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {Object.entries(storage.config).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`edit-${key}`} className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  <Input
                    id={`edit-${key}`}
                    type={
                      key.includes("secret") ||
                      key.includes("token") ||
                      key.includes("password") ||
                      key.includes("connectionString")
                        ? "password"
                        : "text"
                    }
                    value={formData.config?.[key] || value}
                    onChange={(e) => updateConfig(key, e.target.value)}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
