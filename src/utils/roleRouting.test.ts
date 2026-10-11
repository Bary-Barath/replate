import { describe, expect, it } from 'vitest';
import type { AuthUser } from '../types';
import { canAccessRole, getRoleHome } from './roleRouting';

const user = (role: AuthUser['role'], verificationStatus?: AuthUser['verificationStatus']): AuthUser => ({ id: role, role, name: role, email: `${role}@demo.test`, verificationStatus });

describe('role routing', () => {
  it('redirects each role to its correct experience', () => {
    expect(getRoleHome(null)).toBe('/auth/sign-in');
    expect(getRoleHome(user('customer'))).toBe('/customer/dashboard');
    expect(getRoleHome(user('seller', 'verified'))).toBe('/seller/dashboard');
    expect(getRoleHome(user('seller', 'pending'))).toBe('/seller/verification');
    expect(getRoleHome(user('admin'))).toBe('/admin/dashboard');
  });

  it('does not grant seller access to customers', () => {
    expect(canAccessRole(user('customer'), ['seller'])).toBe(false);
    expect(canAccessRole(user('seller', 'verified'), ['seller'])).toBe(true);
  });
});
