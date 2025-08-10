// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assumes AuthService provides getAuthHeaders
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8083/api/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/me`, {
    headers: this.authService.getAuthHeaders()
  });
}

}
