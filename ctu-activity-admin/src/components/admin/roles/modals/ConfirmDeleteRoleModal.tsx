"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SimpleRole {
  id: number;
  name: string;
}

interface ConfirmDeleteRoleModalProps {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;

  roleId: number | null;
  roleName?: string;

  userCount: number;
  alternativeRoles: SimpleRole[];
  onReassignAndDelete: (targetRoleId: number) => Promise<void>;
  onDeleteWithoutUser: () => Promise<void>;
}

export function ConfirmDeleteRoleModal({
  open,
  onClose,
  onDeleted,
  roleId,
  roleName,
  userCount,
  alternativeRoles,
  onReassignAndDelete,
  onDeleteWithoutUser,
}: ConfirmDeleteRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && alternativeRoles.length > 0) {
      setSelectedRoleId(alternativeRoles[0].id);
    }
  }, [open, alternativeRoles]);

  const handleConfirm = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      if (userCount > 0) {
        if (!selectedRoleId) return;
        await onReassignAndDelete(selectedRoleId);
      } else {
        await onDeleteWithoutUser();
      }
      onDeleted();
    } finally {
      setLoading(false);
    }
  };

  const hasUser = userCount > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {hasUser ? "Chuyển người dùng & Xoá vai trò" : "Xác nhận xoá vai trò"}
          </DialogTitle>
          <DialogDescription>
            {hasUser ? (
              <span>
                Vai trò <b>{roleName}</b> hiện đang được gán cho <b>{userCount}</b> người dùng. Bạn cần chuyển họ sang
                một vai trò khác trước khi xoá.
              </span>
            ) : (
              <span>
                Bạn có chắc muốn xoá vai trò <b>{roleName}</b> không? Thao tác này là Soft Delete, có thể khôi phục lại.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {hasUser && (
          <div className="space-y-3 mt-4">
            <Label>Chọn vai trò thay thế</Label>
            <RadioGroup
              value={selectedRoleId?.toString() ?? ""}
              onValueChange={(value) => setSelectedRoleId(Number(value))}
              className="space-y-2 max-h-60 overflow-y-auto pr-1"
            >
              {alternativeRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center space-x-2 rounded-md border px-3 py-2 hover:bg-gray-50"
                >
                  <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} />
                  <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                    {role.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={handleConfirm}
            disabled={loading || (hasUser && !selectedRoleId)}
          >
            {loading ? "Đang xử lý..." : hasUser ? "Chuyển & Xoá" : "Xoá"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
