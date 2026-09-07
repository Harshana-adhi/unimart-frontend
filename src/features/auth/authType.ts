// src/features/auth/authType.ts
export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export interface AuthUser {
  id: number;
  universityEmail: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  universityEmail: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface TokenResponse {
  accessToken: string;
  expiresInMinutes: number;
  userId: number;
  universityEmail: string;
  fullName: string;
  role: Role;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
}
