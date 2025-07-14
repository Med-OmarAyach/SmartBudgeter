import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetConfig } from '../models/budget.model';
import { Category } from '../models/category.model';
@Component({
  selector: 'app-budget-config-modal',
  imports: [FormsModule,CommonModule],
  standalone: true,
  templateUrl: './budget-config-modal-component.component.html',
  styleUrls: ['./budget-config-modal-component.component.css'],
})
export class BudgetConfigModalComponent {
  @Input() isOpen = false;
  @Input() categories: Category[] = [];
  @Input() existingBudgets: BudgetConfig[] = [];
  @Input() userId: string = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{budgets: BudgetConfig[], alertSettings: any}>();
  
  budgetConfigs: BudgetConfig[] = [];
  selectedCategoryId = '';
  newBudgetLimit = 0;
  
  alertSettings = {
    emailNotifications: true,
    pushNotifications: false,
    warningThreshold: 80
  };
  
  ngOnInit() {
    this.initializeBudgetConfigs();
  }
  
  ngOnChanges() {
    if (this.isOpen) {
      this.initializeBudgetConfigs();
    }
  }
  
  initializeBudgetConfigs() {
    this.budgetConfigs = [...this.existingBudgets];
  }
  
  get availableCategories(): Category[] {
    const usedCategoryIds = this.budgetConfigs.map(b => b.category_id);
    return this.categories.filter(cat => !usedCategoryIds.includes(cat.id));
  }
  
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  }
  
  addBudgetCategory() {
    if (this.selectedCategoryId && this.newBudgetLimit > 0) {
      const newBudget: BudgetConfig = {
        category_id: this.selectedCategoryId,
        user_id: this.userId,
        monthly_limit: this.newBudgetLimit,
        created_at: new Date()
      };
      
      this.budgetConfigs.push(newBudget);
      this.selectedCategoryId = '';
      this.newBudgetLimit = 0;
    }
  }
  
  removeBudgetCategory(categoryId: string) {
    this.budgetConfigs = this.budgetConfigs.filter(b => b.category_id !== categoryId);
  }
  
  trackByCategory(index: number, item: BudgetConfig): string {
    return item.category_id;
  }
  
  closeModal() {
    this.close.emit();
  }
  
  onSubmit() {
    const validBudgets = this.budgetConfigs.filter(b => b.monthly_limit > 0);
    
    this.save.emit({
      budgets: validBudgets,
      alertSettings: this.alertSettings
    });
    
    this.closeModal();
  }
}