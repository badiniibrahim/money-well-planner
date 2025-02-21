import { State } from "@/src/entities/models/dashboard/state";

export interface IDashboardRepository {
  getState(userId: string): Promise<State>;
}
