
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Carlos Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Excelente atendimento e produtos de alta qualidade. Reformei minha casa inteira com produtos da Roma e fiquei muito satisfeito com o resultado final.",
    image: "carlos-silva"
  },
  {
    id: 2,
    name: "Ana Oliveira",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Os porcelanatos que comprei são lindos e a entrega foi super rápida. O atendimento online foi muito eficiente e esclarecedor.",
    image: "ana-oliveira"
  },
  {
    id: 3,
    name: "Marcelo Santos",
    location: "Belo Horizonte, MG",
    rating: 4,
    text: "Ótima variedade de produtos para banheiro. Consegui encontrar tudo o que precisava em um só lugar e com preços competitivos.",
    image: "marcelo-santos"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="section-title text-center mb-12">O que nossos clientes dizem</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img  
                        className="w-14 h-14 rounded-full object-cover" 
                        alt={`Foto de ${testimonial.name}`}
                       src="https://images.unsplash.com/photo-1645220127514-f7ece06772a8" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
