// EditRoleModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { RoleService } from "@/services/roleService";
import { toast } from "sonner";
import { roleMessage } from "@/constants/messages/roleMessage";
import { PermissionModule } from "@/types/permission.type";
import _ from "lodash";
import { PermmissionService } from "@/services/permissionService";
import "../../../../styles/RoleModal.css";
import PermissionSelectorEdit from "../PermissionSelectorEdit";

interface ModalProps {
  open: boolean;
  roleId: number | null;
  onClose: () => void;
  onSuccess: (roleId: number) => void;
}

export function EditRoleModal({ open, roleId, onClose, onSuccess }: ModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [listPermissions, setListPermissions] = useState<PermissionModule[] | null>(null);

  useEffect(() => {
    if (!roleId || !open) return;

    const init = async () => {
      try {
        const [perRes, roleRes] = await Promise.all([
          PermmissionService.CallFetchPermissionList(),
          RoleService.CallGetRoleDetail(roleId),
        ]);

        if (perRes && perRes?.statusCode === 200 && Array.isArray(perRes.data)) {
          setListPermissions(groupByPermission(perRes.data));
        }

        if (roleRes && roleRes?.statusCode === 200 && roleRes.data) {
          const role = roleRes.data;
          setName(role?.name ?? "");
          setDescription(role?.description ?? "");

          const existingPermissions = role.rolePermissions?.map((p: any) => p.permissionId) || [];
          setSelectedPermissions(existingPermissions);
        }
      } catch (error) {
        console.error("Error init edit Modal:", error);
      }
    };

    init();
  }, [roleId, open]);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.resource)
      .map((value, key) => ({
        module: key,
        permissions: value,
      }))
      .value();
  };

  const handleCloseModal = () => {
    setSelectedPermissions([]);
    setLoading(false);
    onClose();
    setName("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.warning(roleMessage.emptyRole);
      return;
    }
    if (!description.trim()) {
      toast.error(roleMessage.emptyDes);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        permissionIds: selectedPermissions,
      };

      const EditRoleResponse = await RoleService.CallUpdateRole(roleId!, payload as any);

      if (EditRoleResponse?.statusCode === 200) {
        toast.success(roleMessage.editSuccess);
        if (EditRoleResponse.data?.id) onSuccess(EditRoleResponse.data?.id);
        handleCloseModal();
      } else {
        toast.error(EditRoleResponse?.message || roleMessage.error);
      }
    } catch (error) {
      console.error("Error editing role:", error);
      toast.error(roleMessage.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal} modal={false}>
      <DialogContent className=" max-w-[95vw] w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-6 hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chỉnh sửa vai trò</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Tên vai trò <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: ADMIN, STUDENT, UNIT_MANAGER..."
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết về vai trò này..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <PermissionSelectorEdit
              listPermissions={listPermissions}
              value={selectedPermissions}
              onChange={(data) => setSelectedPermissions(data)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button className="cursor-pointer" variant="outline" onClick={handleCloseModal} disabled={loading}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !description.trim()}
              className="text-white min-w-32 cursor-pointer transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }}
            >
              {loading ? "Đang lưu..." : "Lưu vai trò"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
