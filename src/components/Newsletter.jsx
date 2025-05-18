
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu e-mail.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Sucesso!",
        description: "Você foi inscrito em nossa newsletter.",
      });
      setEmail("");
    }, 500);
  };

  return (
    <section className="py-16 bg-primary/10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Receba nossas ofertas exclusivas
            </h2>
            <p className="text-gray-600 mb-8">
              Inscreva-se em nossa newsletter e receba promoções, novidades e dicas para sua casa.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="gap-2">
                Inscrever <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">
              Ao se inscrever, você concorda com nossa política de privacidade.
              Não compartilhamos seus dados com terceiros.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
