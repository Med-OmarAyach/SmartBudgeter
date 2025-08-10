import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { CategoryService } from '../services/category.service';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { BudgetConfigModalComponent } from '../budget-config-modal-component.component/budget-config-modal-component.component';
import { Budget, BudgetConfig, BudgetSummary } from '../models/budget.model';
import { Category } from '../models/category.model';
import { Expense } from '../models/expense.model';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  standalone: true,
  imports: [CommonModule, BudgetConfigModalComponent]
})
export class BudgetComponent implements OnInit, AfterViewInit {
  budgets: Budget[] = [];
  categories: Category[] = [];
  budgetSummary: BudgetSummary | null = null;
  showConfigModal = false;
  loading = false;
  error: string | null = null;
  existingBudgetConfigsForModal: BudgetConfig[] = [];

  expenses: Expense[] = [];

  constructor(
    private budgetService: BudgetService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Initialize Lucide icons if available
    (window as any).lucide?.createIcons();
  }

  loadData() {
    this.loading = true;
    this.error = null;

    // Load budgets, categories, expenses, and summary
    Promise.all([
      this.loadBudgets(),
      this.loadCategories(),
      this.loadExpenses(),
      this.loadBudgetSummary()
    ]).finally(() => {
      this.loading = false;
      // Re-initialize icons after data load
      setTimeout(() => (window as any).lucide?.createIcons(), 100);
    });
  }
  loadExpenses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.expenseService.getCurrentUserExpenses().subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          // After loading expenses, update budget.spent for each budget
          this.updateBudgetsSpent();
          resolve();
        },
        error: (err) => {
          console.error('Failed to load expenses', err);
          this.expenses = [];
          resolve(); // Don't block other loads
        }
      });
    });
  }

  updateBudgetsSpent() {
    if (!this.budgets || !this.expenses) return;
    this.budgets.forEach(budget => {
      const totalSpent = this.expenses
        .filter(exp => exp.categoryId === budget.categoryId)
        .reduce((sum, exp) => sum + exp.amount, 0);
      budget.spent = totalSpent;
    });
  }

  loadBudgets(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.budgetService.getCurrentUserBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        console.log('Budgets loaded:', this.budgets);
        // --- Add this line ---
        this.getExistingBudgetConfigs(); // Populate existingBudgetConfigsForModal
        // --- End of addition ---
        resolve();
      },
      error: (err) => {
        console.error('Failed to load budgets', err);
        // --- Optionally reset the modal input on error ---
        // this.existingBudgetConfigsForModal = [];
        // --- End of optional addition ---
        reject(err);
      }
    });
  });
}


  loadCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getAllForCurrentUser().subscribe({
        next: (categories) => {
          this.categories = categories;
          resolve();
        },
        error: (err) => {
          console.error('Failed to load categories', err);
          reject(err);
        }
      });
    });
  }

  loadBudgetSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.budgetService.getBudgetSummary().subscribe({
        next: (summary) => {
          this.budgetSummary = summary;
          console.log('Budget summary loaded:', this.budgetSummary);
          resolve();
        },
        error: (err) => {
          console.error('Failed to load budget summary', err);
          // Don't set error for summary as it's not critical
          resolve();
        }
      });
    });
  }

  openConfigModal() {
    this.showConfigModal = true;
  }

  closeModal() {
    this.showConfigModal = false;
    // Reload data to reflect any changes made in the modal
    this.loadData(); // This includes loadBudgetSummary()
    // Optionally remove the separate loadBudgetSummary() call if loadData() handles it
    // this.loadBudgetSummary(); // Redundant if loadData() already does this
}

  saveBudgetConfig(data: { 
  budgets: BudgetConfig[], 
  alertSettings: { warningThreshold: number } 
}) {
  this.loading = true;
  const promises: Promise<any>[] = [];

  // Process each budget configuration


  // Save alert settings
 /* const alertSettingsPromise = new Promise<void>((resolve, reject) => {
    this.budgetService.saveAlertSettings(data.alertSettings).subscribe({
      next: () => {
        console.log('Alert settings saved:', data.alertSettings);
        resolve();
      },
      error: (err) => {
        console.error('Error saving alert settings:', err);
        reject(err);
      }
    });
  });
  promises.push(alertSettingsPromise);
*/
  // Execute all operations
  Promise.all(promises)
    .then(() => {
      this.loadBudgetSummary(); // Reload summary
      this.loadData(); // Reload all data
      this.closeModal();
    })
    .catch(err => {
      console.error('Error saving budget config or alert settings:', err);
      this.error = 'Failed to save budget configuration or alert settings';
      this.loading = false;
    });
}
  deleteBudget(budgetId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      return;
    }

    this.budgetService.delete(budgetId).subscribe({
      next: () => {
        console.log('Budget deleted:', budgetId);
        this.loadData(); // Reload all data after deletion
      },
      error: (err) => {
        console.error('Error deleting budget:', err);
        this.loadData(); // Still reload data to ensure consistency
      }
    });
  }

  addSpending(budgetId: string, amount: number) {
    // Find the budget to get its categoryId
    const budget = this.budgets.find(b => b.budgetId.toString() === budgetId);
    if (!budget) {
      console.error('Budget not found for adding spending:', budgetId);
      return;
    }
    // Create a new expense for this category
    const expenseData = {
      category: { id: budget.categoryId },
      amount: amount,
      note: 'Added via budget control',
      date: new Date().toISOString()
    };
    this.expenseService.create(expenseData).subscribe({
      next: (newExpense) => {
        // Reload expenses and budgets to update spent
        this.loadExpenses().then(() => {
          this.updateBudgetsSpent();
          this.loadBudgetSummary();
        });
      },
      error: (err) => {
        console.error('Error adding expense:', err);
      }
    });
  }

  // budget.component.ts
getCategoryName(categoryId: number): string { // Assuming categoryId is a number in Budget/Category
    console.log('Looking for category ID (number):', categoryId);
    const category = this.categories.find(c => c.id === Number(categoryId));
    console.log('Category ID:', categoryId, 'Found:', category);
    return category ? category.name : 'Catégorie Inconnue';
}

  getBudgetProgress(budget: Budget): number {
    if (budget.monthlyLimit === 0) return 0;
    return Math.min((budget.spent / budget.monthlyLimit) * 100, 100);
  }

  getBudgetStatus(budget: Budget): 'safe' | 'warning' | 'danger' {
    const progress = this.getBudgetProgress(budget);
    if (progress >= 100) return 'danger';
    if (progress >= 80) return 'warning';
    return 'safe';
  }

  getRemainingBudget(budget: Budget): number {
    return Math.max(budget.monthlyLimit - budget.spent, 0);
  }

  isOverBudget(budget: Budget): boolean {
    return budget.spent > budget.monthlyLimit;
  }

  getExistingBudgetConfigs(): BudgetConfig[] { // Keep return type for now
  const configs = this.budgets.map(budget => ({
    category_id: budget.categoryId,
    monthlyLimit: budget.monthlyLimit,
    // spent: budget.spent // Remove if not needed by BudgetConfig interface
  }));

  // Update the dedicated property
  this.existingBudgetConfigsForModal = configs;

  // Return the value (optional, if still called directly elsewhere)
  return configs;
}

  retry() {
this.loadBudgetSummary(); // Reload summary
                this.loadData();  }

  clearError() {
    this.error = null;
  }

  // budget.component.ts
trackByBudgetId(index: number, budget: Budget): string {
    // Handle case where budget.budgetId might be undefined
    if (budget.budgetId === undefined || budget.budgetId === null) {
        console.warn(`Budget at index ${index} is missing a 'budgetId'. Using index as fallback for trackBy.`);
        return index.toString(); // Fallback to index
    }
    return budget.budgetId.toString();
}}