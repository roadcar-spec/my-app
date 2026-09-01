// サーバーのローカルタイムゾーンに関わらず、日本時間(Asia/Tokyo)の
// カレンダー日付を "YYYY-MM-DD" 形式で取得するためのヘルパー。
const jstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getJstDateString(date: Date = new Date()): string {
  return jstFormatter.format(date);
}

// 日本時間(Asia/Tokyo)における「前日」を "YYYY-MM-DD" 形式で取得するヘルパー。
// 「今日」はまだ終わっていないため、直近の確定した営業日(=前日)を既定値として
// 使いたい箇所(ダッシュボード等)で使う。
export function getJstYesterdayString(date: Date = new Date()): string {
  const todayJst = getJstDateString(date);

  const yesterday = new Date(`${todayJst}T00:00:00Z`);

  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return yesterday.toISOString().split("T")[0];
}

// 日本時間(Asia/Tokyo)における「今月1日」を "YYYY-MM-01" 形式で取得するヘルパー。
// フォームの月初期値など、サーバーのタイムゾーンに関わらず正しい月を出したい箇所で使う。
export function getJstMonthStartString(date: Date = new Date()): string {
  return `${getJstDateString(date).substring(0, 7)}-01`;
}

// 車検進捗の対象3ヶ月(基準月＋続く2ヶ月)を、年をまたいでも(12月→1月)
// 正しく計算する内部ヘルパー。基準月(monthStartDateStr、"YYYY-MM-DD" または
// "YYYY-MM")から { year, month } を3ヶ月分返す。
function getRollingMonths(
  monthStartDateStr: string
): [
  { year: number; month: number },
  { year: number; month: number },
  { year: number; month: number }
] {
  const year = Number(monthStartDateStr.substring(0, 4));
  const month = Number(monthStartDateStr.substring(5, 7));

  const at = (offset: number) => {
    const totalMonths = month - 1 + offset;
    return {
      year: year + Math.floor(totalMonths / 12),
      month: (((totalMonths % 12) + 12) % 12) + 1,
    };
  };

  return [at(0), at(1), at(2)];
}

// 車検進捗の月ラベル。基準月(monthStartDateStr、"YYYY-MM-DD" または "YYYY-MM")
// から始まる3ヶ月分の "N月" ラベルを、年をまたいでも(12月→1月)正しく返す。
export function getRollingMonthLabels(
  monthStartDateStr: string
): [string, string, string] {
  const months = getRollingMonths(monthStartDateStr);

  return months.map((m) => `${m.month}月`) as [string, string, string];
}

// 車検進捗の対象3ヶ月を、基準月(monthStartDateStr、"YYYY-MM-DD" または "YYYY-MM")
// から始まる "YYYY-MM-01" 形式の日付文字列で返す。年をまたいでも(12月→1月)正しい年になる。
export function getRollingMonthStarts(
  monthStartDateStr: string
): [string, string, string] {
  const months = getRollingMonths(monthStartDateStr);

  return months.map(
    (m) => `${m.year}-${String(m.month).padStart(2, "0")}-01`
  ) as [string, string, string];
}
