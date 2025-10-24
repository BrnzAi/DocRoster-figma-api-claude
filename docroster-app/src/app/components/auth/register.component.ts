import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './data-access/auth.service';
import { FileUploadService } from './data-access/file-upload.service';
import { AuthButtonsComponent } from './ui/auth-buttons.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthButtonsComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  profileImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional field
      terms: [true, [Validators.requiredTrue]] // Checked by default
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get terms() {
    return this.registerForm.get('terms');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      if (!this.terms?.value) {
        this.errorMessage = 'Please accept the Terms and Conditions';
      }
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { name, email } = this.registerForm.value;
    // For demo, use a default password
    const password = 'password123';

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        this.errorMessage = error?.message || 'Registration failed';
      }
    });
  }

  signInWithGoogle(): void {
    this.loading = true;
    const mockEmail = 'google.user@example.com';
    this.authService.login({ email: mockEmail, password: 'password123' }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.message || 'Google sign-in failed';
      }
    });
  }

  signInWithApple(): void {
    this.loading = true;
    const mockEmail = 'apple.user@example.com';
    this.authService.login({ email: mockEmail, password: 'password123' }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.message || 'Apple sign-in failed';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Handle profile image upload
   */
  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      this.fileUploadService.uploadFile(file, 'profile').subscribe({
        next: (result) => {
          if (result.success && result.url) {
            this.profileImageUrl = result.url;
          } else {
            this.errorMessage = result.error || 'Failed to upload image';
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage = 'Failed to upload image';
        }
      });
    }
  }

  /**
   * Trigger file input click
   */
  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput?.click();
  }
}
