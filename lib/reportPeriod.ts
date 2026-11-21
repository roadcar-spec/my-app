import { getBusinessDaysInRange, isBusinessDay } from "@/lib/businessDay";

// 日報の「対象月」の区切り(2026-11-21 ユーザーの決定)。
// 毎月1日の日報は前月の最終日の結果なので、対象月 M の行は「M月2日 〜 翌月1日」とみなす。
//  ・M月1日の行は M 月の累計・本日実績・提出日数に入れない(前月の最終として扱う)
//  ・表示日が1日なら、その画面は前月(の最終)を表示する
// 報告用の集計(mail-import/metrics.js)と同じ考え方。

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

function addMonths(monthStartStr: string, months: number): string {
  const d = new Date(`${monthStartStr}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().split("T")[0];
}

export type ReportPeriod = {
  // 対象月の1日("YYYY-MM-01")。目標・車検の対象月・月ラベル・営業日の数え始めに使う
  monthStart: string;
  // 対象月の2日。行を拾う下限
  periodStart: string;
  // 翌月1日(=対象月の最終の日報)。行を拾う上限
  periodEnd: string;
  // 対象月の末日
  monthEnd: string;
  // 月の経過(営業日index)を数えるときの日。表示日、ただし翌月1日なら月末
  businessAsOf: string;
  // 表示日が翌月1日(=対象月の締めの日報)か
  isClosingDay: boolean;
};

export function getReportPeriod(viewDate: string): ReportPeriod {
  const ownMonthStart = `${viewDate.substring(0, 8)}01`;

  const monthStart =
    viewDate === ownMonthStart
      ? addMonths(ownMonthStart, -1)
      : ownMonthStart;

  const periodEnd = addMonths(monthStart, 1);
  const monthEnd = addDays(periodEnd, -1);
  const isClosingDay = viewDate === periodEnd;

  return {
    monthStart,
    periodStart: addDays(monthStart, 1),
    periodEnd,
    monthEnd,
    businessAsOf: isClosingDay ? monthEnd : viewDate,
    isClosingDay,
  };
}

// その対象月で、表示日までに日報が出ているべき日(report_date)。
// 対象月2日〜表示日の営業日。表示日が翌月1日なら、その日(締めの日報)も営業日なら含める。
export function getRequiredReportDates(
  period: ReportPeriod,
  viewDate: string
): string[] {
  const end = viewDate < period.monthEnd ? viewDate : period.monthEnd;

  const dates =
    end >= period.periodStart
      ? getBusinessDaysInRange(period.periodStart, end)
      : [];

  if (viewDate >= period.periodEnd && isBusinessDay(period.periodEnd)) {
    dates.push(period.periodEnd);
  }

  return dates;
}
