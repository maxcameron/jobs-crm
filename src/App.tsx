
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import CompanyDetails from "./pages/CompanyDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { TrackingPreferences } from "./components/TrackingPreferences";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="relative min-h-screen">
            <Navigation />
            <main className="pl-[64px]">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/preferences"
                  element={
                    <ProtectedRoute>
                      <div className="container py-8">
                        <h1 className="text-4xl font-bold tracking-tight mb-8">Preferences</h1>
                        <TrackingPreferences />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/:id"
                  element={
                    <ProtectedRoute>
                      <CompanyDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
