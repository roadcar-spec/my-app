import { createClient } from "@/lib/supabase/server";

export class MasterStoreRepository {
  async getAll() {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("master_store")
      .select("*")
      .order("code");

    if (error) throw error;

    return data;
  }

  async create(code: string, name: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("master_store")
      .insert({
        code,
        name,
      })
      .select();

    if (error) throw error;

    return data;
  }
}

export const masterStoreRepository = new MasterStoreRepository();