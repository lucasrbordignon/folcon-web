
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Lock, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha e-mail e senha.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast({
        title: "Falha no Login",
        description: error.message || "E-mail ou senha inválidos.",
        variant: "destructive",
      });
    }
    // Auth state change will handle successful login toast via App.jsx
    
    setIsLoading(false);
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    if (!email) {
      toast({
        title: "E-mail Necessário",
        description: "Por favor, insira seu e-mail para receber o link mágico.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin, 
      },
    });

    if (error) {
      toast({
        title: "Erro ao Enviar Link Mágico",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Link Mágico Enviado",
        description: "Verifique seu e-mail para o link de login.",
      });
    }
    setIsLoading(false);
  };


  return (
    <motion.div 
      className="flex items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 p-3 bg-primary text-primary-foreground rounded-full w-fit"
          >
            <LogIn className="h-8 w-8" />
          </motion.div>
          <CardTitle className="text-3xl font-bold">Bem-vindo ao Fol&Con</CardTitle>
          <CardDescription>Faça login para acessar seu painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={handleMagicLink} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Entrar com Link Mágico'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Não tem uma conta? <a href="#" className="text-primary hover:underline">Contate o suporte</a>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} CRM Pro. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
