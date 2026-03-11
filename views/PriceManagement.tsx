
import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Calculator, Info, ChevronRight, ChevronDown, Package, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Product, MenuItem, Category, RecipeItem } from '../types';

interface PriceManagementProps {
  products: Product[];
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  categories: Category[];
}

const PriceManagement: React.FC<PriceManagementProps> = ({ products, menuItems, setMenuItems, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    category: categories[0]?.name || '',
    description: '',
    salePrice: 0,
    recipe: [],
    isSpecialty: false
  });

  const calculateRecipeCost = (recipe: RecipeItem[]) => {
    return recipe.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return acc + (product.costPrice * item.quantity);
      }
      return acc;
    }, 0);
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: categories[0]?.name || '',
      description: '',
      salePrice: 0,
      recipe: [],
      isSpecialty: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      salePrice: item.salePrice,
      recipe: [...item.recipe],
      isSpecialty: item.isSpecialty || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
    } else {
      const id = Math.random().toString(36).substr(2, 9);
      setMenuItems(prev => [...prev, { ...formData, id }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setMenuItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const addRecipeItem = () => {
    if (products.length === 0) return;
    setFormData(prev => ({
      ...prev,
      recipe: [...prev.recipe, { productId: products[0].id, quantity: 1 }]
    }));
  };

  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: string | number) => {
    const newRecipe = [...formData.recipe];
    newRecipe[index] = { ...newRecipe[index], [field]: value };
    setFormData(prev => ({ ...prev, recipe: newRecipe }));
  };

  const removeRecipeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipe: prev.recipe.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar en el menú..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nuevo Plato
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMenuItems.map(item => {
          const cost = calculateRecipeCost(item.recipe);
          const margin = item.salePrice - cost;
          const marginPercent = item.salePrice > 0 ? (margin / item.salePrice) * 100 : 0;
          const isExpanded = expandedItem === item.id;

          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Desktop Header */}
              <div 
                className="hidden md:flex p-4 items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-orange-600" /> : <ChevronRight className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {item.name}
                      {item.isSpecialty && <Star className="w-4 h-4 text-orange-500 fill-orange-500" />}
                    </h3>
                    <p className="text-xs text-gray-500">{item.category} • {item.description.substring(0, 50)}{item.description.length > 50 ? '...' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Costo Receta</p>
                    <p className="font-bold text-gray-900">L {cost.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Precio Venta</p>
                    <p className="font-bold text-orange-600">L {item.salePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Margen</p>
                    <p className={`font-bold ${marginPercent > 30 ? 'text-green-600' : marginPercent > 15 ? 'text-orange-600' : 'text-red-600'}`}>
                      {marginPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                      className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Header */}
              <div 
                className="md:hidden p-4 space-y-4 cursor-pointer"
                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {item.name}
                      {item.isSpecialty && <Star className="w-4 h-4 text-orange-500 fill-orange-500" />}
                    </h3>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-black bg-orange-50 text-orange-600 rounded uppercase tracking-tighter mt-1">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                      className="p-2 text-gray-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                      className="p-2 text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg">
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Costo</p>
                    <p className="font-bold text-gray-700 text-xs">L {cost.toFixed(0)}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Precio</p>
                    <p className="font-bold text-orange-600 text-xs">L {item.salePrice.toFixed(0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Margen</p>
                    <p className={`font-bold text-xs ${marginPercent > 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {marginPercent.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                  {isExpanded ? (
                    <>Ver menos <ChevronDown className="w-3 h-3" /></>
                  ) : (
                    <>Ver receta y métricas <ChevronRight className="w-3 h-3" /></>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Composición de la Receta
                      </h4>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-600">Insumo</th>
                                <th className="px-4 py-2 text-right font-semibold text-gray-600">Cantidad</th>
                                <th className="hidden sm:table-cell px-4 py-2 text-right font-semibold text-gray-600">Costo Unit.</th>
                                <th className="px-4 py-2 text-right font-semibold text-gray-600">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {item.recipe.length > 0 ? item.recipe.map((r, idx) => {
                                const product = products.find(p => p.id === r.productId);
                                return (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 text-gray-700">{product?.name || 'Desconocido'}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{r.quantity} {product?.unit}</td>
                                    <td className="hidden sm:table-cell px-4 py-2 text-right text-gray-600">L {product?.costPrice.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right font-medium text-gray-900">L {(r.quantity * (product?.costPrice || 0)).toFixed(2)}</td>
                                  </tr>
                                );
                              }) : (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-gray-400 italic">Sin ingredientes definidos</td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot className="bg-gray-50 font-bold">
                              <tr>
                                <td colSpan={window.innerWidth < 640 ? 2 : 3} className="px-4 py-2 text-right text-gray-700">Costo Total:</td>
                                <td className="px-4 py-2 text-right text-gray-900">L {cost.toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> Métricas Económicas
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-bold uppercase">Utilidad Bruta</span>
                          <span className="font-bold text-green-600">L {margin.toFixed(2)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-bold uppercase">Food Cost %</span>
                          <span className="font-bold text-orange-600">{((cost / item.salePrice) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Descripción</span>
                          <p className="text-sm text-gray-600 italic leading-relaxed">"{item.description || 'Sin descripción'}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Agregar/Editar Plato */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Plato del Menú' : 'Nuevo Plato del Menú'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2">Información Básica</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Plato</label>
                    <input 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                      <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio de Venta (L)</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.salePrice}
                        onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción Breve</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
                      placeholder="Ej: Carne de res premium con tajadas de guineo y ensalada..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <input 
                      type="checkbox"
                      id="isSpecialty"
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={formData.isSpecialty}
                      onChange={e => setFormData({...formData, isSpecialty: e.target.checked})}
                    />
                    <label htmlFor="isSpecialty" className="flex items-center gap-2 cursor-pointer">
                      <Star className={`w-5 h-5 ${formData.isSpecialty ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-orange-900">Marcar como Especialidad</span>
                        <span className="text-[10px] text-orange-700">Aparecerá destacado en el menú digital</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-gray-700">Composición (Receta)</h4>
                    <button 
                      type="button"
                      onClick={addRecipeItem}
                      className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Agregar Insumo
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {formData.recipe.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={idx} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Insumo</label>
                            <select 
                              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
                              value={item.productId}
                              onChange={e => updateRecipeItem(idx, 'productId', e.target.value)}
                            >
                              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>)}
                            </select>
                          </div>
                          <div className="w-24">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cant.</label>
                            <input 
                              type="number"
                              step="0.01"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                              value={item.quantity}
                              onChange={e => updateRecipeItem(idx, 'quantity', Number(e.target.value))}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeRecipeItem(idx)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                    {formData.recipe.length === 0 && (
                      <div className="text-center py-8 text-gray-400 italic text-sm">
                        No has agregado insumos a esta receta.
                      </div>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-orange-800">Resumen de Costos</span>
                      <Calculator className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-700">Costo de Producción:</span>
                        <span className="font-bold text-orange-900">L {calculateRecipeCost(formData.recipe).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-700">Precio Sugerido (35% Food Cost):</span>
                        <span className="font-bold text-orange-900">L {(calculateRecipeCost(formData.recipe) / 0.35).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors uppercase text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-600 text-white font-bold hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-100 transition-all uppercase text-xs"
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Plato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar este plato?</h3>
              <p className="text-gray-500 mb-6">
                Estás a punto de eliminar <span className="font-bold text-gray-900">"{itemToDelete.name}"</span>. 
                Esta acción no se puede deshacer y el plato ya no aparecerá en el menú de ventas.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase text-xs"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all uppercase text-xs"
                >
                  Eliminar Plato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceManagement;
