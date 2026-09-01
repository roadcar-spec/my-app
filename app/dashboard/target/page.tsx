"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  saveServiceTargets,
  saveInspectionTargets,
} from "@/lib/saveManagementTarget";
import { sortStoresByDisplayOrder } from "@/lib/storeDisplayOrder";
import { getJstDateString } from "@/lib/jstDate";

type Store = {
  id: string;
  name: string;
};

// 店舗ID → 月(1-12) → 入力値(文字列) のグリッド
type Grid = Record<string, Record<number, string>>;

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function monthStart(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function emptyGrid(stores: Store[]): Grid {
  const grid: Grid = {};

  for (const store of stores) {
    grid[store.id] = {};

    for (const month of MONTHS) {
      grid[store.id][month] = "";
    }
  }

  return grid;
}

function cellValue(grid: Grid, storeId: string, month: number) {
  return Number(grid[storeId]?.[month] || 0);
}

function rowTotal(grid: Grid, storeId: string) {
  return MONTHS.reduce((sum, month) => sum + cellValue(grid, storeId, month), 0);
}

function columnTotal(grid: Grid, stores: Store[], month: number) {
  return stores.reduce((sum, store) => sum + cellValue(grid, store.id, month), 0);
}

function grandTotal(grid: Grid, stores: Store[]) {
  return stores.reduce((sum, store) => sum + rowTotal(grid, store.id), 0);
}

function TargetGrid({
  title,
  stores,
  grid,
  onChange,
}: {
  title: string;
  stores: Store[];
  grid: Grid;
  onChange: (storeId: string, month: number, value: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <h2 className="font-bold text-lg">{title}</h2>

      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white text-left p-2 border-b whitespace-nowrap">
                店舗
              </th>
              {MONTHS.map((month) => (
                <th
                  key={month}
                  className="p-2 border-b text-center whitespace-nowrap"
                >
                  {month}月
                </th>
              ))}
              <th className="p-2 border-b text-center whitespace-nowrap bg-gray-50">
                合計
              </th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="sticky left-0 z-10 bg-white font-semibold p-2 border-b whitespace-nowrap">
                  {store.name}
                </td>

                {MONTHS.map((month) => (
                  <td key={month} className="p-1 border-b">
                    <input
                      type="number"
                      value={grid[store.id]?.[month] ?? ""}
                      onChange={(e) =>
                        onChange(store.id, month, e.target.value)
                      }
                      className="w-16 border rounded-lg p-1.5 text-right"
                    />
                  </td>
                ))}

                <td className="p-2 border-b text-right font-semibold bg-gray-50 whitespace-nowrap">
                  {rowTotal(grid, store.id).toLocaleString()}
                </td>
              </tr>
            ))}

            <tr>
              <td className="sticky left-0 z-10 bg-gray-50 font-semibold p-2 whitespace-nowrap">
                合計
              </td>

              {MONTHS.map((month) => (
                <td
                  key={month}
                  className="p-2 text-right font-semibold bg-gray-50 whitespace-nowrap"
                >
                  {columnTotal(grid, stores, month).toLocaleString()}
                </td>
              ))}

              <td className="p-2 text-right font-bold bg-gray-100 whitespace-nowrap">
                {grandTotal(grid, stores).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TargetPage() {
  const [stores, setStores] = useState<Store[]>([]);

  const thisYear = Number(getJstDateString().substring(0, 4));
  const yearOptions = [
    thisYear - 1,
    thisYear,
    thisYear + 1,
    thisYear + 2,
  ];

  const [year, setYear] = useState(thisYear);

  const [grossGrid, setGrossGrid] = useState<Grid>({});
  const [inspectionGrid, setInspectionGrid] = useState<Grid>({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 店舗一覧を読み込む
  useEffect(() => {
    const loadStores = async () => {
      const { data } = await supabase.from("master_store").select("*");
      setStores(sortStoresByDisplayOrder(data ?? []));
    };

    loadStores();
  }, []);

  // 年、または店舗一覧が変わったら、その年の既存データを全店舗分まとめて読み込み、
  // 入っている値をそのままグリッドに反映する
  useEffect(() => {
    if (stores.length === 0) return;

    const loadExisting = async () => {
      setLoading(true);

      const rangeStart = monthStart(year, 1);
      const rangeEnd = monthStart(year, 12);

      const [
        { data: serviceRows, error: serviceError },
        { data: inspectionRows, error: inspectionError },
      ] = await Promise.all([
        supabase
          .from("management_monthly_target")
          .select("*")
          .gte("year_month", rangeStart)
          .lte("year_month", rangeEnd),
        supabase
          .from("inspection_monthly_target")
          .select("*")
          .gte("target_month", rangeStart)
          .lte("target_month", rangeEnd),
      ]);

      if (serviceError) console.error(serviceError);
      if (inspectionError) console.error(inspectionError);

      const nextGrossGrid = emptyGrid(stores);
      const nextInspectionGrid = emptyGrid(stores);

      for (const row of serviceRows ?? []) {
        const month = Number(String(row.year_month).substring(5, 7));

        if (nextGrossGrid[row.store_id]) {
          nextGrossGrid[row.store_id][month] = String(
            row.service_target ?? ""
          );
        }
      }

      for (const row of inspectionRows ?? []) {
        const month = Number(String(row.target_month).substring(5, 7));

        if (nextInspectionGrid[row.store_id]) {
          nextInspectionGrid[row.store_id][month] = String(
            row.target_count ?? ""
          );
        }
      }

      setGrossGrid(nextGrossGrid);
      setInspectionGrid(nextInspectionGrid);

      setLoading(false);
    };

    loadExisting();
  }, [year, stores]);

  function changeGross(storeId: string, month: number, value: string) {
    setGrossGrid((prev) => ({
      ...prev,
      [storeId]: { ...prev[storeId], [month]: value },
    }));
  }

  function changeInspection(storeId: string, month: number, value: string) {
    setInspectionGrid((prev) => ({
      ...prev,
      [storeId]: { ...prev[storeId], [month]: value },
    }));
  }

  async function save() {
    setSaving(true);

    try {
      const serviceRows = stores.flatMap((store) =>
        MONTHS.map((month) => ({
          store_id: store.id,
          year_month: monthStart(year, month),
          service_target: Number(grossGrid[store.id]?.[month] || 0),
        }))
      );

      const inspectionRows = stores.flatMap((store) =>
        MONTHS.map((month) => ({
          store_id: store.id,
          target_month: monthStart(year, month),
          target_count: Number(inspectionGrid[store.id]?.[month] || 0),
        }))
      );

      await Promise.all([
        saveServiceTargets(serviceRows),
        saveInspectionTargets(inspectionRows),
      ]);

      alert("保存しました");
    } catch (error) {
      console.error(error);
      alert("保存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-[1400px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">月次目標入力</h1>

        <Link href="/dashboard" className="text-blue-600 font-semibold">
          ← 管理画面へ戻る
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <label className="font-semibold">対象年</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded-lg p-2"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}年
            </option>
          ))}
        </select>

        {loading && (
          <span className="text-sm text-gray-500">読み込み中...</span>
        )}
      </div>

      <TargetGrid
        title="サービス粗利目標"
        stores={stores}
        grid={grossGrid}
        onChange={changeGross}
      />

      <TargetGrid
        title="車検対象台数"
        stores={stores}
        grid={inspectionGrid}
        onChange={changeInspection}
      />

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold disabled:opacity-50"
      >
        {saving ? "保存中..." : "保存"}
      </button>
    </main>
  );
}
