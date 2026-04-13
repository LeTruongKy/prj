"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { TagService, ITag } from "@/services/tagService";
import { toast } from "sonner";

interface TagSelectorProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
  disabled?: boolean;
}

export function TagSelector({
  selectedTagIds,
  onChange,
  disabled = false,
}: TagSelectorProps) {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await TagService.CallFetchAllTags();
        console.log("Fetched tags:", res);
        if (res?.statusCode === 200) {
          setTags(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Không thể tải danh sách tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tagId: number, checked: boolean) => {
    let newTagIds: number[];
    if (checked) {
      newTagIds = [...selectedTagIds, tagId];
    } else {
      newTagIds = selectedTagIds.filter((id) => id !== tagId);
    }
    onChange(newTagIds);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải tags...</span>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-md">
        Không có tags nào. Vui lòng tạo tags trước.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag.id}`}
              checked={selectedTagIds.includes(tag.id)}
              onCheckedChange={(checked) =>
                handleTagChange(tag.id, checked as boolean)
              }
              disabled={disabled}
            />
            <Label
              htmlFor={`tag-${tag.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {tag.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
