// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GoogleSigninService } from '../services/google-singin.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>Create Account</h2>
          <p>Join us today and get started</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              placeholder="Choose a username"
              [class.error]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
            />
            <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="error-message">
              <span *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</span>
              <span *ngIf="registerForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</span>
              <span *ngIf="registerForm.get('username')?.errors?.['maxlength']">Username must not exceed 20 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Create a password"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            />
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="familyName">Family Name <span class="optional">(optional)</span></label>
            <input
              type="text"
              id="familyName"
              formControlName="familyName"
              placeholder="Enter family name"
              [class.error]="registerForm.get('familyName')?.invalid && registerForm.get('familyName')?.touched"
            />
            <div *ngIf="registerForm.get('familyName')?.invalid && registerForm.get('familyName')?.touched" class="error-message">
              <span *ngIf="registerForm.get('familyName')?.errors?.['maxlength']">Family name must not exceed 50 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="familyMember">Number of Family Members <span class="optional">(optional)</span></label>
            <input
              type="number"
              id="familyMember"
              formControlName="familyMember"
              placeholder="Enter number of family members"
              min="1"
              max="50"
              [class.error]="registerForm.get('familyMember')?.invalid && registerForm.get('familyMember')?.touched"
            />
            <div *ngIf="registerForm.get('familyMember')?.invalid && registerForm.get('familyMember')?.touched" class="error-message">
              <span *ngIf="registerForm.get('familyMember')?.errors?.['min']">Number must be at least 1</span>
              <span *ngIf="registerForm.get('familyMember')?.errors?.['max']">Number must not exceed 50</span>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-container">
              <input type="checkbox" formControlName="acceptTerms">
              <span class="checkmark"></span>
              I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
            </label>
            <div *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched" class="error-message">
              <span>You must accept the terms and conditions</span>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div *ngIf="errorMessage" class="alert error-alert">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="alert success-alert">
            {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="register-button"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading" class="loading">
              <div class="spinner"></div>
              Creating account...
            </span>
          </button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

    
<!-- In your component HTML -->
 <div class="gclass"><div id="google-button"></div></div>


        <div class="login-link">
          Already have an account? <a href="/login" class="link">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      position: absolute;
      top: 0;
      min-height: 120vh;
      min-width:120vw;
      background: #121621;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
    }

    .register-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .register-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .register-header h2 {
      color: white;
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .register-header p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 14px;
    }

    .register-form {
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

    .optional {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 400;
      font-size: 12px;
    }

    .form-group input[type="number"] {
      -moz-appearance: textfield;
    }

    .form-group input[type="number"]::-webkit-outer-spin-button,
    .form-group input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .checkbox-group {
      margin-bottom: 24px;
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      cursor: pointer;
      line-height: 1.5;
    }

    .checkbox-container input {
      margin-right: 8px;
      margin-top: 2px;
      width: auto;
      flex-shrink: 0;
    }

    .link {
      color: white;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .error-alert {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
    }

    .success-alert {
      background: rgba(107, 207, 127, 0.1);
      border: 1px solid rgba(107, 207, 127, 0.3);
      color: #6bcf7f;
    }

    .register-button {
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

    .register-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .register-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
.gclass{
  display: flex;
justify-content: center
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

    .google-button {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .google-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .google-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .register-card {
        padding: 24px;
      }

      .register-header h2 {
        font-size: 24px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private apiUrl = 'http://localhost:8083/api/auth'; // Adjust to your API URL

  constructor(private fb: FormBuilder, private http: HttpClient, private googleSignin: GoogleSigninService) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      familyName: ['', [Validators.maxLength(50)]],
      familyMember: ['', [Validators.min(1), Validators.max(50)]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    return null; // Removed since we don't have confirmPassword field
  }

  // Removed password strength methods since we're using simpler validation

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const registerData = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        familyName: this.registerForm.value.familyName || null,
        familyMember: this.registerForm.value.familyMember || null
      };

      this.http.post(`${this.apiUrl}/register`, registerData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.successMessage = response;
            this.registerForm.reset();
            // Optionally redirect to login page after successful registration
            // this.router.navigate(['/login']);
          },
          error: (error) => {
            this.isLoading = false;
            if (error.status === 409) {
              this.errorMessage = error.error;
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  signUpWithGoogle() {
    console.log('Google sign-up clicked');
    // Implement Google OAuth here
  }

 ngOnInit(): void {
  this.googleSignin.initialize();
}
}