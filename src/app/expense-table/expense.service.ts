import { Injectable } from '@angular/core';
import { Expense } from './expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenses: Expense[] = [
    { id: 1, date: '2024-01-15', description: 'Supermarché Carrefour', category: 'alimentation', amount: 85.5 },
    { id: 2, date: '2024-01-14', description: 'Essence Total', category: 'transport', amount: 65.0 },
    { id: 3, date: '2024-01-13', description: 'Cinéma UGC', category: 'loisirs', amount: 24.0 },
    { id: 4, date: '2024-01-12', description: 'Pharmacie', category: 'sante', amount: 35.8 },
    { id: 5, date: '2024-01-11', description: 'Restaurant', category: 'alimentation', amount: 45.0 },
  ];

  getExpenses(): Expense[] {
    return this.expenses;
  }
}