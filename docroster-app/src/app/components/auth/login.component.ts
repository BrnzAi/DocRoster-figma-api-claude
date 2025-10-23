import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  // Google Maps configuration for background
  mapOptions: google.maps.MapOptions = {
    center: { lat: 49.2827, lng: -123.1207 }, // Vancouver
    zoom: 12,
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'none', // Disable map interactions
    mapId: environment.googleMapsMapId,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

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
        this.errorMessage = error.message || 'Invalid email or password';
      }
    });
  }

  // Quick login helpers for demo
  loginAsUser(): void {
    this.loginForm.patchValue({
      email: 'demo@docroster.com',
      password: 'password123'
    });
    this.onSubmit();
  }

  loginAsSpecialist(): void {
    this.loginForm.patchValue({
      email: 'specialist@docroster.com',
      password: 'specialist123'
    });
    this.onSubmit();
  }
}
