export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'specialist' | 'admin';
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
