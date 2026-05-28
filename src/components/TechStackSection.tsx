import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const technologies = [
  { name: "React", slug: "react", accent: "61DAFB", type: "simple" },
  { name: "Next.js", slug: "nextdotjs", accent: "ffffff", type: "simple", invertInLight: true },
  { name: "TypeScript", slug: "typescript", accent: "3178C6", type: "simple" },
  { name: "Node.js", slug: "nodedotjs", accent: "5FA04E", type: "simple" },
  { name: "Supabase", slug: "supabase", accent: "3ECF8E", type: "simple" },
  { name: "n8n", slug: "n8n", accent: "FF6D5A", type: "simple" },
  { name: "Figma", slug: "figma", accent: "F24E1E", type: "simple" },
  { name: "Photoshop", slug: "photoshop/photoshop-plain.svg", accent: "", type: "devicon", adobeIcon: true },
  { name: "Illustrator", slug: "illustrator/illustrator-plain.svg", accent: "", type: "devicon", adobeIcon: true },
  { name: "Premiere", slug: "premierepro/premierepro-plain.svg", accent: "", type: "devicon", adobeIcon: true },
  { name: "PostgreSQL", slug: "postgresql", accent: "4169E1", type: "simple" },
  { name: "Python", slug: "python", accent: "3776AB", type: "simple" },
  { name: "Java", slug: "java/java-original.svg", accent: "", type: "devicon" },
  { name: "Docker", slug: "docker", accent: "2496ED", type: "simple" },
];

// We duplicate the list so the marquee loops seamlessly
const doubled = [...technologies, ...technologies];

const TechCard = ({ tech }: { tech: typeof technologies[0] }) => {
  const imgSrc = tech.type === "simple" 
    ? `https://cdn.simpleicons.org/${tech.slug}/${tech.accent}`
    : `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech.slug}`;
    
  return (
    <div
      className="tech-card flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] backdrop-blur-sm hover:border-kortex-orange/30 hover:bg-kortex-orange/[0.04] transition-all duration-300 cursor-default group"
    >
      <div className={`w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${tech.adobeIcon ? 'tech-logo-adobe' : ''}`}>
        <img 
          src={imgSrc} 
          alt={tech.name} 
          className={`max-w-full max-h-full object-contain ${tech.invertInLight ? 'tech-logo-invertable' : ''}`} 
        />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground leading-none">{tech.name}</p>
      </div>
    </div>
  );
};

const TechStackSection = () => {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="tech" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-kortex-orange/4 blur-[200px] pointer-events-none" />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-muted/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-muted/50 to-transparent pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto text-center mb-16">
        <div ref={headerRef}>
          <span className="why-pill">Tecnologias que Dominamos</span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mt-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Stack de{" "}
            <span className="text-gradient-orange">alta performance</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            Trabalhamos com as tecnologias mais modernas do mercado para entregar velocidade, segurança e escalabilidade em cada projeto.
          </p>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative flex overflow-hidden mb-4">
        <div className="marquee-track flex gap-4">
          {doubled.map((tech, i) => (
            <TechCard key={`r1-${i}`} tech={tech} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left (reversed) */}
      <div className="relative flex overflow-hidden">
        <div className="marquee-track-reverse flex gap-4">
          {[...doubled].reverse().map((tech, i) => (
            <TechCard key={`r2-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
