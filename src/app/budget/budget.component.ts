import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BudgetService } from '../services/budget.service';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { BudgetConfigModalComponent } from '../budget-config-modal-component/budget-config-modal-component.component';
import { Budget, BudgetConfig, BudgetSummary } from '../models/budget.model';
import { Category } from '../models/category.model';

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

  constructor(
    private budgetService: BudgetService, 
    private categoryService: CategoryService
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
    
    // Load budgets, categories, and summary
    Promise.all([
      this.loadBudgets(),
      this.loadCategories(),
      this.loadBudgetSummary()
    ]).finally(() => {
      this.loading = false;
      // Re-initialize icons after data load
      setTimeout(() => (window as any).lucide?.createIcons(), 100);
    });
  }

  loadBudgets(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.budgetService.getCurrentUserBudgets().subscribe({
        next: (data) => {
          this.budgets = data;
          console. log('Budgets loaded:', this.budgets);
          resolve();
        },
        error: (err) => {
          console.error('Failed to load budgets', err);
          reject(err);
        }
      });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getByUserId().subscribe({
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

  closeConfigModal() {
    this.showConfigModal = false;
 this.loadBudgetSummary(); // Reload summary
                this.loadData();

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
      this.closeConfigModal();
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
    this.budgetService.addSpending(budgetId, { amount }).subscribe({
      next: (updatedBudget) => {
        // Update the budget in the list
        const index = this.budgets.findIndex(b => b.id.toString() === budgetId);
        if (index !== -1) {
          this.budgets[index] = updatedBudget;
        }
        this.loadBudgetSummary(); // Reload summary
      },
      error: (err) => {
        console.error('Error adding spending:', err);
      }
    });
  }

  getCategoryName(categoryId: string): string {
      console.log('Category ID:', categoryId);

    const category = this.categories.find(c => c.id.toString() === categoryId)
  console.log('Category ID:', categoryId, 'Found:', category);
    return category ? category.name : 'Unknown Category';
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

  getExistingBudgetConfigs(): BudgetConfig[] {
    return this.budgets.map(budget => ({
      category_id: budget.categoryId,
      monthlyLimit: budget.monthlyLimit,
      spent: budget.spent
    }));
  }

  retry() {
this.loadBudgetSummary(); // Reload summary
                this.loadData();  }

  clearError() {
    this.error = null;
  }

  trackByBudgetId(index: number, budget: Budget): string {
    return budget.id.toString();
  }}