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

export function formatDayLabel(date: Date): string {
  if (isToday(date)) return "hoje";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
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

export function buildDateTimeForDay(selectedDayMs?: number): Date {
  const now = new Date();
  if (selectedDayMs == null) return now;

  const selectedDay = new Date(selectedDayMs);
  if (isSameDay(selectedDay, now)) return now;

  selectedDay.setHours(now.getHours(), now.getMinutes(), 0, 0);
  return selectedDay;
}
