import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, HttpClientModule],
  templateUrl: './sign-in-form.component.html',
  styleUrl: './sign-in-form.component.css',
})
export class SignInFormComponent {

  signInForm: FormGroup;
  showPassword = false;
  isPending = false;
  errorMessage: string | null = null;
showConfirmPassword: any;
successMessage: any;
getPasswordStrengthClass(): string {
  // TODO: Implement real logic
  return 'weak';
}
signInWithGoogle() {}
getPasswordStrengthText(): string {
  // Return strength text
  return 'Weak'; // Replace with real logic if needed
}

toggleConfirmPasswordVisibility(): void { }
signUpWithGoogle(): void { }

  constructor(private fb: FormBuilder ,private auth: AuthService) {
  this.signInForm = this.fb.group({
    email: ['sofia@devias.io', [Validators.required, Validators.email]],
    password: ['Secret1', [Validators.required]],
  });
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

async onSubmit() {
  if (this.signInForm.invalid) return;

  this.isPending = true;
  this.errorMessage = null;

  const { email, password } = this.signInForm.value;

  this.auth.signIn({ username: email, password }).subscribe({
    next: (res) => {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
    },
    error: (err) => {
      this.errorMessage = err.error || 'Login failed';
      this.isPending = false;
    }
  });
}
}
