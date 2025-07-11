export type StorageType = "s3" | "gcs" | "local" | "azure" | "dropbox" | "cloudinary";

export interface StorageConfig {
    id: string;
    name: string;
    type: StorageType;
    isActive: boolean;
    createdAt: string;
    lastSync?: string;
    config: Record<string, string>;
    usage?: {
        used: number;
        total: number;
        unit: "GB" | "TB";
    };
}

export type StorageStatus = "healthy" | "warning" | "error" | "syncing";

export interface StorageHealth {
    status: StorageStatus;
    lastCheck: string;
    responseTime: number;
    errorMessage?: string;
}

export interface StorageAnalytics {
    uploadCount: number;
    downloadCount: number;
    totalFiles: number;
    avgResponseTime: number;
    uptime: number;
    dailyUsage: Array<{
        date: string;
        uploads: number;
        downloads: number;
        storage: number;
    }>;
}

export interface CreateStorageRequest {
    name: string;
    type: StorageType;
    config: Record<string, string>;
}
