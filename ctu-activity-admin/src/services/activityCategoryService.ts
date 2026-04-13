import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IActivityCategory, ModalActivityCategoryData } from "@/types/activityCategory.type";

export const ActivityCategoryService = {
    CallFetchCategoriesList: (): Promise<IBackendRes<IActivityCategory[]>> => {
        return privateAxios.get(`/categories`);
    },

    CallCreateCategory: (data: ModalActivityCategoryData): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.post("/activity-categories", data);
    },

    CallGetCategoryDetail: (id: number): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.get(`/activity-categories/${id}`);
    },

    CallUpdateCategory: (id: number, payload: ModalActivityCategoryData): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.put(`/activity-categories/${id}`, payload);
    },

    CallDeleteCategory: (id: number): Promise<IBackendRes<any>> => {
        return privateAxios.delete(`/activity-categories/${id}`);
    },
};
