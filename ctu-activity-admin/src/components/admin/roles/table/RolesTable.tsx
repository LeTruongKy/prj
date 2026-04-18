"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IRole } from "@/types/role.type";
import { RoleService } from "@/services/roleService";
import { roleColumns } from "./RoleColums";
import { CreateRoleModal } from "../modals/CreateRoleModal";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { EditRoleModal } from "../modals/EditRoleModal";
import { ConfirmDeleteRoleModal } from "../modals/ConfirmDeleteRoleModal";
import { toast } from "sonner";

export function RolesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [roleList, setRoleList] = React.useState<IRole[]>([]);

  const [openAddRoleModal, setOpenAddRoleModal] = React.useState(false);
  const [openEditRoleModal, setOpenEditRoleModal] = React.useState(false);

  const [editingRoleId, setEditingRoleId] = React.useState<number | null>(null);
  const [deletingRole, setDeletingRole] = React.useState<IRole | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [deleteMeta, setDeleteMeta] = React.useState<{
    userCount: number;
    alternativeRoles: { id: number; name: string }[];
  } | null>(null);

  const handleEditRole = (roleId: number) => {
    setEditingRoleId(roleId);
    setOpenEditRoleModal(true);
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      const role = roleList.find((r) => r.id === roleId) || null;
      setDeletingRole(role);

      // Note: Backend might not support check-delete yet, adjusting logic
      const res = await RoleService.CallCheckRoleBeforeDelete(roleId);

      if (res?.statusCode === 200 && res.data) {
        setDeleteMeta({
          userCount: res.data.userCount,
          alternativeRoles: res.data.alternativeRoles,
        });
        setConfirmDeleteOpen(true);
      } else {
        // Fallback for simple delete if check fails or not implemented
        setConfirmDeleteOpen(true);
        setDeleteMeta({ userCount: 0, alternativeRoles: [] });
      }
    } catch (error) {
      console.error("Error check delete role:", error);
      // Fallback to confirm delete
      setConfirmDeleteOpen(true);
      setDeleteMeta({ userCount: 0, alternativeRoles: [] });
    }
  };

  const handleReassignAndDelete = async (targetRoleId: number) => {
    if (!deletingRole) return;
    try {
      const res = await RoleService.CallReassignAndDeleteRole(deletingRole.id, targetRoleId);

      if (res?.statusCode === 200) {
        toast.success("Chuyển người dùng & xoá vai trò thành công");
        await fetchRoleData();
      } else {
        toast.error(res?.message || "Không thể xoá vai trò");
      }
    } catch (error) {
      console.error("Error reassign & delete:", error);
      toast.error("Lỗi khi chuyển role & xoá");
    }
  };

  const handleDeleteWithoutUser = async () => {
    if (!deletingRole) return;
    try {
      const res = await RoleService.CallDeleteRole(deletingRole.id);

      if (res?.statusCode === 200) {
        toast.success("Xoá vai trò thành công");
        fetchRoleData();
      } else {
        toast.error(res?.message || "Không thể xoá vai trò");
      }
    } catch (error) {
      console.error("Error delete role:", error);
      toast.error("Lỗi khi xoá vai trò");
    }
  };

  const handleRestoreRole = async (roleId: number) => {
    try {
      const res = await RoleService.CallRestoreRole(roleId);
      if (res?.statusCode === 200 && res.data) {
        toast.success(`Khôi phục ROLE: ${res.data.name} thành công`);
        fetchRoleData();
      } else {
        toast.error(res?.message || `Khôi phục vai trò thất bại`);
      }
    } catch (error) {
      console.error("Error restore role:", error);
      toast.error("Lỗi khi khôi phục vai trò");
    }
  };

  const table = useReactTable({
    data: roleList,
    columns: roleColumns(handleEditRole, handleDeleteRole, handleRestoreRole),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      const res = await RoleService.CallFetchRolesList();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        setRoleList(res.data);
      }
    } catch (error) {
      console.log("Error loading roles:", error);
    }
  };

  const fetchRoleDataToTop = async (roleId: number) => {
    try {
      const res = await RoleService.CallFetchRolesList();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        const roles = res.data;
        const updatedRole = roles.find((r) => r.id === roleId);

        if (!updatedRole) {
          setRoleList(roles);
          return;
        }

        const newList = [updatedRole, ...roles.filter((r) => r.id !== roleId)];
        setRoleList(newList);
      }
    } catch (error) {
      console.log("Error fetch role data to top:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setOpenAddRoleModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenAddRoleModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditRoleModal(false);
    setEditingRoleId(null);
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Tìm theo tên vai trò..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          <Button
            onClick={() => handleOpenCreateModal()}
            className="text-white cursor-pointer transition-all duration-300 hover:opacity-90"
            style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
          >
            + Thêm vai trò
          </Button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto cursor-pointer">
                <Settings2 /> Xem
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chuyển đổi cột</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnNames: Record<string, string> = {
                    id: "ID",
                    name: "Tên Vai trò",
                    description: "Mô tả",
                    isSystem: "Hệ thống",
                    createdAt: "Ngày tạo",
                    updatedAt: "Ngày chỉnh sửa",
                  };
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnNames[column.id]}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id} className="bg-white">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center ">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
      <EditRoleModal
        open={openEditRoleModal}
        onClose={handleCloseEditModal}
        onSuccess={(newRoleId) => fetchRoleDataToTop(newRoleId)}
        roleId={editingRoleId}
      />
      <CreateRoleModal open={openAddRoleModal} onClose={handleCloseCreateModal} onSuccess={(newRoleId) => fetchRoleDataToTop(newRoleId)} />
      <ConfirmDeleteRoleModal
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeletingRole(null);
          setDeleteMeta(null);
        }}
        onDeleted={() => {
          setConfirmDeleteOpen(false);
          setDeletingRole(null);
          setDeleteMeta(null);
          fetchRoleData();
        }}
        roleId={deletingRole?.id ?? null}
        roleName={deletingRole?.name}
        userCount={deleteMeta?.userCount ?? 0}
        alternativeRoles={deleteMeta?.alternativeRoles ?? []}
        onReassignAndDelete={handleReassignAndDelete}
        onDeleteWithoutUser={handleDeleteWithoutUser}
      />
    </>
  );
}
