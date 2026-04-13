"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { UnitService } from "@/services/unitService";
import { ModalUnitData, IUnit } from "@/types/unit.type";
import { toast } from "sonner";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateUnitModal({ open, onClose, onSuccess }: ModalProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"LCH" | "CH">("CH");
    const [parentId, setParentId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [parentUnits, setParentUnits] = useState<IUnit[]>([]);

    useEffect(() => {
        if (open) {
            fetchParentUnits();
        }
    }, [open]);

    const fetchParentUnits = async () => {
        try {
            const res = await UnitService.CallFetchUnitsList();
            if (res?.statusCode === 200 && Array.isArray(res.data?.data)) {
                // Only LCH units can be parents
                const lchUnits = res.data.data.filter((u: IUnit) => u.type === "LCH");
                setParentUnits(lchUnits);
            }
        } catch (error) {
            console.error("Error fetching parent units:", error);
        }
    };

    const handleCloseModal = () => {
        setName("");
        setType("CH");
        setParentId("");
        setLoading(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.warning("Tên đơn vị không được để trống");
            return;
        }

        setLoading(true);
        try {
            const payload: ModalUnitData = {
                name: name.trim(),
                type,
                parentId: parentId && parentId !== "none" ? Number(parentId) : null,
            };

            const res = await UnitService.CallCreateUnit(payload);

            if (res?.statusCode === 201 || res?.statusCode === 200) {
                toast.success("Thêm đơn vị thành công!");
                onSuccess();
                handleCloseModal();
            } else {
                toast.error(res?.message || "Đã có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Error creating unit:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent className="max-w-lg w-full p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Thêm đơn vị mới</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="unit-name" className="text-sm font-medium">
                            Tên đơn vị <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="unit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Khoa CNTT, CN Chi hội 1..."
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit-type" className="text-sm font-medium">
                            Loại đơn vị <span className="text-red-500">*</span>
                        </Label>
                        <Select value={type} onValueChange={(val) => setType(val as "LCH" | "CH")}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Chọn loại đơn vị" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LCH">Liên chi hội (LCH)</SelectItem>
                                <SelectItem value="CH">Chi hội (CH)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit-parent" className="text-sm font-medium">
                            Đơn vị trực thuộc
                        </Label>
                        <Select value={parentId} onValueChange={setParentId}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Không trực thuộc (đơn vị gốc)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Không trực thuộc</SelectItem>
                                {parentUnits.map((unit) => (
                                    <SelectItem key={unit.id} value={String(unit.id)}>
                                        {unit.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-28 cursor-pointer"
                        >
                            {loading ? "Đang lưu..." : "Thêm đơn vị"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
