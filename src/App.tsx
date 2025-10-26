
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ClientsPage from "@/pages/ClientsPage";
import ContactsPage from "@/pages/ContactsPage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductsPage from "@/pages/ProductsPage";
import SettingsPage from "@/pages/SettingsPage";
import TasksPage from "@/pages/TasksPage";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    let isInitialLoad = true;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    getSession();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
          toast({ title: "Logout realizado.", description: "Até logo!" });
        }
      }
    );

    isInitialLoad = false;

    return () => {
      authSubscription?.subscription?.unsubscribe();
    };
  }, [toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro no Logout", description: error.message, variant: "destructive" });
    }
  };
  
  const isAuthenticated = !!session;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="p-8 rounded-lg">
          <p className="text-lg font-semibold text-primary">Carregando CRM Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-muted/40">
        {isAuthenticated && <Sidebar onLogout={handleLogout} user={session?.user} />}
        <div className="flex-1 flex flex-col">
          {isAuthenticated && <Header user={session?.user} onLogout={handleLogout}/>}
          <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto ${!isAuthenticated ? 'h-screen flex items-center justify-center' : ''}`}>
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
              />
              <Route 
                path="/" 
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/clients" 
                element={isAuthenticated ? <ClientsPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/contacts" 
                element={isAuthenticated ? <ContactsPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/products" 
                element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/tasks" 
                element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/settings" 
                element={isAuthenticated ? <SettingsPage user={session?.user} /> : <Navigate to="/login" />} 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
