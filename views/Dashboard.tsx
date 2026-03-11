
import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingBag,
  ArrowRight,
  Calendar,
  Target,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Sale, Expense } from '../types';

interface DashboardProps {
  stats: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    salesCount: number;
    inventoryValue: number;
  };
  sales: Sale[];
  expenses: Expense[];
  weeklyGoal: number;
  setWeeklyGoal: (val: number) => void;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', maximumFractionDigits: 2 }).format(val);

const Dashboard: React.FC<DashboardProps> = ({ stats, sales, expenses, weeklyGoal, setWeeklyGoal }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(weeklyGoal);

  const recentSales = useMemo(() => sales.filter(s => s.status !== 'Cancelado').slice(0, 5), [sales]);

  const summaryChartData = [
    { name: 'Ventas', value: stats.totalSales, color: '#10b981' },
    { name: 'Gastos', value: stats.totalExpenses, color: '#ef4444' },
    { name: 'Utilidad', value: stats.netProfit, color: '#f97316' },
  ];

  // Calcular ventas de la semana actual (últimos 7 días)
  const currentWeekSales = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sales
      .filter(s => s.status !== 'Cancelado' && new Date(s.date) >= sevenDaysAgo)
      .reduce((acc, s) => acc + s.total, 0);
  }, [sales]);

  const progressPercentage = Math.min(Math.round((currentWeekSales / weeklyGoal) * 100), 100);

  // Generar datos para los últimos 7 días
  const evolutionData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('es-HN', { weekday: 'short', day: 'numeric' });

      const daySales = sales
        .filter(s => s.status !== 'Cancelado' && s.date.startsWith(dateStr))
        .reduce((acc, s) => acc + s.total, 0);
      
      const dayExpenses = expenses
        .filter(e => e.date.startsWith(dateStr))
        .reduce((acc, e) => acc + e.amount, 0);

      data.push({
        name: label,
        ventas: daySales,
        gastos: dayExpenses,
      });
    }
    return data;
  }, [sales, expenses]);

  const handleSaveGoal = () => {
    setWeeklyGoal(tempGoal);
    setIsEditingGoal(false);
  };

  const handleCancelGoal = () => {
    setTempGoal(weeklyGoal);
    setIsEditingGoal(false);
  };

  return (
    <div className="space-y-6">
      {/* Target/Goal Section */}
      <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Meta de Ventas Semanal</h3>
              <div className="flex items-center gap-2">
                {isEditingGoal ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="number"
                      className="w-32 px-2 py-1 border-2 border-orange-500 rounded-lg outline-none font-black text-xl"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(Number(e.target.value))}
                      autoFocus
                    />
                    <button onClick={handleSaveGoal} className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={handleCancelGoal} className="p-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-gray-900">{formatCurrency(weeklyGoal)}</p>
                    <button 
                      onClick={() => setIsEditingGoal(true)}
                      className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-700">Progreso: {formatCurrency(currentWeekSales)}</span>
              <span className="text-sm font-black text-orange-600">{progressPercentage}%</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
              <div 
                className="h-full bg-orange-500 transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">
              {progressPercentage >= 100 
                ? '¡Felicidades! Has alcanzado la meta de esta semana.' 
                : `Faltan ${formatCurrency(Math.max(0, weeklyGoal - currentWeekSales))} para cumplir tu meta.`}
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 pointer-events-none" />
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-orange-50 rounded-full opacity-50 pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Ventas Totales" 
          value={formatCurrency(stats.totalSales)} 
          icon={<DollarSign className="w-6 h-6 text-green-600" />} 
          trend="+12%" 
          bg="bg-green-50"
        />
        <StatCard 
          title="Utilidad Neta" 
          value={formatCurrency(stats.netProfit)} 
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />} 
          trend="+5.4%" 
          bg="bg-orange-50"
        />
        <StatCard 
          title="Gastos" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<TrendingDown className="w-6 h-6 text-red-600" />} 
          trend="+2.1%" 
          bg="bg-red-50"
        />
        <StatCard 
          title="Valor Inventario" 
          value={formatCurrency(stats.inventoryValue)} 
          icon={<Package className="w-6 h-6 text-blue-600" />} 
          bg="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Evolution Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Evolución Semanal</h3>
                <p className="text-sm text-gray-500">Ventas vs Gastos (Últimos 7 días)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-gray-600">Ventas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-xs font-medium text-gray-600">Gastos</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(val) => `L ${val.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVentas)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorGastos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Comparativa de Totales</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {summaryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Ventas Recientes</h3>
            <button className="text-orange-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Ver todas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentSales.length > 0 ? recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{sale.customerName || 'Consumidor Final'}</p>
                    <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900 whitespace-nowrap">{formatCurrency(sale.total)}</p>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-10">No hay ventas registradas aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, bg }) => (
  <div className={`p-6 rounded-xl border border-gray-200 shadow-sm bg-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;
