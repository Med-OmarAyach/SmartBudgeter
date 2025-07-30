// balance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiUrl = 'http://localhost:8083/api'; // Adjust to your API URL

  constructor(private http: HttpClient) { }

  getBalance(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/register/balance/${userId}`);
  }
  getMonthlyExpenses(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/expenses/last-month-total/${userId}`);
  }

  updateBalance(userId: number, newBalance: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/register/balance/${userId}`, newBalance);
  }
}