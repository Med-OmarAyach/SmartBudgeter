import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Bar Chart Configuration
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [65, 59, 80, 81, 56, 65, 59, 80, 81, 56, 100, 15], label: 'This year', backgroundColor: 'rgba(113, 4, 255, 0.6)' },
    { data: [35, 59, 8, 51, 56, 75, 59, 50, 81, 36, 10, 95], label: 'Last year', backgroundColor: 'rgba(76, 52, 109, 0.6)' }
  ];
  public orders = [
  {
    category: 'Groceries',
    spent: 180,
    amount: 200,
    status: 'under',
    left: 20
  },
  {
    category: 'Utilities',
    spent: 100,
    amount: 100,
    status: 'on',
    left: 0
  },
  {
    category: 'Entertainment',
    spent: 250,
    amount: 200,
    status: 'over',
    left: -50
  },
  {
    category: 'Transport',
    spent: 90,
    amount: 120,
    status: 'under',
    left: 30
  },
  {
    category: 'Dining Out',
    spent: 130,
    amount: 100,
    status: 'over',
    left: -30
  }
];


  // Pie Chart Configuration
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public pieChartData: any[] = [
    {
      data: [300, 500, 100],
      label: 'Sales',
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
    },
  ];
}