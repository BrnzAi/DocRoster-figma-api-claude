import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './data-access/auth.service';
import { AuthButtonsComponent } from './ui/auth-buttons.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthButtonsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        this.errorMessage = error?.message || 'Invalid email or password';
      }
    });
  }

  // Social login methods (mock implementations)
  signInWithGoogle(): void {
    // Mock Google sign-in - in production this would use Firebase Auth or similar
    this.loading = true;
    const mockEmail = 'google.user@example.com';
    this.authService.login({ email: mockEmail, password: 'password123' }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Google sign-in failed';
      }
    });
  }

  signInWithApple(): void {
    // Mock Apple sign-in - in production this would use Apple Sign In SDK
    this.loading = true;
    const mockEmail = 'apple.user@example.com';
    this.authService.login({ email: mockEmail, password: 'password123' }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Apple sign-in failed';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToRecover(): void {
    this.router.navigate(['/auth/recover']);
  }
}
