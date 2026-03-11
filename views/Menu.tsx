import React, { useMemo, useState } from 'react';
import { MenuItem, Category, Sale } from '../types';
import { Utensils, Info, ShoppingBag, Plus, Minus, X, Check, Star, Trash2, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuProps {
  menuItems: MenuItem[];
  categories: Category[];
  onAddSale?: (sale: Omit<Sale, 'id' | 'orderNumber' | 'status'>) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, categories, onAddSale }) => {
  const [quickCart, setQuickCart] = useState<Record<string, number>>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const menuByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    menuItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [menuItems]);

  const quickCartCount = (Object.values(quickCart) as number[]).reduce((a, b) => a + b, 0);
  const quickCartTotal = Object.entries(quickCart).reduce((sum: number, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.salePrice * (qty as number) : 0);
  }, 0);

  const addToCart = (id: string) => {
    setQuickCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setQuickCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const handleProcessOrder = () => {
    if (!onAddSale) return;

    const saleItems = Object.entries(quickCart).map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id)!;
      return {
        productId: item.id,
        quantity: qty,
        price: item.salePrice
      };
    });

    onAddSale({
      date: new Date().toISOString(),
      items: saleItems,
      total: quickCartTotal,
      paymentMethod: 'Efectivo'
    });

    setQuickCart({});
    setIsConfirming(false);
    setShowDetails(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Menú Digital</h2>
          <p className="text-gray-500">Consulta nuestros platos y especialidades</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <p className="text-sm text-orange-800">
          Este es nuestro menú actual. Los precios están sujetos a cambios sin previo aviso.
        </p>
      </div>

      {categories.map(category => {
        const categoryItems = menuByCategory[category.name] || [];
        
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-orange-200 pb-2">
              <div className="flex items-center gap-3">
                <Utensils className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{category.name}</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                    item.isSpecialty 
                      ? 'bg-orange-50/50 border-orange-200 shadow-md ring-1 ring-orange-200' 
                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        {item.isSpecialty && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-orange-600 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-orange-100 w-fit">
                            <Star className="w-3 h-3 fill-orange-600" />
                            Especialidad
                          </span>
                        )}
                        <h4 className={`font-bold group-hover:text-orange-600 transition-colors text-lg ${item.isSpecialty ? 'text-orange-900' : 'text-gray-900'}`}>
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xl font-black text-orange-600">
                        L {item.salePrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description || 'Sin descripción disponible.'}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={() => addToCart(item.id)}
                        className="bg-orange-600 text-white p-2 rounded-none hover:bg-slate-900 transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir
                      </button>
                    </div>
                  </div>
                  {((quickCart[item.id] as number) || 0) > 0 && (
                    <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      {quickCart[item.id]} en carrito
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {menuItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay platos configurados en el menú todavía.</p>
        </div>
      )}
      
      <div className="pt-8 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400 italic">AsadoPro - Calidad en cada corte</p>
      </div>

      {/* Quick Order Bar - Innovative Floating Design */}
      <AnimatePresence>
        {quickCartCount > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
            {/* Detailed View Popover - Innovative Receipt Design */}
            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-full mb-6"
                >
                  <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Tu Selección</h4>
                        <span className="text-xl font-black text-white uppercase tracking-tighter">Detalle del Pedido</span>
                      </div>
                      <button 
                        onClick={() => setShowDetails(false)} 
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(quickCart).map(([id, qty]) => {
                        const item = menuItems.find(m => m.id === id);
                        return (
                          <motion.div 
                            layout
                            key={id} 
                            className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl group hover:bg-white/10 transition-all"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{item?.name}</span>
                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">L {item?.salePrice.toLocaleString()} / unidad</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3 bg-black/50 p-1 rounded-lg border border-white/5">
                                <button 
                                  onClick={() => removeFromCart(id)} 
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-sm font-black text-white min-w-[20px] text-center">{qty}</span>
                                <button 
                                  onClick={() => addToCart(id)} 
                                  className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-md transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-sm font-black text-orange-500 min-w-[80px] text-right">
                                L {(item!.salePrice * (qty as number)).toLocaleString()}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Acumulado</span>
                        <span className="text-3xl font-black text-white tracking-tighter">L {quickCartTotal.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => setQuickCart({})}
                        className="flex items-center justify-center gap-2 py-3 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Vaciar Pedido
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Floating Bar */}
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 relative overflow-hidden group"
            >
              {/* Animated Glow Effect */}
              <div className="absolute -inset-x-full top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent group-hover:animate-shimmer" />

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`relative p-3 rounded-xl transition-all duration-500 ${showDetails ? 'bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <ShoppingBag className={`w-6 h-6 ${showDetails ? 'text-white' : 'text-orange-500'}`} />
                  <span className="absolute -top-1 -right-1 bg-white text-slate-950 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-950">
                    {quickCartCount}
                  </span>
                </button>
                
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5">Total Pedido</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">L {quickCartTotal.toLocaleString()}</span>
                    <button 
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      {showDetails ? <X className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 animate-bounce" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsConfirming(true)}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] active:scale-95 flex items-center gap-3"
                >
                  Cobrar
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white rounded-none w-full max-w-md p-10 shadow-[0_0_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Confirmar Venta</h3>
              <button onClick={() => setIsConfirming(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6 mb-12">
              {Object.entries(quickCart).map(([id, qty]) => {
                const item = menuItems.find(m => m.id === id);
                return (
                  <div key={id} className="flex justify-between items-end py-3 border-b border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Producto</span>
                      <span className="font-bold text-slate-800">{qty}x {item?.name}</span>
                    </div>
                    <span className="font-black text-slate-900">L {(item!.salePrice * (qty as number)).toLocaleString()}</span>
                  </div>
                );
              })}
              
              <div className="flex justify-between items-center pt-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</span>
                  <span className="text-4xl font-black text-orange-600 tracking-tighter">L {quickCartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleProcessOrder}
                className="w-full py-5 bg-slate-900 text-white rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-[0.98]"
              >
                Procesar Pago
              </button>
              <button 
                onClick={() => setIsConfirming(false)} 
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all"
              >
                Volver al Menú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
