import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  Budget, 
  CreateBudgetRequest, 
  UpdateBudgetRequest, 
  AddSpendingRequest, 
  BudgetSummary 
} from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
private readonly apiUrl = 'http://localhost:8080/api/budgets';

  constructor(private http: HttpClient) {}

  // Create budget
  create(request: CreateBudgetRequest): Observable<Budget> {
    const payload = {
      categoryId: request.category_id,
      monthlyLimit: request.monthlyLimit
    };
    console.log('Creating budget with payload:', payload);
    return this.http.post<Budget>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  // Get all budgets
  getAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get budget by ID
  getById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get budgets by user
getCurrentUserBudgets(): Observable<Budget[]> {
  return this.http.get<Budget[]>(`${this.apiUrl}/user`)
    .pipe(catchError(this.handleError));
}



  // Get budgets by category
  getByCategoryId(categoryId: string): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(catchError(this.handleError));
  }


  // Add spending to budget
  addSpending(id: string, request: AddSpendingRequest): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${id}/spend`, request)
      .pipe(catchError(this.handleError));
  }

  // Delete budget
delete(id: string): Observable<void> {
    console.log('Deleting budget with ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  // Get over-budget budgets
  getOverBudget(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/over-budget`)
      .pipe(catchError(this.handleError));
  }

  // Get over-budget budgets by user
  getOverBudgetByUserId(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/over-budget/user`)
      .pipe(catchError(this.handleError));
  }

  // Get budget summary for user
  getBudgetSummary(): Observable<BudgetSummary> {
    return this.http.get<BudgetSummary>(`${this.apiUrl}/summary/user`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 200) {
      errorMessage = 'operation successful';
    }
    else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('BudgetService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}