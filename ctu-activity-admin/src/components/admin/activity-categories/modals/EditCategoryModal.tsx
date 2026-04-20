"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import { IActivityCategory, ModalActivityCategoryData } from "@/types/activityCategory.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: IActivityCategory | null;
}

const CATEGORY_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B"];

export function EditCategoryModal({ open, onClose, onSuccess, category }: EditCategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(CATEGORY_COLORS[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && category) {
            setName(category.name);
            setDescription(category.description || "");
            setColor(category.color || CATEGORY_COLORS[0]);
        }
    }, [open, category]);

    const handleCloseModal = () => {
        setName("");
        setDescription("");
        setColor(CATEGORY_COLORS[0]);
        setLoading(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!category?.category_id) {
            toast.error("Category ID not found");
            return;
        }

        if (!name.trim()) {
            toast.warning("Tên loại hoạt động không được để trống");
            return;
        }

        setLoading(true);
        try {
            const payload: ModalActivityCategoryData = {
                name: name.trim(),
                description: description.trim() || undefined,
                color,
            };

            const res = await ActivityCategoryService.CallUpdateCategory(category.category_id, payload);

            if (res?.statusCode === 200) {
                toast.success("Cập nhật loại hoạt động thành công!");
                onSuccess();
                handleCloseModal();
            } else {
                toast.error(res?.message || "Đã có lỗi xảy ra");
            }
        } catch (error: any) {
            console.error("Error updating category:", error);
            const message = error?.response?.data?.message || "Đã có lỗi xảy ra";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="max-w-lg w-full p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Chỉnh sửa loại hoạt động</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="category-name" className="text-sm font-medium">
                            Tên loại hoạt động <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="category-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Thể thao, Văn hóa, Khoa học..."
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category-description" className="text-sm font-medium">
                            Mô tả
                        </Label>
                        <Textarea
                            id="category-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả loại hoạt động"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Chọn màu</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {CATEGORY_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                        color === c ? "border-gray-900 scale-110" : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            className="cursor-pointer"
                            variant="outline"
                            onClick={handleCloseModal}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !name.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white min-w-28 cursor-pointer gap-2 hover:shadow-lg transition-all"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? "Đang lưu..." : "Cập nhật"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
