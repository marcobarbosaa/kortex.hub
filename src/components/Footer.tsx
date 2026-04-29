import { Link } from "react-router-dom";

const Footer = () => {
  const produtoLinks = [
    { label: "Serviços", href: "/#services", isHash: true },
    { label: "Como funciona", href: "/#how-it-works", isHash: true },
    { label: "Planos", href: "/#pricing", isHash: true },
    { label: "Cases", href: "/cases", isHash: false },
  ];

  const empresaLinks = [
    { label: "Sobre", href: "/sobre", isHash: false },
    { label: "Blog", href: "/blog", isHash: false },
    { label: "Carreiras", href: "/carreiras", isHash: false },
    { label: "Contato", href: "/contato", isHash: false },
  ];

  const legalLinks = [
    { label: "Política de Privacidade", href: "/privacidade", isHash: false },
    { label: "Termos de Uso", href: "/termos", isHash: false },
    { label: "Cookies", href: "/cookies", isHash: false },
  ];

  return (
    <footer className="bg-[#050505] border-t border-foreground/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <span className="font-heading text-xl text-foreground">KORTEX</span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Estratégia, design e tecnologia combinados em um único sistema de crescimento.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-body">Produto</h4>
            <ul className="space-y-2.5">
              {produtoLinks.map((item) => (
                <li key={item.label}>
                  {item.isHash ? (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-body">Empresa</h4>
            <ul className="space-y-2.5">
              {empresaLinks.map((item) => (
                <li key={item.label}>
                  {item.isHash ? (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 font-body">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  {item.isHash ? (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-foreground/[0.06] pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Kortex. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
