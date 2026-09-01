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

// 車検進捗の月ラベル。基準月(monthStartDateStr、"YYYY-MM-DD" または "YYYY-MM")
// から始まる3ヶ月分の "N月" ラベルを、年をまたいでも(12月→1月)正しく返す。
export function getRollingMonthLabels(
  monthStartDateStr: string
): [string, string, string] {
  const month = Number(monthStartDateStr.substring(5, 7));

  const label = (offset: number) => {
    const m = ((month - 1 + offset) % 12) + 1;
    return `${m}月`;
  };

  return [label(0), label(1), label(2)];
}
