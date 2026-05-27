import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/SupportChat";
import { GuidedExperience } from "@/components/GuidedExperience";
import { ColorModeToggle } from "@/components/ColorModeToggle";
import { useTheme } from "@/hooks/useTheme";
import { useColorMode } from "@/hooks/useColorMode";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard, Briefcase, CreditCard,
  MessageSquare, LogOut, PanelLeft, Layers, Crown,
} from "lucide-react";
import { NotificationPopover } from "./NotificationPopover";

interface ClientLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const NAV = [
  { label: "Visão Geral", icon: LayoutDashboard, url: "/cliente" },
  { label: "Cronograma", icon: Briefcase, url: "/cliente/projetos" },
  { label: "Falar com Especialista", icon: MessageSquare, url: "/cliente/suporte" },
];

export function ClientLayout({ children, title, description }: ClientLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { profile, user, signOut } = useAuth();
  useTheme();
  useColorMode();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col animate-page-fade">
      {/* ── Topbar ── */}
      <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 shrink-0 bg-background z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">K</span>
            </div>
            <span className="text-foreground font-semibold text-sm hidden sm:inline">
              GABS — Área do Cliente
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorModeToggle />
          <NotificationPopover />
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-primary">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative w-full min-w-0">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "h-full shrink-0 border-r border-border/50 flex flex-col transition-all duration-200 ease-linear",
            "bg-[hsl(var(--sidebar-background))]",
            "absolute z-40 md:relative",
            sidebarOpen ? "w-52 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-14"
          )}
        >
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
            {sidebarOpen && (
              <p className="px-2 mb-2 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">
                Menu
              </p>
            )}
            {NAV.map((n) => {
              const active = location.pathname === n.url;
              return (
                <button
                  key={n.url}
                  onClick={() => navigate(n.url)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                    !sidebarOpen && "justify-center",
                    active
                      ? "bg-[hsl(var(--sidebar-accent))] text-foreground font-medium"
                      : "text-[hsl(var(--sidebar-foreground))] hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]"
                  )}
                >
                  <n.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{n.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Client info + logout */}
          <div className="px-2 py-3 border-t border-[hsl(var(--sidebar-border))] space-y-1">
            {sidebarOpen && (
              <div className="flex items-center gap-2.5 px-2 py-2">
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-primary">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.user_metadata?.empresa || profile?.full_name || 'Minha Empresa'}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {profile?.full_name || user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                "text-[hsl(var(--sidebar-foreground))] hover:text-destructive hover:bg-[hsl(var(--sidebar-accent))]",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </aside>

        {/* ── Page content ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden overflow-y-auto bg-background w-full">
          <div className="p-4 sm:p-6 space-y-6 w-full max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
              {description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>

      <SupportChat />
      <GuidedExperience />
    </div>
  );
}
