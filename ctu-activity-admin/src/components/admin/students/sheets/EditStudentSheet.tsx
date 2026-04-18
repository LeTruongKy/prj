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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { IUser } from "@/types/user.type";
import { UserService } from "@/services/userService";
import { toast } from "sonner";

interface EditStudentSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: IUser | null;
    onStudentUpdated?: () => void;
}

export function EditStudentSheet({
    open,
    onOpenChange,
    student,
    onStudentUpdated,
}: EditStudentSheetProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        studentCode: "",
        major: "",
    });

    useEffect(() => {
        if (open && student) {
            setFormData({
                fullName: student.fullName || "",
                studentCode: student.studentCode || "",
                major: student.major || "",
            });
        }
    }, [open, student]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!student?.id) {
            toast.error("Student ID not found");
            return;
        }

        if (!formData.fullName.trim()) {
            toast.error("Họ và tên không được trống");
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                fullName: formData.fullName,
                studentCode: formData.studentCode,
                major: formData.major,
            };

            const res = await UserService.CallUpdateUser(student.id, updateData);

            if (res?.statusCode === 200) {
                toast.success("Cập nhật thông tin sinh viên thành công");
                onOpenChange(false);
                onStudentUpdated?.();
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsSaving(false);
        }
    };

    if (!student) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa thông tin sinh viên</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin của "{student.fullName}"
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Full Name */}
                    <div>
                        <Label htmlFor="fullName" className="text-sm font-medium">
                            Họ và tên *
                        </Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Nhập họ và tên"
                            className="mt-1"
                        />
                    </div>

                    {/* Student Code */}
                    <div>
                        <Label htmlFor="studentCode" className="text-sm font-medium">
                            MSSV
                        </Label>
                        <Input
                            id="studentCode"
                            name="studentCode"
                            value={formData.studentCode}
                            onChange={handleInputChange}
                            placeholder="Nhập mã sinh viên"
                            className="mt-1"
                        />
                    </div>

                    {/* Major */}
                    <div>
                        <Label htmlFor="major" className="text-sm font-medium">
                            Ngành học
                        </Label>
                        <Input
                            id="major"
                            name="major"
                            value={formData.major}
                            onChange={handleInputChange}
                            placeholder="Nhập ngành học"
                            className="mt-1"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <Input
                            value={student.email}
                            disabled
                            className="mt-1 bg-gray-50"
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
