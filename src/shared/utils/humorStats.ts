import { IUserHumor } from "../types/humor";
import {
  DateRange,
  PeriodSelection,
  buildPeriodRange,
  formatMonthYearLabel
} from "./date";

export type MonthBucket = {
  key: string;
  label: string;
  year: number;
  month: number;
  averageRate: number | null;
  count: number;
};

export type HumorPeriodStats = {
  range: DateRange;
  periodLabel: string;
  count: number;
  averageRate: number | null;
  bests: IUserHumor[];
  worsts: IUserHumor[];
  monthlyBuckets: MonthBucket[];
};

export function filterHumorsInRange(list: IUserHumor[], range: DateRange): IUserHumor[] {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();
  return list.filter((item) => item.dateTime >= startMs && item.dateTime <= endMs);
}

function averageRate(list: IUserHumor[]): number | null {
  if (list.length === 0) return null;
  const sum = list.reduce((total, item) => total + item.rate, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

function sortByDateDesc(list: IUserHumor[]): IUserHumor[] {
  return [...list].sort((a, b) => b.dateTime - a.dateTime);
}

export function pickBests(list: IUserHumor[]): IUserHumor[] {
  if (list.length === 0) return [];
  const maxRate = Math.max(...list.map((item) => item.rate));
  return sortByDateDesc(list.filter((item) => item.rate === maxRate));
}

export function pickWorsts(list: IUserHumor[]): IUserHumor[] {
  if (list.length === 0) return [];
  const minRate = Math.min(...list.map((item) => item.rate));
  return sortByDateDesc(list.filter((item) => item.rate === minRate));
}

export function filterHumorsByMonth(
  list: IUserHumor[],
  year: number,
  month: number
): IUserHumor[] {
  return sortByDateDesc(
    list.filter((item) => {
      const date = new Date(item.dateTime);
      return date.getFullYear() === year && date.getMonth() === month;
    })
  );
}

function buildMonthlyBuckets(list: IUserHumor[], range: DateRange): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  const cursor = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
  const last = new Date(range.end.getFullYear(), range.end.getMonth(), 1);

  while (cursor <= last) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthItems = filterHumorsByMonth(list, year, month);

    buckets.push({
      key,
      label: formatMonthYearLabel(month, year),
      year,
      month,
      averageRate: averageRate(monthItems),
      count: monthItems.length
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return buckets;
}

export function computeHumorPeriodStats(
  list: IUserHumor[],
  selection: PeriodSelection,
  periodLabel: string
): HumorPeriodStats {
  const range = buildPeriodRange(selection);
  const inRange = filterHumorsInRange(list, range);

  return {
    range,
    periodLabel,
    count: inRange.length,
    averageRate: averageRate(inRange),
    bests: pickBests(inRange),
    worsts: pickWorsts(inRange),
    monthlyBuckets: buildMonthlyBuckets(inRange, range)
  };
}
