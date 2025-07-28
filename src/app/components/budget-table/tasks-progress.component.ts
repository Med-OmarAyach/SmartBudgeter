// tasks-progress.component.ts
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-tasks-progress',
  template: `
    <mat-card>
      <mat-card-content>
        <div class="progress-header">
          <div>
            <p class="label">Budget Used</p>
            <h4>{{ value }}%</h4>
          </div>
          <mat-icon class="avatar-icon" color="warn">list</mat-icon>
        </div>
        <mat-progress-bar [value]="value" mode="determinate"></mat-progress-bar>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .label {
      font-size: 0.75rem;
      color: gray;
      margin: 0;
    }
    .avatar-icon {
      font-size: 32px;
      background: #ffcc00;
      border-radius: 50%;
      padding: 12px;
    }
  `],
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule, MatCardModule]
})
export class TasksProgressComponent {
  @Input() value = 0;
}
