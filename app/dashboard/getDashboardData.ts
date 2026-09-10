import { supabase } from "@/lib/supabase";
import {
  getBusinessDayIndex,
  getBusinessDaysInRange,
  getDateAtBusinessDayIndex,
} from "@/lib/businessDay";
import { isSubmitted } from "@/lib/managementStatus";
import {
  getJstYesterdayString,
  getPreviousMonthRange,
  getRollingMonthLabels,
  getRollingMonthStarts,
} from "@/lib/jstDate";
import { sortStoresByDisplayOrder } from "@/lib/storeDisplayOrder";

type Store = {
  id: string;
  name: string;
};

export type Daily = {
  store_id: string;
  report_date: string;
  service_gross: number;
  inspection_done_1: number;
  inspection_done_2: number;
  inspection_done_3: number;
  status: string;
};

type Target = {
  store_id: string;
  year_month: string;
  service_target: number;
};

type InspectionTarget = {
  store_id: string;
  target_month: string;
  target_count: number;
};

// 「先月同時点比」(営業日indexベースのペース比較)。比較対象が存在しない場合
// (先月に対応する営業日が無い/先月の目標が未設定 等)はnullで「比較なし」を表す。
export type PaceComparison = {
  rate: number;
  previousRate: number;
  deltaPoints: number;
} | null;


// 当日の本日実績＝当日累計－同月内の直近提出日の累計（月をまたぐと基準がないため差分計算しない）
export function getTodayGrossAmount(
  dailyList:Daily[],
  storeId:string,
  date:string,
  monthStart:string
) {

  const todayRow =
    dailyList.find(
      d =>
        d.store_id === storeId &&
        d.report_date === date
    );

  if (!todayRow) {
    return 0;
  }

  const previousRow =
    dailyList
      .filter(
        d =>
          d.store_id === storeId &&
          d.report_date < date &&
          d.report_date >= monthStart &&
          isSubmitted(d.status)
      )
      .sort(
        (a,b)=>
          b.report_date.localeCompare(
            a.report_date
          )
      )[0];

  return (
    todayRow.service_gross -
    (previousRow?.service_gross ?? 0)
  );

}



function average(
  values:number[]
) {

  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (a,b)=>a+b,
      0
    )
    /
    values.length
  );

}



export async function getDashboardData(
  viewDate?: string
) {


  const date =
    viewDate ??
    getJstYesterdayString();


  const monthStart =
    `${date.substring(0,8)}01`;


  const [month1, month2, month3] =
    getRollingMonthStarts(
      monthStart
    );


  // 先月同時点比較(営業日indexベース)のための基準値
  const { prevMonthStart, prevMonthEnd } =
    getPreviousMonthRange(
      monthStart
    );


  const businessDayIndex =
    getBusinessDayIndex(
      monthStart,
      date
    );


  // 「今月の営業日N日目」に対応する先月の日付。先月の営業日数がN日に
  // 満たない場合はundefined(＝比較対象なし、呼び出し側でnull扱いする)。
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



  const { data: daily } =
    await supabase
      .from("management_daily")
      .select("*")
      .lte(
        "report_date",
        date
      );



  const { data: targets } =
    await supabase
      .from("management_monthly_target")
      .select("*")
      .in(
        "year_month",
        [monthStart, prevMonthStart]
      );



  const { data: inspectionTargets } =
    await supabase
      .from("inspection_monthly_target")
      .select("*")
      .in(
        "target_month",
        [month1, month2, month3, prevMonthStart]
      );



  const storeList =
    sortStoresByDisplayOrder(
      (stores ?? []) as Store[]
    );



  const dailyList =
    (daily ?? []) as Daily[];


  const targetList =
    (targets ?? []) as Target[];


  const inspectionTargetList =
    (inspectionTargets ?? []) as InspectionTarget[];


  function getInspectionTarget(
    storeId:string,
    targetMonth:string
  ) {

    return inspectionTargetList.find(
      t =>
        t.store_id === storeId &&
        t.target_month === targetMonth
    );

  }



  // 直近提出データを取得する。monthStartBoundを指定すると、それより前の
  // 日付は対象から除外する＝月をまたいで前月の実績を「繰り越し」として
  // 拾わない(getTodayGrossAmountが前月にまたがない設計にしているのと同じ原則)。
  // 指定しない場合は従来通り無制限(呼び出し元の既存の挙動を変えない)。
  function getLatestSubmit(
    storeId:string,
    asOfDate:string = date,
    monthStartBound:string = ""
  ) {

    return dailyList
      .filter(
        d =>
          d.store_id === storeId &&
          isSubmitted(d.status) &&
          d.report_date >= monthStartBound &&
          d.report_date <= asOfDate
      )
      .sort(
        (a,b)=>
          b.report_date.localeCompare(
            a.report_date
          )
      )[0];

  }



  const businessDaysInMonth =
    getBusinessDaysInRange(
      monthStart,
      date
    );



  const submitStores =
    storeList.map(store=>{

      const submittedDates =
        new Set(
          dailyList
            .filter(
              d =>
                d.store_id === store.id &&
                isSubmitted(d.status)
            )
            .map(d => d.report_date)
        );


      const requiredDays =
        businessDaysInMonth.length;


      const submittedDays =
        businessDaysInMonth.filter(
          d => submittedDates.has(d)
        ).length;


      const rate =
        requiredDays
          ?  (submittedDays / requiredDays) * 100
          : 0;


      const today =
        dailyList.find(
          d =>
            d.store_id === store.id &&
            d.report_date === date
        );


      return {

        store,

        submitted:
          isSubmitted(today?.status),

        todayStatus:
          today?.status ?? "未提出",

        rate,

        requiredDays,

        submittedDays,

      };

    });



  const submitAverage =
    average(
      submitStores.map(s => s.rate)
    );



  const grossStores =
    storeList.map(store=>{


      // 今月に入ってまだ誰も提出していない場合に前月末の累計を
      // 「繰り越し」として拾ってしまわないよう、当月内に限定する。
      const latest =
        getLatestSubmit(
          store.id,
          date,
          monthStart
        );


      const amount =
        latest?.service_gross ?? 0;


      const todayAmount =
        getTodayGrossAmount(
          dailyList,
          store.id,
          date,
          monthStart
        );


      const target =
        targetList.find(
          t =>
            t.store_id === store.id &&
            t.year_month === monthStart
        );


      const rate =
        target?.service_target
          ? amount /
              target.service_target *
              100
          : 0;


      // 先月同時点比較(営業日indexベース)
      const prevTarget =
        targetList.find(
          t =>
            t.store_id === store.id &&
            t.year_month === prevMonthStart
        );


      const previousLatest =
        comparisonDate
          ? getLatestSubmit(
              store.id,
              comparisonDate,
              prevMonthStart
            )
          : undefined;


      const previousRate =
        comparisonDate && prevTarget?.service_target
          ? (previousLatest?.service_gross ?? 0) /
              prevTarget.service_target *
              100
          : null;


      const paceComparison: PaceComparison =
        previousRate !== null
          ? {
              rate,
              previousRate,
              deltaPoints: rate - previousRate,
            }
          : null;


      return {

        store,

        amount,

        todayAmount,


        rate,


        isCarryOver:
          latest?.report_date !== date,


        carryOverDate:
          latest?.report_date ?? "",


        paceComparison,

      };

    });



  const inspectionStores =
    storeList.map(store=>{


      // month2/month3(先々月分の前倒し予約状況)は従来通り無制限で
      // 直近提出データを見る(3ヶ月ローリング列の挙動は変更しない)。
      const latest =
        getLatestSubmit(
          store.id
        );


      // month1(当月分)は、今月に入ってまだ誰も提出していない場合に
      // 前月末の累計を「繰り越し」として拾ってしまわないよう当月内に限定する。
      const latestMonth1 =
        getLatestSubmit(
          store.id,
          date,
          monthStart
        );


      const inspectionTarget1 =
        getInspectionTarget(
          store.id,
          month1
        );


      const inspectionTarget2 =
        getInspectionTarget(
          store.id,
          month2
        );


      const inspectionTarget3 =
        getInspectionTarget(
          store.id,
          month3
        );


      const month1Rate =
        inspectionTarget1?.target_count
          ?
              (latestMonth1?.inspection_done_1 ?? 0)
              /
              inspectionTarget1.target_count
              *
              100

          : 0;


      // 先月同時点比較(営業日indexベース、month1のみ対象)
      const prevInspectionTarget1 =
        getInspectionTarget(
          store.id,
          prevMonthStart
        );


      const previousLatestMonth1 =
        comparisonDate
          ? getLatestSubmit(
              store.id,
              comparisonDate,
              prevMonthStart
            )
          : undefined;


      const previousMonth1Rate =
        comparisonDate && prevInspectionTarget1?.target_count
          ? (previousLatestMonth1?.inspection_done_1 ?? 0) /
              prevInspectionTarget1.target_count *
              100
          : null;


      const month1PaceComparison: PaceComparison =
        previousMonth1Rate !== null
          ? {
              rate: month1Rate,
              previousRate: previousMonth1Rate,
              deltaPoints: month1Rate - previousMonth1Rate,
            }
          : null;


      return {

        store,


        month1:
          month1Rate,


        month2:
          inspectionTarget2?.target_count
            ?
                (latest?.inspection_done_2 ?? 0)
                /
                inspectionTarget2.target_count
                *
                100

            : 0,


        month3:
          inspectionTarget3?.target_count
            ?
                (latest?.inspection_done_3 ?? 0)
                /
                inspectionTarget3.target_count
                *
                100

            : 0,


        isCarryOver:
          latest?.report_date !== date,


        carryOverDate:
          latest?.report_date ?? "",


        month1PaceComparison,

      };

    });



  return {


    viewDate:
      date,


    submit:{

      average:
        submitAverage,

      stores:
        submitStores,

    },


    gross:{

      average:
        average(
          grossStores.map(
            g=>g.rate
          )
        ),

      stores:
        grossStores,

    },


    inspection:{


      month1Average:
        average(
          inspectionStores.map(
            i=>i.month1
          )
        ),


      month2Average:
        average(
          inspectionStores.map(
            i=>i.month2
          )
        ),


      month3Average:
        average(
          inspectionStores.map(
            i=>i.month3
          )
        ),


      monthLabels:
        getRollingMonthLabels(
          monthStart
        ),


      stores:
        inspectionStores,

    },


  };

}