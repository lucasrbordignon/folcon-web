
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, CalendarPlus as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import DataTable from '@/components/DataTable';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', due_date: null, status: 'pending', priority: 'medium', client_id: null });
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchTasksAndClients = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const [tasksResponse, clientsResponse] = await Promise.all([
      supabase.from('tasks').select('*, clients (id, name)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').eq('user_id', user.id)
    ]);

    if (tasksResponse.error) {
      toast({ title: "Erro ao buscar tarefas", description: tasksResponse.error.message, variant: "destructive" });
    } else {
      setTasks(tasksResponse.data);
    }

    if (clientsResponse.error) {
      toast({ title: "Erro ao buscar clientes para tarefas", description: clientsResponse.error.message, variant: "destructive" });
    } else {
      setClients(clientsResponse.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTasksAndClients();
  }, [fetchTasksAndClients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, due_date: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const taskData = { ...formData, user_id: user.id, client_id: formData.client_id === "null" || formData.client_id === "" ? null : formData.client_id };
    
    let error;
    if (editingTask) {
      ({ error } = await supabase.from('tasks').update(taskData).eq('id', editingTask.id));
    } else {
      ({ error } = await supabase.from('tasks').insert(taskData));
    }

    if (error) {
      toast({ title: `Erro ao ${editingTask ? 'atualizar' : 'adicionar'} tarefa`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Tarefa ${editingTask ? 'atualizada' : 'adicionada'} com sucesso!` });
      setIsSheetOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', due_date: null, status: 'pending', priority: 'medium', client_id: null });
      fetchTasksAndClients();
    }
    setIsLoading(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ 
      title: task.title, 
      description: task.description || '', 
      due_date: task.due_date ? new Date(task.due_date) : null, 
      status: task.status || 'pending', 
      priority: task.priority || 'medium',
      client_id: task.client_id || null
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteTaskId(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    setIsLoading(true);
    const { error } = await supabase.from('tasks').delete().eq('id', deleteTaskId);
    if (error) {
      toast({ title: "Erro ao excluir tarefa", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tarefa excluída com sucesso!" });
      fetchTasksAndClients();
    }
    setDeleteTaskId(null);
    setIsLoading(false);
  };

  const statusMap = { pending: 'Pendente', in_progress: 'Em Progresso', completed: 'Concluída' };
  const priorityMap = { low: 'Baixa', medium: 'Média', high: 'Alta' };

  const columns = [
    { accessorKey: 'title', header: 'Título' },
    { accessorKey: 'clients.name', header: 'Cliente', cell: ({row}) => row.original.clients?.name || '-' },
    { accessorKey: 'due_date', header: 'Prazo', cell: ({row}) => row.original.due_date ? format(new Date(row.original.due_date), 'dd/MM/yyyy') : '-' },
    { accessorKey: 'status', header: 'Status', cell: ({row}) => statusMap[row.original.status] || row.original.status },
    { accessorKey: 'priority', header: 'Prioridade', cell: ({row}) => priorityMap[row.original.priority] || row.original.priority },
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tarefas</h1>
        <Button onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', due_date: null, status: 'pending', priority: 'medium', client_id: null }); setIsSheetOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isLoading && tasks.length === 0 ? (
          <p className="text-muted-foreground">Carregando tarefas...</p>
        ) : (
          <DataTable
            columns={columns}
            data={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filterColumn="title"
          />
        )}
      </motion.div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</SheetTitle>
            <SheetDescription>
              {editingTask ? 'Atualize os detalhes da tarefa.' : 'Preencha as informações da nova tarefa.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="client_id">Cliente (Opcional)</Label>
              <Select onValueChange={(value) => handleSelectChange('client_id', value)} value={formData.client_id || "null"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Nenhum</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="due_date">Prazo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!formData.due_date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleSelectChange('status', value)} defaultValue={formData.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select onValueChange={(value) => handleSelectChange('priority', value)} defaultValue={formData.priority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Tarefa'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default TasksPage;
