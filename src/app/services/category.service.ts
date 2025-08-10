// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Adjust path if needed
import { Category } from '../models/category.model'; // Adjust path if needed

// Define interfaces for structured responses if not already done
interface CategorySummary {
  categoryName: string;
  categoryId: number;
  totalAmount: number;
  expenseCount: number;
}

interface CategoryWithExpenses {
  category: Category;
  expenses: any[]; // Define a proper Expense model
  totalAmount: number;
  expenseCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8083/api/categories';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // --- Helper method to get common headers (Authorization) ---
  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Create a new category for the current user
  create(category: { name: string }): Observable<Category> {
    const headers = this.getHeaders();
    // The backend will associate the category with the user from the JWT
    return this.http.post<Category>(this.apiUrl, category, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get all categories for the CURRENT user
  // Calls backend endpoint: GET /api/categories/user
  getAllForCurrentUser(): Observable<Category[]> {
    const headers = this.getHeaders();
    return this.http.get<Category[]>(`${this.apiUrl}/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get a specific category by ID (backend checks ownership)
  // Calls backend endpoint: GET /api/categories/{id}
  getById(id: number): Observable<Category> {
    const headers = this.getHeaders();
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update a specific category by ID (backend checks ownership)
  // Calls backend endpoint: PUT /api/categories/{id}
  update(id: number, category: Partial<Category>): Observable<Category> {
     const headers = this.getHeaders();
     return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers })
       .pipe(catchError(this.handleError));
   }

  // Delete a specific category by ID (backend checks ownership)
  // Calls backend endpoint: DELETE /api/categories/{id}
  delete(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get category summary for the CURRENT user
  // Calls backend endpoint: GET /api/categories/summary/user
  getSummaryForCurrentUser(): Observable<CategorySummary[]> {
    const headers = this.getHeaders();
    return this.http.get<CategorySummary[]>(`${this.apiUrl}/summary/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get a specific category with its expenses (backend checks ownership)
  // Calls backend endpoint: GET /api/categories/{id}/expenses
  getCategoryWithExpenses(id: number): Observable<CategoryWithExpenses> {
    const headers = this.getHeaders();
    return this.http.get<CategoryWithExpenses>(`${this.apiUrl}/${id}/expenses`, { headers })
      .pipe(catchError(this.handleError));
  }

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
      `CategoryService Error:\n  Status: ${error.status}\n  Message: ${errorMessage}\n  URL: ${error.url}\n  Details:`,
      error
    );

    return throwError(() => new Error(errorMessage));
  }
}
