import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code2,
  Palette,
  Zap,
  Users,
  Star,
  Briefcase,
  Globe,
  Server,
  Layers,
  PenTool,
  Layout,
  Settings2,
} from "lucide-react";

/* ─── DADOS DA EQUIPE ─────────────────────────────────────── */
const team = [
  {
    name: "Marco Barbosa",
    role: "Desenvolvedor Backend & Full Stack",
    photo: "/marco.jpg",
    bio: "Especialista em construir a espinha dorsal de produtos digitais. Marco lidera o desenvolvimento de sistemas robustos, APIs escaláveis, automações inteligentes, landing pages de alta performance e web apps completos — do banco de dados ao deploy.",
    accent: "#FF6A00",
    accentClass: "text-kortex-orange",
    borderClass: "hover:border-kortex-orange/50",
    glowClass: "group-hover:shadow-[0_0_40px_rgba(255,106,0,0.12)]",
    badgeClass: "bg-kortex-orange/10 border-kortex-orange/20 text-kortex-orange",
    skills: [
      { icon: Server, label: "Backend & APIs" },
      { icon: Layout, label: "Landing Pages" },
      { icon: Settings2, label: "Automações" },
      { icon: Code2, label: "Web Apps" },
    ],
    number: "01",
  },
  {
    name: "João Neto",
    role: "Desenvolvedor Frontend & Designer UX/UI",
    photo: "/joao-v2.png",
    bio: "Responsável por transformar código e ideias em interfaces que encantam. João cuida de cada pixel da experiência do usuário — desde a arquitetura do frontend até o design system completo, garantindo produtos visualmente impressionantes e tecnicamente sólidos.",
    accent: "#A855F7",
    accentClass: "text-purple-400",
    borderClass: "hover:border-purple-500/50",
    glowClass: "group-hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]",
    badgeClass: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    imageWrapperClass: "scale-[1.35] origin-[50%_15%]",
    skills: [
      { icon: Layers, label: "Frontend" },
      { icon: Palette, label: "UX/UI Design" },
      { icon: Code2, label: "React & TypeScript" },
      { icon: Zap, label: "Performance" },
    ],
    number: "02",
  },
  {
    name: "Mateus Oliveira",
    role: "Designer de Identidade Visual & Branding",
    photo: "/mateus-v2.png",
    bio: "O guardião da alma visual da marca. Mateus cria identidades visuais marcantes e completas — logotipos únicos, manuais de marca, paletas de cores, tipografia e todos os ativos que fazem uma empresa ser reconhecida e lembrada.",
    accent: "#10B981",
    accentClass: "text-emerald-400",
    borderClass: "hover:border-emerald-500/50",
    glowClass: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]",
    badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    imageWrapperClass: "scale-[1.35] origin-[50%_15%]",
    skills: [
      { icon: PenTool, label: "Criação de Logo" },
      { icon: Briefcase, label: "Manual de Marca" },
      { icon: Palette, label: "Design System" },
      { icon: Globe, label: "Identidade Visual" },
    ],
    number: "03",
  },
];

/* ─── STATS ───────────────────────────────────────────────── */
const stats = [
  { value: "2.4K+", label: "Empresas Atendidas", icon: Users },
  { value: "340%", label: "Crescimento Médio", icon: Zap },
  { value: "4.9", label: "Avaliação Média", icon: Star },
  { value: "5+", label: "Anos de Experiência", icon: Briefcase },
];

/* ─── COMPONENTE ──────────────────────────────────────────── */
const Sobre = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-950/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-kortex-orange/4 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/4 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,106,0,0.7) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-6 text-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-8 justify-center">
            <span className="hover:text-kortex-orange cursor-pointer transition-colors" onClick={() => navigate("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-kortex-orange">Sobre Nós</span>
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Quem somos
          </span>

          <h1
            className="font-heading tracking-[-0.02em] text-foreground mb-6 leading-[1.1] reveal-on-scroll"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Três especialidades.
            <br />
            <span className="text-gradient-orange">Um único resultado.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-2xl mx-auto reveal-on-scroll">
            A GABS nasceu da combinação perfeita de backend, frontend e design — três
            pilares que, juntos, formam o ecossistema digital mais completo para
            empresas que querem escalar de verdade.
          </p>

          <div className="flex flex-wrap gap-4 justify-center reveal-on-scroll">
            <Button
              variant="hero"
              className="rounded-full h-12 px-8 gap-2"
              onClick={() => navigate("/register")}
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full h-12 px-8 border-border hover:border-kortex-orange hover:text-kortex-orange"
              onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })}
            >
              Conhecer o time
            </Button>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-border/50 bg-card/20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="reveal-on-scroll text-center group"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-xl bg-kortex-orange/10 border border-kortex-orange/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-kortex-orange" />
                    </div>
                  </div>
                  <p
                    className="font-heading text-kortex-orange leading-none mb-1"
                    style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────── */}
      <section id="team" className="py-28 bg-background">
        <div className="max-w-[900px] mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-20 reveal-on-scroll">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
              Nosso Time
            </span>
            <h2
              className="font-heading text-foreground tracking-[-0.02em] mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              As pessoas por trás{" "}
              <span className="text-gradient-orange">de cada entrega</span>
            </h2>
            <div className="w-16 h-1 bg-kortex-orange/60 rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Cada especialidade foi cuidadosamente escolhida para cobrir todos os
              pontos críticos da sua jornada digital.
            </p>
          </div>

          {/* Cards — vertical stack */}
          <div className="flex flex-col gap-8">
            {team.map((member, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`reveal-on-scroll group relative bg-card/30 border border-border/60 rounded-3xl overflow-hidden transition-all duration-500 ${member.borderClass} ${member.glowClass}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Large number watermark */}
                  <span
                    className="absolute top-4 right-6 font-heading opacity-[0.04] select-none pointer-events-none z-0"
                    style={{ fontSize: "7rem", lineHeight: 1, color: member.accent }}
                  >
                    {member.number}
                  </span>

                  <div className={`relative z-10 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-stretch`}>

                    {/* Photo */}
                    <div className="relative md:w-[280px] flex-shrink-0 h-72 md:h-auto overflow-hidden">
                      <div className={`w-full h-full ${member.imageWrapperClass || ''}`}>
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      {/* Gradient overlay */}
                      <div
                        className={`absolute inset-0 ${isEven
                          ? "bg-gradient-to-r from-transparent to-card/80"
                          : "bg-gradient-to-l from-transparent to-card/80"
                        } md:block hidden`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent md:hidden" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                      {/* Role badge */}
                      <span
                        className={`inline-block self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${member.badgeClass}`}
                      >
                        {member.role}
                      </span>

                      <h3 className="font-heading text-foreground text-2xl md:text-3xl tracking-tight mb-3">
                        {member.name}
                      </h3>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                        {member.bio}
                      </p>

                      {/* Skills grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {member.skills.map((skill, si) => {
                          const SkillIcon = skill.icon;
                          return (
                            <div
                              key={si}
                              className="flex items-center gap-2 bg-background/40 border border-border/40 rounded-xl px-3 py-2 text-xs font-medium text-foreground/80"
                            >
                              <SkillIcon className={`w-3.5 h-3.5 flex-shrink-0 ${member.accentClass}`} />
                              {skill.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to right, transparent, ${member.accent}, transparent)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border/50 bg-card/10">
        <div className="max-w-[800px] mx-auto px-6 text-center reveal-on-scroll">
          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-4"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
          >
            Pronto para fazer parte da nossa{" "}
            <span className="text-gradient-orange">história de sucesso?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Vamos juntos construir o ecossistema digital que sua empresa merece.
          </p>
          <Button
            variant="hero"
            className="rounded-full h-13 px-10 gap-2 text-base font-bold shadow-[0_0_30px_rgba(255,106,0,0.2)] hover:shadow-[0_0_40px_rgba(255,106,0,0.35)]"
            onClick={() => navigate("/register")}
          >
            Acelerar meu negócio <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;
