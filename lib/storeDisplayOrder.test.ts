import { describe, expect, it } from "vitest";
import { displayOrder, sortStoresByDisplayOrder } from "./storeDisplayOrder";

describe("sortStoresByDisplayOrder", () => {
  it("sorts stores into the fixed display order regardless of input order", () => {
    const stores = [
      { id: "6", name: "板橋" },
      { id: "1", name: "大阪中央" },
      { id: "4", name: "東大阪" },
      { id: "2", name: "千里" },
      { id: "5", name: "岸和田" },
      { id: "3", name: "堺" },
    ];

    const result = sortStoresByDisplayOrder(stores);

    expect(result.map((s) => s.name)).toEqual(displayOrder);
  });

  it("filters out stores not present in the display order allowlist", () => {
    const stores = [
      { id: "1", name: "大阪中央" },
      { id: "99", name: "未知の店舗" },
      { id: "2", name: "千里" },
    ];

    const result = sortStoresByDisplayOrder(stores);

    expect(result.map((s) => s.name)).toEqual(["大阪中央", "千里"]);
  });

  it("returns an empty array when given no matching stores", () => {
    expect(sortStoresByDisplayOrder([{ id: "1", name: "存在しない店舗" }])).toEqual(
      []
    );
  });

  it("returns an empty array for empty input", () => {
    expect(sortStoresByDisplayOrder([])).toEqual([]);
  });
});
