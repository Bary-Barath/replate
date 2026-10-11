import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, SellerVerificationStatus, UserRole } from '../types';
import { AuthContext } from './authContext';
import type { CustomerRegistration, SellerRegistration } from './authContext';

const AUTH_STORAGE_KEY = 'replate-demo-auth-v1';

const createDemoUser = (role: UserRole, verificationStatus: SellerVerificationStatus = 'verified'): AuthUser => {
  if (role === 'seller') return {
    id: verificationStatus === 'verified' ? 'demo-seller' : 'demo-seller-pending',
    role,
    name: verificationStatus === 'verified' ? 'FreshBake Bakery' : 'New Seller Account',
    email: verificationStatus === 'verified' ? 'seller@replate.demo' : 'pending-seller@replate.demo',
    businessName: verificationStatus === 'verified' ? 'FreshBake Bakery' : 'New Seller Account',
    businessCategory: 'Bakery',
    businessAddress: '12 Market Street',
    verificationStatus,
  };
  if (role === 'admin') return { id: 'demo-admin', role, name: 'RePlate Admin', email: 'admin@replate.demo' };
  return { id: 'demo-customer', role: 'customer', name: 'Demo Customer', email: 'customer@replate.demo', phone: '+91 98765 43210' };
};

const readUser = (): AuthUser | null => {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) as AuthUser : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readUser);

  useEffect(() => {
    if (user) window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const signInDemo = (role: UserRole, verificationStatus: SellerVerificationStatus = 'verified') => {
    setUser(createDemoUser(role, verificationStatus));
  };

  const registerCustomerDemo = (details: CustomerRegistration) => {
    setUser({ id: `customer-${Date.now()}`, role: 'customer', name: details.name, email: details.email, phone: details.phone });
  };

  const registerSellerDemo = (details: SellerRegistration) => {
    setUser({ id: `seller-${Date.now()}`, role: 'seller', name: details.ownerName, email: details.email, phone: details.phone, businessName: details.businessName, businessCategory: details.category, businessAddress: details.address, verificationStatus: 'pending' });
  };

  return <AuthContext.Provider value={{ user, isDemoMode: true, signInDemo, registerCustomerDemo, registerSellerDemo, signOut: () => setUser(null) }}>{children}</AuthContext.Provider>;
};
