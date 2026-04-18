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
import { IActivityCategory } from "@/types/activityCategory.type";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import { activityTypeColumns } from "./ActivityTypeColumns";
import { CreateCategoryModal } from "../../activity-categories/modals/CreateCategoryModal";
import { EditCategoryModal } from "../../activity-categories/modals/EditCategoryModal";

export function ActivityTypesTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [categoryList, setCategoryList] = React.useState<IActivityCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<IActivityCategory | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await ActivityCategoryService.CallFetchCategoriesList();
            if (res?.statusCode === 200 && Array.isArray(res.data.data)) {
                setCategoryList(res.data.data);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
            toast.error("Không thể tải danh sách loại hoạt động");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: IActivityCategory) => {
        setSelectedCategory(category);
        setOpenEditModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa loại hoạt động này?")) {
            try {
                console.log("Deleting category with id:", id);
                const res = await ActivityCategoryService.CallDeleteCategory(id);
                if (res?.statusCode === 200) {
                    toast.success("Xóa loại hoạt động thành công");
                    fetchCategories();
                } else {
                    toast.error(res?.message || "Xóa thất bại");
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Đã có lỗi xảy ra");
            }
        }
    };

    const table = useReactTable({
        data: categoryList,
        columns: activityTypeColumns(handleEdit, handleDelete),
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
        fetchCategories();
    }, []);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Tìm loại hoạt động..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setOpenCreateModal(true)}
                >
                    <Plus className="h-4 w-4" /> Thêm loại hoạt động
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
                                    name: "Tên loại",
                                    description: "Mô tả",
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
                        ) : categoryList.length ? (
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

            <CreateCategoryModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={() => fetchCategories()}
            />

            <EditCategoryModal
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setSelectedCategory(null);
                }}
                onSuccess={() => fetchCategories()}
                category={selectedCategory}
            />
        </div>
    );
}
