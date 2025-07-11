"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorageIcon } from "./storage-icon";
import type { StorageType, CreateStorageRequest } from "@/types/storage";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateStorageModalProps {
  onCreateStorage: (storage: CreateStorageRequest) => void;
}

export function CreateStorageModal({ onCreateStorage }: CreateStorageModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateStorageRequest>({
    name: "",
    type: "s3",
    config: {},
  });

  const storageTypes: Array<{ value: StorageType; label: string; description: string }> = [
    { value: "s3", label: "Amazon S3", description: "AWS Simple Storage Service" },
    { value: "gcs", label: "Google Cloud Storage", description: "Google Cloud Platform" },
    { value: "azure", label: "Azure Blob Storage", description: "Microsoft Azure" },
    { value: "local", label: "Local Storage", description: "Local file system" },
    { value: "dropbox", label: "Dropbox", description: "Dropbox cloud storage" },
    { value: "cloudinary", label: "Cloudinary", description: "Cloudinary storage" },
  ];

  const getConfigFields = (type: StorageType) => {
    const fields = {
      s3: [
        { key: "region", label: "AWS Region", placeholder: "us-east-1", required: true },
        { key: "bucket", label: "Bucket Name", placeholder: "my-bucket", required: true },
        { key: "accessKey", label: "Access Key ID", placeholder: "AKIA...", required: true },
        { key: "secretKey", label: "Secret Access Key", placeholder: "Secret key", type: "password", required: true },
      ],
      gcs: [
        { key: "projectId", label: "Project ID", placeholder: "my-project", required: true },
        { key: "bucket", label: "Bucket Name", placeholder: "my-bucket", required: true },
        { key: "keyFile", label: "Service Account Key", placeholder: "service-account.json", required: true },
      ],
      azure: [
        { key: "accountName", label: "Account Name", placeholder: "mystorageaccount", required: true },
        { key: "containerName", label: "Container Name", placeholder: "mycontainer", required: true },
        {
          key: "connectionString",
          label: "Connection String",
          placeholder: "DefaultEndpointsProtocol=https...",
          type: "password",
          required: true,
        },
      ],
      local: [
        { key: "path", label: "Storage Path", placeholder: "/mnt/storage", required: true },
        { key: "permissions", label: "Permissions", placeholder: "755", required: false },
      ],
      dropbox: [
        { key: "appKey", label: "App Key", placeholder: "Dropbox app key", required: true },
        { key: "appSecret", label: "App Secret", placeholder: "Dropbox app secret", type: "password", required: true },
        { key: "accessToken", label: "Access Token", placeholder: "sl...", type: "password", required: true },
      ],
      cloudinary: [
        { key: "cloudName", label: "Cloud Name", placeholder: "mycloud", required: true },
        { key: "apiKey", label: "API Key", placeholder: "1234567890", required: true },
        { key: "apiSecret", label: "API Secret", placeholder: "********", type: "password", required: true },
        { key: "uploadPreset", label: "Upload Preset", placeholder: "default_preset", required: false },
      ],
    };
    return fields[type] || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStorage(formData);
    setOpen(false);
    setFormData({ name: "", type: "s3", config: {} });
  };

  const updateConfig = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  };

  const handleTypeChange = (value: StorageType) => {
    setFormData((prev) => ({ ...prev, type: value, config: {} }));
  };

  const selectedStorageType = storageTypes.find((type) => type.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Storage</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Storage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Storage Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Storage Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="My Production Storage"
              required
            />
          </div>

          {/* Storage Type - Compact Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Storage Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {storageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <StorageIcon type={type.value} className="w-4 h-4" />
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Configuration</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {getConfigFields(formData.type).map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label htmlFor={field.key} className="text-xs text-muted-foreground">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type || "text"}
                    value={formData.config[field.key] || ""}
                    onChange={(e) => updateConfig(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
