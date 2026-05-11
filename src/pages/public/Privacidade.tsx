import PublicPageLayout from "@/components/PublicPageLayout";

const Privacidade = () => {
  return (
    <PublicPageLayout title="Política de Privacidade" description="Última atualização: Abril de 2026">
      <h2>1. Coleta de Dados</h2>
      <p>
        A GABS coleta as seguintes informações: dados de cadastro (nome, email, telefone), dados de navegação 
        (IP, cookies, páginas visitadas) e dados relacionados ao uso dos nossos sistemas e integrações (quando 
        autorizado via CRM ou APIs conectadas).
      </p>
      
      <h2>2. Uso das Informações</h2>
      <p>
        Utilizamos suas informações para: prover, operar e manter os serviços da plataforma; otimizar nossos algoritmos 
        de inteligência e automação; enviar relatórios técnicos; processar pagamentos e prevenir fraudes.
      </p>

      <h2>3. Compartilhamento</h2>
      <p>
        Não vendemos seus dados para terceiros. O compartilhamento ocorre estritamente com provedores de infraestrutura 
        (cloud, gateways de pagamento) essenciais para o funcionamento da plataforma GABS, sob rígidos acordos de confidencialidade.
      </p>
    </PublicPageLayout>
  );
};

export default Privacidade;
