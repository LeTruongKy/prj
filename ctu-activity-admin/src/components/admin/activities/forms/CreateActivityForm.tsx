"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

import { createActivitySchema } from "@/schemas/activity.schema";
import { ActivityService } from "@/services/activityService";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import { CriteriaService } from "@/services/criteriaService";
import { IActivityCategory } from "@/types/activityCategory.type";
import { ICriteria } from "@/types/criteria.type";
import { useAuthStore } from "@/stores/authStore";
// ✅ Import PosterUploadField
import { PosterUploadField } from "../components/PosterUploadField";
// ✅ Import TagSelector
import { TagSelector } from "@/components/common/TagSelector";

interface CreateActivityFormProps {
  onSuccess?: () => void;
}

type FormData = {
  title: string;
  description: string;
  location: string;
  categoryId: number;
  criteriaIds: number[];
  maxParticipants: number;
  startTime: string;
  endTime: string;
  posterUrl?: string;
};

export function CreateActivityForm({ onSuccess }: CreateActivityFormProps) {
  const { authUser } = useAuthStore();
  const [categories, setCategories] = useState<IActivityCategory[]>([]);
  const [criteria, setCriteria] = useState<ICriteria[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCriteria, setLoadingCriteria] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // ✅ State for poster file
  const [posterFile, setPosterFile] = useState<File | null>(null);
  // ✅ State for tags
  const [tagIds, setTagIds] = useState<number[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(createActivitySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      location: "",
      categoryId: undefined,
      criteriaIds: [],
      maxParticipants: 30,
      startTime: "",
      endTime: "",
      posterUrl: undefined,
    },
  });

  // Fetch categories and criteria on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        const categoryRes = await ActivityCategoryService.CallFetchCategoriesList();
        console.log("fetchCategories res", categoryRes);
        if (categoryRes?.statusCode === 200) {
          setCategories(categoryRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách loại hoạt động");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoadingCriteria(true);
        const res = await CriteriaService.CallFetchCriteriaList();
        if (res?.statusCode === 200) {
          const data = res.data;

          setCriteria(data);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
        toast.error("Không thể tải danh sách tiêu chí");
      } finally {
        setLoadingCriteria(false);
      }
    };

    fetchCriteria();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      if (!authUser?.unitId) {
        toast.error("Không thể xác định đơn vị của bạn");
        return;
      }

      // Format times to ISO string
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);

      // ✅ Use FormData for multipart/form-data request
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("location", data.location);
      formData.append("categoryId", String(data.categoryId));
      formData.append("unitId", String(authUser.unitId));
      formData.append("maxParticipants", String(data.maxParticipants));
      formData.append("startTime", startDate.toISOString());
      formData.append("endTime", endDate.toISOString());

      // ✅ Append file if selected
      if (posterFile) {
        formData.append("file", posterFile);
      }

      // ✅ Append criteria IDs if any
      if (data.criteriaIds && data.criteriaIds.length > 0) {
        data.criteriaIds.forEach((id) => {
          formData.append("criteriaIds", String(id));
        });
      }

      // ✅ Append tag IDs if any
      if (tagIds && tagIds.length > 0) {
        tagIds.forEach((id) => {
          formData.append("tagIds", String(id));
        });
      }

      // ✅ Call service with FormData (multipart/form-data)
      const res = await ActivityService.CallCreateActivityWithFile(formData);

      if (res?.statusCode === 201 || res?.statusCode === 200) {
        toast.success("Tạo hoạt động thành công");
        form.reset();
        setPosterFile(null);
        setTagIds([]);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Tạo hoạt động thất bại");
      }
    } catch (error: any) {
      console.error("Error creating activity:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Đã có lỗi xảy ra khi tạo hoạt động";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu Đề Hoạt Động</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tiêu đề hoạt động"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô Tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả chi tiết về hoạt động"
                  rows={4}
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa Điểm</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập địa điểm tổ chức"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Poster Image Upload */}
        <FormItem>
          <FormLabel>Ảnh Poster Hoạt Động</FormLabel>
          <FormDescription>
            Chọn ảnh đại diện cho hoạt động. Hỗ trợ JPEG, PNG, GIF, WebP (tối đa 5MB)
          </FormDescription>
          <PosterUploadField
            value={posterFile}
            onChange={setPosterFile}
            disabled={submitting}
          />
        </FormItem>

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại Hoạt Động</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
                disabled={submitting || loadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hoạt động" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCategories ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Đang tải...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Không có loại hoạt động
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormDescription>
            Chọn các tags liên quan để giúp người dùng dễ tìm kiếm hoạt động này
          </FormDescription>
          <TagSelector
            selectedTagIds={tagIds}
            onChange={setTagIds}
            disabled={submitting}
          />
        </FormItem>

        {/* Criteria (Multi-select with checkboxes) */}
        <FormField
          control={form.control}
          name="criteriaIds"
          render={() => (
            <FormItem>
              <FormLabel>Tiêu Chí SV5T</FormLabel>
              <FormDescription>
                Chọn các tiêu chí liên quan đến hoạt động này
              </FormDescription>
              <div className="flex flex-col gap-3 mt-3">
                {loadingCriteria ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Đang tải tiêu chí...
                  </div>
                ) : criteria.length > 0 ? (
                  criteria.map((crit) => (
                    <FormField
                      key={crit.id}
                      control={form.control}
                      name="criteriaIds"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(crit.id) || false}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, crit.id]);
                                } else {
                                  field.onChange(
                                    current.filter((id) => id !== crit.id)
                                  );
                                }
                              }}
                              disabled={submitting}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {crit.name}
                            {crit.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {crit.description}
                              </p>
                            )}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Không có tiêu chí
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Participants */}
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số Lượng Tối Đa</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng tối đa"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min="1"
                  max="10000"
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Time */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời Gian Bắt Đầu</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormDescription>
                Định dạng: YYYY-MM-DDTHH:MM
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time */}
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời Gian Kết Thúc</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormDescription>
                Phải sau thời gian bắt đầu
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="submit"
            disabled={submitting || loadingCategories || loadingCriteria}
            className="gap-2"
          >
            {submitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Lưu Hoạt Động"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
