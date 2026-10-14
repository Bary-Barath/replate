import { createContext } from 'react';
import type { AuthUser, SellerVerificationStatus, UserRole } from '../types';

export interface CustomerRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface SellerRegistration {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  category: string;
  phone: string;
  address: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isSupabaseConfigured: boolean;
  isDemoMode: boolean;
  signInDemo: (role: UserRole, verificationStatus?: SellerVerificationStatus) => void;
  registerCustomerDemo: (details: CustomerRegistration) => void;
  registerSellerDemo: (details: SellerRegistration) => void;
  signUpWithSupabase: (
    email: string,
    password: string,
    name: string,
    role?: UserRole,
    sellerData?: Partial<SellerRegistration>
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
