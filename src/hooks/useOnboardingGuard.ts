import { useAuth } from '@/components/AuthProvider';

export type OnboardingStatus = 'not_started' | 'onboarding_done' | 'setup_done' | 'complete';

export function useOnboardingGuard() {
  const { user } = useAuth();
  const metadata = user?.user_metadata || {};

  const getStatus = (): OnboardingStatus => {
    if (metadata.setup_completed) return 'complete';
    if (metadata.onboarding_completed) return 'setup_done';
    if (metadata.company_type) return 'onboarding_done';
    return 'not_started';
  };

  const status = getStatus();

  const onboardingData = {
    companyType: metadata.company_type || null,
    mainPain: metadata.main_pain || null,
    mainGoal: metadata.main_goal || null,
    setupBalance: metadata.setup_balance || null,
    setupFirstEntry: metadata.setup_first_entry || false,
    servicesUnlocked: metadata.services_unlocked || 2,
    insightsGenerated: metadata.insights_generated || 0,
    isPremium: metadata.is_premium || false,
    sessionCount: metadata.session_count || 0,
  };

  const getRedirectPath = (): string => {
    switch (status) {
      case 'not_started': return '/onboarding';
      case 'onboarding_done': return '/onboarding/setup';
      case 'setup_done': return '/cliente';
      case 'complete': return '/cliente';
      default: return '/onboarding';
    }
  };

  return {
    status,
    onboardingData,
    getRedirectPath,
    isOnboardingComplete: status === 'complete' || status === 'setup_done',
  };
}
