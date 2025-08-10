import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Reminder {
  reminderId: number;
  title: string | null;
  message: string | null;
  dueDate: string | null; 
  completed: boolean;
  createdAt?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:8083/api/reminders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/user`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createReminder(reminder: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, reminder, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateReminder(id: number, reminder: Reminder): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
