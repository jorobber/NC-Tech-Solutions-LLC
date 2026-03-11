
import React, { useState, useMemo } from 'react';
import { Plus, ShoppingCart, X, CreditCard, Banknote, Landmark, Calendar, Filter, Search, Tag, CheckCircle2, XCircle, Trash2, AlertTriangle, Phone, Edit, Save, User } from 'lucide-react';
import { Product, Sale, MenuItem, OrderStatus } from '../types';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  menuItems: MenuItem[];
  onAddSale: (sale: Omit<Sale, 'id' | 'orderNumber' | 'status'>) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateSale: (id: string, updates: Partial<Sale>) => void;
  onDeleteSale: (id: string) => void;
}

type DateFilterType = 'today' | 'week' | 'month' | 'all' | 'custom';

const Sales: React.FC<SalesProps> = ({ sales, products, menuItems, onAddSale, onUpdateStatus, onUpdateSale, onDeleteSale }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [mobileTab, setMobileTab] = useState<'products' | 'cart'>('products');
  const [historyTab, setHistoryTab] = useState<'active' | 'canceled'>('active');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [saleToVoid, setSaleToVoid] = useState<Sale | null>(null);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Estados para la nueva venta
  const [productSearch, setProductSearch] = useState('');
  const [currentSaleItems, setCurrentSaleItems] = useState<{itemId: string, quantity: number}[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta'>('Efectivo');

  // Lógica de filtrado de ventas histórica
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const saleDateStr = sale.date.split('T')[0];

      switch (dateFilter) {
        case 'today':
          return saleDateStr === todayStr;
        case 'week': {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return saleDate >= sevenDaysAgo;
        }
        case 'month': {
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        }
        case 'custom': {
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return saleDate >= start && saleDate <= end;
        }
        case 'all':
        default:
          return true;
      }
    });
  }, [sales, dateFilter, customStartDate, customEndDate]);

  // Lógica de filtrado de platos del menú dentro del modal
  const filteredMenuItemsForSale = useMemo(() => {
    if (!productSearch.trim()) return menuItems;
    const term = productSearch.toLowerCase();
    return menuItems.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );
  }, [menuItems, productSearch]);

  const total = currentSaleItems.reduce((acc, item) => {
    const m = menuItems.find(mi => mi.id === item.itemId);
    return acc + (m ? m.salePrice * item.quantity : 0);
  }, 0);

  const handleAddItem = (itemId: string) => {
    setCurrentSaleItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) {
        return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId, quantity: 1 }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSaleItems.length === 0) return;

    onAddSale({
      date: new Date().toISOString(),
      items: currentSaleItems.map(item => ({
        productId: item.itemId, // Usamos el ID del MenuItem
        quantity: item.quantity,
        price: menuItems.find(m => m.id === item.itemId)?.salePrice || 0
      })),
      total,
      customerName,
      customerPhone,
      paymentMethod
    });

    setIsAdding(false);
    setCurrentSaleItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setProductSearch('');
  };

  const handleOpenModal = () => {
    setProductSearch('');
    setIsAdding(true);
  };

  const confirmDeleteSale = () => {
    if (saleToDelete) {
      onDeleteSale(saleToDelete.id);
      setSaleToDelete(null);
    }
  };

  const confirmVoidSale = () => {
    if (saleToVoid) {
      onUpdateStatus(saleToVoid.id, 'Cancelado');
      setSaleToVoid(null);
    }
  };

  const { activeSales, canceledSales } = useMemo(() => {
    return {
      activeSales: filteredSales.filter(s => s.status !== 'Cancelado'),
      canceledSales: filteredSales.filter(s => s.status === 'Cancelado')
    };
  }, [filteredSales]);

  const renderSaleCard = (sale: Sale) => (
    <div key={sale.id} className={`bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${sale.status === 'Cancelado' ? 'border-red-100 opacity-75' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400 font-medium">{new Date(sale.date).toLocaleString('es-HN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          })}</p>
          <p className="font-bold text-gray-900 mt-0.5">{sale.customerName || 'Consumidor Final'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {sale.customerPhone && (
              <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> {sale.customerPhone}
              </p>
            )}
            <button 
              onClick={() => setSaleToEdit(sale)}
              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
              title="Editar datos del cliente"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
            sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' : 
            sale.paymentMethod === 'Tarjeta' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {sale.paymentMethod}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter ${
            sale.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 
            sale.status === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {sale.status}
          </span>
        </div>
      </div>
      <div className="space-y-2 border-t border-gray-50 pt-4 mb-4">
        {sale.items.map((item, idx) => {
          const menuItem = menuItems.find(m => m.id === item.productId);
          return (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {menuItem?.name || 'Item'}</span>
              <span className="font-semibold text-gray-900">L {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-gray-500 text-xs font-bold uppercase">Total</span>
        <div className="flex items-center gap-3">
          {sale.status !== 'Cancelado' ? (
            <button 
              onClick={() => setSaleToVoid(sale)}
              className="text-[10px] font-bold text-red-500 hover:underline"
            >
              Anular
            </button>
          ) : (
            <button 
              onClick={() => setSaleToDelete(sale)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar registro permanentemente"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <span className={`text-lg font-black ${sale.status === 'Cancelado' ? 'text-gray-400 line-through' : 'text-orange-600'}`}>
            L {sale.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-800">Historial de Ventas</h3>
          <p className="text-sm text-gray-500">Mostrando {filteredSales.length} ventas realizadas</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 shadow-sm font-medium transition-colors"
        >
          <Tag className="w-5 h-5" />
          Nueva Venta
        </button>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-semibold">Filtrar por:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todo' },
            { id: 'today', label: 'Hoy' },
            { id: 'week', label: '7 días' },
            { id: 'month', label: 'Este mes' },
            { id: 'custom', label: 'Personalizado' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setDateFilter(filter.id as DateFilterType)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                dateFilter === filter.id 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 mt-2 md:mt-0 animate-in fade-in slide-in-from-left-2">
            <input 
              type="date" 
              className="text-xs border rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
            <span className="text-gray-400 text-xs">a</span>
            <input 
              type="date" 
              className="text-xs border rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Mobile History Tabs */}
      <div className="lg:hidden flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
        <button 
          onClick={() => setHistoryTab('active')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${historyTab === 'active' ? 'bg-green-50 text-green-700' : 'text-gray-400'}`}
        >
          Ejecutadas ({activeSales.length})
        </button>
        <button 
          onClick={() => setHistoryTab('canceled')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${historyTab === 'canceled' ? 'bg-red-50 text-red-700' : 'text-gray-400'}`}
        >
          Anuladas ({canceledSales.length})
        </button>
      </div>

      {filteredSales.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Columna Ventas Ejecutadas */}
          <div className={`space-y-4 ${historyTab === 'active' ? 'block' : 'hidden lg:block'}`}>
            <div className="hidden lg:flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Ventas Ejecutadas ({activeSales.length})
              </h4>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                L {activeSales.reduce((acc, s) => acc + s.total, 0).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {activeSales.length > 0 ? (
                activeSales.map(sale => renderSaleCard(sale))
              ) : (
                <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 italic">No hay ventas activas en este periodo</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna Ventas Anuladas */}
          <div className={`space-y-4 ${historyTab === 'canceled' ? 'block' : 'hidden lg:block'}`}>
            <div className="hidden lg:flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Ventas Anuladas ({canceledSales.length})
              </h4>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                L {canceledSales.reduce((acc, s) => acc + s.total, 0).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {canceledSales.length > 0 ? (
                canceledSales.map(sale => renderSaleCard(sale))
              ) : (
                <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 italic">No hay ventas anuladas en este periodo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No se encontraron ventas en este periodo.</p>
          <button 
            onClick={() => setDateFilter('all')}
            className="mt-4 text-orange-600 font-bold hover:underline"
          >
            Ver todo el historial
          </button>
        </div>
      )}

      {/* Modal Nueva Venta */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Tag className="w-6 h-6 text-orange-600" />
                Nueva Venta
              </h3>
              <button onClick={() => setIsAdding(false)} className="hover:bg-gray-200 p-1 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden flex border-b bg-white">
              <button 
                onClick={() => setMobileTab('products')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${mobileTab === 'products' ? 'border-orange-600 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-400'}`}
              >
                1. Platos
              </button>
              <button 
                onClick={() => setMobileTab('cart')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors relative ${mobileTab === 'cart' ? 'border-orange-600 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-400'}`}
              >
                2. Orden
                {currentSaleItems.length > 0 && (
                  <span className="absolute top-2 right-4 w-5 h-5 bg-orange-600 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">
                    {currentSaleItems.length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Selección de Productos */}
              <div className={`w-full md:w-2/3 p-6 overflow-y-auto bg-white border-r flex flex-col gap-6 ${mobileTab === 'products' ? 'flex' : 'hidden md:flex'}`}>
                {/* Buscador de productos */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o categoría..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-sm"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    autoFocus
                  />
                  {productSearch && (
                    <button 
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMenuItemsForSale.length > 0 ? (
                    filteredMenuItemsForSale.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleAddItem(p.id);
                          // Opcional: Feedback visual o cambio de tab?
                        }}
                        className="p-4 border border-gray-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 text-left transition-all active:scale-95 group relative overflow-hidden shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded">
                            {p.category}
                          </span>
                        </div>
                        <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-700">{p.name}</p>
                        <div className="flex justify-between items-end mt-3">
                          <p className="text-sm text-orange-600 font-black">L {p.salePrice.toLocaleString()}</p>
                        </div>
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-orange-500" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center flex flex-col items-center">
                      <Tag className="w-12 h-12 text-gray-200 mb-2" />
                      <p className="text-gray-400 font-medium italic">No se encontraron platos para "{productSearch}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen Carrito y Pago */}
              <div className={`w-full md:w-1/3 p-6 bg-gray-50 flex flex-col border-t md:border-t-0 ${mobileTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-700">Detalle de Orden</h4>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                    {currentSaleItems.length} ítems
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1 custom-scrollbar">
                  {currentSaleItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ShoppingCart className="w-12 h-12 opacity-10 mb-2" />
                      <p className="italic text-sm">Carrito vacío</p>
                    </div>
                  ) : (
                    currentSaleItems.map(item => {
                      const m = menuItems.find(mi => mi.id === item.itemId);
                      return (
                        <div key={item.itemId} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-in zoom-in-95 duration-200">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{m?.name}</p>
                            <p className="text-xs text-orange-500 font-semibold">{item.quantity} x L {m?.salePrice.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                             <button 
                               onClick={() => setCurrentSaleItems(prev => prev.map(i => i.itemId === item.itemId ? {...i, quantity: Math.max(0, i.quantity - 1)} : i).filter(i => i.quantity > 0))}
                               className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                             >-</button>
                             <span className="font-black w-4 text-center text-sm">{item.quantity}</span>
                             <button 
                               onClick={() => handleAddItem(item.itemId)}
                               className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors"
                             >+</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 mt-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Cliente</label>
                      <input 
                        placeholder="Nombre del Cliente"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Teléfono</label>
                      <input 
                        placeholder="Número de Teléfono"
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Método de Pago</label>
                    <div className="flex justify-between gap-2">
                      <button 
                        onClick={() => setPaymentMethod('Efectivo')}
                        className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Efectivo' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Efectivo</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('Tarjeta')}
                        className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Tarjeta' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Tarjeta</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('Transferencia')}
                        className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Transferencia' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                      >
                        <Landmark className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Trf</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-2xl font-black text-gray-900 py-2">
                    <span>Total</span>
                    <span className="text-orange-600">L {total.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    disabled={currentSaleItems.length === 0}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-black text-lg hover:bg-orange-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-orange-100 active:scale-[0.98]"
                  >
                    Confirmar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Edición de Venta */}
      {saleToEdit && (
        <EditSaleModal 
          sale={saleToEdit} 
          onClose={() => setSaleToEdit(null)} 
          onSave={(updates) => {
            onUpdateSale(saleToEdit.id, updates);
            setSaleToEdit(null);
          }}
        />
      )}

      {/* Modal Confirmar Anulación de Venta */}
      {saleToVoid && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Anular esta venta?</h3>
              <p className="text-gray-500 mb-6">
                Estás a punto de anular la venta <span className="font-bold text-gray-900">#{saleToVoid.orderNumber}</span> de <span className="font-bold text-gray-900">{saleToVoid.customerName || 'Consumidor Final'}</span>. 
                Los insumos retornarán automáticamente al inventario.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSaleToVoid(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase text-xs"
                >
                  Regresar
                </button>
                <button 
                  onClick={confirmVoidSale}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all uppercase text-xs"
                >
                  Confirmar Anulación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación de Venta */}
      {saleToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar registro de venta?</h3>
              <p className="text-gray-500 mb-6">
                Estás a punto de eliminar permanentemente el registro de la venta <span className="font-bold text-gray-900">#{saleToDelete.orderNumber}</span> de <span className="font-bold text-gray-900">{saleToDelete.customerName || 'Consumidor Final'}</span>. 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSaleToDelete(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase text-xs"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDeleteSale}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all uppercase text-xs"
                >
                  Eliminar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EditSaleModalProps {
  sale: Sale;
  onClose: () => void;
  onSave: (updates: Partial<Sale>) => void;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ sale, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState(sale.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(sale.customerPhone || '');
  const [paymentMethod, setPaymentMethod] = useState(sale.paymentMethod);

  const handleSave = () => {
    onSave({
      customerName,
      customerPhone,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Edit className="w-5 h-5 text-orange-600" />
            Editar Venta #{sale.orderNumber}
          </h3>
          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Cliente</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Nombre del Cliente"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="Número de Teléfono"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Método de Pago</label>
            <div className="flex justify-between gap-2">
              <button 
                onClick={() => setPaymentMethod('Efectivo')}
                className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Efectivo' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
              >
                <Banknote className="w-4 h-4" />
                <span className="text-[10px] font-bold">Efectivo</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('Tarjeta')}
                className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Tarjeta' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-bold">Tarjeta</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('Transferencia')}
                className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'Transferencia' ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
              >
                <Landmark className="w-4 h-4" />
                <span className="text-[10px] font-bold">Trf</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase text-xs"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 uppercase text-xs"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
