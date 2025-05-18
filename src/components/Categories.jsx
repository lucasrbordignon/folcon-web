
import React from "react";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Pisos e Revestimentos",
    image: "porcelanato-category",
    description: "Porcelanatos, cerâmicas e muito mais"
  },
  {
    id: 2,
    name: "Banheiros",
    image: "bathroom-category",
    description: "Louças, metais e acessórios"
  },
  {
    id: 3,
    name: "Cozinhas",
    image: "kitchen-category",
    description: "Pias, torneiras e armários"
  },
  {
    id: 4,
    name: "Tintas",
    image: "paint-category",
    description: "Tintas para interior e exterior"
  },
  {
    id: 5,
    name: "Ferramentas",
    image: "tools-category",
    description: "Ferramentas elétricas e manuais"
  },
  {
    id: 6,
    name: "Materiais de Construção",
    image: "construction-category",
    description: "Cimentos, argamassas e mais"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const Categories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="section-title text-center mb-12">Categorias em Destaque</h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              className="category-card group"
              variants={itemVariants}
            >
              <img  
                className="w-full h-64 object-cover rounded-lg" 
                alt={`Categoria ${category.name}`}
               src="https://images.unsplash.com/photo-1592414744208-e1c195640d05" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg"></div>
              
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.description}</p>
              </div>
              
              <div className="category-card-overlay">
                <a href="#" className="btn-primary">Ver produtos</a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
