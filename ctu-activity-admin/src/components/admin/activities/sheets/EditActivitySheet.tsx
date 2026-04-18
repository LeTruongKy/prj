"use client";

import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { IActivity } from "@/types/activity.type";
import { ActivityService } from "@/services/activityService";
import { toast } from "sonner";

interface EditActivitySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity: IActivity | null;
    onActivityUpdated?: () => void;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100' rx='8'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export function EditActivitySheet({
    open,
    onOpenChange,
    activity,
    onActivityUpdated,
}: EditActivitySheetProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
    });
    const [posterPreview, setPosterPreview] = useState<string>("");
    const [posterFile, setPosterFile] = useState<File | null>(null);

    useEffect(() => {
        if (open && activity) {
            setFormData({
                title: activity.title || "",
                description: activity.description || "",
                location: activity.location || "",
            });
            setPosterPreview(activity.poster_url || activity.posterUrl || PLACEHOLDER_IMAGE);
            setPosterFile(null);
        }
    }, [open, activity]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!activity?.activity_id && !activity?.id) {
            toast.error("Activity ID not found");
            return;
        }

        if (!formData.title.trim()) {
            toast.error("Tên hoạt động không được trống");
            return;
        }

        setIsSaving(true);
        try {
            const activityId = activity.activity_id || activity.id;
            
            // If poster file changed, use FormData to upload with image
            if (posterFile) {
                const formDataWithFile = new FormData();
                formDataWithFile.append("title", formData.title);
                formDataWithFile.append("description", formData.description);
                formDataWithFile.append("location", formData.location);
                formDataWithFile.append("file", posterFile);

                const res = await ActivityService.CallUpdateActivityWithFile(activityId as number, formDataWithFile);

                if (res?.statusCode === 200) {
                    toast.success("Cập nhật hoạt động thành công");
                    onOpenChange(false);
                    onActivityUpdated?.();
                } else {
                    toast.error(res?.message || "Cập nhật thất bại");
                }
            } else {
                // No image change, just update text fields
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    location: formData.location,
                };

                const res = await ActivityService.CallUpdateActivity(activityId as number, updateData);

                if (res?.statusCode === 200) {
                    toast.success("Cập nhật hoạt động thành công");
                    onOpenChange(false);
                    onActivityUpdated?.();
                } else {
                    toast.error(res?.message || "Cập nhật thất bại");
                }
            }
        } catch (error) {
            console.error("Error updating activity:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsSaving(false);
        }
    };

    if (!activity) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa hoạt động</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin chi tiết của "{activity.title}"
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Poster Image */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Hình ảnh hoạt động
                        </Label>
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src={posterPreview}
                                    alt="Poster preview"
                                    className="w-48 h-40 object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                    }}
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePosterChange}
                                className="hidden"
                                id="poster-upload"
                            />
                            <div className="flex gap-2 justify-center">
                                <label htmlFor="poster-upload">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-2 cursor-pointer"
                                        asChild
                                    >
                                        <span>
                                            <Upload className="h-4 w-4" />
                                            Chọn ảnh
                                        </span>
                                    </Button>
                                </label>
                                {posterFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="gap-2 text-red-600 hover:text-red-700"
                                        onClick={() => {
                                            setPosterFile(null);
                                            setPosterPreview(activity.poster_url || activity.posterUrl || PLACEHOLDER_IMAGE);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        Xóa
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                            Tiêu đề hoạt động *
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Nhập tiêu đề hoạt động"
                            className="mt-1"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="text-sm font-medium">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả hoạt động"
                            rows={4}
                            className="mt-1"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Label htmlFor="location" className="text-sm font-medium">
                            Địa điểm
                        </Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Nhập địa điểm hoạt động"
                            className="mt-1"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
