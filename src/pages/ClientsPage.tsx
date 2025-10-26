import ConfirmationDialog from '@/components/ConfirmationDialog';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/database';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Client = Database['public']['Tables']['clients']['Row'];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', company: '', address: '' });
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro ao buscar clientes", description: error.message, variant: "destructive" });
    } else {
      setClients(data ?? []);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const clientData = { ...formData, user_id: user.id };

    let error;
    if (editingClient) {
      ({ error } = await supabase.from('clients').update(clientData).eq('id', editingClient.id));
    } else {
      ({ error } = await supabase.from('clients').insert(clientData));
    }

    if (error) {
      toast({ title: `Erro ao ${editingClient ? 'atualizar' : 'adicionar'} cliente`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Cliente ${editingClient ? 'atualizado' : 'adicionado'} com sucesso!` });
      setIsSheetOpen(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', company: '', address: '' });
      fetchClients();
    }
    setIsLoading(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || ''
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteClientId(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteClientId) return;
    setIsLoading(true);
    const { error } = await supabase.from('clients').delete().eq('id', deleteClientId);
    if (error) {
      toast({ title: "Erro ao excluir cliente", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente excluído com sucesso!" });
      fetchClients();
    }
    setDeleteClientId(null);
    setIsLoading(false);
  };

  const columns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Telefone' },
    { accessorKey: 'company', header: 'Empresa' },
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
        <Button onClick={() => { 
          setEditingClient(null); 
          setFormData({ name: '', email: '', phone: '', company: '', address: '' }); 
          setIsSheetOpen(true); 
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Cliente
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isLoading && clients.length === 0 ? (
          <p className="text-muted-foreground">Carregando clientes...</p>
        ) : (
          <DataTable
            columns={columns}
            data={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filterColumn="name"
          />
        )}
      </motion.div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</SheetTitle>
            <SheetDescription>
              {editingClient ? 'Atualize as informações do cliente.' : 'Preencha os detalhes do novo cliente.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Cliente'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ClientsPage;
