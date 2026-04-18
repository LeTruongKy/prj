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
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { toast } from "sonner";
import { permisionColumns } from "./PermissionsColumns";
import { IPermission } from "@/types/permission.type";
import { PermmissionService } from "@/services/permissionService";

export function PermissionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [permissionList, setPermissionList] = React.useState<IPermission[]>([]);

  const [openAddPermisisonModal, setOpenAddPermisisonModal] = React.useState(false);
  const [openEditPermisisonModal, setOpenEditPermisisonModal] = React.useState(false);

  const [editingPermissionId, setEditingPermissionId] = React.useState<number | null>(null);

  const handleEditPermisison = (id: number) => {
    setEditingPermissionId(id);
    setOpenEditPermisisonModal(true);
  };

  const handleDeletePermission = async (id: number) => {
    try {
      if (confirm("Bạn có chắc chắn muốn xóa quyền hạn này?")) {
        const res = await PermmissionService.CallDeletePermission(id);
        if (res?.statusCode === 200) {
          toast.success("Xóa quyền hạn thành công");
          fetchPermisisonData();
        } else {
          toast.error(res?.message || "Xóa quyền hạn thất bại");
        }
      }
    } catch (error) {
      console.error("Error delete permission:", error);
      toast.error("Lỗi khi xóa quyền hạn");
    }
  };

  const handleRestorePermison = async (id: number) => {
    // Backend restore logic if needed
  };

  const table = useReactTable({
    data: permissionList,
    columns: permisionColumns(handleEditPermisison, handleDeletePermission, handleRestorePermison),
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
    fetchPermisisonData();
  }, []);

  const fetchPermisisonData = async () => {
    try {
      const res = await PermmissionService.CallFetchPermissionList();
      if (res?.statusCode === 200 && Array.isArray(res.data)) {
        setPermissionList(res.data);
      }
    } catch (error) {
      console.log("Error loading permissions:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setOpenAddPermisisonModal(true);
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Tìm theo slug hoặc resource..."
            value={(table.getColumn("slug")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("slug")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Button
            onClick={() => handleOpenCreateModal()}
            className="text-white cursor-pointer transition-all duration-300 hover:opacity-90"
            style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }}
          >
            + Thêm quyền hạn
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
                    slug: "Slug",
                    resource: "Resource",
                    action: "Action",
                    description: "Mô tả",
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
    </>
  );
}
