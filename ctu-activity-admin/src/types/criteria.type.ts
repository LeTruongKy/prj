export interface ICriteriaGroup {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  criteria?: ICriteria[];
}

export interface ICriteria {
  id: number;
  name: string;
  description?: string;
  criteriaGroupId: number;
  group?: ICriteriaGroup;
  createdAt: string;
  updatedAt: string;
}

export interface ICriteriaData {
  data: ICriteria[];
  total: number;
}

export interface ICriteriaGroupData {
  data: ICriteriaGroup[];
  total: number;
}
