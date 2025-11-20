
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Contact, Home, LogOut, LucideIcon, Package, Settings, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clientes" },
  { to: "/contacts", icon: Contact, label: "Contatos" },
  { to: "/products", icon: Package, label: "Produtos" },
  { to: "/tasks", icon: CheckSquare, label: "Tarefas" },
];

const Sidebar: React.FC<SidebarProps> = ({ onLogout, user }) => {
  const location = useLocation();
  const userEmail = user?.email || "Usuário";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside 
        className="hidden md:flex md:flex-col md:w-56 bg-card border-r h-screen sticky top-0"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-center h-16 border-b px-4">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-2xl font-bold text-foreground">CRM Pro</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={location.pathname === item.to ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                >
                  <Link to={item.to}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        
        <div className="px-4 py-6 border-t space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={location.pathname === "/settings" ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
              >
                <Link to="/settings">
                  <Settings className="mr-3 h-4 w-4" />
                  Configurações
                </Link>
              </Button>
            </TooltipTrigger>
             <TooltipContent side="right" className="md:hidden">
              Configurações
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-sm" onClick={onLogout}>
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="md:hidden">
              Sair
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="px-4 py-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={userEmail} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground truncate">{user?.user_metadata?.full_name || userEmail}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar (Bottom Nav) */}
      <motion.aside 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around py-1.5 z-50 shadow-t-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {navItems.map((item) => ( 
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={`flex flex-col items-center h-auto p-1.5 rounded-md ${location.pathname === item.to ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
              >
                <Link to={item.to}>
                  <item.icon className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </Link>
              </Button>
            </TooltipTrigger>
             <TooltipContent side="top">
                {item.label}
              </TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
             <Button
                asChild
                variant="ghost"
                size="icon"
                className={`flex flex-col items-center h-auto p-1.5 rounded-md ${location.pathname === "/settings" ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] leading-tight">Ajustes</span>
                </Link>
              </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
              Configurações
          </TooltipContent>
        </Tooltip>
      </motion.aside>
    </TooltipProvider>
  );
};

export default Sidebar;
