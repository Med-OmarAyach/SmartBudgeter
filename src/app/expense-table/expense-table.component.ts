import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.model';

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content fade-in-up">
      <div class="page-header">
        <h1 class="page-title">Historique des Dépenses</h1>
        <button class="btn btn-primary" (click)="openAddExpenseModal()">
          <i data-lucide="plus"></i>
          Ajouter une Dépense
        </button>
      </div>

      <div class="card">
        <div class="filters">
          <div class="filter-group">
            <label>Date de début</label>
            <input type="date" class="form-control" [(ngModel)]="filters.startDate" (ngModelChange)="applyFilters()">
          </div>
          <div class="filter-group">
            <label>Date de fin</label>
            <input type="date" class="form-control" [(ngModel)]="filters.endDate" (ngModelChange)="applyFilters()">
          </div>
          <div class="filter-group">
            <label>Catégorie</label>
            <select class="form-control" [(ngModel)]="filters.category" (ngModelChange)="applyFilters()">
              <option value="">Toutes les catégories</option>
              <option value="alimentation">Alimentation</option>
              <option value="transport">Transport</option>
              <option value="loisirs">Loisirs</option>
              <option value="sante">Santé</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Montant minimum</label>
            <input type="number" class="form-control" [(ngModel)]="filters.minAmount" placeholder="0" (ngModelChange)="applyFilters()">
          </div>
          <div class="filter-group">
            <label>Montant maximum</label>
            <input type="number" class="form-control" [(ngModel)]="filters.maxAmount" placeholder="1000" (ngModelChange)="applyFilters()">
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th (click)="sortTable('date')">Date <i data-lucide="arrow-up-down"></i></th>
                <th (click)="sortTable('description')">Description <i data-lucide="arrow-up-down"></i></th>
                <th (click)="sortTable('category')">Catégorie <i data-lucide="arrow-up-down"></i></th>
                <th (click)="sortTable('amount')">Montant <i data-lucide="arrow-up-down"></i></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of filteredExpenses">
                <td>{{ expense.date }}</td>
                <td>{{ expense.description }}</td>
                <td>{{ expense.category }}</td>
                <td>{{ expense.amount | number:'1.2-2' }} €</td>
                <td>
                  <button class="btn btn-secondary" (click)="editExpense(expense.id)">
                    <i data-lucide="edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #121621, #121621);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 2px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, #121621, #121621);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.9);
        color: #64748b;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .btn-secondary:hover {
        background: white;
        transform: translateY(-1px);
      }

      .card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .filter-group label {
        font-weight: 600;
        color: #64748b;
        font-size: 0.9rem;
      }

      .form-control {
        padding: 0.75rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
      }

      .form-control:focus {
        outline: none;
        border-color: #121621;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .table-container {
        overflow-x: auto;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      .table th {
        background: linear-gradient(135deg, #121621, #121621);
        color: white;
        padding: 1rem 1.5rem;
        text-align: left;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .table th:hover {
        background: linear-gradient(135deg, #635BFF, #635BFF);
      }

      .table td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
      }

      .table tbody tr:hover {
        background: rgba(102, 126, 234, 0.05);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .filters {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ExpensetableComponent {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  filters = {
    startDate: '',
    endDate: '',
    category: '',
    minAmount: 0,
    maxAmount: 1000,
  };
  currentSort = { column: 'date' as keyof Expense, direction: 'desc' };

  //constructor(private expenseService: ExpenseService) {
    //this.expenses = this.expenseService.getExpenses();
    //this.filteredExpenses = [...this.expenses];
  //}

  ngAfterViewInit() {
    (window as any).lucide.createIcons();
  }

  sortTable(column: keyof Expense) {
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    this.filteredExpenses.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === 'amount') {
        valueA = parseFloat(valueA as any);
        valueB = parseFloat(valueB as any);
      }

      return this.currentSort.direction === 'asc'
        ? valueA > valueB ? 1 : -1
        : valueA < valueB ? 1 : -1;
    });
  }

  applyFilters() {
    this.filteredExpenses = this.expenses.filter(expense => {
      let passes = true;

      if (this.filters.startDate && expense.date < this.filters.startDate) {
        passes = false;
      }
      if (this.filters.endDate && expense.date > this.filters.endDate) {
        passes = false;
      }
      if (this.filters.category && expense.category !== this.filters.category) {
        passes = false;
      }
      if (this.filters.minAmount && expense.amount < this.filters.minAmount) {
        passes = false;
      }
      if (this.filters.maxAmount && expense.amount > this.filters.maxAmount) {
        passes = false;
      }

      return passes;
    });
  }

  openAddExpenseModal() {
    alert("Ouverture du modal d'ajout de dépense");
  }

  editExpense(id: number) {
    alert(`Édition de la dépense ${id}`);
  }
}