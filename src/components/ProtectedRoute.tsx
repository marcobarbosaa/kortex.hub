import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  /** Se true, não redireciona para onboarding (usado nas próprias rotas de onboarding) */
  skipOnboardingGuard?: boolean;
};

export const ProtectedRoute = ({ children, requireAdmin = false, skipOnboardingGuard = false }: ProtectedRouteProps) => {
  // BYPASS TEMPORÁRIO PARA VISUALIZAÇÃO SEM LOGIN
  return <>{children}</>;

  return <>{children}</>;
};
