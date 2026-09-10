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

// dateStr は "YYYY-MM-DD" 形式のカレンダー日付そのものを表すため、
// サーバーのローカルタイムゾーンに影響されないよう常にUTCとして解釈する。
function toUtcDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

function isLastDayOfMonth(date: Date): boolean {
  const nextDay = new Date(date);
  nextDay.setUTCDate(date.getUTCDate() + 1);
  return nextDay.getUTCMonth() !== date.getUTCMonth();
}

export function isBusinessDay(dateStr: string): boolean {
  // 年末年始・お盆は曜日に関係なく休み
  for (const [start, end] of specialHolidayRanges) {
    if (dateStr >= start && dateStr <= end) {
      return false;
    }
  }

  const date = toUtcDate(dateStr);
  const dayOfWeek = date.getUTCDay(); // 0=日,1=月,2=火,3=水,4=木,5=金,6=土

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
  const current = toUtcDate(startDateStr);
  const end = toUtcDate(endDateStr);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    if (isBusinessDay(dateStr)) {
      result.push(dateStr);
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

// [monthStartDateStr, dateStr] の範囲に含まれる営業日が何日目か(1始まり)を返す。
// dateStr 自体が営業日でなくても、そこまでに経過した営業日数をそのまま返す
// (＝getBusinessDaysInRange の件数の薄いラッパー)。
export function getBusinessDayIndex(
  monthStartDateStr: string,
  dateStr: string
): number {
  return getBusinessDaysInRange(monthStartDateStr, dateStr).length;
}

// [monthStartDateStr, monthEndDateStr] の範囲内で、営業日index番目(1始まり、
// getBusinessDayIndex の戻り値と対応)に当たる日付を返す。その範囲に営業日が
// index件に満たない場合(例:前月の営業日数が今月より少ない)はundefinedを返す。
// 「先月に対応する時点が存在しない」ケースは呼び出し側で許容すべき正常系。
export function getDateAtBusinessDayIndex(
  monthStartDateStr: string,
  monthEndDateStr: string,
  index: number
): string | undefined {
  const result = getBusinessDaysInRange(
    monthStartDateStr,
    monthEndDateStr
  );

  return result[index - 1];
}