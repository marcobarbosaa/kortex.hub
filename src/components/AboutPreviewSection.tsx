import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const team = [
  { 
    name: "Marco Barbosa", 
    role: "Backend & Full Stack", 
    photo: "/marco.jpg",
    className: "top-[2%] left-1/2 -translate-x-1/2",
    imgClass: "object-top pt-1",
    zoom: ""
  },
  { 
    name: "João Neto", 
    role: "Frontend & Design UX/UI", 
    photo: "/joao-v2.png",
    className: "bottom-[2%] left-[2%]",
    imgClass: "object-[50%_15%]",
    zoom: "scale-[1.25] origin-[50%_20%]"
  },
  { 
    name: "Mateus Oliveira", 
    role: "Branding & Identidade", 
    photo: "/mateus-v2.png",
    className: "bottom-[2%] right-[2%]",
    imgClass: "object-[50%_15%]",
    zoom: "scale-[1.25] origin-[50%_20%]"
  },
];

const AboutPreviewSection = () => {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-kortex-orange/4 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div ref={sectionRef} className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left — Team Triangle Connected */}
        <div className="relative w-full aspect-square max-h-[500px] mx-auto order-2 lg:order-1 flex items-center justify-center p-4">
          
          {/* Connection Lines (SVG) */}
          <svg 
            className="absolute inset-0 w-full h-full z-0 text-kortex-orange/40 drop-shadow-[0_0_15px_rgba(255,106,0,0.6)]" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Base glowing line */}
            <polygon 
              points="50,23 23,77 77,77" 
              fill="rgba(255,106,0,0.02)" 
              stroke="currentColor" 
              strokeWidth="0.3" 
            />
            {/* Animated dashed line running around the triangle */}
            <polygon 
              points="50,23 23,77 77,77" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.6" 
              strokeDasharray="3 6"
              className="animate-trinity-dash" 
            />
            
            {/* Glowing dots at the centers */}
            <circle cx="50" cy="23" r="1.5" fill="currentColor" className="animate-pulse" />
            <circle cx="23" cy="77" r="1.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="77" cy="77" r="1.5" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1.2s' }} />

            {/* Pulsing rings around the dots */}
            <circle cx="50" cy="23" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.2" className="animate-ping" />
            <circle cx="23" cy="77" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.2" className="animate-ping" style={{ animationDelay: '0.6s' }} />
            <circle cx="77" cy="77" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.2" className="animate-ping" style={{ animationDelay: '1.2s' }} />
          </svg>

          {/* Team Cards */}
          {team.map((member) => (
            <div
              key={member.name}
              className={`absolute w-[42%] aspect-square rounded-[2rem] overflow-hidden border-2 border-kortex-orange/10 bg-background shadow-2xl group transition-all duration-500 hover:scale-105 hover:border-kortex-orange/40 hover:shadow-[0_0_30px_rgba(255,106,0,0.15)] z-10 ${member.className}`}
            >
              {/* Image wrapper for zoom */}
              <div className={`w-full h-full ${member.zoom}`}>
                <img
                  src={member.photo}
                  alt={member.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${member.imgClass}`}
                />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[9px] sm:text-[10px] font-bold text-kortex-orange uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {member.role}
                </p>
                <h3 className="font-heading text-foreground text-sm sm:text-base tracking-wide leading-tight">
                  {member.name}
                </h3>
              </div>
            </div>
          ))}

          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border border-kortex-orange/20 pointer-events-none hidden sm:block" />
          <div className="absolute -bottom-8 -right-4 w-16 h-16 rounded-full border border-primary/20 pointer-events-none hidden sm:block" />
        </div>

        {/* Right — Text */}
        <div className="order-1 lg:order-2">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-kortex-orange/10 text-kortex-orange border border-kortex-orange/20 mb-6">
            Quem somos
          </span>

          <h2
            className="font-heading text-foreground tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Um time de <span className="text-gradient-orange">3 especialistas</span>{" "}
            focados no seu crescimento
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed mb-5">
            Somos backend, frontend e branding — três pilares que, juntos, constroem o
            ecossistema digital completo para sua empresa escalar. Sem intermediários, sem
            ruído: da ideia ao resultado, com a mesma equipe.
          </p>

          <p className="text-muted-foreground text-[15px] leading-relaxed mb-10">
            Da criação do logo ao deploy da plataforma, cada entrega é pensada para gerar
            presença, autoridade e conversão.
          </p>

          <button
            onClick={() => navigate("/sobre")}
            className="group flex items-center gap-2 text-[15px] font-bold text-kortex-orange hover:text-foreground transition-colors"
          >
            Conhecer o time completo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
