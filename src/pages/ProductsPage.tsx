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
import { Database } from '@/types/database';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

type ProductType = 'product' | 'service';

type Product = Database['public']['Tables']['products']['Row'];

interface FormData {
  name: string;
  description: string;
  price: string;
  type: ProductType;
}

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', description: '', price: '', type: 'product' });
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
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
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro ao buscar produtos/serviços", description: error.message, variant: "destructive" });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: ProductType) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      description: product.description || '', 
      price: product.price !== null && product.price !== undefined ? product.price.toString() : '', 
      type: (product.type === 'product' || product.type === 'service') ? product.type : 'product'
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
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
    { accessorKey: 'type', header: 'Tipo', cell: ({ row }: any) => row.original.type === 'product' ? 'Produto' : 'Serviço' },
    { accessorKey: 'price', header: 'Preço', cell: ({ row }: any) => `R$ ${Number(row.original.price).toFixed(2)}` },
    { accessorKey: 'description', header: 'Descrição', cell: ({ row }: any) => <p className="truncate max-w-xs">{row.original.description}</p> },
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
