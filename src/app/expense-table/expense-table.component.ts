import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../services/expense.service'; // Adjust path as needed
import { CreateExpenseRequest, Expense } from '../models/expense.model'; // Adjust path as needed
import { AuthService } from '../services/auth.service'; // Adjust path as needed
import { CategoryService } from '../services/category.service'; // Adjust path as needed
import { CreateExpenseData, ExpenseModalComponent } from './add-expense/add-expense'; // Adjust path as needed
@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpenseModalComponent],
  template: `
    <div class="page-content fade-in-up">
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Chargement des dépenses...</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="!loading && errorMessage" class="alert alert-danger">
        {{ errorMessage }}
        <button class="btn btn-outline" (click)="retryLoadExpenses()">Réessayer</button>
      </div>

      <div class="page-header">
        <h1 class="page-title">Expenses History</h1>
        <button class="btn btn-primary" (click)="openAddExpenseModal()" [disabled]="loading">
          <i data-lucide="plus"></i>
          Add an expense
        </button>
      </div>

      <div class="card">
        <div class="filters">
          <div class="filter-group">
            <label>Start datet</label>
            <input type="date" class="form-control" [(ngModel)]="filters.startDate" (ngModelChange)="applyFilters()" [disabled]="loading">
          </div>
          <div class="filter-group">
            <label>End date</label>
            <input type="date" class="form-control" [(ngModel)]="filters.endDate" (ngModelChange)="applyFilters()" [disabled]="loading">
          </div>
          <div class="filter-group">
            <label>Category</label>
            <select class="form-control" [(ngModel)]="filters.category" (ngModelChange)="applyFilters()" [disabled]="loading">
              <option value="">All categories</option>
              <!-- Populate categories dynamically if available -->
              <option *ngFor="let category of availableCategories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label>Minimum</label>
            <input type="number" class="form-control" [(ngModel)]="filters.minAmount" placeholder="0" (ngModelChange)="applyFilters()" [disabled]="loading">
          </div>
          <div class="filter-group">
            <label>Maximum</label>
            <input type="number" class="form-control" [(ngModel)]="filters.maxAmount" placeholder="1000" (ngModelChange)="applyFilters()" [disabled]="loading">
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th (click)="sortTable('createdAt')" class="sortable">
                  Date <i data-lucide="arrow-up-down"></i>
                </th>
                <th (click)="sortTable('note')" class="sortable">
                  note <i data-lucide="arrow-up-down"></i>
                </th>
                <th (click)="sortTable('categoryId')" class="sortable">
                  Category <i data-lucide="arrow-up-down"></i>
                </th>
                <th (click)="sortTable('amount')" class="sortable">
                  Amount <i data-lucide="arrow-up-down"></i>
                </th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of filteredExpenses || []; trackBy: trackByExpenseId">
                <td>{{ expense.createdAt ? (expense.createdAt | date:'dd/MM/yyyy') : '' }}</td>
                <td>{{ expense.note }}</td>
                <td>{{ expense.category.name }}</td>
                <td>{{ expense.amount | number:'1.2-2' }} €</td>
                <td>
                  <button class="btn btn-danger" (click)="deleteExpense(expense.expenseId)" [disabled]="loading">
                    <i data-lucide="trash-2"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="!loading && filteredExpenses.length === 0">
                <td colspan="5" class="text-center">
                  no expenses found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <app-expense-modal
  [isOpen]="showAddExpenseModal"
  [categories]="availableCategories"
  (save)="onSaveNewExpense($event)"
  (close)="closeAddExpenseModal()"
></app-expense-modal>
    </div>
  `,
  styleUrls: ["./expense-table.component.css"],
})
export class ExpensetableComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  availableCategories: any[] = []; // Adjust type if you have a Category model
  loading = false;
  errorMessage = '';
  showAddExpenseModal = false;
  
  filters = {
    startDate: '',
    endDate: '',
    category: '',
    minAmount: 0,
    maxAmount: 1000000, // Set a high default max amount
  };
  
  currentSort = { column: 'createdAt' as keyof Expense, direction: 'desc' as 'asc' | 'desc' };

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService // For auth headers if needed
    , private CategoryService: CategoryService // Adjust path as needed
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories(); // Load categories for filter dropdown
  }

  ngAfterViewInit() {
    // Initialize Lucide icons if available
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }

 // Inside budget-table.component.ts
loadExpenses() {
  this.loading = true;
  this.errorMessage = '';
  
  this.expenses = []; 
  this.filteredExpenses = [];

 this.expenseService.getCurrentUserExpenses().subscribe({
  next: (expenses: Expense[] | null) => {
    this.loading = false;

    // ✅ Fallback if backend sends null
    this.expenses = expenses ?? [];
    this.filteredExpenses = [...this.expenses];
    console.log('Raw expenses from API:', this.expenses);
    console.log('Filters:', this.filters);

    this.applyFilters();
    this.sortTable(this.currentSort.column);

    // Re-init icons
    setTimeout(() => {
      (window as any).lucide?.createIcons();
    }, 100);
  },
  error: (error) => {
    this.loading = false;
    this.errorMessage = 'Error while loading expenses. Please try again later.';
    this.expenses = [];
    this.filteredExpenses = [];
  }
});

}

  loadCategories() {
     this.CategoryService.getAllForCurrentUser().subscribe({
       next: (categories) => {
         this.availableCategories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Handle category loading error if needed
       }
    });
    
    
  }

  retryLoadExpenses() {
    this.loadExpenses();
  }

  trackByExpenseId(index: number, expense: Expense): number {
    return expense.expenseId!; // Use non-null assertion if ID is guaranteed
  }

  getCategoryName(categoryId: number): string {
    const category = this.availableCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnu';
  }

  sortTable(column: keyof Expense) {
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    this.filteredExpenses.sort((a, b) => {
      let valueA: any = a[column];
      let valueB: any = b[column];

      // Handle date sorting
      if (column === 'createdAt') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }

      // Handle numeric sorting
      if (column === 'amount' || column === 'categoryId') {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }

      if (valueA < valueB) {
        return this.currentSort.direction === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.currentSort.direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  applyFilters() {
      this.filteredExpenses = this.expenses.filter(expense => {
      let passes = true;
      const expenseDate = new Date(expense.createdAt);
      const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

      if (startDate && expenseDate < startDate) return false;
      if (endDate && expenseDate > endDate) return false;

      // Category filter
      if (this.filters.category && expense.categoryId !== parseInt(this.filters.category)) {
        passes = false;
      }

      // Amount filters
      if (this.filters.minAmount && expense.amount < this.filters.minAmount) {
        passes = false;
      }
      if (this.filters.maxAmount && expense.amount > this.filters.maxAmount) {
        passes = false;
      }

      return passes;
    });

    // Re-apply sorting after filtering
    this.sortTable(this.currentSort.column);
  }

  openAddExpenseModal() {
    console.log("Opening Add Expense Modal");
    this.showAddExpenseModal = true; // Set flag to true to show modal
  }

  closeAddExpenseModal() {
    console.log("Closing Add Expense Modal");
    this.showAddExpenseModal = false; // Set flag to false to hide modal
    // Optionally clear any temporary messages in the modal
    // This is handled by the modal's closeModal method
  }

  onSaveNewExpense(expenseData: CreateExpenseRequest) {
    console.log("Saving new expense from modal:", expenseData);
    // This method is called when the user clicks "Ajouter la Dépense" in the modal
    // and the modal emits the validated data.

    this.loading = true; // Show loading indicator
    this.errorMessage = ''; // Clear previous errors

    // Call your ExpenseService to create the expense
    // Adjust the service method call based on your actual ExpenseService implementation
    // Assuming your ExpenseService has a create method that takes CreateExpenseData
    this.expenseService.create(expenseData).subscribe({
      next: (newExpense: Expense) => {
        this.loading = false;
        console.log("Expense created successfully:", newExpense);
        // Add the new expense to the local list
        this.expenses.push(newExpense);
        this.filteredExpenses = [...this.expenses]; // Update filtered list
        this.applyFilters(); // Re-apply filters/sorting
        // Close the modal
        this.closeAddExpenseModal();
        // Show success message if desired (could be handled in modal too)
        // this.successMessage = 'Dépense ajoutée avec succès !';
      },
      error: (error) => {
        this.loading = false;
        console.error("Error creating expense:", error);
        // Handle error, show message in the main component or let modal handle it
        this.errorMessage = error.message || 'Erreur lors de la création de la dépense.';
        // Keep the modal open so the user can correct errors
      }
    });
  }

  deleteExpense(id: number) {
    console.log('🗑️ Attempting to delete expense with ID:', id);

  if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
    this.loading = true;
    this.expenseService.delete(id.toString()).subscribe({
      next: () => {
        this.loading = false;
        console.log(`Dépense ${id} supprimée avec succès`);
        this.loadExpenses();
      },
      error: (error) => {
        this.loading = false;
        console.error(`Error deleting expense ${id}:`, error);
        this.errorMessage = 'Erreur lors de la suppression de la dépense.';
      }
    });
  }
}

}