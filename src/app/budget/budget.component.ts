import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetConfigModalComponent } from '../budget-config-modal-component/budget-config-modal-component.component';
interface Budget {
  id: string;
  category: string;
  category_id: string;
  budget: number;
  spent: number;
  user_id: string;
  created_at: Date;
}
interface Category {
  id: string;
  name: string;
}

interface BudgetConfig {
  id?: string;
  category_id: string;
  user_id: string;
  monthly_limit: number;
  created_at?: Date;
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule,BudgetConfigModalComponent],
  templateUrl: './budget.component.html',
   styleUrls: ['./budget.component.css']
})

export class BudgetComponent {
 

  ngAfterViewInit() {
    (window as any).lucide.createIcons();
  }

  showConfigModal = false;
  currentUserId = 'user123'; // This should come from your auth service
  
  // Sample data - replace with actual data from your service
  budgets: Budget[] = [
    {
      id: '1',
      category: 'Alimentation',
      category_id: 'cat1',
      budget: 500,
      spent: 350,
      user_id: 'user123',
      created_at: new Date()
    },
    {
      id: '2',
      category: 'Transport',
      category_id: 'cat2',
      budget: 200,
      spent: 180,
      user_id: 'user123',
      created_at: new Date()
    },
    {
      id: '3',
      category: 'Loisirs',
      category_id: 'cat3',
      budget: 300,
      spent: 320,
      user_id: 'user123',
      created_at: new Date()
    }
  ];
  
  categories: Category[] = [
    { id: 'cat1', name: 'Alimentation' },
    { id: 'cat2', name: 'Transport' },
    { id: 'cat3', name: 'Loisirs' },
    { id: 'cat4', name: 'Santé' },
    { id: 'cat5', name: 'Logement' },
    { id: 'cat6', name: 'Vêtements' },
    { id: 'cat7', name: 'Éducation' },
    { id: 'cat8', name: 'Divertissement' }
  ];
  
  existingBudgetConfigs: BudgetConfig[] = [
    {
      id: '1',
      category_id: 'cat1',
      user_id: 'user123',
      monthly_limit: 500,
      created_at: new Date()
    },
    {
      id: '2',
      category_id: 'cat2',
      user_id: 'user123',
      monthly_limit: 200,
      created_at: new Date()
    }
  ];
  
  openConfigModal() {
    this.showConfigModal = true;
  }
  
  closeConfigModal() {
    this.showConfigModal = false;
  }
  
  saveBudgetConfig(data: {budgets: BudgetConfig[], alertSettings: any}) {
    console.log('Saving budget configuration:', data);
    
    // Here you would typically call your service to save the data
    // this.budgetService.saveBudgetConfigs(data.budgets);
    // this.alertService.saveAlertSettings(data.alertSettings);
    
    // Update the existing budget configs
    this.existingBudgetConfigs = data.budgets;
    
    // Update the budgets display data
    this.updateBudgetsFromConfigs(data.budgets);
    
    // Show success message
    console.log('Budget configuration saved successfully!');
  }
  
  private updateBudgetsFromConfigs(configs: BudgetConfig[]) {
    // Update existing budgets or create new ones based on configs
    configs.forEach(config => {
      const existingBudget = this.budgets.find(b => b.category_id === config.category_id);
      const categoryName = this.categories.find(c => c.id === config.category_id)?.name || 'Unknown';
      
      if (existingBudget) {
        existingBudget.budget = config.monthly_limit;
      } else {
        // Create new budget entry
        this.budgets.push({
          id: Math.random().toString(36).substr(2, 9),
          category: categoryName,
          category_id: config.category_id,
          budget: config.monthly_limit,
          spent: 0,
          user_id: config.user_id,
          created_at: new Date()
        });
      }
    });
    
    // Remove budgets that are no longer in configs
    this.budgets = this.budgets.filter(budget => 
      configs.some(config => config.category_id === budget.category_id)
    );
  }

}