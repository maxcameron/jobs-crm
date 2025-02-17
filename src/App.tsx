
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import CompanyDetails from "@/pages/CompanyDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import Preferences from "@/pages/Preferences";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/company/:id" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
