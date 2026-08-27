import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isSubmitted } from "@/lib/managementStatus";
import { getJstDateString, getRollingMonthLabels } from "@/lib/jstDate";
import "./inspection.css";

export const dynamic = "force-dynamic";

const displayOrder = [
  "大阪中央",
  "千里",
  "堺",
  "東大阪",
  "岸和田",
  "板橋",
];


function calcRate(
  done:number,
  target:number
) {

  if (!target) return 0;

  return Math.round(
    (done / target) * 100
  );

}


function calcAverage(
  values:number[]
) {

  if (!values.length) return 0;

  return Math.round(
    values.reduce(
      (a,b)=>a+b,
      0
    )
    /
    values.length
  );

}



export default async function InspectionPage() {


  const viewDate =
    getJstDateString();


  const yearMonth =
    `${viewDate.substring(0,8)}01`;



  const { data: stores } =
    await supabase
      .from("master_store")
      .select("*");



  const { data: targets } =
    await supabase
      .from("management_monthly_target")
      .select("*")
      .eq(
        "year_month",
        yearMonth
      );



  const { data: daily } =
    await supabase
      .from("management_daily")
      .select("*")
      .lte(
        "report_date",
        viewDate
      );



  const storeList =
    (stores ?? [])
      .filter(
        store =>
          displayOrder.includes(
            store.name
          )
      )
      .sort(
        (a,b)=>
          displayOrder.indexOf(a.name)
          -
          displayOrder.indexOf(b.name)
      );



  const monthLabels =
    getRollingMonthLabels(yearMonth);


  const months = [
    {
      name:monthLabels[0],
      target:"inspection_target_1",
      done:"inspection_done_1",
    },
    {
      name:monthLabels[1],
      target:"inspection_target_2",
      done:"inspection_done_2",
    },
    {
      name:monthLabels[2],
      target:"inspection_target_3",
      done:"inspection_done_3",
    },
  ];



  const inspectionData =
    months.map(month=>{


      const rows =
        storeList.map(store=>{


          const target =
            targets?.find(
              t =>
                t.store_id === store.id
            );



          const latest =
            daily
              ?.filter(
                d =>
                  d.store_id === store.id &&
                  isSubmitted(d.status)
              )
              .sort(
                (a,b)=>
                  b.report_date.localeCompare(
                    a.report_date
                  )
              )[0];



          const targetValue =
            Number(
              target?.[month.target] ?? 0
            );



          const doneValue =
            Number(
              latest?.[month.done] ?? 0
            );



          return {

            store,


            target:
              targetValue,


            done:
              doneValue,


            remaining:
              targetValue - doneValue,


            rate:
              calcRate(
                doneValue,
                targetValue
              ),


            isCarryOver:
              latest?.report_date !== viewDate,


            carryOverDate:
              latest?.report_date ?? "",

          };


        });



      return {

        name:
          month.name,


        rows,


        average:
          calcAverage(
            rows.map(
              row =>
                row.rate
            )
          ),

      };


    });




  return (

    <main className="inspection">


      <header>

        <Link href="/dashboard">

          ← 管理画面へ戻る

        </Link>


        <h1>
          車検進捗詳細
        </h1>


      </header>




      {
        inspectionData.map(month=>(

          <section
            key={month.name}
          >

            <h2>
              {month.name}
            </h2>


            <p>
              平均進捗率：
              {month.average}%
            </p>




            <div className="grid header">

              <span>
                店舗
              </span>

              <span>
                対象
              </span>

              <span>
                決着
              </span>

              <span>
                残
              </span>

              <span>
                進捗率
              </span>

            </div>




            {
              month.rows.map(row=>(

                <div
                  className="grid row"
                  key={row.store.id}
                >


                  <span>
                    {row.store.name}
                  </span>



                  <span>
                    {row.target}台
                  </span>




                  <span
                    className={
                      row.isCarryOver
                      ? "warning"
                      : ""
                    }
                  >

                    {row.done}台

                    {/*
                    {
                      row.isCarryOver &&
                      (
                        <small>
                          <br />
                          ※{row.carryOverDate}
                        </small>
                      )
                    }
                   */}
                  </span>




                  <span
                    className={
                      row.remaining > 0
                      ? "warning"
                      : ""
                    }
                  >

                    {row.remaining}台

                  </span>




                  <span
                    className={
                      row.rate < month.average
                      ? "warning"
                      : ""
                    }
                  >

                    {row.rate}%

                  </span>



                </div>

              ))
            }


          </section>


        ))
      }



    </main>

  );

}