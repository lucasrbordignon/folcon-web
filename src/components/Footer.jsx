
import React from "react";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary h-10 w-10 rounded flex items-center justify-center text-white font-bold text-xl">R</div>
              <span className="ml-2 text-2xl font-bold text-white">Roma</span>
            </div>
            <p className="text-sm mb-4">
              Há mais de 30 anos oferecendo as melhores soluções em materiais para construção e acabamento, com qualidade e preço justo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-sm">(11) 4002-8922</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-sm">contato@roma.com.br</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 13h</span>
              </li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Sobre Nós</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Produtos</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Nossas Lojas</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Termos e Condições</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors">Trabalhe Conosco</a>
              </li>
            </ul>
          </div>
          
          {/* Payment */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Formas de Pagamento</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded h-8 w-12 flex items-center justify-center">
                  <div className="bg-gray-700 h-4 w-6 rounded"></div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">Segurança</h3>
            <div className="flex space-x-2">
              <div className="bg-gray-800 rounded h-10 w-20 flex items-center justify-center">
                <div className="bg-gray-700 h-6 w-16 rounded"></div>
              </div>
              <div className="bg-gray-800 rounded h-10 w-20 flex items-center justify-center">
                <div className="bg-gray-700 h-6 w-16 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 Roma. Todos os direitos reservados.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Desenvolvido por</span>
              <span className="ml-2 text-sm font-medium text-white">Hostinger Horizons</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
