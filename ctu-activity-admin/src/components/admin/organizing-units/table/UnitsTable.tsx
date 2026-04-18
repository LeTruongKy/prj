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
import { Plus, Settings2 } from "lucide-react";

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
import { IUnit } from "@/types/unit.type";
import { UnitService } from "@/services/unitService";
import { unitColumns } from "./UnitColumns";
import { CreateUnitModal } from "../modals/CreateUnitModal";
import { EditUnitModal } from "../modals/EditUnitModal";

export function UnitsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [unitList, setUnitList] = React.useState<IUnit[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [selectedUnit, setSelectedUnit] = React.useState<IUnit | null>(null);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const res = await UnitService.CallFetchUnitsList();
            console.log("fetchUnits res", res);
            if (res?.statusCode === 200 && Array.isArray(res.data?.data)) {
                setUnitList(res.data.data);
            }
        } catch (error) {
            console.error("Error loading units:", error);
            toast.error("Không thể tải danh sách đơn vị");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (unit: IUnit) => {
        setSelectedUnit(unit);
        setOpenEditModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa đơn vị này?")) {
            try {
                const res = await UnitService.CallDeleteUnit(id);
                if (res?.statusCode === 200) {
                    toast.success("Xóa đơn vị thành công");
                    fetchUnits();
                } else {
                    toast.error(res?.message || "Xóa thất bại");
                }
            } catch (error: any) {
                console.error("Error deleting unit:", error);
                const message = error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra";
                toast.error(message);
            }
        }
    };

    const table = useReactTable({
        data: unitList,
        columns: unitColumns(handleEdit, handleDelete),
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
        fetchUnits();
    }, []);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Tìm đơn vị..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <Button
                    className="text-white gap-2 cursor-pointer transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }}
                    onClick={() => setOpenCreateModal(true)}
                >
                    <Plus className="h-4 w-4" /> Thêm đơn vị
                </Button>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Settings2 className="h-4 w-4 mr-2" /> Xem
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                const columnNames: Record<string, string> = {
                                    name: "Tên đơn vị",
                                    type: "Loại",
                                    parentId: "Đơn vị mẹ",
                                    createdAt: "Ngày tạo",
                                };
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {columnNames[column.id] || column.id}
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : unitList.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="bg-white hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />

            <CreateUnitModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={() => fetchUnits()}
            />

            <EditUnitModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setSelectedUnit(null);
                }}
                onSuccess={() => fetchUnits()}
                unit={selectedUnit}
            />
        </div>
    );
}
