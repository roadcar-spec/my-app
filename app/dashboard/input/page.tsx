"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { saveManagement } from "@/lib/saveManagement";
import { getManagementLatest } from "@/lib/getManagementLatest";
import type { ManagementStatus } from "@/lib/managementStatus";
import { getStatusDisplayKind } from "@/lib/managementStatus";


const stores = [
  {
    id: "700f919d-94c6-4656-bbf4-e12f9a54b1ca",
    name: "千里",
  },
  {
    id: "18459614-0f56-47c9-84ba-393c567c2097",
    name: "大阪中央",
  },
  {
    id: "570713d0-88f5-4508-a2f7-ca023daabddf",
    name: "堺",
  },
  {
    id: "2f9e38a0-01af-4d4d-b13b-1a5acbcff84a",
    name: "東大阪",
  },
  {
    id: "1fce3986-917a-4c20-b7ac-a5909c3bb1c8",
    name: "岸和田",
  },
  {
    id: "74346808-9954-4d09-a52b-d11eceba6a76",
    name: "板橋",
  },
];


export default function DashboardInputPage() {


  const [date,setDate] =
    useState(
      new Date()
      .toISOString()
      .split("T")[0]
    );


  const [storeId,setStoreId] =
    useState(
      stores[0].id
    );


  const [form,setForm] =
    useState({

      serviceGross:"",

      m1Done:"",

      m2Done:"",

      m3Done:"",

    });


  const [status,setStatus] =
    useState("未提出");


  const [latestDate,setLatestDate] =
    useState("");


  const [isCarryOver,setIsCarryOver] =
    useState(false);


  const [message,setMessage] =
    useState("");



  useEffect(()=>{

    loadLatest();

  },[date,storeId]);




  async function loadLatest(){


    const data =
      await getManagementLatest(
        storeId,
        date
      );


    setStatus(
      data.todayStatus
    );


    setLatestDate(
      data.latestDate
    );


    setIsCarryOver(
      data.isCarryOver
    );


    setForm({

      serviceGross:
        String(
          data.service_gross
        ),

      m1Done:
        String(
          data.inspection_done_1
        ),

      m2Done:
        String(
          data.inspection_done_2
        ),

      m3Done:
        String(
          data.inspection_done_3
        ),

    });


  }



  function change(
    key:string,
    value:string
  ){

    setForm(prev=>({

      ...prev,

      [key]:
        value,

    }));

  }




  async function save(
    saveStatus:ManagementStatus
  ){


    await saveManagement({

      report_date:
        date,


      store_id:
        storeId,


      service_gross:
        Number(
          form.serviceGross
        ),


      inspection_done_1:
        Number(
          form.m1Done
        ),


      inspection_done_2:
        Number(
          form.m2Done
        ),


      inspection_done_3:
        Number(
          form.m3Done
        ),


      status:
        saveStatus,

    });



    setStatus(
      saveStatus
    );


    setMessage(
      saveStatus === "当日提出"
      ? "当日提出として登録しました"
      : saveStatus === "翌日提出"
      ? "翌日提出として登録しました"
      : "未提出として登録しました"
    );

  }




  const storeName =
    stores.find(
      s=>s.id===storeId
    )?.name;



  return (

    <main className="min-h-screen bg-gray-100 p-6">


      <div className="max-w-xl mx-auto space-y-5">


        <h1 className="text-3xl font-bold">
          ボルボ管理入力
        </h1>



        <div className="bg-white rounded-xl shadow p-5 space-y-4">


          <div>

            <label className="font-bold">
              日付
            </label>


            <input

              type="date"

              value={date}

              onChange={
                e=>setDate(
                  e.target.value
                )
              }

              className="w-full border rounded-lg p-3"

            />

          </div>




          <div>

            <label className="font-bold">
              拠点
            </label>


            <select

              value={storeId}

              onChange={
                e=>setStoreId(
                  e.target.value
                )
              }

              className="w-full border rounded-lg p-3"

            >

              {
                stores.map(store=>(

                  <option

                    key={store.id}

                    value={store.id}

                  >

                    {store.name}

                  </option>

                ))
              }


            </select>


          </div>



          <div
            className={
              getStatusDisplayKind(status) === "ontime"
              ? "bg-green-100 p-3 rounded-lg"
              : getStatusDisplayKind(status) === "late"
              ? "bg-amber-100 p-3 rounded-lg"
              : "bg-red-100 p-3 rounded-lg"
            }
          >

            状態：
            {status}

            <br />

            {

              isCarryOver &&
              <>
                参照元：
                {latestDate}
                提出データ
              </>

            }

          </div>


        </div>




        <div className="bg-white rounded-xl shadow p-5 space-y-4">


          <h2 className="font-bold text-lg">
            サービス粗利
          </h2>


          <input

            type="number"

            value={form.serviceGross}

            onChange={
              e=>
                change(
                  "serviceGross",
                  e.target.value
                )
            }

            className="w-full border rounded-lg p-3"

          />


        </div>




        <div className="bg-white rounded-xl shadow p-5 space-y-4">


          <h2 className="font-bold">
            車検決着台数
          </h2>


          {
            [
              ["m1Done","1ヶ月目"],
              ["m2Done","2ヶ月目"],
              ["m3Done","3ヶ月目"],
            ]
            .map(([key,label])=>(


              <div key={key}>


                <label>
                  {label}
                </label>


                <input

                  type="number"

                  value={
                    form[
                      key as keyof typeof form
                    ]
                  }

                  onChange={
                    e=>
                      change(
                        key,
                        e.target.value
                      )
                  }

                  className="w-full border rounded-lg p-3"

                />


              </div>


            ))
          }


        </div>




        <div className="grid grid-cols-3 gap-4">


          <button

            onClick={
              ()=>save("当日提出")
            }

            className="bg-green-600 text-white rounded-xl py-4 font-bold"

          >

            当日提出

          </button>



          <button

            onClick={
              ()=>save("翌日提出")
            }

            className="bg-amber-500 text-white rounded-xl py-4 font-bold"

          >

            翌日提出

          </button>



          <button

            onClick={
              ()=>save("未提出")
            }

            className="bg-red-600 text-white rounded-xl py-4 font-bold"

          >

            未提出登録

          </button>


        </div>



        {
          message &&

          <div className="bg-green-100 border rounded-lg p-3">

            {message}

          </div>

        }



        <Link

          href="/dashboard"

          className="block text-center bg-white rounded-xl shadow p-4"

        >

          ← 管理画面へ戻る

        </Link>


      </div>


    </main>

  );

}