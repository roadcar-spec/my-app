import { supabase } from "./supabase";

type TargetData = {
  year_month: string;
  store_id: string;

  service_target: number;

  inspection_target_1: number;
  inspection_target_2: number;
  inspection_target_3: number;
};


export async function saveManagementTarget(data: TargetData) {

  const { error } = await supabase
    .from("management_monthly_target")
    .upsert(data, {
      onConflict: "year_month,store_id",
    });


  if (error) {
    throw error;
  }


  return true;
}