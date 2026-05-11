import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Settings, User, Bell, Shield, Palette, Globe,
  CreditCard, Key, Save, Camera, ChevronRight,
  Mail, Phone, Building2, MapPin, Eye, EyeOff,
  ToggleLeft, ToggleRight, Smartphone, Monitor, Moon,
  Trash2, Download, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = "profile" | "notifications" | "appearance" | "security" | "billing" | "integrations";

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: "profile",       label: "Perfil",         icon: User },
  { id: "notifications", label: "Notificações",   icon: Bell },
  { id: "appearance",    label: "Aparência",       icon: Palette },
  { id: "security",      label: "Segurança",       icon: Shield },
  { id: "billing",       label: "Plano & Faturamento", icon: CreditCard },
  { id: "integrations",  label: "Integrações",    icon: Globe },
];

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="glass-card rounded-xl p-6 glow-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Foto de Perfil</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">JD</span>
            </div>
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">João Dias</p>
            <p className="text-xs text-muted-foreground mt-0.5">Administrador · GABS Hub</p>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                Alterar foto
              </button>
              <button className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="glass-card rounded-xl p-6 glow-border space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Informações Pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Nome completo", value: "João Dias",         icon: User,     type: "text" },
            { label: "E-mail",        value: "joao@kortex.com.br", icon: Mail,     type: "email" },
            { label: "Telefone",      value: "+55 11 98765-4321", icon: Phone,    type: "tel" },
            { label: "Empresa",       value: "GABS Agency",     icon: Building2, type: "text" },
            { label: "Cargo",         value: "Diretor de Marketing", icon: User,  type: "text" },
            { label: "Localização",   value: "São Paulo, SP",     icon: MapPin,   type: "text" },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <f.icon className="h-3.5 w-3.5" /> {f.label}
              </label>
              <input
                type={f.type}
                defaultValue={f.value}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Salvar alterações
        </button>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    emailCampaign: true, emailBilling: true, emailClients: false,
    pushPerformance: true, pushAlerts: true, pushSystem: false,
    weeklyReport: true, digestSummary: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const sections = [
    {
      title: "E-mail", icon: Mail, items: [
        { key: "emailCampaign" as const, label: "Atualizações de campanhas", desc: "Quando uma campanha muda de status ou atinge uma meta." },
        { key: "emailBilling"  as const, label: "Cobranças e faturas",        desc: "Faturas geradas, pagamentos confirmados ou pendentes." },
        { key: "emailClients"  as const, label: "Atividade de clientes",      desc: "Novos clientes, mensagens ou avaliações recebidas." },
      ],
    },
    {
      title: "Push / Painel", icon: Smartphone, items: [
        { key: "pushPerformance" as const, label: "Alertas de performance",  desc: "Quedas de CTR, CPA acima do limite ou metas atingidas." },
        { key: "pushAlerts"      as const, label: "Alertas críticos",         desc: "Budget esgotado, automação interrompida ou erro de integração." },
        { key: "pushSystem"      as const, label: "Atualizações do sistema",  desc: "Novidades, manutenções e changelogs da plataforma." },
      ],
    },
    {
      title: "Relatórios", icon: Monitor, items: [
        { key: "weeklyReport"   as const, label: "Relatório semanal",  desc: "Resumo de performance toda segunda-feira às 9h." },
        { key: "digestSummary"  as const, label: "Digest diário",      desc: "Resumo do dia anterior entregue às 8h." },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.title} className="glass-card rounded-xl p-6 glow-border space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <s.icon className="h-4 w-4 text-primary" /> {s.title}
          </h3>
          {s.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-1">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={prefs[item.key]} onToggle={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Salvar preferências
        </button>
      </div>
    </div>
  );
}

// ── Appearance Tab ────────────────────────────────────────────────────────────
function AppearanceTab() {
  const [density, setDensity] = useState<"compact" | "default" | "comfortable">("default");
  const [language, setLanguage] = useState("pt-BR");

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-6 glow-border space-y-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary" /> Tema e cores
        </h3>
        <div className="rounded-lg bg-muted/50 border border-border p-4 text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary shrink-0" />
          Use os botões de <span className="text-foreground font-medium mx-1">☀️ Modo</span> e <span className="text-foreground font-medium mx-1">🎨 Cor do tema</span> na barra superior para personalizar a aparência.
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 glow-border space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Densidade do layout</h3>
        <div className="grid grid-cols-3 gap-3">
          {(["compact", "default", "comfortable"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all",
                density === d
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted"
              )}
            >
              <div className={cn("flex flex-col gap-0.5 w-8", d === "compact" && "gap-px", d === "comfortable" && "gap-1.5")}>
                {[1,2,3].map((i) => (
                  <div key={i} className={cn("h-1 w-full rounded-full bg-current opacity-60", d === "comfortable" && "h-1.5")} />
                ))}
              </div>
              {{ compact: "Compacto", default: "Padrão", comfortable: "Confortável" }[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 glow-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Idioma</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="pt-BR">🇧🇷 Português (Brasil)</option>
          <option value="en-US">🇺🇸 English (US)</option>
          <option value="es-ES">🇪🇸 Español</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Salvar preferências
        </button>
      </div>
    </div>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [showPass, setShowPass] = useState(false);
  const [mfa, setMfa] = useState(true);

  const sessions = [
    { device: "Chrome · macOS", location: "São Paulo, BR", time: "Agora", current: true },
    { device: "Safari · iPhone 15", location: "São Paulo, BR", time: "Há 2h",  current: false },
    { device: "Chrome · Windows",   location: "Rio de Janeiro, BR", time: "Ontem", current: false },
  ];

  return (
    <div className="space-y-4">
      {/* Change password */}
      <div className="glass-card rounded-xl p-6 glow-border space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" /> Alterar senha
        </h3>
        {["Senha atual", "Nova senha", "Confirmar nova senha"].map((label, i) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {i === 0 && (
                <button
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Atualizar senha
        </button>
      </div>

      {/* MFA */}
      <div className="glass-card rounded-xl p-6 glow-border">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Autenticação em dois fatores</p>
              <p className="text-xs text-muted-foreground mt-0.5">Proteja sua conta com um segundo fator via app autenticador.</p>
            </div>
          </div>
          <Toggle enabled={mfa} onToggle={() => setMfa((v) => !v)} />
        </div>
      </div>

      {/* Active sessions */}
      <div className="glass-card rounded-xl p-6 glow-border space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Sessões ativas</h3>
        {sessions.map((s) => (
          <div key={s.device} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
              </div>
            </div>
            {s.current ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-success/10 text-success font-medium">Atual</span>
            ) : (
              <button className="text-xs text-destructive hover:underline">Encerrar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Billing Tab ───────────────────────────────────────────────────────────────
function BillingTab() {
  const invoices = [
    { month: "Março 2025",    status: "paid",    value: "R$ 4.800", date: "01/04/2025" },
    { month: "Fevereiro 2025", status: "paid",   value: "R$ 4.800", date: "01/03/2025" },
    { month: "Janeiro 2025",  status: "paid",    value: "R$ 4.800", date: "01/02/2025" },
    { month: "Dezembro 2024", status: "paid",    value: "R$ 4.200", date: "01/01/2025" },
  ];
  return (
    <div className="space-y-4">
      {/* Current plan */}
      <div className="glass-card rounded-xl p-6 glow-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">Pro</span>
              <p className="text-sm font-semibold text-foreground">Plano Professional</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">R$ 4.800<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            <p className="text-xs text-muted-foreground mt-1">Renova em 01/05/2025 · Próxima cobrança automática</p>
          </div>
          <button className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
            Alterar plano
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          {[
            { label: "Clientes ativos", value: "24 / 30" },
            { label: "Web Apps",        value: "8 / 10" },
            { label: "Automações",      value: "12 / 20" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-sm font-semibold text-foreground">{f.value}</p>
              <p className="text-xs text-muted-foreground">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="glass-card rounded-xl p-6 glow-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" /> Método de pagamento
        </h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-12 rounded bg-foreground/10 flex items-center justify-center text-xs font-bold text-foreground">VISA</div>
            <div>
              <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expira 08/2027</p>
            </div>
          </div>
          <button className="text-xs text-primary hover:underline">Alterar</button>
        </div>
      </div>

      {/* Invoices */}
      <div className="glass-card rounded-xl p-6 glow-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Histórico de faturas</h3>
        {invoices.map((inv) => (
          <div key={inv.month} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{inv.month}</p>
              <p className="text-xs text-muted-foreground">{inv.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{inv.value}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Paga</span>
              <button className="text-muted-foreground hover:text-foreground transition-colors" title="Baixar PDF">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Integrations Tab ──────────────────────────────────────────────────────────
function IntegrationsTab() {
  const integrations = [
    { name: "Google Ads",     desc: "Sincronize campanhas e métricas automaticamente.",           connected: true,  color: "bg-[#4285F4]/10 text-[#4285F4]", abbr: "GA" },
    { name: "Meta Ads",       desc: "Gerencie anúncios no Facebook e Instagram.",                 connected: true,  color: "bg-[#1877F2]/10 text-[#1877F2]", abbr: "MA" },
    { name: "Google Analytics", desc: "Importe dados de tráfego e comportamento.",               connected: true,  color: "bg-[#E37400]/10 text-[#E37400]", abbr: "G4" },
    { name: "HubSpot CRM",    desc: "Sincronize contatos e pipeline de vendas.",                  connected: false, color: "bg-[#FF7A59]/10 text-[#FF7A59]", abbr: "HS" },
    { name: "Slack",          desc: "Receba alertas e relatórios direto nas suas equipes.",       connected: false, color: "bg-[#4A154B]/10 text-[#9C27B0]",  abbr: "SL" },
    { name: "WhatsApp API",   desc: "Automatize mensagens e notificações para clientes.",         connected: false, color: "bg-success/10 text-success",        abbr: "WA" },
  ];
  return (
    <div className="space-y-3">
      {integrations.map((intg) => (
        <div key={intg.name} className="glass-card rounded-xl p-5 glow-border flex items-center gap-4">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0", intg.color)}>
            {intg.abbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{intg.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{intg.desc}</p>
          </div>
          {intg.connected ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-success/10 text-success font-medium">Conectado</span>
              <button className="text-xs text-destructive hover:underline">Desconectar</button>
            </div>
          ) : (
            <button className="shrink-0 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" /> Conectar
            </button>
          )}
        </div>
      ))}

      {/* Danger zone */}
      <div className="glass-card rounded-xl p-6 glow-border border-destructive/30 space-y-3 mt-6">
        <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Zona de perigo
        </h3>
        <p className="text-xs text-muted-foreground">Ações irreversíveis. Certifique-se de que entende as consequências antes de prosseguir.</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/40 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <Download className="h-3.5 w-3.5" /> Exportar todos os dados
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/40 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Excluir conta
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Page ─────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const TAB_CONTENT: Record<Tab, React.ReactNode> = {
    profile:       <ProfileTab />,
    notifications: <NotificationsTab />,
    appearance:    <AppearanceTab />,
    security:      <SecurityTab />,
    billing:       <BillingTab />,
    integrations:  <IntegrationsTab />,
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" /> Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas preferências, segurança e integrações.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-left w-full",
                    activeTab === t.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <t.icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {TAB_CONTENT[activeTab]}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
