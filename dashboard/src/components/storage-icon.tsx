import { Cloud, Database, HardDrive, Droplets, CloudUpload } from "lucide-react"
import type { StorageType } from "@/types/storage"

interface StorageIconProps {
  type: StorageType
  className?: string
}

export function StorageIcon({ type, className = "w-5 h-5" }: StorageIconProps) {
  const icons = {
    s3: Cloud,
    gcs: Cloud,
    azure: Cloud,
    local: HardDrive,
    dropbox: Droplets,
    cloudinary: CloudUpload,
  };

  const Icon = icons[type] || Database

  return <Icon className={className} />
}
