import PublicPageLayout from "@/components/PublicPageLayout";
import { Button } from "@/components/ui/button";

const Contato = () => {
  return (
    <PublicPageLayout title="Fale com a Kortex" description="Estamos prontos para entender seus desafios e projetar a solução ideal.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Como podemos ajudar?</h3>
          <p className="text-muted-foreground mb-8">
            Preencha o formulário e um de nossos especialistas em crescimento entrará em contato em até 24 horas.
          </p>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Email Institucional</p>
              <p className="text-muted-foreground">contato@kortex.dev</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Sede Operacional</p>
              <p className="text-muted-foreground">São Paulo, SP - Brasil (Operação 100% Remota)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-foreground/[0.02] border border-border rounded-xl p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nome Completo</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Profissional</label>
              <input type="email" className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Mensagem</label>
              <textarea rows={4} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-primary"></textarea>
            </div>
            <Button className="w-full">Enviar Mensagem</Button>
          </form>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default Contato;
