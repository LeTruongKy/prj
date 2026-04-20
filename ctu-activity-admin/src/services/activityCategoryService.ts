import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IActivityCategory, ModalActivityCategoryData } from "@/types/activityCategory.type";

// Helper function to normalize category data
const normalizeCategory = (category: any): IActivityCategory => {
    return {
        ...category,
        id: category.id || category.category_id,
        category_id: category.category_id || category.id,
    };
};

const normalizeCategories = (categories: any[]): IActivityCategory[] => {
    return categories.map(normalizeCategory);
};

export const ActivityCategoryService = {
    CallFetchCategoriesList: async (): Promise<IBackendRes<IActivityCategory[]>> => {
        const res = await privateAxios.get(`/categories`);
        if (res?.data) {
            const categoryData = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
            return {
                ...res,
                data: normalizeCategories(categoryData),
            };
        }
        return res;
    },

    CallCreateCategory: (data: ModalActivityCategoryData): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.post("/categories", data);
    },

    CallGetCategoryDetail: (id: number): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.get(`/categories/${id}`);
    },

    CallUpdateCategory: (id: number, payload: ModalActivityCategoryData): Promise<IBackendRes<IActivityCategory>> => {
        return privateAxios.patch(`/categories/${id}`, payload);
    },

    CallDeleteCategory: (id: number): Promise<IBackendRes<any>> => {
        return privateAxios.delete(`/categories/${id}`);
    },
};
