import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, SellerVerificationStatus, UserRole } from '../types';
import { AuthContext } from './authContext';
import type { CustomerRegistration, SellerRegistration } from './authContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_STORAGE_KEY = 'replate-auth-session-v2';

const createDemoUser = (role: UserRole, verificationStatus: SellerVerificationStatus = 'verified'): AuthUser => {
  if (role === 'seller') {
    return {
      id: verificationStatus === 'verified' ? 'demo-seller' : 'demo-seller-pending',
      role,
      name: verificationStatus === 'verified' ? 'FreshBake Bakery' : 'New Seller Account',
      email: verificationStatus === 'verified' ? 'seller@replate.demo' : 'pending-seller@replate.demo',
      businessName: verificationStatus === 'verified' ? 'FreshBake Bakery' : 'New Seller Account',
      businessCategory: 'Bakery',
      businessAddress: '12 Market Street',
      verificationStatus,
    };
  }
  if (role === 'admin') {
    return {
      id: 'demo-admin',
      role: 'admin',
      name: 'RePlate Administrator',
      email: 'admin@replate.demo',
    };
  }
  return {
    id: 'demo-customer',
    role: 'customer',
    name: 'Demo Customer',
    email: 'customer@replate.demo',
    phone: '+91 98765 43210',
  };
};

const readLocalUser = (): AuthUser | null => {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readLocalUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupabaseProfile = useCallback(async (userId: string, email: string): Promise<AuthUser | null> => {
    if (!supabase) return null;
    try {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('Error fetching Supabase profile:', profileErr.message);
        return null;
      }

      if (!profile) return null;

      // Authoritative role from database
      const role = (profile.role as UserRole) || 'customer';
      let businessData: { businessName?: string; businessCategory?: string; businessAddress?: string; verificationStatus?: SellerVerificationStatus } = {};

      if (role === 'seller') {
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', userId)
          .maybeSingle();

        if (business) {
          businessData = {
            businessName: business.name,
            businessCategory: business.category,
            businessAddress: business.address,
            verificationStatus: business.verification_status as SellerVerificationStatus,
          };
        }
      }

      return {
        id: profile.id,
        role,
        name: profile.name || email.split('@')[0],
        email: profile.email || email,
        phone: profile.phone || undefined,
        ...businessData,
      };
    } catch (err: unknown) {
      console.error('Failed to load user profile from database:', err);
      return null;
    }
  }, []);

  // Initialize Supabase auth listener
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profileUser = await fetchSupabaseProfile(session.user.id, session.user.email || '');
          if (profileUser && mounted) {
            setUser(profileUser);
          }
        }
      } catch (err) {
        console.warn('Supabase auth initialization:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profileUser = await fetchSupabaseProfile(session.user.id, session.user.email || '');
          if (mounted) setUser(profileUser);
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [fetchSupabaseProfile]);

  // Persist user in localStorage for demo fallback
  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Demo Sign-in
  const signInDemo = (role: UserRole, verificationStatus: SellerVerificationStatus = 'verified') => {
    setError(null);
    const demoUser = createDemoUser(role, verificationStatus);
    setUser(demoUser);
  };

  const registerCustomerDemo = (details: CustomerRegistration) => {
    setError(null);
    setUser({
      id: `customer-${Date.now()}`,
      role: 'customer',
      name: details.name,
      email: details.email,
      phone: details.phone,
    });
  };

  const registerSellerDemo = (details: SellerRegistration) => {
    setError(null);
    setUser({
      id: `seller-${Date.now()}`,
      role: 'seller',
      name: details.ownerName,
      email: details.email,
      phone: details.phone,
      businessName: details.businessName,
      businessCategory: details.category,
      businessAddress: details.address,
      verificationStatus: 'pending',
    });
  };

  // Real Supabase Auth: Sign Up
  const signUpWithSupabase = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'customer',
    sellerData?: Partial<SellerRegistration>
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      if (role === 'seller' && sellerData) {
        registerSellerDemo({
          email,
          password,
          ownerName: name,
          businessName: sellerData.businessName || name,
          category: sellerData.category || 'Bakery',
          phone: sellerData.phone || '',
          address: sellerData.address || '',
        });
      } else {
        registerCustomerDemo({ email, password, name, phone: sellerData?.phone || '' });
      }
      return { success: true };
    }

    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: role === 'admin' ? 'customer' : role }, // Client cannot self-promote to admin
        },
      });

      if (authErr) {
        setError(authErr.message);
        return { success: false, error: authErr.message };
      }

      if (authData.user) {
        const userId = authData.user.id;
        const assignedRole: UserRole = role === 'admin' ? 'customer' : role;

        // Upsert user profile
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: userId,
          name,
          email,
          phone: sellerData?.phone || null,
          role: assignedRole,
        });

        if (profileErr) {
          console.warn('Error creating user profile in Supabase:', profileErr.message);
        }

        // If registering as a seller, create pending business record
        if (assignedRole === 'seller' && sellerData) {
          await supabase.from('businesses').insert({
            owner_id: userId,
            name: sellerData.businessName || `${name}'s Store`,
            category: sellerData.category || 'Bakery',
            address: sellerData.address || 'Local Marketplace',
            phone: sellerData.phone || null,
            verification_status: 'pending',
          });
        }

        const profileUser = await fetchSupabaseProfile(userId, email);
        setUser(profileUser);
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Real Supabase Auth: Sign In
  const signInWithSupabase = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      // If demo mode or test credentials
      if (email.includes('admin')) {
        signInDemo('admin');
      } else if (email.includes('seller')) {
        signInDemo('seller');
      } else {
        signInDemo('customer');
      }
      return { success: true };
    }

    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        setError(signInErr.message);
        return { success: false, error: signInErr.message };
      }

      if (data.user) {
        const profileUser = await fetchSupabaseProfile(data.user.id, data.user.email || email);
        setUser(profileUser);
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Real Supabase Auth: Reset Password
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email);
      if (resetErr) {
        setError(resetErr.message);
        return { success: false, error: resetErr.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      return { success: false, error: msg };
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    // Prevent client-side role elevation
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.id;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            name: safeUpdates.name,
            phone: safeUpdates.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateErr) {
          return { success: false, error: updateErr.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Update failed';
        return { success: false, error: msg };
      }
    }

    setUser((prev) => (prev ? { ...prev, ...safeUpdates } : null));
    return { success: true };
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isSupabaseConfigured,
        isDemoMode: !isSupabaseConfigured,
        signInDemo,
        registerCustomerDemo,
        registerSellerDemo,
        signUpWithSupabase,
        signInWithSupabase,
        resetPassword,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
