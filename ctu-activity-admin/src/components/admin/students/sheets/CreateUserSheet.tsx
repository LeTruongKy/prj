"use client";

import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserService } from "@/services/userService";
import { UnitService } from "@/services/unitService";
import { RoleService } from "@/services/roleService";
import { IUnit } from "@/types/unit.type";
import { IRole } from "@/types/role.type";

interface CreateUserSheetProps {
    onUserCreated: () => void;
}

export function CreateUserSheet({ onUserCreated }: CreateUserSheetProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [unitId, setUnitId] = useState<string>("");
    const [roleId, setRoleId] = useState<string>("");

    useEffect(() => {
        if (open) {
            fetchDropdownData();
        }
    }, [open]);

    const fetchDropdownData = async () => {
        try {
            const [unitRes, roleRes] = await Promise.all([
                UnitService.CallFetchUnitsList(),
                RoleService.CallFetchRolesList(),
            ]);
            if (unitRes?.statusCode === 200 && Array.isArray(unitRes.data)) {
                setUnits(unitRes.data);
            }
            if (roleRes?.statusCode === 200 && Array.isArray(roleRes.data)) {
                setRoles(roleRes.data);
            }
        } catch (error) {
            console.error("Error loading dropdown data:", error);
        }
    };

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPassword("");
        setStudentCode("");
        setUnitId("");
        setRoleId("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName || !email || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
            return;
        }

        setLoading(true);
        try {
            const res = await UserService.CallCreateUser({
                fullName,
                email,
                password,
                studentCode: studentCode || undefined,
                unitId: unitId ? parseInt(unitId) : undefined,
                roleId: roleId ? parseInt(roleId) : undefined,
            });

            if (res?.statusCode === 200 || res?.statusCode === 201) {
                toast.success("Tạo người dùng thành công!");
                resetForm();
                setOpen(false);
                onUserCreated();
            } else {
                toast.error(res?.message || "Tạo người dùng thất bại");
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2 hover:shadow-lg transition-all">
                    <UserPlus className="h-4 w-4" /> Thêm người dùng
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader>
                    <SheetTitle>Tạo người dùng mới</SheetTitle>
                    <SheetDescription>
                        Nhập thông tin để tạo tài khoản mới cho người dùng.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                            Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@ctu.edu.vn"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Mật khẩu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="studentCode">MSSV</Label>
                        <Input
                            id="studentCode"
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value)}
                            placeholder="B2012345"
                        />
                    </div>

                    {/* <div className="space-y-2">
                        <Label>Đơn vị</Label>
                        <Select value={unitId} onValueChange={setUnitId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn đơn vị" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={String(unit.id)}>
                                        {unit.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Select value={roleId} onValueChange={setRoleId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={String(role.id)}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                "Tạo người dùng"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
