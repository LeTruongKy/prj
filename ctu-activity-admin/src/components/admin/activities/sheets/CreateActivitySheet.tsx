"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateActivityForm } from "../forms/CreateActivityForm";

interface CreateActivitySheetProps {
  onActivityCreated?: () => void;
}

export function CreateActivitySheet({ onActivityCreated }: CreateActivitySheetProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onActivityCreated?.();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
      >
        <Plus className="h-4 w-4" /> Tạo hoạt động mới
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tạo Hoạt Động Mới</SheetTitle>
            <SheetDescription>
              Điền thông tin chi tiết để tạo một hoạt động mới. Tất cả trường được đánh dấu * là bắt buộc.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <CreateActivityForm onSuccess={handleSuccess} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
