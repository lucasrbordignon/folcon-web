
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface DataTableProps {
  columns: Array<{
    accessorKey: string;
    header: string;
    cell?: (info: { row: { original: any } }) => React.ReactNode;
  }>;
  data: Array<any>;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  filterColumn?: string;
  columnVisibility?: Record<string, boolean>;
}

type ColumnVisibilityState = Record<string, boolean>;

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  filterColumn,
  columnVisibility = {}
}) => {
  const [filter, setFilter] = useState('');
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<ColumnVisibilityState>(
    columns.reduce((acc, col) => {
      acc[col.accessorKey] = columnVisibility[col.accessorKey] !== undefined ? columnVisibility[col.accessorKey] : true;
      return acc;
    }, {} as ColumnVisibilityState)
  );

  const filteredData = data.filter((item) => {
    if (!filterColumn || !filter) return true;
    const value = item[filterColumn];
    return String(value).toLowerCase().includes(filter.toLowerCase());
  });

  const visibleColumns = columns.filter(col => internalColumnVisibility[col.accessorKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {filterColumn && (
          <Input
            placeholder={`Filtrar por ${columns.find(c => c.accessorKey === filterColumn)?.header.toLowerCase()}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.accessorKey}
                className="capitalize"
                checked={internalColumnVisibility[column.accessorKey]}
                onCheckedChange={(value) =>
                  setInternalColumnVisibility((prev) => ({ ...prev, [column.accessorKey]: !!value }))
                }
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && <DropdownMenuItem onClick={() => onEdit(row)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>}
                          {onDelete && <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + ((onEdit || onDelete) ? 1 : 0)} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Add pagination controls here if needed */}
    </div>
  );
};

export default DataTable;
