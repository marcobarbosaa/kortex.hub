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
  const { session, profile, isLoading } = useAuth();
  const location = useLocation();
  const { status, getRedirectPath } = useOnboardingGuard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-8 h-8 border-4 border-[#ff4d00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    // Redireciona para o login e salva de onde o usuário tentou vir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    // Se a rota exige admin e o usuário não é, manda pro dashboard de cliente
    return <Navigate to="/cliente" replace />;
  }

  // Guard de onboarding: redireciona para a etapa correta se não completou
  if (!skipOnboardingGuard && !requireAdmin) {
    const redirectPath = getRedirectPath();
    const currentPath = location.pathname;

    // Só redireciona se não está já na rota correta
    if (status === 'not_started' && !currentPath.startsWith('/onboarding')) {
      return <Navigate to={redirectPath} replace />;
    }
    if (status === 'onboarding_done' && !currentPath.startsWith('/onboarding/setup')) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};
