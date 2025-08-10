// src/app/services/expense.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Adjust path if needed
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, AddSpendingRequest } from '../models/expense.model'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly apiUrl = 'http://localhost:8083/api/expenses'; // Base URL for expense endpoints

  constructor(private http: HttpClient, private authService: AuthService) {} // Inject HttpClient and AuthService

  // --- Helper method to get common headers (Authorization) ---
  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders(); // Use AuthService method to get Bearer token header
  }

  // --- Expense CRUD Operations ---

  // 1. Get all expenses for the CURRENT user
  getCurrentUserExpenses(): Observable<Expense[]> {
    const headers = this.getHeaders();
    // Calls backend endpoint: GET /api/expenses/user
    return this.http.get<Expense[]>(`${this.apiUrl}/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // 2. Get total expenses for the last month for the CURRENT user
  getLastMonthTotal(): Observable<number> {
    const headers = this.getHeaders();
    // Calls backend endpoint: GET /api/expenses/last-month-total/user
    // Assuming backend returns a plain number or a JSON object like { total: 123.45 }
    // Adjust return type and extraction logic if needed.
    return this.http.get<number>(`${this.apiUrl}/last-month-total/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // 3. Create a new expense for the CURRENT user
  create(expenseData: CreateExpenseRequest): Observable<Expense> {
    const headers = this.getHeaders();
    // Calls backend endpoint: POST /api/expenses
    // Backend should associate the new expense with the user from the JWT token
    return this.http.post<Expense>(this.apiUrl, expenseData, { headers })
      .pipe(catchError(this.handleError));
  }

  // 4. Update an existing expense (Backend checks ownership)
  update(id: string, expenseData: UpdateExpenseRequest): Observable<Expense> {
    const headers = this.getHeaders();
    // Calls backend endpoint: PUT /api/expenses/{id}
    // Backend should verify the expense belongs to the user from the JWT token
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expenseData, { headers })
      .pipe(catchError(this.handleError));
  }

  // 5. Delete an existing expense (Backend checks ownership)
  delete(id: string): Observable<void> {
  const headers = this.authService.getAuthHeaders();
  return this.http.delete<void>(`http://localhost:8083/api/expenses/${id}`, { headers });
}

  // 6. Add spending to an expense (if applicable, might be budget-related)
  // If this is indeed for expenses, adjust the endpoint accordingly.
  // If it's for budgets, put it in BudgetService.
  addSpending(id: string, requestData: AddSpendingRequest): Observable<Expense> {
    const headers = this.getHeaders();
    // Calls backend endpoint: POST /api/expenses/{id}/spend
    // Backend should verify the expense belongs to the user from the JWT token
    // Adjust endpoint if it's actually for budgets
    return this.http.post<Expense>(`${this.apiUrl}/${id}/spend`, requestData, { headers })
      .pipe(catchError(this.handleError));
  }

  // --- Error Handling ---
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side (HTTP) error
      switch (error.status) {
        case 0:
          errorMessage = 'Network error or server is unreachable. Please check your connection.';
          break;
        case 400:
          errorMessage = `Bad Request: ${error.error?.message || 'The request was invalid.'}`;
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again.';
          // Consider triggering a logout
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource could not be found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Something went wrong on the server.';
          break;
        // Add other cases as needed
        default:
          errorMessage = error.error?.message || `Server Error Code: ${error.status}\nMessage: ${error.message}`;
          break;
      }
    }

    console.error(
      `ExpenseService Error:\n  Status: ${error.status}\n  Message: ${errorMessage}\n  URL: ${error.url}\n  Details:`,
      error
    );

    return throwError(() => new Error(errorMessage));
  }
  // --- End of Error Handling ---
}