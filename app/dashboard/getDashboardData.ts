import { supabase } from "@/lib/supabase";
import { getBusinessDaysInRange } from "@/lib/businessDay";
import { isSubmitted } from "@/lib/managementStatus";
import { getJstDateString, getRollingMonthLabels } from "@/lib/jstDate";

type Store = {
  id: string;
  name: string;
};

type Daily = {
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
  service_target: number;
  inspection_target_1: number;
  inspection_target_2: number;
  inspection_target_3: number;
};


const displayOrder = [
  "大阪中央",
  "千里",
  "堺",
  "東大阪",
  "岸和田",
  "板橋",
];


function getYesterday() {

  const todayJst = getJstDateString();

  const date = new Date(
    `${todayJst}T00:00:00Z`
  );

  date.setUTCDate(
    date.getUTCDate() - 1
  );

  return date
    .toISOString()
    .split("T")[0];

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
    getYesterday();


  const monthStart =
    `${date.substring(0,8)}01`;



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
      .eq(
        "year_month",
        monthStart
      );



  const storeList =
    ((stores ?? []) as Store[])
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



  const dailyList =
    (daily ?? []) as Daily[];


  const targetList =
    (targets ?? []) as Target[];



  function getLatestSubmit(
    storeId:string
  ) {

    return dailyList
      .filter(
        d =>
          d.store_id === storeId &&
          isSubmitted(d.status) &&
          d.report_date <= date
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


      const latest =
        getLatestSubmit(
          store.id
        );


      const amount =
        latest?.service_gross ?? 0;


      const target =
        targetList.find(
          t =>
            t.store_id === store.id
        );


      return {

        store,

        amount,


        rate:
          target?.service_target
            ? amount /
                target.service_target *
                100
            : 0,


        isCarryOver:
          latest?.report_date !== date,


        carryOverDate:
          latest?.report_date ?? "",

      };

    });



  const inspectionStores =
    storeList.map(store=>{


      const latest =
        getLatestSubmit(
          store.id
        );


      const target =
        targetList.find(
          t =>
            t.store_id === store.id
        );


      return {

        store,


        month1:
          target?.inspection_target_1
            ? 
                (latest?.inspection_done_1 ?? 0)
                /
                target.inspection_target_1
                *
                100
              
            : 0,


        month2:
          target?.inspection_target_2
            ? 
                (latest?.inspection_done_2 ?? 0)
                /
                target.inspection_target_2
                *
                100
              
            : 0,


        month3:
          target?.inspection_target_3
            ? 
                (latest?.inspection_done_3 ?? 0)
                /
                target.inspection_target_3
                *
                100
              
            : 0,


        isCarryOver:
          latest?.report_date !== date,


        carryOverDate:
          latest?.report_date ?? "",

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