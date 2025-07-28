// budget-progress.component.ts
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'app-budget-progress',
  template: `
    <div>
      <mat-progress-bar
        [value]="percent"
        [color]="percent >= 100 ? 'warn' : 'primary'"
        mode="determinate"
        class="budget-bar"
      ></mat-progress-bar>
      <p class="caption">{{ percent.toFixed(0) }}% of your budget used</p>
    </div>
  `,
  styles: [`
    .budget-bar {
      height: 12px;
      border-radius: 6px;
    }
    .caption {
      text-align: right;
      margin-top: 4px;
      font-size: 0.75rem;
      color: gray;
    }
  `],
    standalone: true,

  imports: [MatProgressBarModule]
})
export class BudgetProgressComponent {
  @Input() spent = 0;
  @Input() limit = 100;

  get percent(): number {
    return Math.min((this.spent / this.limit) * 100, 100);
  }
}
