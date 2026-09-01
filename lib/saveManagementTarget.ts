import { supabase } from "./supabase";

type ServiceTargetRow = {
  year_month: string;
  store_id: string;
  service_target: number;
};

type InspectionTargetRow = {
  target_month: string;
  store_id: string;
  target_count: number;
};


// サービス粗利目標(management_monthly_target.service_target)を
// 年間・全拠点分まとめてupsertする。
export async function saveServiceTargets(rows: ServiceTargetRow[]) {

  const { error } = await supabase
    .from("management_monthly_target")
    .upsert(rows, {
      onConflict: "year_month,store_id",
    });


  if (error) {
    throw error;
  }


  return true;
}


// 車検対象台数目標(inspection_monthly_target.target_count)を
// 年間・全拠点分まとめてupsertする。
export async function saveInspectionTargets(rows: InspectionTargetRow[]) {

  const { error } = await supabase
    .from("inspection_monthly_target")
    .upsert(rows, {
      onConflict: "store_id,target_month",
    });


  if (error) {
    throw error;
  }


  return true;
}
