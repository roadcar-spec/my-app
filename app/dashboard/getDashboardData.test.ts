import { describe, expect, it, vi } from "vitest";
import type { Daily } from "./getDashboardData";

// getDashboardData.ts imports the supabase client at module load time, which
// throws outside a configured runtime env; stub it so this pure helper can
// be imported in isolation.
vi.mock("@/lib/supabase", () => ({ supabase: {} }));

const { getTodayGrossAmount } = await import("./getDashboardData");

function makeDaily(overrides: Partial<Daily>): Daily {
  return {
    store_id: "store-1",
    report_date: "2026-08-01",
    service_gross: 0,
    inspection_done_1: 0,
    inspection_done_2: 0,
    inspection_done_3: 0,
    status: "当日提出",
    ...overrides,
  };
}

describe("getTodayGrossAmount", () => {
  it("returns the diff between today's cumulative and the prior submitted day's cumulative", () => {
    const dailyList = [
      makeDaily({ report_date: "2026-08-05", service_gross: 100 }),
      makeDaily({ report_date: "2026-08-07", service_gross: 150 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-07", "2026-08-01")
    ).toBe(50);
  });

  it("returns a negative diff when today's cumulative is a downward correction", () => {
    const dailyList = [
      makeDaily({ report_date: "2026-08-05", service_gross: 200 }),
      makeDaily({ report_date: "2026-08-07", service_gross: 150 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-07", "2026-08-01")
    ).toBe(-50);
  });

  it("does not diff across a month boundary, treating the prior baseline as 0", () => {
    const dailyList = [
      makeDaily({ report_date: "2026-07-31", service_gross: 900 }),
      makeDaily({ report_date: "2026-08-01", service_gross: 50 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-01", "2026-08-01")
    ).toBe(50);
  });

  it("returns 0 when there is no row for today", () => {
    const dailyList = [
      makeDaily({ report_date: "2026-08-05", service_gross: 100 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-07", "2026-08-01")
    ).toBe(0);
  });

  it("ignores non-submitted rows when finding the prior baseline", () => {
    const dailyList = [
      makeDaily({ report_date: "2026-08-05", service_gross: 100, status: "未提出" }),
      makeDaily({ report_date: "2026-08-06", service_gross: 80, status: "当日提出" }),
      makeDaily({ report_date: "2026-08-07", service_gross: 150 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-07", "2026-08-01")
    ).toBe(70);
  });

  it("ignores rows for other stores", () => {
    const dailyList = [
      makeDaily({ store_id: "store-2", report_date: "2026-08-05", service_gross: 999 }),
      makeDaily({ store_id: "store-1", report_date: "2026-08-07", service_gross: 150 }),
    ];

    expect(
      getTodayGrossAmount(dailyList, "store-1", "2026-08-07", "2026-08-01")
    ).toBe(150);
  });
});
