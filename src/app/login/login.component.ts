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
            <label for="displayName">displayName</label>
            <input
              type="text"
              id="displayName"
              formControlName="displayName"
              placeholder="Enter your displayName"
              [class.error]="loginForm.get('displayName')?.invalid && loginForm.get('displayName')?.touched"
            />
            <div *ngIf="loginForm.get('displayName')?.invalid && loginForm.get('displayName')?.touched" class="error-message">
              <span *ngIf="loginForm.get('displayName')?.errors?.['required']">displayName is required</span>
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
  styleUrls: ["./login.component.css"]
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
      displayName: ['', Validators.required],
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
        displayName: this.loginForm.get('displayName')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.signIn(loginData).subscribe({
        next: (response) => {
          this.authService.storeAuthData(response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid displayName or password';
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