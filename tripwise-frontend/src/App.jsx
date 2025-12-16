import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { IdentifyUser } from './pages/IdentifyUser';
import { PlanTrip } from './pages/PlanTrip';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { LocalGuide } from './pages/LocalGuide';
import { BookingDetails } from './pages/BookingDetails';
import { UserDashboard } from './pages/UserDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { healthAPI } from './services/api';

export function App() {
  const [backendStatus, setBackendStatus] = useState(null);

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
    <LanguageProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/identify" element={<IdentifyUser />} />
                <Route path="/plan-trip" element={<PlanTrip />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/local-guide" element={<LocalGuide />} />
              </Routes>
          </div>
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}