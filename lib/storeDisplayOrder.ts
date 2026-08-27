export const displayOrder = [
  "大阪中央",
  "千里",
  "堺",
  "東大阪",
  "岸和田",
  "板橋",
];

export function sortStoresByDisplayOrder<T extends { name: string }>(
  stores: T[]
): T[] {
  return stores
    .filter((store) => displayOrder.includes(store.name))
    .sort(
      (a, b) => displayOrder.indexOf(a.name) - displayOrder.indexOf(b.name)
    );
}
