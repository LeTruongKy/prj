"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { TagService, ITag } from "@/lib/services/tagService";
import { UserInterestService } from "@/lib/services/userInterestService";
import { toast } from "sonner";

interface InterestSelectorProps {
  userId?: string;
  onSuccess?: () => void;
  showSubmitButton?: boolean;
  disabled?: boolean;
}

export function InterestSelector({
  userId,
  onSuccess,
  showSubmitButton = true,
  disabled = false,
}: InterestSelectorProps) {
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all tags
        const tagsRes = await TagService.CallFetchAllTags();
        if (tagsRes?.statusCode === 200) {
          setTags(tagsRes.data || []);
        }

        // If userId provided, fetch existing interests
        if (userId) {
          const interestsRes = await UserInterestService.CallGetUserInterests(userId);
          if (interestsRes?.statusCode === 200) {
            const interestTagIds = (interestsRes.data || []).map(
              (interest) => interest.tagId
            );
            setSelectedTagIds(interestTagIds);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleTagChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    } else {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    }
  };

  const handleSubmit = async () => {
    if (selectedTagIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sở thích");
      return;
    }

    try {
      setSubmitting(true);
      const res = await UserInterestService.CallUpdateUserInterests({
        tagIds: selectedTagIds,
        weight: 1.0,
      });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success("Sở thích của bạn đã được cập nhật thành công");
        onSuccess?.();
      } else {
        toast.error(res?.message || "Lỗi khi cập nhật sở thích");
      }
    } catch (error: any) {
      console.error("Error updating interests:", error);
      toast.error(error?.message || "Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-md">
        Không có tags nào. Vui lòng liên hệ quản trị viên.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chọn sở thích của bạn</h3>
        <p className="text-sm text-muted-foreground">
          Chọn các tags mà bạn quan tâm để nhận được các đề xuất hoạt động phù hợp
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`interest-${tag.id}`}
                checked={selectedTagIds.includes(tag.id)}
                onCheckedChange={(checked) =>
                  handleTagChange(tag.id, checked as boolean)
                }
                disabled={disabled || submitting}
              />
              <Label
                htmlFor={`interest-${tag.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {tag.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {showSubmitButton && (
        <Button
          onClick={handleSubmit}
          disabled={submitting || selectedTagIds.length === 0}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Lưu sở thích"
          )}
        </Button>
      )}
    </div>
  );
}
