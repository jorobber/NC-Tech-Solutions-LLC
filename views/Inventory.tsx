
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Edit2, Trash2, AlertCircle, 
  ArrowUpDown, ArrowUp, ArrowDown, X, Check, Settings,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import { Product, Category, Unit } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, categories, setCategories, units, setUnits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Estados para la edición de stock en línea
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState('');

  // Estados para el Modal (Agregar/Editar general)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: categories[0]?.name || '',
    costPrice: 0,
    stock: 0,
    unit: 'kg'
  });

  // Estado para el Modal de Gestión de Categorías
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Estado para el Modal de Gestión de Unidades
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editUnitName, setEditUnitName] = useState('');

  // Estado para el Modal de Confirmación de Eliminación de Productos
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Estado para el Modal de Confirmación de Eliminación de Categorías
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Estado para el Modal de Confirmación de Eliminación de Unidades
  const [isDeleteUnitModalOpen, setIsDeleteUnitModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  const processedProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleStockSubmit = (id: string) => {
    const newValue = parseInt(tempStockValue);
    if (!isNaN(newValue) && newValue >= 0) {
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, stock: Math.floor(newValue) } : p
      ));
    }
    setEditingStockId(null);
  };

  const columnHelper = createColumnHelper<Product>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 hover:text-orange-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4 text-gray-400" />}
        </button>
      ),
      cell: info => (
        <div>
          <p className="font-medium text-gray-900">{info.getValue()}</p>
          <p className="text-xs text-gray-500">Unidad: {info.row.original.unit}</p>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Categoría',
      cell: info => (
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-md">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('stock', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 hover:text-orange-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          {column.getIsSorted() === 'asc' ? <ArrowUp className="w-4 h-4" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4 text-gray-400" />}
        </button>
      ),
      cell: info => {
        const product = info.row.original;
        const value = info.getValue();
        return editingStockId === product.id ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-200">
            <input
              type="number"
              min="0"
              step="1"
              className="w-20 px-2 py-1 border-2 border-orange-500 rounded outline-none font-bold text-sm"
              value={tempStockValue}
              onChange={e => setTempStockValue(e.target.value)}
              onBlur={() => handleStockSubmit(product.id)}
              onKeyDown={e => e.key === 'Enter' && handleStockSubmit(product.id)}
              autoFocus
            />
            <Check className="w-4 h-4 text-green-600" />
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer group/stock"
            onClick={() => {
              setEditingStockId(product.id);
              setTempStockValue(value.toString());
            }}
            title="Clic para editar stock rápidamente"
          >
            <span className={`font-semibold ${value <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
              {value}
            </span>
            {value <= 5 && <AlertCircle className="w-4 h-4 text-red-500" />}
            <Edit2 className="w-3 h-3 text-orange-400 opacity-0 group-hover/stock:opacity-100 transition-opacity" />
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: info => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEdit(info.row.original)}
            className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            title="Editar información completa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteClick(info.row.original)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ], [editingStockId, tempStockValue, categories]);

  const table = useReactTable({
    data: processedProducts,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: categories[0]?.name || '',
      costPrice: 0,
      stock: 0,
      unit: units[0]?.name || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      costPrice: product.costPrice,
      stock: product.stock,
      unit: product.unit
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setProducts(prev => prev.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      ));
    } else {
      const id = Math.random().toString(36).substr(2, 9);
      setProducts(prev => [...prev, { ...formData, id }]);
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const id = Math.random().toString(36).substr(2, 9);
    setCategories(prev => [...prev, { id, name: newCategoryName.trim() }]);
    setNewCategoryName('');
  };

  const handleUpdateCategory = (id: string) => {
    if (!editCategoryName.trim()) return;
    const oldCategory = categories.find(c => c.id === id);
    if (oldCategory) {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editCategoryName.trim() } : c));
      // Update products that use this category name
      setProducts(prev => prev.map(p => p.category === oldCategory.name ? { ...p, category: editCategoryName.trim() } : p));
    }
    setEditingCategoryId(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    const productsInCategory = products.filter(p => p.category === cat.name);
    if (productsInCategory.length > 0) {
      alert(`No se puede eliminar la categoría "${cat.name}" porque tiene ${productsInCategory.length} productos asociados.`);
      return;
    }

    setCategoryToDelete(cat);
    setIsDeleteCategoryModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setIsDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;
    const id = Math.random().toString(36).substr(2, 9);
    setUnits(prev => [...prev, { id, name: newUnitName.trim() }]);
    setNewUnitName('');
  };

  const handleUpdateUnit = (id: string) => {
    if (!editUnitName.trim()) return;
    const oldUnit = units.find(u => u.id === id);
    if (oldUnit) {
      setUnits(prev => prev.map(u => u.id === id ? { ...u, name: editUnitName.trim() } : u));
      // Update products that use this unit name
      setProducts(prev => prev.map(p => p.unit === oldUnit.name ? { ...p, unit: editUnitName.trim() } : p));
    }
    setEditingUnitId(null);
    setEditUnitName('');
  };

  const handleDeleteUnit = (id: string) => {
    const unit = units.find(u => u.id === id);
    if (!unit) return;

    const productsWithUnit = products.filter(p => p.unit === unit.name);
    if (productsWithUnit.length > 0) {
      alert(`No se puede eliminar la unidad "${unit.name}" porque tiene ${productsWithUnit.length} productos asociados.`);
      return;
    }

    setUnitToDelete(unit);
    setIsDeleteUnitModalOpen(true);
  };

  const confirmDeleteUnit = () => {
    if (unitToDelete) {
      setUnits(prev => prev.filter(u => u.id !== unitToDelete.id));
      setIsDeleteUnitModalOpen(false);
      setUnitToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsUnitModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            title="Gestionar Unidades"
          >
            <Settings className="w-5 h-5" />
            Unidades
          </button>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            title="Gestionar Categorías"
          >
            <Settings className="w-5 h-5" />
            Categorías
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-sm font-semibold text-gray-600">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página <span className="font-bold text-gray-900">{table.getState().pagination.pageIndex + 1}</span> de{' '}
              <span className="font-bold text-gray-900">{table.getPageCount()}</span>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="ml-4 px-2 py-1 bg-white border border-gray-200 rounded text-sm outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30 transition-colors"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {processedProducts.length > 0 ? processedProducts.map((product) => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-gray-100 text-gray-500 rounded uppercase tracking-tighter mt-1">
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleOpenEdit(product)}
                    className="p-2 text-gray-400 hover:text-orange-600 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(product)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Stock:</span>
                  {editingStockId === product.id ? (
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-16 px-2 py-1 border-2 border-orange-500 rounded outline-none font-bold text-xs"
                      value={tempStockValue}
                      onChange={e => setTempStockValue(e.target.value)}
                      onBlur={() => handleStockSubmit(product.id)}
                      onKeyDown={e => e.key === 'Enter' && handleStockSubmit(product.id)}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        setEditingStockId(product.id);
                        setTempStockValue(product.stock.toString());
                      }}
                    >
                      <span className={`font-black ${product.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                        {product.stock} {product.unit}
                      </span>
                      {product.stock <= 5 && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Costo Unitario</p>
                  <p className="font-bold text-gray-900 text-sm">L {product.costPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-500 italic text-sm">
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>

      {/* Modal Agregar/Editar Producto (Información General) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1 uppercase tracking-tight">Nombre</label>
                <input 
                  required
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1 uppercase tracking-tight">Categoría</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1 uppercase tracking-tight">Unidad</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  >
                    {units.map(unit => <option key={unit.id} value={unit.name}>{unit.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1 uppercase tracking-tight">Costo (L)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.costPrice}
                    onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1 uppercase tracking-tight">Stock</label>
                <input 
                  type="number"
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                />
              </div>
              
              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-orange-600 text-white font-bold hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-100 transition-all uppercase text-xs"
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Producto?</h3>
            <p className="text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar <span className="font-bold text-gray-700">"{productToDelete?.name}"</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl shadow-lg shadow-red-100 transition-all uppercase text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación de Unidad */}
      {isDeleteUnitModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Unidad?</h3>
            <p className="text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar la unidad <span className="font-bold text-gray-700">"{unitToDelete?.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteUnitModalOpen(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteUnit}
                className="flex-1 py-3 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl shadow-lg shadow-red-100 transition-all uppercase text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Unidades */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsUnitModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-gray-800">Gestionar Unidades</h3>
            
            <form onSubmit={handleAddUnit} className="mb-6">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Nueva unidad..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={newUnitName}
                  onChange={e => setNewUnitName(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {units.map(unit => (
                <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                  {editingUnitId === unit.id ? (
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text"
                        className="flex-1 px-2 py-1 border border-orange-500 rounded outline-none text-sm font-medium"
                        value={editUnitName}
                        onChange={e => setEditUnitName(e.target.value)}
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleUpdateUnit(unit.id)}
                      />
                      <button onClick={() => handleUpdateUnit(unit.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingUnitId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-700">{unit.name}</span>
                      <div className="flex gap-1 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingUnitId(unit.id);
                            setEditUnitName(unit.name);
                          }}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Editar unidad"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar unidad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setIsUnitModalOpen(false)}
                className="w-full py-2 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors uppercase text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación de Categoría */}
      {isDeleteCategoryModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Categoría?</h3>
            <p className="text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar la categoría <span className="font-bold text-gray-700">"{categoryToDelete?.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteCategoryModalOpen(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteCategory}
                className="flex-1 py-3 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl shadow-lg shadow-red-100 transition-all uppercase text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Categorías */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-gray-800">Gestionar Categorías</h3>
            
            <form onSubmit={handleAddCategory} className="mb-6">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Nueva categoría..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                  {editingCategoryId === cat.id ? (
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text"
                        className="flex-1 px-2 py-1 border border-orange-500 rounded outline-none text-sm font-medium"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleUpdateCategory(cat.id)}
                      />
                      <button onClick={() => handleUpdateCategory(cat.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCategoryId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <div className="flex gap-1 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingCategoryId(cat.id);
                            setEditCategoryName(cat.name);
                          }}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Editar categoría"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full py-2 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors uppercase text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
