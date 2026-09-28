import { describe, expect, it } from "vitest";
import {
  getBusinessDayIndex,
  getBusinessDaysInRange,
  getClampedDateAtBusinessDayIndex,
  getDateAtBusinessDayIndex,
  isBusinessDay,
} from "./businessDay";

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

describe("getBusinessDayIndex", () => {
  it("counts the business days elapsed up to and including the given date (normal case)", () => {
    // 2026-08-24 (Mon), 2026-08-25 (Tue, closed), 2026-08-26 (Wed, closed),
    // 2026-08-27 (Thu) => 2 business days by 2026-08-27
    expect(getBusinessDayIndex("2026-08-24", "2026-08-27")).toBe(2);
  });

  it("composes with the last-day-of-month exception instead of reimplementing it", () => {
    // 2026-03-30 (Mon, business), 2026-03-31 (Tue, last-day-of-month exception, business)
    expect(getBusinessDayIndex("2026-03-30", "2026-03-31")).toBe(2);
  });
});

describe("getDateAtBusinessDayIndex", () => {
  it("finds the date at a given 1-indexed business-day index within a range (normal case)", () => {
    // 2026-08-24 (Mon, 1st business day), 2026-08-27 (Thu, 2nd business day)
    expect(
      getDateAtBusinessDayIndex("2026-08-24", "2026-08-31", 2)
    ).toBe("2026-08-27");
  });

  it("returns undefined when the range does not have that many business days", () => {
    // 2026-03-30..2026-04-01 only has 2 business days (see getBusinessDaysInRange test above)
    expect(
      getDateAtBusinessDayIndex("2026-03-30", "2026-04-01", 5)
    ).toBeUndefined();
  });

  it("composes with the public-holiday exception instead of reimplementing it", () => {
    // 2026-02-11 is a Wednesday public holiday (business-day exception, see isBusinessDay tests)
    const businessDaysUpToHoliday = getBusinessDaysInRange(
      "2026-02-01",
      "2026-02-11"
    );
    const index = businessDaysUpToHoliday.length;

    expect(
      getDateAtBusinessDayIndex("2026-02-01", "2026-02-28", index)
    ).toBe("2026-02-11");
  });
});

describe("getClampedDateAtBusinessDayIndex", () => {
  it("clamps to the last business day in range when the range has fewer business days than the requested index (real-world case: August 2026 shortened by the お盆 special-holiday closure)", () => {
    // As of 2026-09-27, September has 21 elapsed business days, but August
    // 2026 (2026-08-01..2026-08-31) only has 20 business days in total because
    // of the お盆 special-holiday closure (2026-08-12..2026-08-16). Confirm
    // August's actual last business day rather than assuming it, then confirm
    // the clamped function lands on it for an out-of-range index.
    const augustBusinessDays = getBusinessDaysInRange(
      "2026-08-01",
      "2026-08-31"
    );
    expect(augustBusinessDays.length).toBe(20);
    expect(augustBusinessDays[augustBusinessDays.length - 1]).toBe(
      "2026-08-31"
    );

    expect(
      getClampedDateAtBusinessDayIndex("2026-08-01", "2026-08-31", 21)
    ).toBe("2026-08-31");
  });

  it("agrees with getDateAtBusinessDayIndex when the index is within range (normal case)", () => {
    // Same case as the getDateAtBusinessDayIndex normal-case test above:
    // 2026-08-24 (Mon, 1st business day), 2026-08-27 (Thu, 2nd business day)
    const expected = getDateAtBusinessDayIndex(
      "2026-08-24",
      "2026-08-31",
      2
    );
    expect(expected).toBe("2026-08-27");

    expect(
      getClampedDateAtBusinessDayIndex("2026-08-24", "2026-08-31", 2)
    ).toBe(expected);
  });

  it("returns undefined when the range has zero business days at all", () => {
    // 2026-08-12..2026-08-16 falls entirely inside the お盆 special-holiday
    // range, so it has zero business days regardless of weekday.
    expect(
      getBusinessDaysInRange("2026-08-12", "2026-08-16")
    ).toEqual([]);

    expect(
      getClampedDateAtBusinessDayIndex("2026-08-12", "2026-08-16", 1)
    ).toBeUndefined();
  });
});
