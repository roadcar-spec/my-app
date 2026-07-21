import { createClient } from "@/lib/supabase/server";

export type DailyServiceData = {
  report_date: string;
  store_id: string;

  service_total: number;

  volvo_total: number;
  volvo_inspection: number;
  volvo_check: number;
  volvo_general: number;
  volvo_body: number;

  other_total: number;
  other_inspection: number;
  other_check: number;
  other_general: number;
  other_body: number;
};

export class DailyServiceRepository {
  async getAll() {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("daily_service")
      .select(`
        *,
        master_store(
          code,
          name
        )
      `)
      .order("report_date", { ascending: false });

    if (error) throw error;

    return data;
  }

  async save(data: DailyServiceData) {
    const supabase = await createClient();

    const { data: exists, error: findError } = await supabase
      .from("daily_service")
      .select("id")
      .eq("report_date", data.report_date)
      .eq("store_id", data.store_id)
      .maybeSingle();

    if (findError) throw findError;

    if (!exists) {
      const { data: result, error } = await supabase
        .from("daily_service")
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return result;
    }

    const { data: result, error } = await supabase
      .from("daily_service")
      .update(data)
      .eq("id", exists.id)
      .select()
      .single();

    if (error) throw error;

    return result;
  }

  async delete(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("daily_service")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  }
}

export const dailyServiceRepository = new DailyServiceRepository();