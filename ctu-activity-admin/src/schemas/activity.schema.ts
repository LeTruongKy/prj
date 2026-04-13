import { z } from "zod";

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề hoạt động là bắt buộc")
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),

  description: z
    .string()
    .max(5000, "Mô tả không được vượt quá 5000 ký tự")
    .default(""),

  location: z
    .string()
    .min(1, "Địa điểm là bắt buộc")
    .min(3, "Địa điểm phải có ít nhất 3 ký tự")
    .max(255, "Địa điểm không được vượt quá 255 ký tự"),

  categoryId: z
    .number()
    .min(1, "Vui lòng chọn loại hoạt động"),

  criteriaIds: z
    .array(z.number())
    .min(0, "Chọn ít nhất một tiêu chí")
    .default([]),

  maxParticipants: z
    .number()
    .min(1, "Số lượng tối đa phải lớn hơn 0")
    .max(10000, "Số lượng tối đa không được vượt quá 10000"),

  startTime: z
    .string()
    .min(1, "Thời gian bắt đầu là bắt buộc"),

  endTime: z
    .string()
    .min(1, "Thời gian kết thúc là bắt buộc"),

  // ✅ Optional poster URL (from Cloudinary)
  posterUrl: z
    .string()
    .optional()
    .nullable(),
}).refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endTime"],
  }
);

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;

// ✅ Schema for file validation (used separately in component)
export const posterFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước file không được vượt quá 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
      {
        message: "Chỉ hỗ trợ định dạng JPEG, PNG, GIF, hoặc WebP",
      }
    )
    .optional(),
});

export type PosterFileSchema = z.infer<typeof posterFileSchema>;
