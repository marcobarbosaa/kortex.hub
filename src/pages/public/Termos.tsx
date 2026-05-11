import PublicPageLayout from "@/components/PublicPageLayout";

const Termos = () => {
  return (
    <PublicPageLayout title="Termos de Uso" description="Última atualização: Abril de 2026">
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar ou usar a plataforma GABS (aplicativos, sites, integrações), você concorda em ficar vinculado 
        a estes Termos de Serviço e a todas as leis e regulamentos aplicáveis.
      </p>
      
      <h2>2. Licença de Uso</h2>
      <p>
        Concedemos a você uma licença limitada, não exclusiva e não transferível para acessar e usar a Plataforma GABS 
        para fins comerciais internos. A engenharia reversa, cópia de código-fonte ou redistribuição não autorizada é 
        estritamente proibida e resultará no encerramento imediato da conta.
      </p>

      <h2>3. Disponibilidade e SLA</h2>
      <p>
        A GABS se esforça para manter uma disponibilidade de 99.9% de seus serviços. No entanto, não garantimos 
        que a plataforma será ininterrupta, especialmente durante janelas de manutenção programada previamente comunicadas.
      </p>
    </PublicPageLayout>
  );
};

export default Termos;
