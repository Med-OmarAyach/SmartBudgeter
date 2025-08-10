// balance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiUrl = 'http://localhost:8083/api'; // Adjust to your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // --- Helper method to get the current user ID dynamically ---
  // This ensures you always get the latest ID from localStorage
  private getCurrentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  // --- Helper method to get common HTTP headers (including Authorization) ---
  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders(); // Use AuthService method
  }

  // --- Updated methods using dynamic user ID and correct endpoints ---

  getBalance(): Observable<number> {
  return this.http.get<number>(
    'http://localhost:8083/api/user/balance',
    { headers: this.authService.getAuthHeaders() } 
  );
}



  getMonthlyExpenses(): Observable<number> {
    const userId = this.getCurrentUserId(); // Get ID dynamically
    if (userId === null) {
      throw new Error('User ID not found. User might not be logged in.');
    }
    const headers = this.getHeaders(); // Get auth headers
    // Use the dynamic user ID in the URL
    return this.http.get<number>(`${this.apiUrl}/expenses/last-month-total/user`, { headers });
  }
updateBalance(newBalance: number): Observable<any> {
  const headers = this.authService.getAuthHeaders();
  return this.http.put(
    `${this.apiUrl}/user/balance`,
    newBalance, // raw number
    { headers }
  );
}

  // --- This is the method causing the 404 ---
  getCategorySummaryForUser(): Observable<any[]> {
    const userId = this.getCurrentUserId(); // Get ID dynamically
    if (userId === null) {
      throw new Error('User ID not found. User might not be logged in.');
    }
    const headers = this.getHeaders(); // Get auth headers

    return this.http.get<any[]>(`${this.apiUrl}/categories/summary/user`, { headers });
  }
}