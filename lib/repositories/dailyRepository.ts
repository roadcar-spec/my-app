import { createClient } from "@/lib/supabase/server";

export class DailyRepository {

  async getDailySales(limit = 10) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("daily_sales")
      .select("*")
      .order("report_date", {
        ascending: false,
      })
      .limit(limit);

    if (error) throw error;

    return data;
  }



  async saveDailySales(form: any) {

    const supabase = await createClient();



    // ① 営業
    const { data: sales, error: salesError } =
      await supabase
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
        )
        .select();



    if (salesError) throw salesError;



    // ② サービス
    const volvoTotal =
      form.volvo_inspection +
      form.volvo_check +
      form.volvo_general +
      form.volvo_body;


    const otherTotal =
      form.other_inspection +
      form.other_check +
      form.other_general +
      form.other_body;



    const { data: service, error: serviceError } =
      await supabase
        .from("daily_service")
        .upsert(
          {
            report_date: form.report_date,
            store_id: form.store_id,

            service_total:
              volvoTotal + otherTotal,

            volvo_total: volvoTotal,

            volvo_inspection:
              form.volvo_inspection,

            volvo_check:
              form.volvo_check,

            volvo_general:
              form.volvo_general,

            volvo_body:
              form.volvo_body,


            other_total: otherTotal,

            other_inspection:
              form.other_inspection,

            other_check:
              form.other_check,

            other_general:
              form.other_general,

            other_body:
              form.other_body,
          },
          {
            onConflict: "report_date,store_id",
          }
        )
        .select();



    if (serviceError) throw serviceError;




    // ③ 粗利
    const { data: profit, error: profitError } =
      await supabase
        .from("daily_service_profit")
        .upsert(
          {
            report_date: form.report_date,
            store_id: form.store_id,

            gross_profit:
              form.volvo_profit +
              form.other_profit,


            volvo_profit:
              form.volvo_profit,

            other_profit:
              form.other_profit,


            labor_sales:
              form.volvo_labor +
              form.other_labor,


            volvo_labor:
              form.volvo_labor,

            other_labor:
              form.other_labor,


            parts_purchase:
              form.parts_purchase,
          },
          {
            onConflict: "report_date,store_id",
          }
        )
        .select();



    if (profitError) throw profitError;




    // ④ その他
    const { data: other, error: otherError } =
      await supabase
        .from("daily_other")
        .upsert(
          {
            report_date: form.report_date,
            store_id: form.store_id,

            insurance_count:
              form.insurance_count,

            finance_count:
              form.finance_count,

            tradein_count:
              form.tradein_count,


            inspection_progress_current:
              form.inspection_progress_current,

            inspection_progress_next:
              form.inspection_progress_next,

            inspection_progress_next2:
              form.inspection_progress_next2,
          },
          {
            onConflict: "report_date,store_id",
          }
        )
        .select();



    if (otherError) throw otherError;



    return {
      sales,
      service,
      profit,
      other,
    };
  }
}


export const dailyRepository =
  new DailyRepository();