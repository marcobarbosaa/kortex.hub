import {
  LayoutDashboard, TrendingUp, Users, Palette,
  Settings, Zap, BarChart3, Globe, Bell, LogOut,
  Briefcase, Receipt, MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

interface AppSidebarProps {
  collapsed?: boolean;
}

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Projetos", url: "/admin/projetos", icon: Briefcase },
  { title: "Faturas", url: "/admin/faturas", icon: Receipt },
  { title: "Suporte", url: "/admin/suporte", icon: MessageSquare },
];

const toolItems = [
  { title: "Automações", url: "/automations", icon: Zap },
  { title: "Web Apps", url: "/webapps", icon: Globe },
];

const bottomItems = [
  { title: "Notificações", url: "/notifications", icon: Bell },
  { title: "Configurações", url: "/settings", icon: Settings },
];

const navItemClass = (collapsed: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
    "text-[hsl(var(--sidebar-foreground))] hover:text-foreground",
    "hover:bg-[hsl(var(--sidebar-accent))]",
    collapsed && "justify-center"
  );

const activeNavItemClass = "bg-[hsl(var(--sidebar-accent))] text-foreground font-medium";

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full py-4">
      {/* Logo */}
      <div className={cn("px-4 mb-6 flex items-center gap-2.5", collapsed && "justify-center px-2")}>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">K</span>
        </div>
        {!collapsed && (
          <span className="text-foreground font-semibold text-lg tracking-tight">Kortex</span>
        )}
      </div>

      {/* Nav sections */}
      <div className="flex-1 px-2 space-y-5 overflow-y-auto">
        <nav>
          {!collapsed && (
            <p className="px-2 mb-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--sidebar-foreground)/0.5)]">
              Principal
            </p>
          )}
          <ul className="space-y-0.5">
            {mainItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  end
                  className={navItemClass(collapsed)}
                  activeClassName={activeNavItemClass}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          {!collapsed && (
            <p className="px-2 mb-1 text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--sidebar-foreground)/0.5)]">
              Ferramentas
            </p>
          )}
          <ul className="space-y-0.5">
            {toolItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={navItemClass(collapsed)}
                  activeClassName={activeNavItemClass}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-2 mt-4 pt-4 border-t border-[hsl(var(--sidebar-border))] space-y-0.5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={navItemClass(collapsed)}
            activeClassName={activeNavItemClass}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
            "text-[hsl(var(--sidebar-foreground))] hover:text-destructive hover:bg-[hsl(var(--sidebar-accent))]",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
