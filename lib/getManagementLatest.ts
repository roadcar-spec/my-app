import { supabase } from "@/lib/supabase";

export async function getManagementLatest(
  storeId: string,
  reportDate: string
) {

  // 当日データ確認
  const { data: today } =
    await supabase
      .from("management_daily")
      .select("*")
      .eq(
        "store_id",
        storeId
      )
      .eq(
        "report_date",
        reportDate
      )
      .maybeSingle();



  // 当日提出済みの場合
  if (
    today &&
    today.status === "提出"
  ) {

    return {

      todayStatus:
        "提出",

      latestDate:
        today.report_date,

      isCarryOver:
        false,


      service_gross:
        today.service_gross ?? 0,


      inspection_done_1:
        today.inspection_done_1 ?? 0,


      inspection_done_2:
        today.inspection_done_2 ?? 0,


      inspection_done_3:
        today.inspection_done_3 ?? 0,

    };

  }



  // 直近提出データ取得
  const { data: latest } =
    await supabase
      .from("management_daily")
      .select("*")
      .eq(
        "store_id",
        storeId
      )
      .eq(
        "status",
        "提出"
      )
      .lt(
        "report_date",
        reportDate
      )
      .order(
        "report_date",
        {
          ascending:false,
        }
      )
      .limit(1)
      .maybeSingle();



  return {

    todayStatus:
      today?.status ?? "未提出",


    latestDate:
      latest?.report_date ?? "",


    isCarryOver:
      !!latest,


    service_gross:
      latest?.service_gross ?? 0,


    inspection_done_1:
      latest?.inspection_done_1 ?? 0,


    inspection_done_2:
      latest?.inspection_done_2 ?? 0,


    inspection_done_3:
      latest?.inspection_done_3 ?? 0,

  };

}