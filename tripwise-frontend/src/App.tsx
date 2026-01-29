'use client';

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkStatusBanner from '@/components/NetworkStatusBanner';
import ValidationErrors from '@/components/ValidationErrors';
import SuccessToast from '@/components/SuccessToast';
import WelcomeToast from '@/components/WelcomeToast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { useProfileStore } from '@/store/profileStore';
import { useSessionRecovery } from '@/hooks/useSessionRecovery';

import { useShallow } from 'zustand/react/shallow';

// Import page components
import PlanWelcomePage from '@/app/plan/page';
import StepPage from '@/app/plan/step/[stepId]/page';
import ConfirmationPage from '@/app/plan/confirmation/page';
import Landing from '@/pages/Landing';
import ChattingPage from '@/pages/ChattingPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import AuthPage from '@/pages/auth/AuthPage';
import WizardLayout from '@/features/wizard/WizardLayout';

export default function App() {
  const { error, isLoading } = useProfileStore(useShallow(state => ({
    error: state.error,
    isLoading: state.isLoading
  })));
  const { recoverSession } = useSessionRecovery({ enableAutoRecovery: true });

  useEffect(() => {
    recoverSession();
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo, componentStack) => {
        console.error('App Error Boundary caught:', error, errorInfo);
      }}
    >
      <div className="relative min-h-screen font-sans selection:bg-primary/10">
        <LiquidBackground />
        <NetworkStatusBanner />

        <main className="relative z-10">
          <ValidationErrors
            errors={error ? { general: error } : {}}
            onDismiss={(field) => {
              if (error && typeof error === 'object' && (error as any).field === field) {
                console.log(`Dismissed error for field: ${field}`);
              }
            }}
          />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChattingPage />} />
              <Route path="/plan" element={<PlanWelcomePage />} />
              <Route path="/plan/step/:stepId" element={<StepPage />} />
              <Route path="/plan/confirmation" element={<ConfirmationPage />} />
              <Route path="/wizard" element={<WizardLayout />} />
            </Route>
          </Routes>
        </main>

        <WelcomeToast />

        <SuccessToast
          show={isLoading}
          message="Processing..."
        />
      </div>
    </ErrorBoundary>
  );
}
