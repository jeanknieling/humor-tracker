import {
  HumorSortDirection,
  HumorSortField,
  IUserHumor
} from "../types/humor";

export function sortHumorList(
  list: IUserHumor[],
  field: HumorSortField,
  direction: HumorSortDirection
): IUserHumor[] {
  const sorted = [...list];

  sorted.sort((a, b) => {
    if (field === "dateTime") {
      return direction === "desc" ? b.dateTime - a.dateTime : a.dateTime - b.dateTime;
    }

    if (field === "rate") {
      return direction === "desc" ? b.rate - a.rate : a.rate - b.rate;
    }

    const descriptionCompare = a.description.localeCompare(b.description, "pt-BR", {
      sensitivity: "base"
    });
    return direction === "desc" ? -descriptionCompare : descriptionCompare;
  });

  return sorted;
}

export const SORT_OPTIONS: {
  field: HumorSortField;
  direction: HumorSortDirection;
  label: string;
}[] = [
  { field: "dateTime", direction: "desc", label: "Data (mais recente)" },
  { field: "dateTime", direction: "asc", label: "Data (mais antiga)" },
  { field: "rate", direction: "desc", label: "Nota (maior primeiro)" },
  { field: "rate", direction: "asc", label: "Nota (menor primeiro)" },
  { field: "description", direction: "asc", label: "Descrição (A–Z)" },
  { field: "description", direction: "desc", label: "Descrição (Z–A)" }
];
