import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IUnit, ModalUnitData } from "@/types/unit.type";

export const UnitService = {
    CallFetchUnitsList: (): Promise<IBackendRes<{ data: IUnit[]; total: number }>> => {
        return privateAxios.get(`/units`);
    },

    CallCreateUnit: (unitData: ModalUnitData): Promise<IBackendRes<IUnit>> => {
        return privateAxios.post("/units", unitData);
    },

    CallGetUnitDetail: (id: number): Promise<IBackendRes<IUnit>> => {
        return privateAxios.get(`/units/${id}`);
    },

    CallUpdateUnit: (id: number, payload: ModalUnitData): Promise<IBackendRes<IUnit>> => {
        return privateAxios.put(`/units/${id}`, payload);
    },

    CallDeleteUnit: (id: number): Promise<IBackendRes<any>> => {
        return privateAxios.delete(`/units/${id}`);
    },
};
