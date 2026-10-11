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
  isDemoMode: true;
  signInDemo: (role: UserRole, verificationStatus?: SellerVerificationStatus) => void;
  registerCustomerDemo: (details: CustomerRegistration) => void;
  registerSellerDemo: (details: SellerRegistration) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
