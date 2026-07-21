"use client";

import { useEffect, useState } from "react";
import SalesSection from "@/components/input/SalesSection";

type Store = {
  id: string;
  code: string;
  name: string;
};

const emptySales = {
  srVisitors: 0,
  newVisitors: 0,
  negotiations: 0,
  testDrive: 0,
  quotation: 0,
  newOrder: 0,
  usedOrder: 0,
  newRegistration: 0,
  usedRegistration: 0,
};

export default function InputPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [message, setMessage] = useState("");

  const [reportDate, setReportDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [storeId, setStoreId] = useState("");

  const [sales, setSales] = useState(emptySales);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (storeId) {
      loadDailySales();
    }
  }, [reportDate, storeId]);

  async function loadStores() {
    const res = await fetch("/api/master-store");
    const result = await res.json();

    if (result.success) {
      setStores(result.data);

      if (result.data.length > 0) {
        setStoreId(result.data[0].id);
      }
    }
  }

  async function loadDailySales() {
    const res = await fetch(
      `/api/daily-sales?report_date=${reportDate}&store_id=${storeId}`
    );

    const result = await res.json();

    if (!result.success) {
      setSales(emptySales);
      return;
    }

    if (!result.data) {
      setSales(emptySales);
      return;
    }

    setSales({
      srVisitors: result.data.sr_visitors ?? 0,
      newVisitors: result.data.new_visitors ?? 0,
      negotiations: result.data.negotiations ?? 0,
      testDrive: result.data.test_drive ?? 0,
      quotation: result.data.quotation ?? 0,
      newOrder: result.data.new_order ?? 0,
      usedOrder: result.data.used_order ?? 0,
      newRegistration: result.data.new_registration ?? 0,
      usedRegistration: result.data.used_registration ?? 0,
    });
  }

  async function save() {
    const payload = {
      report_date: reportDate,
      store_id: storeId,

      sr_visitors: sales.srVisitors,
      new_visitors: sales.newVisitors,
      negotiations: sales.negotiations,
      test_drive: sales.testDrive,
      quotation: sales.quotation,
      new_order: sales.newOrder,
      used_order: sales.usedOrder,
      new_registration: sales.newRegistration,
      used_registration: sales.usedRegistration,
    };

    const res = await fetch("/api/daily-sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      setMessage("✅ 保存しました");
    } else {
      setMessage(result.message);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        <h1 className="text-3xl font-bold">
          日報入力
        </h1>

        <div className="rounded-lg bg-white p-6 shadow">

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                日付
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                店舗
              </label>

              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                {stores.map((store) => (
                  <option
                    key={store.id}
                    value={store.id}
                  >
                    {store.name}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>        
        <SalesSection
          srVisitors={sales.srVisitors}
          setSrVisitors={(v) =>
            setSales((prev) => ({ ...prev, srVisitors: v }))
          }

          newVisitors={sales.newVisitors}
          setNewVisitors={(v) =>
            setSales((prev) => ({ ...prev, newVisitors: v }))
          }

          negotiations={sales.negotiations}
          setNegotiations={(v) =>
            setSales((prev) => ({ ...prev, negotiations: v }))
          }

          testDrive={sales.testDrive}
          setTestDrive={(v) =>
            setSales((prev) => ({ ...prev, testDrive: v }))
          }

          quotation={sales.quotation}
          setQuotation={(v) =>
            setSales((prev) => ({ ...prev, quotation: v }))
          }

          newOrder={sales.newOrder}
          setNewOrder={(v) =>
            setSales((prev) => ({ ...prev, newOrder: v }))
          }

          usedOrder={sales.usedOrder}
          setUsedOrder={(v) =>
            setSales((prev) => ({ ...prev, usedOrder: v }))
          }

          newRegistration={sales.newRegistration}
          setNewRegistration={(v) =>
            setSales((prev) => ({ ...prev, newRegistration: v }))
          }

          usedRegistration={sales.usedRegistration}
          setUsedRegistration={(v) =>
            setSales((prev) => ({ ...prev, usedRegistration: v }))
          }
        />

        <button
          type="button"
          onClick={save}
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-bold text-white hover:bg-blue-700"
        >
          保存
        </button>
        {message && (
          <div className="rounded-lg bg-green-100 border border-green-300 p-4 text-green-800 font-semibold">
            {message}
          </div>
        )}


      </div>
    </main>
  );
}