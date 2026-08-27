import { describe, expect, it } from "vitest";
import {
  getJstDateString,
  getJstMonthStartString,
  getRollingMonthLabels,
} from "./jstDate";

describe("getJstDateString", () => {
  it("resolves UTC 2026-08-25T15:30Z to JST 2026-08-26 (just past JST midnight)", () => {
    // UTC 15:30 + 9h = JST 00:30 next day => 2026-08-26
    const instant = new Date(Date.UTC(2026, 7, 25, 15, 30, 0));
    expect(getJstDateString(instant)).toBe("2026-08-26");
  });

  it("resolves UTC 2026-08-25T20:00Z to JST 2026-08-26 (later same JST morning)", () => {
    // UTC 20:00 + 9h = JST 05:00 next day => 2026-08-26
    const instant = new Date(Date.UTC(2026, 7, 25, 20, 0, 0));
    expect(getJstDateString(instant)).toBe("2026-08-26");
  });

  it("resolves UTC 2026-08-25T14:59Z to JST 2026-08-25 (just before JST midnight)", () => {
    // UTC 14:59 + 9h = JST 23:59 same day => 2026-08-25
    const instant = new Date(Date.UTC(2026, 7, 25, 14, 59, 0));
    expect(getJstDateString(instant)).toBe("2026-08-25");
  });

  it("resolves UTC 2026-08-25T15:00Z to JST 2026-08-26 (exact boundary)", () => {
    // UTC 15:00 + 9h = JST 00:00 next day => 2026-08-26
    const instant = new Date(Date.UTC(2026, 7, 25, 15, 0, 0));
    expect(getJstDateString(instant)).toBe("2026-08-26");
  });

  it("defaults to the current instant when no date is passed", () => {
    const result = getJstDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getJstMonthStartString", () => {
  it("returns the first day of the JST month for a given instant", () => {
    // UTC 15:30 + 9h = JST 2026-08-26
    const instant = new Date(Date.UTC(2026, 7, 25, 15, 30, 0));
    expect(getJstMonthStartString(instant)).toBe("2026-08-01");
  });

  it("resolves near the JST month boundary using the JST date, not the UTC date", () => {
    // UTC 2026-07-31T15:00Z + 9h = JST 2026-08-01
    const instant = new Date(Date.UTC(2026, 6, 31, 15, 0, 0));
    expect(getJstMonthStartString(instant)).toBe("2026-08-01");
  });

  it("defaults to the current instant when no date is passed", () => {
    const result = getJstMonthStartString();
    expect(result).toMatch(/^\d{4}-\d{2}-01$/);
  });
});

describe("getRollingMonthLabels", () => {
  it("returns the base month plus the following two months", () => {
    expect(getRollingMonthLabels("2026-08-01")).toEqual([
      "8月",
      "9月",
      "10月",
    ]);
  });

  it("wraps from December back to January and February", () => {
    expect(getRollingMonthLabels("2026-12-01")).toEqual([
      "12月",
      "1月",
      "2月",
    ]);
  });

  it("wraps from November", () => {
    expect(getRollingMonthLabels("2026-11-01")).toEqual([
      "11月",
      "12月",
      "1月",
    ]);
  });

  it("accepts a YYYY-MM string without a day component", () => {
    expect(getRollingMonthLabels("2026-08")).toEqual([
      "8月",
      "9月",
      "10月",
    ]);
  });
});
