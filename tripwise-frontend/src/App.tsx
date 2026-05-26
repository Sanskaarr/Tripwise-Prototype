import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkStatusBanner from '@/components/NetworkStatusBanner';
import ValidationErrors from '@/components/ValidationErrors';
import WelcomeToast from '@/components/WelcomeToast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { useProfileStore } from '@/store/profileStore';

import { useShallow } from 'zustand/react/shallow';

// Import page components
import PlanWelcomePage from '@/app/plan/page';
import StepPage from '@/app/plan/step/[stepId]/page';
import ConfirmationPage from '@/app/plan/confirmation/page';
import Landing from '@/pages/Landing';
import ConversationalWizard from '@/pages/ConversationalWizard';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import AuthPage from '@/pages/auth/AuthPage';
import QuickTripPage from '@/pages/plan/QuickTripPage';
import BookingSummaryPage from '@/pages/booking/BookingSummaryPage';
import BookingProgressPage from '@/pages/booking/BookingProgressPage';
import DigitalPassPage from '@/pages/booking/DigitalPassPage';

export default function App() {
  const { error } = useProfileStore(useShallow(state => ({
    error: state.error,
  })));

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
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
              <Route path="/chat" element={<ConversationalWizard />} />
              <Route path="/plan" element={<PlanWelcomePage />} />
              <Route path="/plan/step/:stepId" element={<StepPage />} />
              <Route path="/plan/confirmation" element={<ConfirmationPage />} />
              <Route path="/plan/quick" element={<QuickTripPage />} />

              {/* Booking + Digital Pass */}
              <Route path="/booking/summary" element={<BookingSummaryPage />} />
              <Route path="/booking/progress" element={<BookingProgressPage />} />
              <Route path="/booking/:bookingId" element={<DigitalPassPage />} />
              <Route path="/pass/:bookingId" element={<DigitalPassPage />} />
            </Route>
          </Routes>
        </main>

        <WelcomeToast />
      </div>
    </ErrorBoundary>
  );
}
