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
