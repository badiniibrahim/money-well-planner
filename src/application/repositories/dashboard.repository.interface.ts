export interface IDashboardRepository {
  getState(userId: string): Promise<State>;
}
