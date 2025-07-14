
export interface BudgetConfig {
  id?: string;
  category_id: string;
  user_id: string;
  monthly_limit: number;
  created_at?: Date;
}
