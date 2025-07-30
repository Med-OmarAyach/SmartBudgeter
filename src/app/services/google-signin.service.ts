// google-signin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleSigninService {
  private clientId = '803637816834-c34gnvoou8i92o9u3lj5936cb6j4f54u.apps.googleusercontent.com';
  private initialized = false;

  initialize() {
    if (this.initialized) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderButton();
    document.head.appendChild(script);
    this.initialized = true;
  }
  constructor(private http: HttpClient, private router: Router) {}
  renderButton() {
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse,
    });

    const button = document.getElementById('google-button');
    if (button) {
      window.google.accounts.id.renderButton(
        button,
  {
    theme: 'filled_blue',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    logo_alignment: 'left',
    width: 15000,
  }


      );
    } else {
      console.error("Google Sign-In button element with id 'google-button' not found.");
    }
  }
handleCredentialResponse = (response: any) => {
  console.log('Credential:', response);

  this.http.post('http://localhost:8080/api/auth/google-signin', {
    idToken: response.credential,
  }).subscribe({
    next: (res: any) => {
    console.log('Login success:', res);

      // ✅ Save to localStorage
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Optionally navigate or emit success
      this.router.navigate(['/b']); // or wherever you want
    },
    error: (err) => {
      console.error('Login failed:', err);
    }
  });
}
}