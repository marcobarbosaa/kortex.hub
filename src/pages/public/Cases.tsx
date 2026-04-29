import PublicPageLayout from "@/components/PublicPageLayout";

const Cases = () => {
  return (
    <PublicPageLayout title="Cases de Sucesso" description="Veja como ajudamos nossos clientes a alcançarem resultados excepcionais.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-foreground/[0.03] border border-foreground/[0.08] rounded-xl p-6">
          <div className="h-48 bg-muted rounded-lg mb-6 flex items-center justify-center">
            <span className="text-muted-foreground font-semibold">Em breve</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Startup Tech</h3>
          <p className="text-muted-foreground mb-4">Aumento de 300% em leads qualificados em 3 meses com LPs e Automações.</p>
        </div>
        <div className="bg-foreground/[0.03] border border-foreground/[0.08] rounded-xl p-6">
          <div className="h-48 bg-muted rounded-lg mb-6 flex items-center justify-center">
            <span className="text-muted-foreground font-semibold">Em breve</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">SaaS Enterprise</h3>
          <p className="text-muted-foreground mb-4">Redução de churn em 15% através do redesign da plataforma e Web Apps customizados.</p>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default Cases;
