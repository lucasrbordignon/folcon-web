
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Menu, X, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const categories = [
  {
    name: "Pisos e Revestimentos",
    subcategories: ["Porcelanatos", "Cerâmicas", "Vinílicos", "Laminados"]
  },
  {
    name: "Banheiros",
    subcategories: ["Louças", "Metais", "Acessórios", "Gabinetes"]
  },
  {
    name: "Cozinhas",
    subcategories: ["Pias", "Torneiras", "Armários", "Acessórios"]
  },
  {
    name: "Tintas",
    subcategories: ["Interiores", "Exteriores", "Esmaltes", "Vernizes"]
  },
  {
    name: "Ferramentas",
    subcategories: ["Elétricas", "Manuais", "Jardinagem", "Segurança"]
  },
  {
    name: "Materiais de Construção",
    subcategories: ["Cimentos", "Argamassas", "Tijolos", "Telhas"]
  }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-100 py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              <span>(11) 4002-8922</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Encontre uma loja</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Central de Atendimento</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Blog</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.div 
        className={`w-full ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'} transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <div className="bg-primary h-10 w-10 rounded flex items-center justify-center text-white font-bold text-xl">R</div>
              <span className="ml-2 text-2xl font-bold text-gray-800">Roma</span>
            </a>
          </div>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="O que você está procurando?" 
                className="w-full pr-10 focus:border-primary"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="hidden md:flex items-center text-gray-700 hover:text-primary">
              <User className="h-5 w-5" />
              <span className="ml-1 text-sm">Minha Conta</span>
            </a>
            <a href="#" className="relative flex items-center text-gray-700 hover:text-primary">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </a>
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className={`bg-gray-50 border-b border-gray-200 hidden md:block ${isScrolled ? 'py-1' : 'py-2'} transition-all duration-300`}>
        <div className="container">
          <NavigationMenu className="max-w-full justify-start">
            <NavigationMenuList className="space-x-2">
              {categories.map((category) => (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-primary hover:bg-transparent focus:bg-transparent">
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white p-4 rounded-md shadow-lg w-[400px]">
                    <ul className="grid grid-cols-2 gap-3">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <NavigationMenuLink asChild>
                            <a
                              href="#"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{subcategory}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="text-primary font-medium hover:text-primary/80 px-4 py-2 inline-block"
                  href="#"
                >
                  Ofertas
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-white z-50 pt-20 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container py-4">
            <div className="mb-6">
              <Input 
                type="text" 
                placeholder="O que você está procurando?" 
                className="w-full pr-10"
              />
              <Search className="absolute right-7 top-24 transform h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="border-b border-gray-100 pb-4">
                  <h3 className="font-medium text-gray-800 mb-2">{category.name}</h3>
                  <ul className="pl-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory}>
                        <a href="#" className="text-gray-600 hover:text-primary">{subcategory}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pt-2">
                <a href="#" className="text-primary font-medium block py-2">Ofertas</a>
                <a href="#" className="text-gray-700 block py-2">Minha Conta</a>
                <a href="#" className="text-gray-700 block py-2">Central de Atendimento</a>
                <a href="#" className="text-gray-700 block py-2">Encontre uma loja</a>
                <a href="#" className="text-gray-700 block py-2">Blog</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
