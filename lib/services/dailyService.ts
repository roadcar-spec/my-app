import { dailyRepository } from "@/lib/repositories/dailyRepository";

export class DailyService {
  async getDailySales() {
    return dailyRepository.getDailySales();
  }

  async saveDailySales(data: any) {
    return dailyRepository.saveDailySales(data);
  }
}

export const dailyService = new DailyService();