import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BalanceService } from './balance.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Add balance-related properties
  currentBalance: number = 0;
  monthlyExpenses: number = 0;
  balanceLoading: boolean = true;
  expensesLoading: boolean = true;
  balanceError: string = '';
  expensesError: string = '';
  isEditingBalance: boolean = false;
  newBalanceInput: number = 0;
  

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
  public pieChartLabels: string[] = [];
  public pieChartData: any[] = [];
  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  // Use hash to generate consistent color per label
  private getColorForLabel(label: string): string {
    const hash = this.hashString(label);
    const r = (hash & 0xAF0070) >> 16;
    const g = (hash & 0x00FF01) >> 8;
    const b = hash & 0x0100FF;
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  }

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

  // REPLACE your current loadChartData() with this:
loadChartData(): void {
  const currentUserId = 1; // Get from your auth service
  this.balanceService.getCategorySummaryForUser().subscribe({
    next: (data) => {
      console.log('Raw API data:', data);
      
      if (data && data.length > 0) {
        const labels = data.map((item: any) => item.categoryName);
        const amounts = data.map((item: any) => item.totalAmount);
        const backgroundColors = labels.map((label: string) => this.getColorForLabel(label));
        
        this.pieChartLabels = labels;
        this.pieChartData = [{
          data: amounts,
          label: 'Expenses',
          backgroundColor: backgroundColors
        }];
        
        console.log('Chart labels:', this.pieChartLabels);
        console.log('Chart data:', this.pieChartData);
      } else {
        console.log('No data available for pie chart');
        // Handle empty data
        this.pieChartLabels = ['No Data'];
        this.pieChartData = [{
          data: [1],
          label: 'Expenses',
          backgroundColor: ['rgba(200, 200, 200, 0.6)']
        }];
      }
    },
    error: (error) => {
      console.error('Error loading chart data:', error);
      // Handle error case
      this.pieChartLabels = ['Error'];
      this.pieChartData = [{
        data: [1],
        label: 'Expenses',
        backgroundColor: ['rgba(255, 0, 0, 0.6)']
      }];
    }
  });
}
refreshChart(): void {
  this.loadChartData();
}
   constructor(private balanceService: BalanceService) {}

  ngOnInit() {
    this.loadAllData();
    this.loadChartData(); 
  }

  loadAllData() {
    const userId = 1; // Replace with actual user ID
    
    // Load balance
    this.balanceService.getBalance().subscribe({
      next: (balance: number) => {
        this.currentBalance = balance;
        this.newBalanceInput = balance;
        this.balanceLoading = false;
      },
      error: (error) => {
        console.error('Error fetching balance:', error);
        this.balanceError = 'Failed to load balance';
        this.balanceLoading = false;
      }
    });

    // Load monthly expenses
    this.balanceService.getMonthlyExpenses().subscribe({
      next: (expenses: number) => {
        this.monthlyExpenses = expenses;
        this.expensesLoading = false;
      },
      error: (error) => {
        console.error('Error fetching monthly expenses:', error);
        this.expensesError = 'Failed to load expenses';
        this.expensesLoading = false;
      }
    });
  }

  // Balance editing methods
  toggleEditBalance() {
    this.isEditingBalance = !this.isEditingBalance;
    if (this.isEditingBalance) {
      this.newBalanceInput = this.currentBalance;
    }
  }

  updateBalance() {
    const userId = 1;
    
    this.balanceService.updateBalance(this.newBalanceInput).subscribe({
      next: (user: any) => {
        this.currentBalance = this.newBalanceInput;
        this.isEditingBalance = false;
        console.log('Balance updated successfully');
      },
      error: (error) => {
        console.error('Error updating balance:', error);
        alert('Failed to update balance');
      }
    });
  }

  cancelEditBalance() {
    this.isEditingBalance = false;
    this.newBalanceInput = this.currentBalance;
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US').format(amount);
  }

  // Get status class for budget items
  getStatusClass(status: string): string {
    switch (status) {
      case 'under': return 'status-under';
      case 'over': return 'status-over';
      case 'on': return 'status-on';
      default: return '';
    }
  }
}