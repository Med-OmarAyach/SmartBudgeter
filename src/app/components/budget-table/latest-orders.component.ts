// latest-orders.component.ts
import { Component, Input } from '@angular/core';

interface Order {
  category: string;
  spent: number;
  amount: number;
  status: 'under' | 'on' | 'over';
  left: number;
}

@Component({
  selector: 'app-latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.css']
})
export class LatestOrdersComponent {
  @Input() orders: Order[] = [];
    displayedColumns: string[] = ['category', 'spent', 'amount', 'left', 'status'];

    statusMap: Record<string, { label: string; color: string }> = {
    under: { label: 'Under Budget', color: 'primary' },
    on: { label: 'On Budget', color: 'accent' },
    over: { label: 'Over Budget', color: 'warn' },
    };
    getProgressColor(status: string): 'primary' | 'accent' | 'warn' {
  const map = {
    under: 'primary',
    on: 'accent',
    over: 'warn'
  };
  return map[status] || 'primary';
}

}
