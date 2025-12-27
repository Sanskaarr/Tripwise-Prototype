import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IdentifyPage from "./pages/Identify";
import PlanTripPage from "./pages/PlanTrip";
import BookingOptionsPage from "./pages/BookingOptions";
import PaymentPage from "./pages/Payment";
import LocalGuidePage from "./pages/LocalGuide";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/plan" element={<PlanTripPage />} />
          <Route path="/options" element={<BookingOptionsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/guide" element={<LocalGuidePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <VoiceAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
