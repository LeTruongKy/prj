import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { ICriteria, ICriteriaGroup } from "@/types/criteria.type";

export const CriteriaService = {
  CallFetchCriteriaList: (params?: any): Promise<IBackendRes<{ data: ICriteria[]; total: number }>> => {
    return privateAxios.get(`/criteria`, { params });
  },

  CallFetchCriteriaGroupsList: (): Promise<IBackendRes<ICriteriaGroup[]>> => {
    return privateAxios.get(`/criteria-groups`);
  },

  CallGetCriteriaDetail: (id: number): Promise<IBackendRes<ICriteria>> => {
    return privateAxios.get(`/criteria/${id}`);
  },

  CallCreateCriteria: (data: any): Promise<IBackendRes<ICriteria>> => {
    return privateAxios.post("/criteria", data);
  },

  CallUpdateCriteria: (id: number, payload: any): Promise<IBackendRes<ICriteria>> => {
    return privateAxios.put(`/criteria/${id}`, payload);
  },

  CallDeleteCriteria: (id: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/criteria/${id}`);
  },
};
