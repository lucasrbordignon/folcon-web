import ConfirmationDialog from '@/components/ConfirmationDialog';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { Database } from '@/types/database';

type Contact = Database['public']['Tables']['contacts']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type ContactFormData = Database['public']['Tables']['contacts']['Insert'];

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    notes: '',
    client_id: null,
  });
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchContactsAndClients = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const [contactsResponse, clientsResponse] = await Promise.all([
      supabase
        .from('contacts')
        .select('*, clients (id, name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', user.id)
    ]);

    if (contactsResponse.error) {
      toast({ title: "Erro ao buscar contatos", description: contactsResponse.error.message, variant: "destructive" });
    } else if (contactsResponse.data) {
      setContacts(contactsResponse.data as Contact[]);
    }

    if (clientsResponse.error) {
      toast({ title: "Erro ao buscar clientes", description: clientsResponse.error.message, variant: "destructive" });
    } else if (clientsResponse.data) {
      setClients(clientsResponse.data as Client[]);
    }

    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchContactsAndClients();
  }, [fetchContactsAndClients]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, client_id: value === "null" ? null : value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const contactData: ContactFormData = {
      ...formData,
      client_id: formData.client_id === "null" || formData.client_id === "" ? null : formData.client_id,
    };

    let error;
    if (editingContact) {
      ({ error } = await supabase.from('contacts').update(contactData).eq('id', editingContact.id));
    } else {
      ({ error } = await supabase.from('contacts').insert(contactData));
    }

    if (error) {
      toast({ title: `Erro ao ${editingContact ? 'atualizar' : 'adicionar'} contato`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Contato ${editingContact ? 'atualizado' : 'adicionado'} com sucesso!` });
      setIsSheetOpen(false);
      setEditingContact(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        notes: '',
        client_id: null,
      });
      fetchContactsAndClients();
    }
    setIsLoading(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      role: contact.role || '',
      notes: contact.notes || '',
      client_id: contact.client_id || null,
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteContactId(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteContactId) return;
    setIsLoading(true);
    const { error } = await supabase.from('contacts').delete().eq('id', deleteContactId);

    if (error) {
      toast({ title: "Erro ao excluir contato", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contato excluído com sucesso!" });
      fetchContactsAndClients();
    }
    setDeleteContactId(null);
    setIsLoading(false);
  };

  const columns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Telefone' },
    { accessorKey: 'company', header: 'Empresa' },
    { accessorKey: 'role', header: 'Cargo' },
    { accessorKey: 'clients.name', header: 'Cliente Associado', cell: ({ row }: any) => row.original.clients?.name || '-' },
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contatos</h1>
        <Button
          onClick={() => {
            setEditingContact(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              role: '',
              notes: '',
              client_id: null,
            });
            setIsSheetOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Contato
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isLoading && contacts.length === 0 ? (
          <p className="text-muted-foreground">Carregando contatos...</p>
        ) : (
          <DataTable
            columns={columns}
            data={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filterColumn="name"
          />
        )}
      </motion.div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingContact ? 'Editar Contato' : 'Adicionar Novo Contato'}</SheetTitle>
            <SheetDescription>
              {editingContact ? 'Atualize as informações do contato.' : 'Preencha os detalhes do novo contato.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" name="company" value={formData.company || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="role">Cargo/Função</Label>
              <Input id="role" name="role" value={formData.role || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="client_id">Associar ao Cliente (Opcional)</Label>
              <Select onValueChange={handleSelectChange} value={formData.client_id || "null"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Nenhum</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Contato'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ContactsPage;
