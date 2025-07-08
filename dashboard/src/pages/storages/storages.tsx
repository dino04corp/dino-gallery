"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorageCard } from "@/components/storage-card";
import { mockStorages } from "@/data/mock-storages";
import type { StorageConfig } from "@/types/storage";
import { Search, Filter } from "lucide-react";
import { CreateStorageModal } from "@/components/create-storage-modal";
import { EditStorageModal } from "@/components/edit-storage-modal";
import { StorageAnalyticsModal } from "@/components/storage-analytics-modal";
import { BulkOperationsToolbar } from "@/components/bulk-operations-toolbar";
import type { CreateStorageRequest } from "@/types/storage";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function StoragePage() {
  const [storages, setStorages] = useState<StorageConfig[]>(mockStorages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingStorage, setEditingStorage] = useState<StorageConfig | null>(null);
  const [analyticsStorage, setAnalyticsStorage] = useState<StorageConfig | null>(null);

  const handleToggle = (id: string, isActive: boolean) => {
    setStorages((prev) => prev.map((storage) => (storage.id === id ? { ...storage, isActive } : storage)));
  };

  const handleEdit = (id: string) => {
    console.log("Edit storage:", id);
  };

  const handleDelete = (id: string) => {
    setStorages((prev) => prev.filter((storage) => storage.id !== id));
  };

  const handleSync = async (id: string) => {
    console.log("Syncing storage:", id);
    setStorages((prev) =>
      prev.map((storage) => (storage.id === id ? { ...storage, lastSync: new Date().toISOString() } : storage))
    );
  };

  const filteredStorages = storages.filter((storage) => {
    const matchesSearch =
      storage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      storage.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === null || storage.isActive === filterActive;
    return matchesSearch && matchesFilter;
  });

  const activeCount = storages.filter((s) => s.isActive).length;
  const totalUsage = storages.reduce((acc, storage) => {
    if (storage.usage) {
      const usageInGB = storage.usage.unit === "TB" ? storage.usage.used * 1024 : storage.usage.used;
      return acc + usageInGB;
    }
    return acc;
  }, 0);

  const handleCreateStorage = (request: CreateStorageRequest) => {
    const newStorage: StorageConfig = {
      id: `storage-${Date.now()}`,
      ...request,
      isActive: false,
      createdAt: new Date().toISOString(),
      health: {
        status: "healthy",
        lastCheck: new Date().toISOString(),
        responseTime: 150,
      },
      analytics: {
        uploadCount: 0,
        downloadCount: 0,
        totalFiles: 0,
        avgResponseTime: 150,
        uptime: 100,
        dailyUsage: [],
      },
    };
    setStorages((prev) => [...prev, newStorage]);
  };

  const handleSelectStorage = (id: string, selected: boolean) => {
    setSelectedIds((prev) => (selected ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredStorages.map((s) => s.id) : []);
  };

  const handleBulkEnable = () => {
    setStorages((prev) => prev.map((storage) => (selectedIds.includes(storage.id) ? { ...storage, isActive: true } : storage)));
    setSelectedIds([]);
  };

  const handleBulkDisable = () => {
    setStorages((prev) => prev.map((storage) => (selectedIds.includes(storage.id) ? { ...storage, isActive: false } : storage)));
    setSelectedIds([]);
  };

  const handleBulkSync = async () => {
    for (const id of selectedIds) {
      await handleSync(id);
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setStorages((prev) => prev.filter((storage) => !selectedIds.includes(storage.id)));
    setSelectedIds([]);
  };

  const handleEditSave = (id: string, updates: Partial<StorageConfig>) => {
    setStorages((prev) => prev.map((storage) => (storage.id === id ? { ...storage, ...updates } : storage)));
  };

  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Filter className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="space-y-4 pt-6">
          <h3 className="font-semibold">Filter Storages</h3>
          <div className="space-y-2">
            <Button
              variant={filterActive === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(null)}
              className="w-full justify-start"
            >
              All Storages
            </Button>
            <Button
              variant={filterActive === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(true)}
              className="w-full justify-start"
            >
              Active Only
            </Button>
            <Button
              variant={filterActive === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(false)}
              className="w-full justify-start"
            >
              Inactive Only
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Mobile Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Storages</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your storage configurations and monitor usage</p>
            </div>
            <div className="flex gap-2">
              <CreateStorageModal onCreateStorage={handleCreateStorage} />
            </div>
          </div>

          {/* Mobile-First Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Storages</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-xl sm:text-2xl font-bold">{storages.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Configured</div>
            </div>
            <div className="bg-card rounded-lg p-4 border sm:col-span-2 lg:col-span-1">
              <div className="text-xl sm:text-2xl font-bold">{Math.round(totalUsage)} GB</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Usage</div>
            </div>
          </div>

          {/* Mobile-Optimized Search and Filter */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search storages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-2">
              <Button variant={filterActive === null ? "default" : "outline"} size="sm" onClick={() => setFilterActive(null)}>
                All
              </Button>
              <Button variant={filterActive === true ? "default" : "outline"} size="sm" onClick={() => setFilterActive(true)}>
                Active
              </Button>
              <Button variant={filterActive === false ? "default" : "outline"} size="sm" onClick={() => setFilterActive(false)}>
                Inactive
              </Button>
            </div>

            {/* Mobile Filter Sheet */}
            <FilterSheet />
          </div>
        </div>

        {/* Mobile-Optimized Bulk Operations */}
        <div className="mb-6">
          <BulkOperationsToolbar
            selectedIds={selectedIds}
            totalCount={filteredStorages.length}
            onSelectAll={handleSelectAll}
            onBulkEnable={handleBulkEnable}
            onBulkDisable={handleBulkDisable}
            onBulkSync={handleBulkSync}
            onBulkDelete={handleBulkDelete}
            onBulkAnalytics={() => {}}
          />
        </div>

        {/* Responsive Storage Grid */}
        {filteredStorages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No storages found</div>
            <CreateStorageModal onCreateStorage={handleCreateStorage} />
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredStorages.map((storage) => (
              <StorageCard
                key={storage.id}
                storage={storage}
                health={storage.health}
                analytics={storage.analytics}
                isSelected={selectedIds.includes(storage.id)}
                onSelect={handleSelectStorage}
                onToggle={handleToggle}
                onEdit={(id) => setEditingStorage(storages.find((s) => s.id === id) || null)}
                onDelete={handleDelete}
                onSync={handleSync}
                onViewAnalytics={(id) => setAnalyticsStorage(storages.find((s) => s.id === id) || null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EditStorageModal
        storage={editingStorage}
        open={!!editingStorage}
        onClose={() => setEditingStorage(null)}
        onSave={handleEditSave}
      />

      <StorageAnalyticsModal storage={analyticsStorage} open={!!analyticsStorage} onClose={() => setAnalyticsStorage(null)} />
    </div>
  );
}
