
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Porcelanato Polido Bianco 80x80",
    price: 89.90,
    oldPrice: 109.90,
    image: "porcelanato-bianco",
    discount: true,
    isNew: false,
    rating: 4.8
  },
  {
    id: 2,
    name: "Torneira Monocomando para Cozinha",
    price: 249.90,
    oldPrice: null,
    image: "torneira-cozinha",
    discount: false,
    isNew: true,
    rating: 4.5
  },
  {
    id: 3,
    name: "Tinta Acrílica Premium 18L",
    price: 299.90,
    oldPrice: 349.90,
    image: "tinta-premium",
    discount: true,
    isNew: false,
    rating: 4.7
  },
  {
    id: 4,
    name: "Kit Gabinete para Banheiro com Cuba",
    price: 599.90,
    oldPrice: null,
    image: "gabinete-banheiro",
    discount: false,
    isNew: true,
    rating: 4.6
  },
  {
    id: 5,
    name: "Revestimento 3D Autoadesivo",
    price: 59.90,
    oldPrice: 79.90,
    image: "revestimento-3d",
    discount: true,
    isNew: false,
    rating: 4.3
  },
  {
    id: 6,
    name: "Chuveiro Elétrico Advanced",
    price: 189.90,
    oldPrice: null,
    image: "chuveiro-eletrico",
    discount: false,
    isNew: false,
    rating: 4.9
  },
  {
    id: 7,
    name: "Argamassa Colante Flexível 20kg",
    price: 39.90,
    oldPrice: 49.90,
    image: "argamassa-flexivel",
    discount: true,
    isNew: false,
    rating: 4.4
  },
  {
    id: 8,
    name: "Furadeira de Impacto Profissional",
    price: 349.90,
    oldPrice: 399.90,
    image: "furadeira-impacto",
    discount: true,
    isNew: false,
    rating: 4.8
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

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="section-title text-center mb-12">Produtos em Destaque</h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Card className="h-full product-card group">
                <div className="relative overflow-hidden">
                  <img  
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={product.name}
                   src="https://images.unsplash.com/photo-1592414744208-e1c195640d05" />
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.discount && (
                      <Badge variant="default" className="bg-primary">
                        Oferta
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="secondary" className="bg-blue-500">
                        Novo
                      </Badge>
                    )}
                  </div>
                  
                  <button className="absolute top-2 left-2 bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <CardContent className="pt-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>
                  
                  <div className="flex items-baseline mb-2">
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through mr-2">
                        R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    em até 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="px-8">Ver mais produtos</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
