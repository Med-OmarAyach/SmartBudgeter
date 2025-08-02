import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { AlertSettings, BudgetConfig, CreateBudgetRequest } from '../models/budget.model';
import { CategoryService } from '../services/category.service';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-config-modal',
  templateUrl: './budget-config-modal-component.component.html',
  styleUrls: ['./budget-config-modal-component.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BudgetConfigModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = [];
  @Input() existingBudgets: BudgetConfig[] = [];
  @Output() save = new EventEmitter<{ budgets: BudgetConfig[]; alertSettings: AlertSettings }>();
    @Output() close = new EventEmitter<void>();

  budgetConfigs: BudgetConfig[] = [];
  availableCategories: Category[] = [];
  selectedCategoryId: string = '';
  customCategoryName: string = '';
  newBudgetLimit: number | null = null;
  alertSettings = {
    warningThreshold: 75
  };
  successMessage = '';
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    // Deep copy to prevent mutations to input
    this.budgetConfigs = JSON.parse(JSON.stringify(this.existingBudgets));
    if (this.categories.length > 0) {
      this.availableCategories = this.categories.filter(
        cat => !this.budgetConfigs.some(b => b.category_id === cat.id)
      );
      console.log('Available categories from input:', this.availableCategories);
    } else {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.categoryService.getCategoriesWithoutBudgets().subscribe({
      next: (categories) => {
        this.availableCategories = categories.filter(
          cat => !this.budgetConfigs.some(b => b.category_id === cat.id)
        );
        console.log('Available categories from API:', this.availableCategories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorMessage = 'Erreur lors du chargement des catégories';
        this.availableCategories = [];
      }
    });
  }

  trackByCategory(index: number, config: BudgetConfig): number {
    return config.category_id;
  }

  getCategoryName(categoryId: number): string {
    let category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      category = this.availableCategories.find(c => c.id === categoryId);
    }
    return category ? category.name : 'Inconnu';
  }

  onCategoryChange() {
    if (this.selectedCategoryId) {
      this.customCategoryName = '';
    }
    this.clearMessages();
    console.log('Selected category ID:', this.selectedCategoryId, 'Custom category:', this.customCategoryName);
  }

  addBudgetCategory() {
    if (!(this.selectedCategoryId || this.customCategoryName) || !this.newBudgetLimit) {
      this.errorMessage = 'Veuillez sélectionner une catégorie et définir une limite';
      return;
    }

    this.clearMessages();

    if (this.customCategoryName) {
      console.log('Creating new category:', this.customCategoryName);
      this.categoryService.create({ name: this.customCategoryName })
        .subscribe({
          next: (newCategory) => {
            this.createBudget(newCategory.id, this.newBudgetLimit!);
            this.categories.push(newCategory);
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.errorMessage = 'Erreur lors de la création de la catégorie';
          }
        });
    } else {
      this.createBudget(+this.selectedCategoryId, this.newBudgetLimit!);
      this.availableCategories = this.availableCategories.filter(c => c.id !== +this.selectedCategoryId);
    }
  }

  private createBudget(categoryId: number, monthlyLimit: number) {
    const request: CreateBudgetRequest = {
      category_id: categoryId,
      monthlyLimit: monthlyLimit
    };

    this.budgetService.create(request).subscribe({
      next: (budget) => {
        // Add new budget without overwriting existing ones
        this.budgetConfigs = [
          ...this.budgetConfigs,
          { 
            category_id: budget.categoryId, 
            monthlyLimit: budget.monthlyLimit 
          }
        ];
        
        this.successMessage = 'Budget ajouté avec succès !';
        this.resetForm();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
        console.log('Budget created:', budget);
      },
      error: (err) => {
        console.error('Error creating budget:', err);
        this.errorMessage = 'Erreur lors de la création du budget';
      }
    });
  }

  removeBudgetCategory(categoryId: number) {
    // Call API to delete the budget
    this.budgetService.delete(categoryId.toString()).subscribe({
      next: () => {
        // Remove from budgetConfigs
        this.budgetConfigs = this.budgetConfigs.filter(c => c.category_id !== categoryId);
        
        // Add back to available categories
        const category = this.categories.find(c => c.id === categoryId);
        if (category && !this.availableCategories.some(c => c.id === categoryId)) {
          this.availableCategories.push(category);
        }
        
        this.successMessage = 'Budget supprimé avec succès !';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error deleting budget:', err);
        this.errorMessage = 'Erreur lors de la suppression du budget';
      }
    });
  }

  resetForm() {
    this.selectedCategoryId = '';
    this.customCategoryName = '';
    this.newBudgetLimit = null;
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal() {
    this.clearMessages();
          console.log('Saving budgets:', this.budgetConfigs),

    this.save.emit({ 
      budgets: [...this.budgetConfigs], // Send a copy to prevent mutations
      alertSettings: { ...this.alertSettings }
    });
    this.close.emit();
  }
}