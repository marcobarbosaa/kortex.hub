import PublicPageLayout from "@/components/PublicPageLayout";

const Cookies = () => {
  return (
    <PublicPageLayout title="Política de Cookies" description="Como utilizamos cookies para melhorar sua experiência.">
      <h2>O que são cookies?</h2>
      <p>
        Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita um site. 
        Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente, bem como para 
        fornecer informações analíticas aos proprietários do site.
      </p>
      
      <h2>Como a GABS utiliza cookies</h2>
      <p>
        Utilizamos cookies de sessão (que expiram ao fechar o navegador) e cookies persistentes (que permanecem 
        no dispositivo) para:
      </p>
      <ul>
        <li>Manter você logado na plataforma de forma segura.</li>
        <li>Lembrar suas preferências de interface (ex: Dark Mode).</li>
        <li>Analisar o tráfego e comportamento do usuário para otimizar nossos fluxos de navegação.</li>
      </ul>

      <h2>Gerenciamento</h2>
      <p>
        Você pode controlar e/ou excluir cookies conforme desejar em seu próprio navegador. Note que desativar 
        cookies estritamente necessários pode afetar a funcionalidade da plataforma GABS.
      </p>
    </PublicPageLayout>
  );
};

export default Cookies;
