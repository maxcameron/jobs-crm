
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import CompanyDetails from "./pages/CompanyDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { TrackingPreferences } from "./components/TrackingPreferences";
import { useAuth } from "./components/AuthProvider";

const queryClient = new QueryClient();

const TopNav = () => {
  const { session, supabase } = useAuth();
  
  if (!session) return null;
  
  return (
    <div className="fixed top-0 left-[64px] right-0 h-[64px] border-b bg-background z-40 px-6">
      <div className="flex h-full items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold">
            Jobs CRM
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <a 
            href="mailto:maxecameron@gmail.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Feedback
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { session } = useAuth();
  
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <TopNav />
      <main className={session ? "pl-[64px] pt-[64px]" : ""}>
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
                  <h1 className="text-4xl font-bold tracking-tight mb-8">Target Profile</h1>
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
