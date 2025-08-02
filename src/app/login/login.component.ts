import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GoogleSigninService } from '../services/google-singin.service';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>

        <div *ngIf="errorMessage" class="server-error-message">
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              placeholder="Enter your username"
              [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            />
            <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error-message">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" formControlName="rememberMe">
              <span class="checkmark"></span>
              Remember me
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            class="login-button"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading" class="loading">
              <div class="spinner"></div>
              Signing in...
            </span>
          </button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

         <div class="gclass"><div id="google-button"></div></div>


        <div class="signup-link">
          Don't have an account? <a href="/register">Sign up</a>
        </div>  
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: absolute;
      top: 0;
      left:0;
      min-height: 100vh;
      min-width: 100vw;
      background: #121621;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
    }
    .gclass{
  display: flex;
justify-content: center
}

    .login-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h2 {
      color: white;
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .login-header p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 14px;
    }

    .login-form {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: white;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .form-group input:focus {
      outline: none;
      border-color: white;
      background: rgba(255, 255, 255, 0.15);
    }

    .form-group input.error {
      border-color: #ff6b6b;
    }

    .error-message {
      color: #ff6b6b;
      font-size: 12px;
      margin-top: 4px;
    }

    .server-error-message {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid #ff6b6b;
      border-radius: 8px;
      padding: 12px;
      color: #ff6b6b;
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      cursor: pointer;
    }

    .checkbox-container input {
      margin-right: 8px;
      width: auto;
    }

    .forgot-password {
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: opacity 0.3s ease;
    }

    .forgot-password:hover {
      opacity: 0.8;
    }

    .login-button, .google-button {
      width: 100%;
      padding: 12px;
      background: white;
      color: #121621;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .google-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .login-button:hover:not(:disabled), .google-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .google-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
    }

    .login-button:disabled, .google-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #121621;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .divider {
      text-align: center;
      margin: 24px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }

    .divider span {
      background: #121621;
      color: rgba(255, 255, 255, 0.7);
      padding: 0 16px;
      font-size: 14px;
      position: relative;
    }

    .signup-link {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    .signup-link a {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
      }

      .login-header h2 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router, private googleSignin: GoogleSigninService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.loginForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.errorMessage = null; // Clear error message when user starts typing
    });

    
      }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const loginData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.signIn(loginData).subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          if (this.loginForm.get('rememberMe')?.value) {
            localStorage.setItem('refreshToken', response.refreshToken);
          } else {
            sessionStorage.setItem('refreshToken', response.refreshToken);
          }
          this.isLoading = false;
          this.router.navigate(['/budget']);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          }
          console.error('Login error:', error);
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  
 ngOnInit(): void {
  this.googleSignin.initialize();
}

  
  
}