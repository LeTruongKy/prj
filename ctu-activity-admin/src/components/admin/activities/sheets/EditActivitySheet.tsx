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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { IActivity } from "@/types/activity.type";
import { ActivityService } from "@/services/activityService";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import { TagSelector } from "@/components/common/TagSelector";
import { CriteriaSelector } from "@/components/common/CriteriaSelector";
import { toast } from "sonner";
import { IActivityCategory } from "@/types/activityCategory.type";

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
        categoryId: undefined as number | undefined,
        startTime: "",
        endTime: "",
        maxParticipants: 30,
    });
    const [posterPreview, setPosterPreview] = useState<string>("");
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [tagIds, setTagIds] = useState<number[]>([]);
    const [criteriaIds, setCriteriaIds] = useState<number[]>([]);
    const [categories, setCategories] = useState<IActivityCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        if (open && activity) {
            setFormData({
                title: activity.title || "",
                description: activity.description || "",
                location: activity.location || "",
                categoryId: activity.categoryId || activity.category_id,
                startTime: activity.startTime ? new Date(activity.startTime).toISOString().slice(0, 16) : "",
                endTime: activity.endTime ? new Date(activity.endTime).toISOString().slice(0, 16) : "",
                maxParticipants: activity.maxParticipants || 30,
            });
            setPosterPreview(activity.poster_url || activity.posterUrl || PLACEHOLDER_IMAGE);
            setPosterFile(null);
            setTagIds(activity.tagIds || []);
            setCriteriaIds(activity.criteriaIds || []);

            // Fetch categories
            fetchCategories();
        }
    }, [open, activity]);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const categoryRes = await ActivityCategoryService.CallFetchCategoriesList();
            if (categoryRes?.statusCode === 200 && Array.isArray(categoryRes.data)) {
                setCategories(categoryRes.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Không thể tải danh sách loại hoạt động");
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "categoryId" || name === "maxParticipants" ? parseInt(value) || undefined : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === "categoryId" ? parseInt(value) : value,
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
            
            // Always use FormData to handle file upload properly
            const formDataWithFile = new FormData();
            formDataWithFile.append("title", formData.title);
            formDataWithFile.append("description", formData.description);
            formDataWithFile.append("location", formData.location);
            
            if (formData.categoryId) {
                formDataWithFile.append("categoryId", String(formData.categoryId));
            }
            
            if (formData.startTime) {
                formDataWithFile.append("startTime", new Date(formData.startTime).toISOString());
            }
            
            if (formData.endTime) {
                formDataWithFile.append("endTime", new Date(formData.endTime).toISOString());
            }
            
            if (formData.maxParticipants) {
                formDataWithFile.append("maxParticipants", String(formData.maxParticipants));
            }

            // Append file if selected
            if (posterFile) {
                formDataWithFile.append("file", posterFile);
            }

            // Append tag IDs if any
            if (tagIds && tagIds.length > 0) {
                tagIds.forEach((id) => {
                    formDataWithFile.append("tagIds", String(id));
                });
            }

            // Append criteria IDs if any
            if (criteriaIds && criteriaIds.length > 0) {
                criteriaIds.forEach((id) => {
                    formDataWithFile.append("criteriaIds", String(id));
                });
            }

            const res = await ActivityService.CallUpdateActivityWithFile(activityId as number, formDataWithFile);

            if (res?.statusCode === 200) {
                toast.success("Cập nhật hoạt động thành công");
                onOpenChange(false);
                onActivityUpdated?.();
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
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
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-2">
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa hoạt động</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin chi tiết của "{activity.title}"
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-2 mt-2">
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

                    {/* Category */}
                    <div>
                        <Label htmlFor="categoryId" className="text-sm font-medium">
                            Loại hoạt động
                        </Label>
                        <Select
                            value={formData.categoryId ? String(formData.categoryId) : ""}
                            onValueChange={(value) => handleSelectChange("categoryId", value)}
                            disabled={isSaving || loadingCategories}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Chọn loại hoạt động" />
                            </SelectTrigger>
                            <SelectContent>
                                {loadingCategories ? (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                        Đang tải...
                                    </div>
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                        Không có loại hoạt động
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tags */}
                    <div>
                        <Label className="text-sm font-medium">Tags</Label>
                        <TagSelector
                            selectedTagIds={tagIds}
                            onChange={setTagIds}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Criteria */}
                    <div>
                        <Label className="text-sm font-medium">Tiêu chí SV5T</Label>
                        <CriteriaSelector
                            selectedCriteriaIds={criteriaIds}
                            onChange={setCriteriaIds}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Max Participants */}
                    <div>
                        <Label htmlFor="maxParticipants" className="text-sm font-medium">
                            Số lượng tối đa
                        </Label>
                        <Input
                            id="maxParticipants"
                            name="maxParticipants"
                            type="number"
                            value={formData.maxParticipants}
                            onChange={handleInputChange}
                            placeholder="Nhập số lượng tối đa"
                            className="mt-1"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Start Time */}
                    <div>
                        <Label htmlFor="startTime" className="text-sm font-medium">
                            Thời gian bắt đầu
                        </Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="mt-1"
                            disabled={isSaving}
                        />
                    </div>

                    {/* End Time */}
                    <div>
                        <Label htmlFor="endTime" className="text-sm font-medium">
                            Thời gian kết thúc
                        </Label>
                        <Input
                            id="endTime"
                            name="endTime"
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            className="mt-1"
                            disabled={isSaving}
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
