
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-5xl font-bold text-foreground mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">
        Oops! A página que você está procurando não foi encontrada.
      </p>
      <Button asChild>
        <Link to="/">Voltar para o Dashboard</Link>
      </Button>
    </motion.div>
  );
};

export default NotFoundPage;
