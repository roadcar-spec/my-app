"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveManagementTarget } from "@/lib/saveManagementTarget";

const stores = [
  { id: "700f919d-94c6-4656-bbf4-e12f9a54b1ca", name: "千里" },
  { id: "18459614-0f56-47c9-84ba-393c567c2097", name: "大阪中央" },
  { id: "570713d0-88f5-4508-a2f7-ca023daabddf", name: "堺" },
  { id: "2f9e38a0-01af-4d4d-b13b-1a5acbcff84a", name: "東大阪" },
  { id: "1fce3986-917a-4c20-b7ac-a5909c3bb1c8", name: "岸和田" },
  { id: "74346808-9954-4d09-a52b-d11eceba6a76", name: "板橋" },
];

export default function TargetPage() {
  const [form, setForm] = useState({
    yearMonth: "2026-07-01",
    storeId: stores[0].id,
    serviceTarget: "",
    inspectionTarget1: "",
    inspectionTarget2: "",
    inspectionTarget3: "",
  });

  const [loading, setLoading] = useState(false);

  // 月 or 拠点が変わったら既存データを読み込む
  useEffect(() => {
    const loadExisting = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("management_monthly_target")
        .select("*")
        .eq("year_month", form.yearMonth)
        .eq("store_id", form.storeId)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      if (data) {
        setForm((prev) => ({
          ...prev,
          serviceTarget: String(data.service_target ?? ""),
          inspectionTarget1: String(data.inspection_target_1 ?? ""),
          inspectionTarget2: String(data.inspection_target_2 ?? ""),
          inspectionTarget3: String(data.inspection_target_3 ?? ""),
        }));
      } else {
        // データがなければ空欄に戻す
        setForm((prev) => ({
          ...prev,
          serviceTarget: "",
          inspectionTarget1: "",
          inspectionTarget2: "",
          inspectionTarget3: "",
        }));
      }

      setLoading(false);
    };

    loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.yearMonth, form.storeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {
    try {
      await saveManagementTarget({
        year_month: form.yearMonth,
        store_id: form.storeId,
        service_target: Number(form.serviceTarget),
        inspection_target_1: Number(form.inspectionTarget1),
        inspection_target_2: Number(form.inspectionTarget2),
        inspection_target_3: Number(form.inspectionTarget3),
      });

      alert("保存しました");
    } catch (error) {
      console.error(error);
      alert("保存失敗");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">月次目標入力</h1>

      {loading && <p className="text-sm text-gray-500">読み込み中...</p>}

      <div>
        <label className="font-semibold">対象月</label>
        <input
          type="date"
          name="yearMonth"
          value={form.yearMonth}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      <div>
        <label className="font-semibold">拠点</label>
        <select
          name="storeId"
          value={form.storeId}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1"
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold">サービス粗利目標</label>
        <input
          type="number"
          name="serviceTarget"
          value={form.serviceTarget}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <h2 className="font-bold text-lg">車検対象台数</h2>

        <div>
          <label>7月</label>
          <input
            type="number"
            name="inspectionTarget1"
            value={form.inspectionTarget1}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label>8月</label>
          <input
            type="number"
            name="inspectionTarget2"
            value={form.inspectionTarget2}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label>9月</label>
          <input
            type="number"
            name="inspectionTarget3"
            value={form.inspectionTarget3}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>
      </div>

      <button
        onClick={save}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold"
      >
        保存
      </button>
    </main>
  );
}