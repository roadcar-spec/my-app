import { describe, expect, it } from "vitest";
import { getBusinessDaysInRange, isBusinessDay } from "./businessDay";

describe("isBusinessDay", () => {
  it("treats a normal Monday as a business day", () => {
    expect(isBusinessDay("2026-08-24")).toBe(true);
  });

  it("treats a normal Thursday as a business day", () => {
    expect(isBusinessDay("2026-08-27")).toBe(true);
  });

  it("treats a normal Friday as a business day", () => {
    expect(isBusinessDay("2026-08-28")).toBe(true);
  });

  it("treats a normal Saturday as a business day", () => {
    expect(isBusinessDay("2026-08-29")).toBe(true);
  });

  it("treats a normal Sunday as a business day", () => {
    expect(isBusinessDay("2026-08-30")).toBe(true);
  });

  it("treats a normal Tuesday (non-exception) as closed", () => {
    expect(isBusinessDay("2026-08-25")).toBe(false);
  });

  it("treats a normal Wednesday (non-exception) as closed", () => {
    expect(isBusinessDay("2026-08-26")).toBe(false);
  });

  it("treats a Wednesday that is a public holiday as a business day (exception)", () => {
    // 2026-02-11 is a Wednesday and is in publicHolidays2026
    expect(isBusinessDay("2026-02-11")).toBe(true);
  });

  it("treats a Tuesday that is the last day of the month as a business day (exception)", () => {
    // 2026-03-31 is a Tuesday and the last day of March
    expect(isBusinessDay("2026-03-31")).toBe(true);
  });

  it("treats a date inside a special holiday range as closed regardless of weekday", () => {
    // 2026-08-13 is a Thursday (normally a business day) but falls inside the
    // お盆休み special holiday range (2026-08-12 to 2026-08-16)
    expect(isBusinessDay("2026-08-13")).toBe(false);
  });
});

describe("getBusinessDaysInRange", () => {
  it("includes the last-day-of-month exception and excludes the following closed Wednesday", () => {
    // 2026-03-30 (Mon, business), 2026-03-31 (Tue, last day of month exception, business),
    // 2026-04-01 (Wed, not a holiday/month-end exception, closed)
    const result = getBusinessDaysInRange("2026-03-30", "2026-04-01");
    expect(result).toEqual(["2026-03-30", "2026-03-31"]);
  });
});
