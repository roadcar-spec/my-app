import { supabase } from "./supabase";

type ManagementData = {
  report_date: string;
  store_id: string;

  service_gross: number;

  inspection_done_1: number;
  inspection_done_2: number;
  inspection_done_3: number;

  status: "提出" | "未提出";
};


export async function saveManagement(data: ManagementData) {
  const { error } = await supabase
    .from("management_daily")
    .upsert(data, {
      onConflict: "report_date,store_id",
    });


  if (error) {
    throw error;
  }


  return true;
}