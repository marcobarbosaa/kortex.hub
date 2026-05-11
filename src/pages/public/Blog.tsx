import PublicPageLayout from "@/components/PublicPageLayout";

const Blog = () => {
  return (
    <PublicPageLayout title="Blog GABS" description="Insights, estratégias e novidades sobre tecnologia e crescimento digital.">
      <div className="space-y-8 mt-8">
        <article className="border-b border-border pb-8">
          <span className="text-kortex-orange text-sm font-semibold">Tecnologia</span>
          <h2 className="text-2xl font-bold text-foreground mt-2 mb-3">Como a Automação pode reduzir seus custos operacionais em 40%</h2>
          <p className="text-muted-foreground">
            Descubra as principais ferramentas e fluxos de trabalho que as maiores empresas estão
            utilizando para escalar com equipes reduzidas.
          </p>
          <button className="text-primary mt-4 font-semibold text-sm hover:underline">Ler mais →</button>
        </article>
        
        <article className="border-b border-border pb-8">
          <span className="text-kortex-orange text-sm font-semibold">Design & Conversão</span>
          <h2 className="text-2xl font-bold text-foreground mt-2 mb-3">Os segredos por trás das Landing Pages que faturam milhões</h2>
          <p className="text-muted-foreground">
            Uma análise profunda dos padrões de design e copy que garantem taxas de conversão acima da média do mercado.
          </p>
          <button className="text-primary mt-4 font-semibold text-sm hover:underline">Ler mais →</button>
        </article>
      </div>
    </PublicPageLayout>
  );
};

export default Blog;
