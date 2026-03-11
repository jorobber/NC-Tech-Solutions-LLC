
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Phone, Star, ShoppingBag, Search, X, TrendingUp } from 'lucide-react';
import { Sale } from '../types';

interface CustomersProps {
  sales: Sale[];
}

const Customers: React.FC<CustomersProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregate and filter customers from sales
  const customerList = useMemo(() => {
    const customersMap = sales.reduce((acc: any, sale) => {
      const name = sale.customerName || 'Consumidor Final';
      if (!acc[name]) {
        acc[name] = { name, phone: sale.customerPhone || '', totalSpent: 0, orderCount: 0, lastOrder: sale.date };
      }
      if (sale.customerPhone && !acc[name].phone) {
        acc[name].phone = sale.customerPhone;
      }
      acc[name].totalSpent += sale.total;
      acc[name].orderCount += 1;
      if (new Date(sale.date) > new Date(acc[name].lastOrder)) {
        acc[name].lastOrder = sale.date;
      }
      return acc;
    }, {});

    const list = Object.values(customersMap) as any[];
    
    // Filter by search term
    const filtered = list.filter((c: any) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by total spent descending
    return filtered.sort((a: any, b: any) => b.totalSpent - a.totalSpent);
  }, [sales, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {/* Clientes Únicos Card */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-100 group-hover:rotate-6 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Base de Clientes</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">{customerList.length}</p>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Únicos</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crecimiento Mensual</span>
              <span className="text-[10px] font-black text-green-500 flex items-center gap-1">
                +12% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Ticket Promedio Card */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl text-white shadow-lg shadow-orange-100 group-hover:rotate-6 transition-transform duration-300">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Ticket Promedio</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    L {(customerList.reduce((acc, c) => acc + c.totalSpent, 0) / (customerList.length || 1)).toFixed(0)}
                  </p>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Por Cliente</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lealtad del Cliente</span>
              <span className="text-[10px] font-black text-orange-500">
                {customerList.filter(c => c.orderCount > 1).length} Recurrentes
              </span>
            </div>
          </div>

          {/* Cliente Estrella Card */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative flex items-center gap-5">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl text-white shadow-lg shadow-yellow-100 group-hover:rotate-6 transition-transform duration-300">
                <Star className="w-7 h-7 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Cliente Estrella</p>
                <div className="flex flex-col">
                  <p className="text-lg font-black text-gray-900 truncate tracking-tight">
                    {customerList[0]?.name || 'N/A'}
                  </p>
                  <p className="text-[10px] font-bold text-yellow-600">
                    {customerList[0]?.orderCount || 0} Compras Totales
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gasto Total</span>
              <span className="text-[10px] font-black text-yellow-600 uppercase">
                L {customerList[0]?.totalSpent.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-600" />
          Directorio de Clientes
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar cliente por nombre..." 
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Frecuencia</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Compras</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customerList.length > 0 ? (
                customerList.map((customer: any, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-black border border-orange-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 tracking-tight">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Última: {new Date(customer.lastOrder).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium">{customer.phone || '---'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                          <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="font-bold text-gray-700 tracking-tight">{customer.orderCount} pedidos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900 text-lg tracking-tighter">
                        L {customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.orderCount > 3 ? (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-sm shadow-yellow-100 uppercase tracking-widest">
                          <Star className="w-3 h-3 fill-white" /> VIP
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          Regular
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {searchTerm ? (
                        <>
                          <Search className="w-12 h-12 text-gray-200 mb-4" />
                          <p className="text-gray-400 font-medium italic">No se encontraron clientes para "{searchTerm}"</p>
                        </>
                      ) : (
                        <>
                          <Users className="w-12 h-12 text-gray-200 mb-4" />
                          <p className="text-gray-400 font-medium">Registra ventas para ver tus clientes aquí.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {customerList.length > 0 ? (
            customerList.map((customer: any, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 space-y-4 hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-black border border-orange-200 shadow-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 tracking-tight">{customer.name}</p>
                      {customer.phone && (
                        <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-orange-400" /> {customer.phone}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mt-1">Última: {new Date(customer.lastOrder).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {customer.orderCount > 3 && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm uppercase tracking-widest">
                      VIP
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Pedidos</p>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                      <p className="font-black text-gray-700">{customer.orderCount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Gastado</p>
                    <p className="font-black text-orange-600 text-lg tracking-tighter">L {customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 italic text-sm">
              No se encontraron clientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
