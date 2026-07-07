"use client";

import { useState } from "react";
import NumberInput from "@/components/NumberInput";
import SalesForm from "@/components/SalesForm";

export default function InputPage() {
  const [form, setForm] = useState({
    report_date: new Date().toISOString().split("T")[0],
    store_id: "",

    sr_visitors: 0,
    new_visitors: 0,
    negotiations: 0,
    test_drive: 0,
    quotation: 0,
    new_order: 0,
    used_order: 0,
    new_registration: 0,
    used_registration: 0,

    service_total: 0,
    gross_profit: 0,
    labor_sales: 0,

    insurance: 0,
    finance: 0,
    tradein: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 shadow">
        <h1 className="text-xl font-bold">日次入力</h1>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-5">

        {/* 基本情報 */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold mb-4">基本情報</h2>

          <div className="mb-4">
            <label className="block mb-1">日付</label>

            <input
              type="date"
              name="report_date"
              value={form.report_date}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1">店舗</label>

            <select
              name="store_id"
              value={form.store_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">選択してください</option>
              <option value="WKY">和歌山</option>
            </select>
          </div>
        </section>

        {/* 営業 */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-lg mb-3">営業</h2>

          <NumberInput label="SR来場" name="sr_visitors" form={form} onChange={handleChange} />
          <NumberInput label="新規来場" name="new_visitors" form={form} onChange={handleChange} />
          <NumberInput label="商談" name="negotiations" form={form} onChange={handleChange} />
          <NumberInput label="試乗" name="test_drive" form={form} onChange={handleChange} />
          <NumberInput label="見積" name="quotation" form={form} onChange={handleChange} />
          <NumberInput label="新車受注" name="new_order" form={form} onChange={handleChange} />
          <NumberInput label="中古受注" name="used_order" form={form} onChange={handleChange} />
          <NumberInput label="新車登録" name="new_registration" form={form} onChange={handleChange} />
          <NumberInput label="中古登録" name="used_registration" form={form} onChange={handleChange} />
        </section>

        {/* サービス */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-lg mb-3">サービス</h2>

          <NumberInput label="総入庫" name="service_total" form={form} onChange={handleChange} />
        </section>

        {/* 売上 */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-lg mb-3">売上</h2>

          <NumberInput label="総粗利" name="gross_profit" form={form} onChange={handleChange} />
          <NumberInput label="工賃売上" name="labor_sales" form={form} onChange={handleChange} />
        </section>

        {/* その他 */}
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-lg mb-3">その他</h2>

          <NumberInput label="保険件数" name="insurance" form={form} onChange={handleChange} />
          <NumberInput label="ローン件数" name="finance" form={form} onChange={handleChange} />
          <NumberInput label="下取件数" name="tradein" form={form} onChange={handleChange} />
        </section>

        <button
          className="w-full bg-blue-700 text-white rounded-xl py-4 text-lg font-bold"
        >
          保存
        </button>

      </div>
    </main>
  );
}