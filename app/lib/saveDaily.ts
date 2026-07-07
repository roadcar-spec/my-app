import { supabase } from "./supabase";

export async function saveDaily(form: any) {
  const { error } = await supabase
    .from("daily_sales")
    .upsert(
      {
        report_date: form.report_date,
        store_id: form.store_id,

        sr_visitors: form.sr_visitors,
        new_visitors: form.new_visitors,
        negotiations: form.negotiations,
        test_drive: form.test_drive,
        quotation: form.quotation,
        new_order: form.new_order,
        used_order: form.used_order,
        new_registration: form.new_registration,
        used_registration: form.used_registration,
      },
      {
        onConflict: "report_date,store_id",
      }
    );

  if (error) throw error;
}