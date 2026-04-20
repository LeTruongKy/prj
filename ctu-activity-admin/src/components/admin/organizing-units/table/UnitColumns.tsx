import { IUnit } from "@/types/unit.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, School, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/formateDate";

export const unitColumns = (
    onEdit: (unit: IUnit) => void,
    onDelete: (id: number) => void,
): ColumnDef<IUnit>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0"
                >
                    Tên đơn vị <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const unit = row.original;
                return (
                    <div className="flex items-center gap-2 font-medium">
                        {unit.type === "LCH" ? <School className="h-4 w-4 text-blue-500" /> : <Users className="h-4 w-4 text-green-500" />}
                        {unit.name}
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Loại đơn vị",
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${type === "LCH" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                        {type === "LCH" ? "Liên chi hôi" : "Chi hội"}
                    </span>
                );
            },
        },
        {
            accessorKey: "parentId",
            header: "Đơn vị trực thuộc",
            cell: ({ row }) => {
                const parent = row.original.parent;
                return parent ? <span className="text-sm border-b border-dotted border-gray-400">{parent.name}</span> : "/";
            },
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => formatDate(row.getValue("createdAt")),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const unit = row.original;
                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(unit)}>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(unit.id)} className="text-red-600">
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
