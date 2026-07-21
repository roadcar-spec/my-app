import { createClient } from "@/lib/supabase/server";

export type DailySalesData = {
  report_date: string;
  store_id: string;
  sr_visitors: number;
  new_visitors: number;
  negotiations: number;
  test_drive: number;
  quotation: number;
  new_order: number;
  used_order: number;
  new_registration: number;
  used_registration: number;
};

export class DailySalesRepository {
  async getAll() {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("daily_sales")
      .select(
        `
        *,
        master_store (
          code,
          name
        )
      `
      )
      .order("report_date", { ascending: false });

    if (error) throw error;

    return data;
  }

  async save(data: DailySalesData) {
    const supabase = await createClient();

    // 同じ日・同じ店舗のデータ確認
    const { data: exists, error: findError } = await supabase
      .from("daily_sales")
      .select("id")
      .eq("report_date", data.report_date)
      .eq("store_id", data.store_id)
      .maybeSingle();

    if (findError) throw findError;

    // 新規登録
    if (!exists) {
      const { data: result, error } = await supabase
        .from("daily_sales")
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return result;
    }

    // 更新
    const { data: result, error } = await supabase
      .from("daily_sales")
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
      .from("daily_sales")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  }
}

export const dailySalesRepository = new DailySalesRepository();