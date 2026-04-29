// Shared mock data and constants for the client portal

export const progressData = [
  { mes: "Out", progresso: 18 },
  { mes: "Nov", progresso: 32 },
  { mes: "Dez", progresso: 47 },
  { mes: "Jan", progresso: 58 },
  { mes: "Fev", progresso: 67 },
  { mes: "Mar", progresso: 76 },
];

export const trafficData = [
  { mes: "Out", visitas: 1200, leads: 38 },
  { mes: "Nov", visitas: 1900, leads: 62 },
  { mes: "Dez", visitas: 2400, leads: 88 },
  { mes: "Jan", visitas: 2100, leads: 74 },
  { mes: "Fev", visitas: 3100, leads: 105 },
  { mes: "Mar", visitas: 4200, leads: 142 },
];

export const projects = [
  { id: 1, name: "Funil de Vendas Completo",      pillar: "LPs & Funis",      status: "em andamento", progress: 72,  deadline: "25 Abr 2026", manager: "Ana Lima",     description: "Landing pages de alta conversão integradas ao CRM de vendas." },
  { id: 2, name: "Landing Page de Conversão",      pillar: "LPs & Funis",      status: "em andamento", progress: 45,  deadline: "10 Mai 2026", manager: "Carlos Mota",  description: "Nova landing page com foco em geração de leads qualificados." },
  { id: 3, name: "Automação de Follow-up",         pillar: "Automação",         status: "concluído",    progress: 100, deadline: "01 Abr 2026", manager: "João Dias",    description: "Fluxo automático de nutrição e follow-up via CRM." },
  { id: 4, name: "Web App Dashboard",              pillar: "Infraestrutura",    status: "em revisão",   progress: 90,  deadline: "18 Abr 2026", manager: "Rafael Souza", description: "Painel de analytics personalizado para acompanhamento em tempo real." },
  { id: 5, name: "Integração CRM + WhatsApp",      pillar: "Automação",         status: "planejamento", progress: 10,  deadline: "01 Jun 2026", manager: "Ana Lima",     description: "Automação de mensagens e gestão de leads via WhatsApp Business." },
];

export const deliverables = [
  { name: "Brandbook Final v2.pdf",         date: "05 Abr", type: "PDF",   size: "4.2 MB", project: "Funil de Vendas Completo" },
  { name: "Wireframes Landing.fig",         date: "02 Abr", type: "Figma", size: "12 MB",  project: "Landing Page de Conversão" },
  { name: "Relatório Automação Mar.pdf",    date: "31 Mar", type: "PDF",   size: "1.8 MB", project: "Automação de Follow-up" },
  { name: "Assets Integração CRM.zip",      date: "28 Mar", type: "ZIP",   size: "28 MB",  project: "Integração CRM + WhatsApp" },
  { name: "Protótipo Dashboard v3.pdf",     date: "22 Mar", type: "PDF",   size: "3.1 MB", project: "Web App Dashboard" },
];

export const invoices = [
  { month: "Abril 2026",     status: "pending", value: "R$ 4.800", due: "15/04/2026", services: ["LPs & Funis", "Automação"] },
  { month: "Março 2026",     status: "paid",    value: "R$ 4.800", due: "15/03/2026", services: ["Infraestrutura", "Automação"] },
  { month: "Fevereiro 2026", status: "paid",    value: "R$ 4.200", due: "15/02/2026", services: ["Infraestrutura"] },
  { month: "Janeiro 2026",   status: "paid",    value: "R$ 4.200", due: "15/01/2026", services: ["LPs & Funis", "Automação"] },
];

export const timeline = [
  { date: "10 Abr", event: "Reunião de alinhamento semanal",  type: "meeting",  done: false },
  { date: "14 Abr", event: "Revisão wireframes landing page", type: "review",   done: false },
  { date: "18 Abr", event: "Deploy Web App Dashboard v1",     type: "delivery", done: false },
  { date: "22 Abr", event: "Apresentação de resultados Q1",   type: "meeting",  done: false },
  { date: "25 Abr", event: "Entrega brandbook final",         type: "delivery", done: false },
  { date: "08 Abr", event: "Entrega brandbook atualizado",    type: "delivery", done: true  },
  { date: "01 Abr", event: "Campanha Google Ads concluída",   type: "delivery", done: true  },
];

export const notifications = [
  { id: 1, title: "Nova entrega disponível",     body: "Brandbook Final v2 foi enviado para sua aprovação.", time: "Há 5 min", unread: true  },
  { id: 2, title: "Reunião agendada – 10 Abr",  body: "Reunião de alinhamento confirmada para as 14h.",    time: "Há 1h",   unread: true  },
  { id: 3, title: "Fatura gerada – Abril 2026", body: "Fatura de R$ 4.800 disponível. Vence em 15/04.",   time: "Há 3h",   unread: false },
  { id: 4, title: "Dashboard 90% concluído",    body: "Web App Dashboard está em fase de revisão final.",  time: "Ontem",   unread: false },
];

// ── UI constants ─────────────────────────────────────────────────────────────
export const STATUS_COLOR: Record<string, string> = {
  "em andamento": "bg-primary/10 text-primary",
  "concluído":    "bg-success/10 text-success",
  "em revisão":   "bg-warning/10 text-warning",
  "planejamento": "bg-muted text-muted-foreground",
};

export const PILLAR_BORDER: Record<string, string> = {
  "LPs & Funis":    "border-l-blue-500",
  Infraestrutura:   "border-l-primary",
  "Automação":      "border-l-red-500",
};

export const FILE_COLOR: Record<string, string> = {
  PDF:   "bg-destructive/10 text-destructive",
  Figma: "bg-[#A259FF]/10 text-[#A259FF]",
  ZIP:   "bg-warning/10 text-warning",
};
