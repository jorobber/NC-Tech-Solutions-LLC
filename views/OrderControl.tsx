
import React, { useMemo } from 'react';
import { Clock, CheckCircle2, Flame, ChefHat, User, Hash, ArrowRight, PackageOpen, XCircle, AlertTriangle, Phone, Edit, Save, Banknote, CreditCard, Landmark, Plus } from 'lucide-react';
import { Sale, OrderStatus, Product, MenuItem } from '../types';

interface OrderControlProps {
  sales: Sale[];
  products: Product[];
  menuItems: MenuItem[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateSale: (id: string, updates: Partial<Sale>) => void;
  setActiveTab: (tab: string) => void;
}

const OrderControl: React.FC<OrderControlProps> = ({ sales, products, menuItems, onUpdateStatus, onUpdateSale, setActiveTab }) => {
  const [mobileStatus, setMobileStatus] = React.useState<OrderStatus>('Pendiente');
  const [orderToCancel, setOrderToCancel] = React.useState<Sale | null>(null);
  const [orderToEdit, setOrderToEdit] = React.useState<Sale | null>(null);

  // Solo mostramos pedidos activos (no entregados ni cancelados)
  const activeOrders = useMemo(() => {
    return sales.filter(s => s.status !== 'Entregado' && s.status !== 'Cancelado');
  }, [sales]);

  const ordersByStatus = useMemo(() => {
    return {
      Pendiente: activeOrders.filter(o => o.status === 'Pendiente'),
      Preparando: activeOrders.filter(o => o.status === 'Preparando'),
      Listo: activeOrders.filter(o => o.status === 'Listo'),
    };
  }, [activeOrders]);

  const handleCancelClick = (order: Sale) => {
    setOrderToCancel(order);
  };

  const confirmCancel = () => {
    if (orderToCancel) {
      onUpdateStatus(orderToCancel.id, 'Cancelado');
      setOrderToCancel(null);
    }
  };

  const getProductLabel = (productId: string) => {
    const menuItem = menuItems.find(m => m.id === productId);
    if (menuItem) return menuItem.name;
    
    const p = products.find(prod => prod.id === productId);
    return p?.name || 'Producto desconocido';
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Monitor de Cocina</h3>
          <p className="text-sm text-gray-500">Gestión de órdenes en tiempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('menu')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-sm font-bold transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-xs font-bold text-gray-600">{activeOrders.length} Órdenes Activas</span>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-gray-100 p-1 rounded-xl">
        {(['Pendiente', 'Preparando', 'Listo'] as OrderStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setMobileStatus(status)}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
              mobileStatus === status 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-400'
            }`}
          >
            {status === 'Pendiente' ? 'Por Preparar' : status === 'Preparando' ? 'Parrilla' : 'Listos'}
            <span className="ml-1.5 opacity-50">({ordersByStatus[status as keyof typeof ordersByStatus].length})</span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Columna Pendiente */}
        <div className={mobileStatus === 'Pendiente' ? 'block h-full' : 'hidden md:block h-full'}>
          <OrderColumn 
            title="Por Preparar" 
            status="Pendiente" 
            icon={<Clock className="w-5 h-5 text-gray-400" />}
            orders={ordersByStatus.Pendiente}
            onNext={(id) => {
              onUpdateStatus(id, 'Preparando');
              setMobileStatus('Preparando');
            }}
            onCancel={handleCancelClick}
            onEdit={setOrderToEdit}
            nextLabel="Empezar"
            nextIcon={<Flame className="w-4 h-4" />}
            getProductLabel={getProductLabel}
          />
        </div>

        {/* Columna Preparando */}
        <div className={mobileStatus === 'Preparando' ? 'block h-full' : 'hidden md:block h-full'}>
          <OrderColumn 
            title="En la Parrilla" 
            status="Preparando" 
            icon={<Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
            orders={ordersByStatus.Preparando}
            onNext={(id) => {
              onUpdateStatus(id, 'Listo');
              setMobileStatus('Listo');
            }}
            onCancel={handleCancelClick}
            onEdit={setOrderToEdit}
            nextLabel="Terminar"
            nextIcon={<CheckCircle2 className="w-4 h-4" />}
            getProductLabel={getProductLabel}
          />
        </div>

        {/* Columna Listo */}
        <div className={mobileStatus === 'Listo' ? 'block h-full' : 'hidden md:block h-full'}>
          <OrderColumn 
            title="Listos para Entrega" 
            status="Listo" 
            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
            orders={ordersByStatus.Listo}
            onNext={(id) => onUpdateStatus(id, 'Entregado')}
            onCancel={handleCancelClick}
            onEdit={setOrderToEdit}
            nextLabel="Entregar"
            nextIcon={<PackageOpen className="w-4 h-4" />}
            getProductLabel={getProductLabel}
            highlight
          />
        </div>
      </div>

      {/* Modal de Edición de Orden */}
      {orderToEdit && (
        <EditOrderModal 
          order={orderToEdit} 
          onClose={() => setOrderToEdit(null)} 
          onSave={(updates) => {
            onUpdateSale(orderToEdit.id, updates);
            setOrderToEdit(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Anulación */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Anular pedido #{orderToCancel.orderNumber}?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Estás a punto de anular el pedido de <span className="font-bold text-gray-900">{orderToCancel.customerName || 'Consumidor Final'}</span>. 
                Los insumos utilizados retornarán automáticamente al inventario.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase text-xs"
                >
                  Regresar
                </button>
                <button 
                  onClick={confirmCancel}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all uppercase text-xs"
                >
                  Confirmar Anulación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface OrderColumnProps {
  title: string;
  status: OrderStatus;
  icon: React.ReactNode;
  orders: Sale[];
  onNext: (id: string) => void;
  onCancel?: (order: Sale) => void;
  onEdit?: (order: Sale) => void;
  nextLabel: string;
  nextIcon: React.ReactNode;
  getProductLabel: (id: string) => string;
  highlight?: boolean;
}

const OrderColumn: React.FC<OrderColumnProps> = ({ 
  title, icon, orders, onNext, onCancel, onEdit, nextLabel, nextIcon, getProductLabel, highlight 
}) => {
  return (
    <div className={`flex flex-col h-full bg-gray-100 rounded-2xl border border-gray-200 ${highlight ? 'ring-2 ring-green-100' : ''}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-bold text-gray-700">{title}</h4>
        </div>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-black">
          {orders.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group animate-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-100">
                    #{order.orderNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-gray-900 leading-none">{order.customerName || 'Consumidor Final'}</p>
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(order)}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                          title="Editar orden"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {order.customerPhone && (
                      <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" /> {order.customerPhone}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm items-center bg-gray-50 px-2 py-1 rounded">
                    <span className="text-gray-700 font-medium">
                      <span className="text-orange-600 font-black mr-2">{item.quantity}x</span>
                      {getProductLabel(item.productId)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {onCancel && (
                  <button 
                    onClick={() => onCancel(order)}
                    className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Anular
                  </button>
                )}
                <button 
                  onClick={() => onNext(order.id)}
                  className={`flex-[2] py-2 flex items-center justify-center gap-2 rounded-lg text-white font-black text-xs transition-all shadow-sm ${
                    highlight ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-100'
                  }`}
                >
                  {nextIcon}
                  {nextLabel}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-40 py-10">
            <ChefHat className="w-12 h-12 mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider">Sin pedidos</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface EditOrderModalProps {
  order: Sale;
  onClose: () => void;
  onSave: (updates: Partial<Sale>) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
  const [customerName, setCustomerName] = React.useState(order.customerName || '');
  const [customerPhone, setCustomerPhone] = React.useState(order.customerPhone || '');
  const [paymentMethod, setPaymentMethod] = React.useState(order.paymentMethod);

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
            Editar Orden #{order.orderNumber}
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

export default OrderControl;
