"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StorageConfig } from "@/types/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StorageAnalyticsModalProps {
  storage: StorageConfig | null;
  open: boolean;
  onClose: () => void;
}

export function StorageAnalyticsModal({ storage, open, onClose }: StorageAnalyticsModalProps) {
  if (!storage?.analytics) return null;

  const { analytics } = storage;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl truncate">{storage.name} - Analytics</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            {/* Key Metrics - Mobile First Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{analytics.uploadCount.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Uploads</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{analytics.downloadCount.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Downloads</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">{analytics.totalFiles.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Files</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{analytics.uptime}%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance */}
            <Card>
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span>Average Response Time</span>
                      <span>{analytics.avgResponseTime}ms</span>
                    </div>
                    <Progress value={(analytics.avgResponseTime / 1000) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span>Uptime</span>
                      <span>{analytics.uptime}%</span>
                    </div>
                    <Progress value={analytics.uptime} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Chart */}
            <Card>
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Daily Usage Trends</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 10 }} />
                      <YAxis fontSize={12} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: "12px" }} />
                      <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Storage Usage */}
            <Card>
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Storage Usage Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 10 }} />
                      <YAxis fontSize={12} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="storage" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
