// src/app/components/expense-modal/expense-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model'; // Adjust path
import { CreateExpenseRequest } from '../../models/expense.model';
import { ExpenseService } from 'app/services/expense.service';
// Define a simple interface for the data needed to create an expense
export interface CreateExpenseData {
  categoryId: number;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD format
}

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Ajouter une Dépense</h2>
          <button class="close-btn" (click)="closeModal()" type="button" [disabled]="isLoading">
            <svg *ngIf="!isLoading" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div *ngIf="isLoading" class="spinner-small"></div>
          </button>
        </div>

        <div class="alert alert-error" *ngIf="errorMessage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #expenseForm="ngForm" class="expense-form">
          <div class="form-group">
            <label for="categoryId">Catégorie *</label>
            <select
              id="categoryId"
              name="categoryId"
              [(ngModel)]="formData.category_id"
              class="form-control"
              required
              [disabled]="isLoading">
              <option value="">Sélectionner une catégorie</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
            <div *ngIf="expenseForm.submitted && !formData.category_id" class="error-message">
              La catégorie est requise.
            </div>
          </div>

          <div class="form-group">
            <label for="amount">Montant *</label>
            <div class="input-group">
              <input
                type="number"
                id="amount"
                name="amount"
                [(ngModel)]="formData.amount"
                class="form-control"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
                [disabled]="isLoading">
              <span class="input-suffix">€</span>
            </div>
            <div *ngIf="expenseForm.submitted && (formData.amount === null || formData.amount <= 0)" class="error-message">
              Le montant doit être supérieur à zéro.
            </div>
          </div>

          <div class="form-group">
            <label for="note">note</label>
            <input
              type="text"
              id="note"
              name="note"
              [(ngModel)]="formData.note"
              class="form-control"
              placeholder="Entrez une note (facultatif)"
              [disabled]="isLoading">
          </div>

          <div class="form-group">
            <label for="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              [(ngModel)]="formData.date"
              class="form-control"
              required
              [disabled]="isLoading">
            <div *ngIf="expenseForm.submitted && !formData.date" class="error-message">
              La date est requise.
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="closeModal()" [disabled]="isLoading">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="isLoading || !expenseForm.form.valid">
              <span *ngIf="!isLoading">Ajouter la Dépense</span>
              <span *ngIf="isLoading" class="loading">
                <div class="spinner-small"></div>
                Ajout en cours...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000; /* High z-index to appear on top */
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover:not(:disabled) {
      background-color: #f1f5f9;
    }

    .close-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .alert {
      padding: 0.75rem 1rem;
      margin: 1rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .alert-error {
      background-color: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .expense-form {
      padding: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: #334155;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .form-control:disabled {
      background-color: #f1f5f9;
      cursor: not-allowed;
    }

    .input-group {
      display: flex;
      align-items: center;
    }

    .input-suffix {
      margin-left: -2rem;
      padding: 0.5rem;
      color: #64748b;
      pointer-events: none;
    }

    .error-message {
      color: #b91c1c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .btn-outline:hover:not(:disabled) {
      background-color: #f1f5f9;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner-small {
      width: 1rem;
      height: 1rem;
      border: 2px solid #e2e8f0;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .modal-content {
        width: 95%;
        margin: 1rem;
      }
    }
  `]
})
export class ExpenseModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = []; // List of categories for the dropdown
  @Output() save = new EventEmitter<CreateExpenseRequest>(); // Emit the expense data on save
  @Output() close = new EventEmitter<void>(); // Emit close event
constructor(public expenseserice: ExpenseService) {}
  formData: {
  category_id: number;
  amount: number;
  note: string;
  date: string;
} = {
  category_id: 0,
  amount: 0,
  note: '',
  date: ''
};


  isLoading = false;
  errorMessage = '';

  // ExpenseService is injected via the constructor above

  ngOnInit() {
    // Set default date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    this.formData.date = `${year}-${month}-${day}`;
    console.log('ExpenseModal initialized with default date:', this.formData.date);
  }

  closeModal() {
    console.log('Closing expense modal.');
    this.clearMessages();
    this.resetForm();
    this.close.emit(); // Notify parent component to close the modal
  }

  onSubmit() {
  console.log('Submitting expense form:', this.formData);
  this.clearMessages();

  if (!this.formData.category_id || this.formData.category_id <= 0) {
    this.errorMessage = 'Choose a category.';
    return;
  }

  if (!this.formData.amount || this.formData.amount <= 0) {
    this.errorMessage = 'The amount must be greater than 0.';
    return;
  }

  if (!this.formData.date) {
    this.errorMessage = 'Date is required.';
    return;
  }

  // ✅ Fix: wrap category_id as { id: number }
  const expenseDataToEmit: CreateExpenseRequest = {
    category: { id: this.formData.category_id },
    amount: this.formData.amount,
    note: this.formData.note,
    date: this.formData.date
  };

  console.log('Emitting expense data:', expenseDataToEmit);
  this.save.emit(expenseDataToEmit); // This goes to parent component
}


  private resetForm() {
    // Reset form data to initial state (except date)
    this.formData = {
      category_id: 0,
      amount: 0,
      note: '',
      date: this.formData.date // Keep the current date or reset to today if needed
    };
    
  }

  private clearMessages() {
    this.errorMessage = '';
  }
}