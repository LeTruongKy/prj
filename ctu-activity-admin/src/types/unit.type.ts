export interface IUnit {
    id: number;
    name: string;
    type: "LCH" | "CH";
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
    parent?: IUnit;
    children?: IUnit[];
}

export interface IUnitData {
    units: IUnit[];
}

export interface ModalUnitData {
    name: string;
    type: "LCH" | "CH";
    parentId?: number | null;
}
