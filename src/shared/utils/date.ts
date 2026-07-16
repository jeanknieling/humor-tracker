export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isFutureDay(date: Date): boolean {
  return startOfDay(date).getTime() > startOfDay(new Date()).getTime();
}

export function formatDayLabel(date: Date): string {
  if (isToday(date)) return "hoje";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

/** Pergunta de humor conforme o dia (hoje / passado / futuro). */
export function formatHumorQuestion(date: Date): string {
  if (isToday(date)) return "Como está seu humor hoje?";
  if (isFutureDay(date)) return `Como estará seu humor em ${formatDayLabel(date)}?`;
  return `Como estava seu humor em ${formatDayLabel(date)}?`;
}

export function formatDateTimeLabel(date: Date | number): string {
  return new Date(date)
    .toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
    .replace(",", " às");
}

export function toCalendarDateKey(date: Date | number | string): string {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Chaves `YYYY-MM-DD` dos dias que têm pelo menos um humor. */
export function getDaysWithHumorKeys(list: Array<{ dateTime: number }>): string[] {
  const dayKeys = new Set<string>();
  for (const item of list) {
    dayKeys.add(toCalendarDateKey(item.dateTime));
  }
  return [...dayKeys];
}

export function buildDateTimeForDay(selectedDayMs?: number): Date {
  const now = new Date();
  if (selectedDayMs == null) return now;

  const selectedDay = new Date(selectedDayMs);
  if (isSameDay(selectedDay, now)) return now;

  selectedDay.setHours(now.getHours(), now.getMinutes(), 0, 0);
  return selectedDay;
}

export type PeriodMode = "month" | "year";

export type PeriodSelection = {
  mode: PeriodMode;
  /** Mês 0–11 (modo month) */
  month: number;
  year: number;
  endMonth: number;
  endYear: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export function startOfMonth(year: number, month: number): Date {
  return startOfDay(new Date(year, month, 1));
}

export function endOfMonth(year: number, month: number): Date {
  return endOfDay(new Date(year, month + 1, 0));
}

export function startOfYear(year: number): Date {
  return startOfDay(new Date(year, 0, 1));
}

export function endOfYear(year: number): Date {
  return endOfDay(new Date(year, 11, 31));
}

function normalizeMonthYearRange(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number
): { startMonth: number; startYear: number; endMonth: number; endYear: number } {
  const startKey = startYear * 12 + startMonth;
  const endKey = endYear * 12 + endMonth;
  if (startKey <= endKey) {
    return { startMonth, startYear, endMonth, endYear };
  }
  return {
    startMonth: endMonth,
    startYear: endYear,
    endMonth: startMonth,
    endYear: startYear
  };
}

export function buildPeriodRange(selection: PeriodSelection): DateRange {
  if (selection.mode === "month") {
    const range = normalizeMonthYearRange(
      selection.month,
      selection.year,
      selection.endMonth,
      selection.endYear
    );
    return {
      start: startOfMonth(range.startYear, range.startMonth),
      end: endOfMonth(range.endYear, range.endMonth)
    };
  }

  const startYear = Math.min(selection.year, selection.endYear);
  const endYear = Math.max(selection.year, selection.endYear);
  return {
    start: startOfYear(startYear),
    end: endOfYear(endYear)
  };
}

export const MONTH_SHORT_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez"
] as const;

export function formatMonthYearLabel(month: number, year: number): string {
  return `${MONTH_SHORT_PT[month]}/${year}`;
}

export function formatPeriodLabel(selection: PeriodSelection): string {
  if (selection.mode === "month") {
    const range = normalizeMonthYearRange(
      selection.month,
      selection.year,
      selection.endMonth,
      selection.endYear
    );
    const startLabel = formatMonthYearLabel(range.startMonth, range.startYear);
    const endLabel = formatMonthYearLabel(range.endMonth, range.endYear);
    return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
  }

  const startYear = Math.min(selection.year, selection.endYear);
  const endYear = Math.max(selection.year, selection.endYear);
  return startYear === endYear ? String(startYear) : `${startYear} – ${endYear}`;
}

export function createDefaultPeriodSelection(now = new Date()): PeriodSelection {
  return {
    mode: "month",
    month: now.getMonth(),
    year: now.getFullYear(),
    endMonth: now.getMonth(),
    endYear: now.getFullYear()
  };
}
