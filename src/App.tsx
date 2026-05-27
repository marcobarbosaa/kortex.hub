import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import CompressedLanding from "./pages/CompressedLanding";
import AdminDashboard from "./pages/admin/Dashboard";
import WebApps from "./pages/admin/WebApps";
import Performance from "./pages/admin/Performance";
import Clients from "./pages/admin/Clients";
import Campaigns from "./pages/admin/Campaigns";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminSupport from "./pages/admin/AdminSupport";
import DesignHub from "./pages/admin/DesignHub";
import Automations from "./pages/admin/Automations";
import ClientIndex from "./pages/client/Index";
import ClientProjects from "./pages/client/Projects";
import ClientReports from "./pages/client/Reports";
import ClientFinancial from "./pages/client/Financial";
import ClientSupport from "./pages/client/Support";
import ClientServicos from "./pages/client/Servicos";
import ClientUpgrade from "./pages/client/Upgrade";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/admin/Settings";
import Notifications from "./pages/admin/Notifications";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OnboardingFlow from "./pages/onboarding/OnboardingFlow";

// Páginas Públicas do Rodapé
import Cases from "./pages/public/Cases";
import Sobre from "./pages/public/Sobre";
import Blog from "./pages/public/Blog";
import Carreiras from "./pages/public/Carreiras";
import Contato from "./pages/public/Contato";
import Privacidade from "./pages/public/Privacidade";
import Termos from "./pages/public/Termos";
import Cookies from "./pages/public/Cookies";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Rotas Públicas ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/test-landing" element={<CompressedLanding />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/carreiras" element={<Carreiras />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/cookies" element={<Cookies />} />

            {/* ── Rotas de Onboarding (Etapa única) ── */}
            <Route path="/onboarding" element={<ProtectedRoute skipOnboardingGuard><OnboardingFlow /></ProtectedRoute>} />

            {/* ── Rotas de Admin (Requer cargo de admin) ── */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute requireAdmin><Performance /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute requireAdmin><Clients /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute requireAdmin><Campaigns /></ProtectedRoute>} />
            <Route path="/design" element={<ProtectedRoute requireAdmin><DesignHub /></ProtectedRoute>} />
            <Route path="/automations" element={<ProtectedRoute requireAdmin><Automations /></ProtectedRoute>} />
            <Route path="/webapps" element={<ProtectedRoute requireAdmin><WebApps /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requireAdmin><SettingsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute requireAdmin><Notifications /></ProtectedRoute>} />
            <Route path="/admin/projetos" element={<ProtectedRoute requireAdmin><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/faturas" element={<ProtectedRoute requireAdmin><AdminInvoices /></ProtectedRoute>} />
            <Route path="/admin/suporte" element={<ProtectedRoute requireAdmin><AdminSupport /></ProtectedRoute>} />

            {/* ── Rotas do Cliente (Etapas 4-9: Dashboard, Serviços, Upgrade) ── */}
            <Route path="/cliente" element={<ProtectedRoute><ClientIndex /></ProtectedRoute>} />
            <Route path="/cliente/projetos" element={<ProtectedRoute><ClientProjects /></ProtectedRoute>} />
            <Route path="/cliente/relatorios" element={<ProtectedRoute><ClientReports /></ProtectedRoute>} />
            <Route path="/cliente/financeiro" element={<ProtectedRoute><ClientFinancial /></ProtectedRoute>} />
            <Route path="/cliente/suporte" element={<ProtectedRoute><ClientSupport /></ProtectedRoute>} />
            <Route path="/cliente/servicos" element={<ProtectedRoute><ClientServicos /></ProtectedRoute>} />
            <Route path="/cliente/upgrade" element={<ProtectedRoute><ClientUpgrade /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
