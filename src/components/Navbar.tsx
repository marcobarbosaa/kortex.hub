import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { ColorModeToggle } from "@/components/ColorModeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Serviços", href: "#services" },
    { label: "Tecnologias", href: "#tech" },
    { label: "Consultoria", href: "#consultancy" },
    { label: "Contato", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <span 
          className="font-heading text-2xl tracking-tighter text-foreground cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => navigate('/')}
        >
          GABS
        </span>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] uppercase tracking-widest font-semibold text-muted-foreground hover:text-kortex-orange transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ColorModeToggle />
            <Button 
              variant="hero" 
              className="rounded-full h-11 px-8 text-[13px] uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(255,106,0,0.1)] hover:shadow-[0_0_25px_rgba(255,106,0,0.2)]" 
              onClick={() => navigate('/register')}
            >
              Começar agora
            </Button>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-foreground" aria-label="Abrir menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border w-[280px] pt-12">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex justify-center mt-4">
                <ColorModeToggle />
              </div>
              <Button 
                variant="hero" 
                className="rounded-full h-11 w-full text-[13px] uppercase tracking-wider font-bold" 
                onClick={() => navigate('/register')}
              >
                Começar agora
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
