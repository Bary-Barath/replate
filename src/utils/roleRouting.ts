import type { AuthUser, UserRole } from '../types';

export const getRoleHome = (user: AuthUser | null) => {
  if (!user) return '/auth/sign-in';
  if (user.role === 'admin') return '/admin/dashboard';
  if (user.role === 'seller') return user.verificationStatus === 'verified' ? '/seller/dashboard' : '/seller/verification';
  return '/customer/dashboard';
};

export const canAccessRole = (user: AuthUser | null, roles?: UserRole[]) => Boolean(user && (!roles || roles.includes(user.role)));
