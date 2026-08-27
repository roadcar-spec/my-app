// 日報の提出状況。当日提出=期日通り、翌日提出=翌営業日にずれ込んだが提出済み、未提出=未提出。
export type ManagementStatus = "当日提出" | "翌日提出" | "未提出";

// 過去データには旧仕様の "提出" という値がそのまま残っているため、
// "未提出" 以外はすべて「提出済み」として扱う(DBの移行は行わない)。
export function isSubmitted(
  status: ManagementStatus | string | undefined
): boolean {
  return status !== undefined && status !== "未提出";
}

// 表示色分けのための分類。翌日提出=late、未提出/未定義=none、
// それ以外(当日提出・旧仕様の "提出")=ontime として扱う。
export type StatusDisplayKind = "ontime" | "late" | "none";

export function getStatusDisplayKind(
  status: ManagementStatus | string | undefined
): StatusDisplayKind {
  if (status === "翌日提出") return "late";
  if (status === "未提出" || status === undefined) return "none";
  return "ontime"; // 当日提出、および旧仕様の "提出" を含む
}
