import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginRequest {
  displayName: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number; 
  displayName: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8083/api/auth'; // adjust to your backend URL

  constructor(private http: HttpClient) {}

  signIn(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, data);
  } 

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: token });
  }

  googleSignIn(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-signin`, { idToken });
  }
   //Store user authentication data (tokens and ID) in localStorage
  storeAuthData(response: AuthResponse): void {
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    // Store the user ID
    if (response.userId) {
      localStorage.setItem('currentUserId', response.userId.toString());
    }
    // Store display name 
     if (response.displayName) {
      localStorage.setItem('currentUserdisplayName', response.displayName);
    }
  }

  
  // Clear all user authentication data from localStorage
   
  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserdisplayName'); 
  }

  /*
    Get the stored access token
   returns The access token string or null
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /*
    Get the stored refresh token
    returns The refresh token string or null
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /*
    Get the stored user ID
    returns The user ID number or null
   */
  getCurrentUserId(): number | null {
    const userIdStr = localStorage.getItem('currentUserId');
    if (userIdStr) {
      const userId = parseInt(userIdStr, 10);
      // Basic validation
      if (!isNaN(userId)) {
        return userId;
      }
    }
    return null;
  }

  /*
    Check if the user appears to be logged in (has an access token)
    Note: This doesn't validate the token's expiry or validity on the backend.
    returns True if an access token exists, false otherwise
   */
  isUserLoggedIn(): boolean {
    return !!this.getAccessToken(); // Returns true if token exists
  }

  /*
   Get the Authorization header value for HTTP requests
   returns HttpHeaders object with Authorization header, or empty headers
   */
  // Consider moving this to a separate HttpInterceptor for better practice
  // Inside your AuthService class

// --- Corrected getAuthHeaders method ---
getAuthHeaders(): HttpHeaders { // <-- Use the imported type directly
    const token = this.getAccessToken();
    let headers = new HttpHeaders(); // <-- Use the imported class directly
    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
}
logout(): Observable<void> {
    console.log('AuthService: Initiating logout...');

    // 1. Clear local authentication data (tokens, user ID)
    this.clearAuthData();
    console.log('AuthService: Local authentication data cleared.');
return new Observable(observer => {
      // Everything local is done at this point
      observer.complete(); // Signal completion
      console.log('AuthService: Logout process (local cleanup) completed.');
    });
}
}