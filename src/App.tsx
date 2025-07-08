import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Archive from "./pages/Archive";
import Activities from "./pages/Activities";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MaintenancePage } from "./components/MaintenancePage";
import { useAppPublicStatus } from "./hooks/useAppSettings";
import { useAdmin } from "./hooks/useAdmin";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isPublic, maintenanceMessage, adminButtonText, isLoading: settingsLoading } = useAppPublicStatus();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (settingsLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  // If app is not public and user is not admin, show maintenance page
  if (!isPublic && !isAdmin) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <MaintenancePage 
            message={maintenanceMessage}
            adminButtonText={adminButtonText}
          />
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <Admin />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
