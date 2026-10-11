import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types';
import { useAuth } from '../context/useAuth';
import { canAccessRole, getRoleHome } from '../utils/roleRouting';

export const RequireAuth = ({ roles, children }: { roles?: UserRole[]; children?: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={`/auth/sign-in?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (roles && !canAccessRole(user, roles)) return <Navigate to={getRoleHome(user)} replace />;
  return children ? <>{children}</> : <Outlet />;
};

export const RequireVerifiedSeller = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/sign-in?redirect=/seller/dashboard" replace />;
  if (user.role !== 'seller') return <Navigate to={getRoleHome(user)} replace />;
  if (user.verificationStatus !== 'verified') return <Navigate to="/seller/verification" replace />;
  return children ? <>{children}</> : <Outlet />;
};

export const AuthLandingRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={getRoleHome(user)} replace />;
};
