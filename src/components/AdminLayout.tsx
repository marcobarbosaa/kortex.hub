import { useState } from "react";
import { PanelLeft, Search } from "lucide-react";
import { NotificationPopover } from "./NotificationPopover";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ColorModeToggle } from "./ColorModeToggle";
import { useTheme } from "@/hooks/useTheme";
import { useColorMode } from "@/hooks/useColorMode";
import { useAuth } from "@/components/AuthProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
}

export function AdminLayout({ children, searchPlaceholder = "Buscar..." }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, user } = useAuth();
  useTheme();     // initialize accent theme from localStorage on mount
  useColorMode(); // initialize dark/light mode from localStorage on mount

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "h-full shrink-0 border-r overflow-y-auto flex flex-col transition-all duration-200 ease-linear",
          "bg-[hsl(var(--sidebar-background))] border-[hsl(var(--sidebar-border))]",
          collapsed ? "w-14" : "w-64"
        )}
      >
        <AppSidebar collapsed={collapsed} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center justify-between gap-3 border-b border-border/50 px-4 bg-background">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle Sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ColorModeToggle />
            <ThemeSwitcher />
            <NotificationPopover />
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-primary">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
