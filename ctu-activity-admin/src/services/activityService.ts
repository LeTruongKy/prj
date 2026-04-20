import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IActivity, ModalActivityData } from "@/types/activity.type";

export const ActivityService = {
    CallFetchActivitiesList: (params?: any): Promise<IBackendRes<IActivity[]>> => {
        return privateAxios.get(`/activities`, { params });
    },

    CallCreateActivity: (data: ModalActivityData): Promise<IBackendRes<IActivity>> => {
        return privateAxios.post("/activities", data);
    },

    // âœ… NEW: Create activity with file upload (FormData)
    CallCreateActivityWithFile: (formData: FormData): Promise<IBackendRes<IActivity>> => {
        return privateAxios.post("/activities", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    CallGetActivityDetail: (id: number): Promise<IBackendRes<IActivity>> => {
        return privateAxios.get(`/activities/${id}`);
    },

    CallUpdateActivity: (id: number, payload: Partial<ModalActivityData>): Promise<IBackendRes<IActivity>> => {
        return privateAxios.patch(`/activities/${id}`, payload);
    },

    // âœ… NEW: Update activity with file upload (FormData)
    CallUpdateActivityWithFile: (id: number, formData: FormData): Promise<IBackendRes<IActivity>> => {
        return privateAxios.patch(`/activities/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    CallDeleteActivity: (id: number): Promise<IBackendRes<any>> => {
        return privateAxios.delete(`/activities/${id}`);
    },

    CallUpdateActivityStatus: (id: number, status: string): Promise<IBackendRes<IActivity>> => {
        return privateAxios.patch(`/activities/${id}/status`, { status });
    },

    CallExportParticipantsReport: (id: number): Promise<any> => {
        return privateAxios.get(`/activities/${id}/report/export`, {
            responseType: "blob",
        });
    },
};
