"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Loader2, X, FileSpreadsheet } from "lucide-react";
import { IActivity } from "@/types/activity.type";
import { ParticipantsTable } from "../table/ParticipantsTable";
import { formatDate } from "@/utils/formateDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityService } from "@/services/activityService";
import { toast } from "sonner";

interface DetailActivitySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity: IActivity | null;
    loading?: boolean;
}

const statusColorMap: Record<string, { bgColor: string; textColor: string }> = {
    DRAFT: { bgColor: "bg-gray-100", textColor: "text-gray-800" },
    PENDING: { bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
    APPROVED: { bgColor: "bg-blue-100", textColor: "text-blue-800" },
    PUBLISHED: { bgColor: "bg-green-100", textColor: "text-green-800" },
    COMPLETED: { bgColor: "bg-purple-100", textColor: "text-purple-800" },
    CANCELLED: { bgColor: "bg-red-100", textColor: "text-red-800" },
};

export function DetailActivitySheet({ open, onOpenChange, activity, loading }: DetailActivitySheetProps) {
    const [exporting, setExporting] = useState(false);

    const getStatusColor = (status: string) => {
        const colors = statusColorMap[status] || statusColorMap.DRAFT;
        return `${colors.bgColor} ${colors.textColor}`;
    };

    const handleExportReport = async () => {
        if (!activity?.activity_id) return;

        setExporting(true);
        try {
            const response = await ActivityService.CallExportParticipantsReport(activity.activity_id);

            // The response from the interceptor returns response.data directly (which is the Blob)
            const blob = response instanceof Blob
                ? response
                : new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Danh_sach_tham_gia_${activity.title?.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Xuất báo cáo thành công!");
        } catch (error) {
            console.error("Error exporting report:", error);
            toast.error("Không thể xuất báo cáo. Vui lòng thử lại.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
                <SheetHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex-1 pr-8">
                        <SheetTitle>Chi tiết Hoạt động</SheetTitle>
                        <SheetDescription>
                            Xem thông tin hoạt động và quản lý danh sách sinh viên
                        </SheetDescription>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 hover:bg-gray-200 rounded-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </SheetHeader>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="text-muted-foreground">Đang tải thông tin...</p>
                        </div>
                    </div>
                ) : activity ? (
                    <div className="mt-6 space-y-6">
                        {/* Activity Info Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl">{activity.title}</CardTitle>
                                        <CardDescription className="mt-2">{activity.description}</CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(activity.status)}>
                                        {activity.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Thời gian bắt đầu</p>
                                            <p className="font-medium">{formatDate(activity.start_time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Thời gian kết thúc</p>
                                            <p className="font-medium">{formatDate(activity.end_time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Địa điểm</p>
                                            <p className="font-medium">{activity.location || "Chưa xác định"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Sức chứa</p>
                                            <p className="font-medium">
                                                - / {activity.max_participants || "Không giới hạn"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Đơn vị tổ chức</p>
                                            <p className="font-medium">{activity.unit?.name || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Loại hoạt động</p>
                                            <p className="font-medium" style={{ color: activity.category?.color || "#000" }}>
                                                {activity.category?.name || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Export Report Button */}
                                <div className="pt-4 border-t">
                                    <Button
                                        onClick={handleExportReport}
                                        disabled={exporting}
                                        variant="outline"
                                        className="w-full gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                    >
                                        {exporting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Đang xuất báo cáo...
                                            </>
                                        ) : (
                                            <>
                                                <FileSpreadsheet className="h-4 w-4" />
                                                Xuất danh sách tham gia (Excel)
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Participants Section */}
                        <Tabs defaultValue="participants" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="participants">Danh sách sinh viên</TabsTrigger>
                                <TabsTrigger value="statistics">Thống kê</TabsTrigger>
                            </TabsList>

                            <TabsContent value="participants" className="space-y-4">
                                <ParticipantsTable activityId={activity.activity_id} />
                            </TabsContent>

                            <TabsContent value="statistics" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thống kê Tham gia</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
                                                <p className="text-3xl font-bold text-blue-600">-</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-sm text-muted-foreground">Đã check-in</p>
                                                <p className="text-3xl font-bold text-green-600">-</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                                <p className="text-sm text-muted-foreground">Minh chứng đã duyệt</p>
                                                <p className="text-3xl font-bold text-purple-600">-</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">Không tìm thấy thông tin hoạt động</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
