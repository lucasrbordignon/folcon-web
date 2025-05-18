
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import DataTable from '@/components/DataTable';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', type: 'product' });
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro ao buscar produtos/serviços", description: error.message, variant: "destructive" });
    } else {
      setProducts(data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, type: value }));
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

    const productData = { ...formData, user_id: user.id, price: parseFloat(formData.price) || 0 };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from('products').update(productData).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert(productData));
    }

    if (error) {
      toast({ title: `Erro ao ${editingProduct ? 'atualizar' : 'adicionar'} produto/serviço`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Produto/Serviço ${editingProduct ? 'atualizado' : 'adicionado'} com sucesso!` });
      setIsSheetOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', type: 'product' });
      fetchProducts();
    }
    setIsLoading(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description || '', price: product.price || '', type: product.type || 'product' });
    setIsSheetOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;
    setIsLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', deleteProductId);
    if (error) {
      toast({ title: "Erro ao excluir produto/serviço", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Produto/Serviço excluído com sucesso!" });
      fetchProducts();
    }
    setDeleteProductId(null);
    setIsLoading(false);
  };

  const columns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'type', header: 'Tipo', cell: ({ row }) => row.original.type === 'product' ? 'Produto' : 'Serviço' },
    { accessorKey: 'price', header: 'Preço', cell: ({ row }) => `R$ ${Number(row.original.price).toFixed(2)}` },
    { accessorKey: 'description', header: 'Descrição', cell: ({row}) => <p className="truncate max-w-xs">{row.original.description}</p> },
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Produtos/Serviços</h1>
        <Button onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', type: 'product' }); setIsSheetOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {isLoading && products.length === 0 ? (
          <p className="text-muted-foreground">Carregando produtos/serviços...</p>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            filterColumn="name"
          />
        )}
      </motion.div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingProduct ? 'Editar Produto/Serviço' : 'Adicionar Novo Produto/Serviço'}</SheetTitle>
            <SheetDescription>
              {editingProduct ? 'Atualize as informações.' : 'Preencha os detalhes.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Produto</SelectItem>
                  <SelectItem value="service">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ProductsPage;
