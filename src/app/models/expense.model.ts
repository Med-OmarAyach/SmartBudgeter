export interface Expense {
    expenseId: number;
    note: string;
    amount: number;
    categoryId: number;
    userId: number; 
    createdAt?: string; 
    updatedAt?: string; 
    
}

// DTO for creating an expense
export interface CreateExpenseRequest {
  category: { id: number }; // ✅ Send the category object
  amount: number;
  note: string;
  date: string;
}



export interface UpdateExpenseRequest {
    note?: string; 
    amount?: number; 
    date?: string; 
    categoryId?: number; 
   
}

export interface AddSpendingRequest {
    amount: number; // Or BigDecimal
    
}