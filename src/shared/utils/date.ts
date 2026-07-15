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
