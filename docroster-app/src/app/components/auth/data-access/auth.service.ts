import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = computed(() => this.currentUserSignal());
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);

  // Mock users database
  private mockUsers: Map<string, { password: string; user: User }> = new Map([
    ['demo@docroster.com', {
      password: 'password123',
      user: {
        id: '1',
        email: 'demo@docroster.com',
        name: 'Demo User',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'user',
        createdAt: new Date('2024-01-01')
      }
    }],
    ['specialist@docroster.com', {
      password: 'specialist123',
      user: {
        id: '2',
        email: 'specialist@docroster.com',
        name: 'Dr. Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'specialist',
        createdAt: new Date('2024-01-01')
      }
    }]
  ]);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  /**
   * Login with email and password
   * Accepts any valid email format and any password (for demo purposes)
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return of(null).pipe(
      delay(500), // Simulate network delay
      map(() => {
        // Check if user exists in mock database
        const mockUser = this.mockUsers.get(request.email);
        
        if (mockUser && mockUser.password === request.password) {
          return { user: mockUser.user, token: this.generateMockToken() };
        }
        
        // For any other email, accept if it's a valid email format
        if (this.isValidEmail(request.email) && request.password.length >= 6) {
          const newUser: User = {
            id: Date.now().toString(),
            email: request.email,
            name: this.extractNameFromEmail(request.email),
            avatar: `https://i.pravatar.cc/150?u=${request.email}`,
            role: 'user',
            createdAt: new Date()
          };
          return { user: newUser, token: this.generateMockToken() };
        }
        
        throw new Error('Invalid email or password');
      }),
      tap(response => {
        this.setCurrentUser(response.user, response.token);
      })
    );
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return of(null).pipe(
      delay(500),
      map(() => {
        // Check if user already exists
        if (this.mockUsers.has(request.email)) {
          throw new Error('User already exists');
        }

        if (!this.isValidEmail(request.email)) {
          throw new Error('Invalid email format');
        }

        if (request.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const newUser: User = {
          id: Date.now().toString(),
          email: request.email,
          name: request.name,
          avatar: `https://i.pravatar.cc/150?u=${request.email}`,
          role: 'user',
          createdAt: new Date()
        };

        return { user: newUser, token: this.generateMockToken() };
      }),
      tap(response => {
        this.setCurrentUser(response.user, response.token);
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get current user from signal
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.currentUserSignal() !== null;
  }

  // Private helper methods

  private setCurrentUser(user: User, token: string): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
  }

  private generateMockToken(): string {
    return 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private extractNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
