import { supabase } from "./supabase";
import type { ManagementStatus } from "./managementStatus";

type ManagementData = {
  report_date: string;
  store_id: string;

  service_gross: number;
  service_gross_today: number;

  inspection_done_1: number;
  inspection_done_2: number;
  inspection_done_3: number;

  status: ManagementStatus;
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