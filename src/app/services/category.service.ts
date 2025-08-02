import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8083/api/categories';

  constructor(private http: HttpClient) {}

  // Create category
  create(request: CreateCategoryRequest): Observable<Category> {
    const payload = {
      name: request.name,
    };
    return this.http.post<Category>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get category by ID
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get categories by user
  getByUserId(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  // Update category
  update(id: string, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, request)
      .pipe(catchError(this.handleError));
  }

  // Delete category
  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Search categories by name
  searchByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search`, {
      params: { name }
    }).pipe(catchError(this.handleError));
  }

  // Search categories by user and name
  searchByUserIdAndName( name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search/user`, {
      params: { name }
    }).pipe(catchError(this.handleError));
  }

  // Get categories with active budgets
  getCategoriesWithActiveBudgets(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/with-budgets`)
      .pipe(catchError(this.handleError));
  }

  // Get categories without budgets for user
  getCategoriesWithoutBudgets(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/without-budgets/user`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('CategoryService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}