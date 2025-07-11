import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content fade-in-up">
      <div class="page-header">
        <h1 class="page-title">Budget & Alertes</h1>
        <button class="btn btn-primary" (click)="openConfigModal()">
          <i data-lucide="settings"></i>
          Configurer
        </button>
      </div>

      <div class="budget-grid">
        <div class="budget-card" *ngFor="let budget of budgets">
          <div class="budget-header">
            <div class="category-name">{{ budget.category }}</div>
            <div class="budget-amount">{{ budget.budget | number:'1.2-2' }} €</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill"
                 [ngClass]="{
                   'warning': budget.spent / budget.budget > 0.8 && budget.spent / budget.budget <= 1,
                   'danger': budget.spent / budget.budget > 1
                 }"
                 [style.width.%]="(budget.spent / budget.budget) * 100"></div>
          </div>
          <div class="budget-stats">
            <span>Dépensé: {{ budget.spent | number:'1.2-2' }} €</span>
            <span>{{ budget.spent > budget.budget ? 'Dépassement' : 'Restant' }}: {{ (budget.budget - budget.spent) | number:'1.2-2' }} €</span>
          </div>
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

      .budget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .budget-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .budget-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .budget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .category-name {
        font-weight: 700;
        font-size: 1.1rem;
        color: #1e293b;
      }

      .budget-amount {
        font-weight: 600;
        color: #64748b;
      }

      .progress-bar {
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin: 1rem 0;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #059669);
        border-radius: 4px;
        transition: width 0.6s ease;
      }

      .progress-fill.warning {
        background: linear-gradient(90deg, #f59e0b, #d97706);
      }

      .progress-fill.danger {
        background: linear-gradient(90deg, #ef4444, #dc2626);
      }

      .budget-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: #64748b;
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

        .budget-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BudgetComponent {
  budgets = [
    { category: 'Alimentation', budget: 500, spent: 340 },
    { category: 'Transport', budget: 300, spent: 255 },
    { category: 'Loisirs', budget: 200, spent: 210 },
    { category: 'Santé', budget: 150, spent: 60 },
  ];

  ngAfterViewInit() {
    (window as any).lucide.createIcons();
  }

  openConfigModal() {
    alert('Ouverture du modal de configuration des budgets');
  }
}