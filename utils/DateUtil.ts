export function getCurrentWeekId(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const firstDayOfYear: Date = new Date(currentDate.getFullYear(), 0, 1);
  const firstSunday = new Date(year, 0, 1 + (7 - firstDayOfYear.getDay()));
  const weekNumber = Math.ceil(((currentDate.getTime() - firstSunday.getTime()) / 86400000 + 1) / 7);
  return weekNumber.toString();
}