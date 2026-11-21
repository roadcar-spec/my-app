import { describe, expect, it } from "vitest";
import { getReportPeriod, getRequiredReportDates } from "./reportPeriod";

describe("getReportPeriod", () => {
  it("treats the 2nd onward as the same month", () => {
    expect(getReportPeriod("2026-11-02")).toEqual({
      monthStart: "2026-11-01",
      periodStart: "2026-11-02",
      periodEnd: "2026-12-01",
      monthEnd: "2026-11-30",
      businessAsOf: "2026-11-02",
      isClosingDay: false,
    });
  });

  it("treats the 1st as the previous month's closing day", () => {
    expect(getReportPeriod("2026-11-01")).toEqual({
      monthStart: "2026-10-01",
      periodStart: "2026-10-02",
      periodEnd: "2026-11-01",
      monthEnd: "2026-10-31",
      businessAsOf: "2026-10-31",
      isClosingDay: true,
    });
  });

  it("crosses the year boundary", () => {
    const p = getReportPeriod("2027-01-01");
    expect(p.monthStart).toBe("2026-12-01");
    expect(p.periodEnd).toBe("2027-01-01");
  });
});

describe("getRequiredReportDates", () => {
  it("does not require the 1st of the month (it belongs to the previous month)", () => {
    // 2026-11-01(日)は営業日だが、11月の提出日には入れない
    expect(getRequiredReportDates(getReportPeriod("2026-11-02"), "2026-11-02")).toEqual([
      "2026-11-02",
    ]);
  });

  it("includes the next month's 1st on the closing day when it is a business day", () => {
    const dates = getRequiredReportDates(getReportPeriod("2026-11-01"), "2026-11-01");
    expect(dates[0]).toBe("2026-10-02");
    expect(dates.at(-1)).toBe("2026-11-01");
    expect(dates).not.toContain("2026-10-01");
  });

  it("skips the next month's 1st when it is a closed day", () => {
    // 2026-12-01 は火曜(休業日)
    const dates = getRequiredReportDates(getReportPeriod("2026-12-01"), "2026-12-01");
    expect(dates.at(-1)).toBe("2026-11-30");
  });
});
