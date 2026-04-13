import { IActivity } from "./activity.type";

export interface IActivityCategory {
    id: number;
    name: string;
    description: string | null;
    color: string | null;
    createdAt: string;
    updatedAt: string;
    activities?: IActivity[];
}

export interface IActivityCategoryData {
    categories: IActivityCategory[];
}

export interface ModalActivityCategoryData {
    name: string;
    description?: string;
    color?: string;
}
