import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isSubmitted } from "@/lib/managementStatus";
import {
  getBusinessDayIndex,
  getDateAtBusinessDayIndex,
} from "@/lib/businessDay";
import {
  getJstYesterdayString,
  getPreviousMonthRange,
  getRollingMonthLabels,
  getRollingMonthStarts,
} from "@/lib/jstDate";
import { sortStoresByDisplayOrder } from "@/lib/storeDisplayOrder";
import "./inspection.css";

// 「先月同時点比」(営業日indexベースのペース比較)。比較対象が存在しない場合
// (先月に対応する営業日が無い/先月の目標が未設定 等)はnullで「比較なし」を表す。
type PaceComparison = {
  rate: number;
  previousRate: number;
  deltaPoints: number;
} | null;

export const dynamic = "force-dynamic";

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
    getJstYesterdayString();


  const yearMonth =
    `${viewDate.substring(0,8)}01`;


  const [month1, month2, month3] =
    getRollingMonthStarts(yearMonth);


  // 先月同時点比較(営業日indexベース)のための基準値。当月の1列目(month1)
  // にのみ使う。
  const { prevMonthStart, prevMonthEnd } =
    getPreviousMonthRange(yearMonth);


  const businessDayIndex =
    getBusinessDayIndex(
      yearMonth,
      viewDate
    );


  // 「今月の営業日N日目」に対応する先月の日付。先月の営業日数がN日に
  // 満たない場合はundefined(＝比較対象なし)。
  const comparisonDate =
    getDateAtBusinessDayIndex(
      prevMonthStart,
      prevMonthEnd,
      businessDayIndex
    );



  const { data: stores } =
    await supabase
      .from("master_store")
      .select("*");



  const { data: inspectionTargets } =
    await supabase
      .from("inspection_monthly_target")
      .select("*")
      .in(
        "target_month",
        [month1, month2, month3, prevMonthStart]
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
    sortStoresByDisplayOrder(
      stores ?? []
    );



  const monthLabels =
    getRollingMonthLabels(yearMonth);


  // prevTargetMonth: 先月同時点比較で参照する「先月時点でのこの列」の
  // ターゲット月。ローリング窓が1ヶ月ずつ後ろにずれる関係上、month1は
  // 文字通りprevMonthStart、month2は今月のmonth1、month3は今月のmonth2の
  // ターゲット月と一致する。
  const months = [
    {
      name:monthLabels[0],
      targetMonth:month1,
      done:"inspection_done_1",
      isCurrentMonth:true,
      prevTargetMonth:prevMonthStart,
    },
    {
      name:monthLabels[1],
      targetMonth:month2,
      done:"inspection_done_2",
      isCurrentMonth:false,
      prevTargetMonth:month1,
    },
    {
      name:monthLabels[2],
      targetMonth:month3,
      done:"inspection_done_3",
      isCurrentMonth:false,
      prevTargetMonth:month2,
    },
  ];



  const inspectionData =
    months.map(month=>{


      const rows =
        storeList.map(store=>{


          const target =
            inspectionTargets?.find(
              t =>
                t.store_id === store.id &&
                t.target_month === month.targetMonth
            );



          // 当月列(month1)は、今月に入ってまだ誰も提出していない場合に
          // 前月末の累計を「繰り越し」として拾ってしまわないよう当月内に
          // 限定する。先々月分の前倒し予約状況(month2/month3)は従来通り
          // 無制限で直近提出データを見る(挙動を変えない)。
          const latest =
            daily
              ?.filter(
                d =>
                  d.store_id === store.id &&
                  isSubmitted(d.status) &&
                  (
                    !month.isCurrentMonth ||
                    d.report_date >= yearMonth
                  )
              )
              .sort(
                (a,b)=>
                  b.report_date.localeCompare(
                    a.report_date
                  )
              )[0];



          const targetValue =
            Number(
              target?.target_count ?? 0
            );



          const doneValue =
            Number(
              latest?.[month.done] ?? 0
            );



          const rate =
            calcRate(
              doneValue,
              targetValue
            );



          // 先月同時点比較(営業日indexベース、全列対象)。month1は当月分として
          // 前月側の下限をprevMonthStartに限定するが、month2/month3は月をまたいで
          // 前倒し予約状況を追跡し続ける列のため、latestの取得と同様に前月側も
          // 下限を設けず(comparisonDate以下で無制限に)検索する。
          let paceComparison: PaceComparison = null;

          if (comparisonDate) {

            const prevTarget =
              inspectionTargets?.find(
                t =>
                  t.store_id === store.id &&
                  t.target_month === month.prevTargetMonth
              );

            const prevTargetValue =
              Number(
                prevTarget?.target_count ?? 0
              );

            if (prevTargetValue) {

              const previousLatest =
                daily
                  ?.filter(
                    d =>
                      d.store_id === store.id &&
                      isSubmitted(d.status) &&
                      (
                        !month.isCurrentMonth ||
                        d.report_date >= prevMonthStart
                      ) &&
                      d.report_date <= comparisonDate
                  )
                  .sort(
                    (a,b)=>
                      b.report_date.localeCompare(
                        a.report_date
                      )
                  )[0];

              const previousDoneValue =
                Number(
                  previousLatest?.[month.done] ?? 0
                );

              const previousRate =
                calcRate(
                  previousDoneValue,
                  prevTargetValue
                );

              paceComparison = {
                rate,
                previousRate,
                deltaPoints: rate - previousRate,
              };

            }

          }



          return {

            store,


            target:
              targetValue,


            done:
              doneValue,


            remaining:
              targetValue - doneValue,


            rate,


            isCarryOver:
              latest?.report_date !== viewDate,


            carryOverDate:
              latest?.report_date ?? "",


            paceComparison,

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

        <p className="pace-comparison-note">
          （　）内は先月同時点比
        </p>


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
                      ? "carryover"
                      : ""
                    }
                  >

                    {row.done}台

                    {
                      row.isCarryOver &&
                      row.carryOverDate &&
                      (
                        <small>
                          <br />
                          ※{row.carryOverDate.slice(5).replace("-", "/")}
                        </small>
                      )
                    }
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

                    {row.paceComparison && (
                      <small
                        className={
                          "pace-comparison " +
                          (
                            row.paceComparison.deltaPoints >= 0
                            ? "pace-up"
                            : "pace-down"
                          )
                        }
                      >
                        <br />
                        (
                        {row.paceComparison.deltaPoints >= 0 ? "+" : ""}
                        {row.paceComparison.deltaPoints}pt)
                      </small>
                    )}

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