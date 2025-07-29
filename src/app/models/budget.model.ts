// models/budget.model.ts
export interface Budget {
id: number;
  monthlyLimit: number;
  spent: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  userId: number;
  categoryId: number;

}

export interface BudgetConfig {
  category_id: number;
  monthlyLimit: number;
  spent?: number;
}

export interface CreateBudgetRequest {
  user_id?: string;
  category_id: number;
  monthlyLimit: number;
}

export interface UpdateBudgetRequest {
  category_id?: string;
  monthlyLimit?: number;
  spent?: number;
}

export interface AddSpendingRequest {
  amount: number;
}

export interface BudgetSummary {
  totalMonthlyLimit: number;
  monthlyLimit: number;
  totalSpent: number;
  budgetCount: number;
  totalRemaining: number;
}
export interface AlertSettings {
  warningThreshold: number;
}