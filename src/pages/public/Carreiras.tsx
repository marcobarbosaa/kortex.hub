import PublicPageLayout from "@/components/PublicPageLayout";

const Carreiras = () => {
  return (
    <PublicPageLayout title="Carreiras na GABS" description="Junte-se à equipe que está construindo o futuro do crescimento digital.">
      <p className="mb-8">
        Estamos sempre em busca de talentos excepcionais que sejam apaixonados por tecnologia,
        design e performance. Confira nossas vagas abertas abaixo.
      </p>

      <div className="space-y-4">
        <div className="bg-foreground/[0.02] border border-border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Engenheiro Full Stack (React / Node.js)</h3>
            <p className="text-sm text-muted-foreground mt-1">Remoto • Tempo Integral • Sênior</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm w-fit">Aplicar</button>
        </div>

        <div className="bg-foreground/[0.02] border border-border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Especialista em Automação (n8n)</h3>
            <p className="text-sm text-muted-foreground mt-1">Remoto • Tempo Integral • Pleno</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm w-fit">Aplicar</button>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default Carreiras;
