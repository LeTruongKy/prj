import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";

export interface ITag {
  id: number;
  name: string;
}

export const TagService = {
  // Fetch all tags
  CallFetchAllTags: (): Promise<IBackendRes<ITag[]>> => {
    return privateAxios.get(`/tags`);
  },

  // Get a single tag by ID
  CallGetTag: (id: number): Promise<IBackendRes<ITag>> => {
    return privateAxios.get(`/tags/${id}`);
  },

  // Create a new tag (admin only)
  CallCreateTag: (data: { name: string }): Promise<IBackendRes<ITag>> => {
    return privateAxios.post(`/tags`, data);
  },

  // Update a tag
  CallUpdateTag: (id: number, data: { name?: string }): Promise<IBackendRes<ITag>> => {
    return privateAxios.patch(`/tags/${id}`, data);
  },

  // Delete a tag
  CallDeleteTag: (id: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/tags/${id}`);
  },
};
