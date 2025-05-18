
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Promotions = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/80 rounded-lg"></div>
            
            <div className="relative p-8 md:p-10 flex flex-col h-full">
              <div className="mb-auto">
                <span className="inline-block bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">Oferta Especial</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pisos e Revestimentos com até 40% OFF</h3>
                <p className="text-blue-100 mb-6">Aproveite descontos exclusivos em porcelanatos, cerâmicas e muito mais.</p>
              </div>
              
              <Button className="bg-white text-blue-700 hover:bg-blue-50 self-start">
                Ver ofertas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end">
              <img  
                className="h-4/5 object-contain object-bottom" 
                alt="Promoção de pisos e revestimentos"
               src="https://images.unsplash.com/photo-1460447325427-ce3901d00a6d" />
            </div>
          </motion.div>
          
          <motion.div 
            className="relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 to-orange-600/80 rounded-lg"></div>
            
            <div className="relative p-8 md:p-10 flex flex-col h-full">
              <div className="mb-auto">
                <span className="inline-block bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">Novidade</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Nova coleção de metais para banheiro</h3>
                <p className="text-orange-100 mb-6">Conheça nossa linha exclusiva de torneiras, chuveiros e acessórios.</p>
              </div>
              
              <Button className="bg-white text-orange-600 hover:bg-orange-50 self-start">
                Explorar coleção <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end">
              <img  
                className="h-4/5 object-contain object-bottom" 
                alt="Nova coleção de metais para banheiro"
               src="https://images.unsplash.com/photo-1581786555508-718849566a39" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
