// budget.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  AddSpendingRequest,
  BudgetSummary,
  AlertSettings
} from '../models/budget.model'; // Adjust path if needed
import { AuthService } from './auth.service'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly apiUrl = 'http://localhost:8083/api/budgets';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // --- Helper method to get common headers (Authorization) ---
  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // --- Updated/Corrected Service Methods ---

  // Create budget - Send data, let backend associate with user
  // Calls backend endpoint: POST /api/budgets
  create(request: CreateBudgetRequest): Observable<Budget> {
    const headers = this.getHeaders();
    console.log('Creating budget with ', request);
    return this.http.post<Budget>(this.apiUrl, request, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get budgets for the CURRENT user - Use the dedicated endpoint
  // Calls backend endpoint: GET /api/budgets/user
  getCurrentUserBudgets(): Observable<Budget[]> {
    const headers = this.getHeaders();
    return this.http.get<Budget[]>(`${this.apiUrl}/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get a specific budget by ID (backend will check ownership)
  // Calls backend endpoint: GET /api/budgets/{id}
  getById(id: string): Observable<Budget> {
    const headers = this.getHeaders();
    return this.http.get<Budget>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update a specific budget by ID (backend will check ownership)
  // Calls backend endpoint: PUT /api/budgets/{id}
  update(id: string, request: UpdateBudgetRequest): Observable<Budget> {
    const headers = this.getHeaders();
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, request, { headers })
      .pipe(catchError(this.handleError));
  }

  // Add spending to a budget (backend will check ownership of the budget)
  // Calls backend endpoint: POST /api/budgets/{id}/spend
  addSpending(id: string, request: AddSpendingRequest): Observable<Budget> {
    const headers = this.getHeaders();
    return this.http.post<Budget>(`${this.apiUrl}/${id}/spend`, request, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a specific budget by ID (backend will check ownership)
  // Calls backend endpoint: DELETE /api/budgets/{id}
  delete(id: string): Observable<void> {
    const headers = this.getHeaders();
    console.log('Deleting budget with ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get over-budget budgets for the CURRENT user
  // Calls backend endpoint: GET /api/budgets/over-budget/user
  getOverBudgetByUserId(): Observable<Budget[]> {
    const headers = this.getHeaders();
    return this.http.get<Budget[]>(`${this.apiUrl}/over-budget/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get budget summary for the CURRENT user
  // Calls backend endpoint: GET /api/budgets/summary/user
  getBudgetSummary(): Observable<BudgetSummary> {
    const headers = this.getHeaders();
    return this.http.get<BudgetSummary>(`${this.apiUrl}/summary/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // --- This is the method that was likely causing issues ---
  // Get category summary for the CURRENT user
  // Calls backend endpoint: GET /api/categories/summary/user
  // NOTE: This calls the CATEGORIES endpoint, not BUDGETS endpoint.
  getCategorySummaryForUser(): Observable<any[]> { // Use a more specific type if possible
    const headers = this.getHeaders();
    // --- FIXED URL ---
    // Changed from `${this.apiUrl}/categories/summary/user/${userId}` (incorrect, old)
    // To the correct endpoint for current user's category summary
    return this.http.get<any[]>(`http://localhost:8083/api/categories/summary/user`, { headers })
      .pipe(catchError(this.handleError));
  }
  // --- End of fix ---

  saveAlertSettings(alertSettings: AlertSettings): Observable<void> {
    const headers = this.getHeaders();
    // Backend should associate these settings with the user from the JWT
    return this.http.post<void>(`${this.apiUrl}/alert-settings`, alertSettings, { headers })
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 0) {
      errorMessage = 'Network error or client-side issue.';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden. You might not have permission for this budget/category.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('BudgetService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
