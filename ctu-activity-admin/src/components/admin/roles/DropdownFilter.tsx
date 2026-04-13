"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterType } from "@/types/role.type";
import { Button } from "../../ui/button";

interface FilterProps {
  applyFilter: (value: FilterType) => void;
  statusFilter: string;
}

export function DropdownFilter({ applyFilter, statusFilter }: FilterProps) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            Lọc trạng thái
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => applyFilter(value as FilterType)}>
            <DropdownMenuRadioItem className="cursor-pointer" value="all">
              Tất cả
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="cursor-pointer" value="active">
              Khả dụng
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="cursor-pointer" value="deleted">
              Đã xóa
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>{" "}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
