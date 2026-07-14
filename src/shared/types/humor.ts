export interface IUserHumor {
  id: string;
  dateTime: number;
  rate: number;
  description: string;
}

export type HumorSortField = "dateTime" | "rate" | "description";
export type HumorSortDirection = "asc" | "desc";
export type BulkDeleteScope = "day" | "all";
