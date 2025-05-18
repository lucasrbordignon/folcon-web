
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Transforme sua casa com nossos produtos",
    subtitle: "Pisos, revestimentos e muito mais para sua reforma",
    cta: "Ver ofertas",
    bgColor: "from-orange-500 to-red-600",
  },
  {
    id: 2,
    title: "Novidades em porcelanatos",
    subtitle: "Conheça nossa linha exclusiva de porcelanatos importados",
    cta: "Explorar coleção",
    bgColor: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Promoção de tintas",
    subtitle: "Até 30% de desconto em tintas selecionadas",
    cta: "Aproveitar",
    bgColor: "from-green-500 to-teal-600",
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] mt-[120px] md:mt-[160px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className={`absolute inset-0 flex items-center ${index === currentSlide ? 'z-10' : 'z-0'}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentSlide ? 1 : 0,
          }}
          transition={{ duration: 0.7 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}></div>
          
          <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-6 opacity-90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button className="bg-white text-gray-800 hover:bg-gray-100 font-medium px-6 py-3 rounded-md">
                  {slide.cta} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div 
                className="w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <img  className="w-full h-auto rounded-lg shadow-2xl" alt="Produtos para construção" src="https://images.unsplash.com/photo-1677942506125-b87be0bd8c24" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
