export function getCurrentWeekId(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const firstDayOfYear: Date = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear = (currentDate.getTime() - firstDayOfYear.getTime()) / 86400000;
  return `${year}-${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
}