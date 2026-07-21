// 2026年の祝日(火・水に当たる日の判定に使用)
const publicHolidays2026 = [
  "2026-01-01", "2026-01-12", "2026-02-11", "2026-02-23",
  "2026-03-20", "2026-04-29", "2026-05-03", "2026-05-04",
  "2026-05-05", "2026-05-06", "2026-07-20", "2026-08-11",
  "2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12",
  "2026-11-03", "2026-11-23",
];

// 年末年始・お盆など、曜日に関係なく休みになる期間
// ※日付は仮です。実際の休業期間に合わせて調整してください
const specialHolidayRanges: [string, string][] = [
  ["2026-08-12", "2026-08-16"], // お盆休み(仮)
  ["2026-12-29", "2027-01-03"], // 年末年始休み(仮)
];

function isLastDayOfMonth(date: Date): boolean {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.getMonth() !== date.getMonth();
}

export function isBusinessDay(dateStr: string): boolean {
  // 年末年始・お盆は曜日に関係なく休み
  for (const [start, end] of specialHolidayRanges) {
    if (dateStr >= start && dateStr <= end) {
      return false;
    }
  }

  const date = new Date(dateStr + "T00:00:00");
  const dayOfWeek = date.getDay(); // 0=日,1=月,2=火,3=水,4=木,5=金,6=土

  // 火・水以外は営業日
  if (dayOfWeek !== 2 && dayOfWeek !== 3) {
    return true;
  }

  // 祝日なら営業(例外)
  if (publicHolidays2026.includes(dateStr)) {
    return true;
  }

  // 月末なら営業(例外)
  if (isLastDayOfMonth(date)) {
    return true;
  }

  // それ以外の火・水は休み
  return false;
}

export function getBusinessDaysInRange(
  startDateStr: string,
  endDateStr: string
): string[] {
  const result: string[] = [];
  const current = new Date(startDateStr + "T00:00:00");
  const end = new Date(endDateStr + "T00:00:00");

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    if (isBusinessDay(dateStr)) {
      result.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}