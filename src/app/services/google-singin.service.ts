import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Declare google types
declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSigninService {
  private clientId = '803637816834-c34gnvoou8i92o9u3lj5936cb6j4f54u.apps.googleusercontent.com';
  private initialized = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone
  ) {}

  initialize() {
    if (this.initialized) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.ngZone.run(() => {
        this.renderButton();
      });
    };
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.head.appendChild(script);
    this.initialized = true;
  }

  private renderButton() {
    if (typeof window === 'undefined' || !window.google) {
      console.error('Google Sign-In library not loaded');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
      });

      const button = document.getElementById('google-button');
      if (button) {
        window.google.accounts.id.renderButton(
          button,
          {
            type: 'standard', // ✅ Added required 'type' property
            theme: 'filled_blue',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 300
          }
        );
      } else {
        console.error("Google Sign-In button element with id 'google-button' not found.");
      }
    } catch (error) {
      console.error('Error rendering Google Sign-In button:', error);
    }
  }

  handleCredentialResponse = (response: any) => {
    console.log('Credential:', response);

    if (!response.credential) {
      console.error('No credential received from Google');
      return;
    }

    this.http.post('http://localhost:8083/api/auth/google-signin', {
      idToken: response.credential,
    }).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);

        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}