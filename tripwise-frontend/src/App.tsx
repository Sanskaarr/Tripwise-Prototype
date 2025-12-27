import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { IdentifyUser } from './pages/IdentifyUser';
import { Onboarding } from './pages/Onboarding';
import { PlanTrip } from './pages/PlanTrip';
import { BookingOptions } from './pages/BookingOptions';
import { Payment } from './pages/Payment';
import { LocalGuide } from './pages/LocalGuide';
import { BookingDetails } from './pages/BookingDetails';
import { NotFound } from './pages/NotFound';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { healthAPI } from './services/api';

const queryClient = new QueryClient();

export default function App() {
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const health = await healthAPI.checkHealth();
        console.log('Backend health check:', health);
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/identify" element={<IdentifyUser />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/plan-trip" element={<PlanTrip />} />
                  <Route path="/booking" element={<BookingOptions />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/booking-details" element={<BookingDetails />} />
                  <Route path="/local-guide" element={<LocalGuide />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </TooltipProvider>
        </UserProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
