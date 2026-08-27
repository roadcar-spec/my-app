import { describe, expect, it } from "vitest";
import { getStatusDisplayKind, isSubmitted } from "./managementStatus";

describe("isSubmitted", () => {
  it("treats 当日提出 as submitted", () => {
    expect(isSubmitted("当日提出")).toBe(true);
  });

  it("treats 翌日提出 as submitted", () => {
    expect(isSubmitted("翌日提出")).toBe(true);
  });

  it("treats legacy 提出 value as submitted (backward compatibility)", () => {
    expect(isSubmitted("提出")).toBe(true);
  });

  it("treats 未提出 as not submitted", () => {
    expect(isSubmitted("未提出")).toBe(false);
  });

  it("treats undefined as not submitted", () => {
    expect(isSubmitted(undefined)).toBe(false);
  });
});

describe("getStatusDisplayKind", () => {
  it("classifies 当日提出 as ontime", () => {
    expect(getStatusDisplayKind("当日提出")).toBe("ontime");
  });

  it("classifies 翌日提出 as late", () => {
    expect(getStatusDisplayKind("翌日提出")).toBe("late");
  });

  it("classifies 未提出 as none", () => {
    expect(getStatusDisplayKind("未提出")).toBe("none");
  });

  it("classifies legacy 提出 value as ontime (backward compatibility)", () => {
    expect(getStatusDisplayKind("提出")).toBe("ontime");
  });

  it("classifies undefined as none", () => {
    expect(getStatusDisplayKind(undefined)).toBe("none");
  });
});
