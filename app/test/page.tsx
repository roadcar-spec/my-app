"use client";

import { useEffect, useState } from "react";

type Store = {
  id: string;
  code: string;
  name: string;
};

export default function TestPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [reportDate, setReportDate] = useState("2026-07-13");
  const [storeId, setStoreId] = useState("");
  const [srVisitors, setSrVisitors] = useState(0);
  const [message, setMessage] = useState("");



  useEffect(() => {
    async function fetchStores() {
      const res = await fetch("/api/master-store");
      const result = await res.json();

      console.log(result);

      const storeList = result.data;

      if (Array.isArray(storeList)) {
        setStores(storeList);

        if (storeList.length > 0) {
          setStoreId(storeList[0].id);
        }
      }
    }

    fetchStores();
  }, []);




  async function registerDailySales() {

    const payload = {
      report_date: reportDate,
      store_id: storeId,
      sr_visitors: srVisitors,
    };


    console.log("送信データ", payload);


    const res = await fetch(
      "/api/daily-sales",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );


    const result = await res.json();

    setMessage(
      JSON.stringify(result, null, 2)
    );
  }



  return (
    <main className="min-h-screen bg-white p-8 text-gray-900">

      <div className="max-w-xl space-y-8">

        <h1 className="text-3xl font-bold">
          Daily Sales Test
        </h1>


        <div className="space-y-5 rounded-lg border p-6">


          <div>
            <label className="mb-2 block font-semibold">
              日付
            </label>

            <input
              type="date"
              value={reportDate}
              onChange={(e)=>
                setReportDate(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-2 text-gray-900"
            />
          </div>



          <div>
            <label className="mb-2 block font-semibold">
              店舗
            </label>

            <select
              value={storeId}
              onChange={(e)=>
                setStoreId(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-2 text-gray-900"
            >

              {stores.map((store)=>(
                <option
                  key={store.id}
                  value={store.id}
                >
                  {store.name}
                </option>
              ))}

            </select>

          </div>



          <div>
            <label className="mb-2 block font-semibold">
              SR来場
            </label>

            <input
              type="number"
              value={srVisitors}
              onChange={(e)=>
                setSrVisitors(Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-2 text-gray-900"
            />
          </div>



          <button
            type="button"
            onClick={registerDailySales}
            className="
              cursor-pointer
              rounded-lg
              bg-purple-600
              px-6
              py-3
              font-semibold
              text-white
              shadow-md
              transition
              hover:bg-purple-700
              active:scale-95
            "
          >
            日報登録
          </button>


        </div>



        {message && (
          <pre className="
            rounded-lg
            bg-gray-100
            p-4
            text-sm
            text-gray-900
          ">
            {message}
          </pre>
        )}


      </div>

    </main>
  );
}