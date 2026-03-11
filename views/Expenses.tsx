
import React, { useState } from 'react';
import { Plus, Trash2, Tag, Calendar, DollarSign, Banknote, CreditCard, Landmark } from 'lucide-react';
import { Expense } from '../types';

interface ExpensesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, setExpenses }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Insumos',
    amount: 0,
    description: '',
    paymentMethod: 'Efectivo'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    setExpenses([{ ...newExpense, id }, ...expenses]);
    setIsAdding(false);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: 'Insumos',
      amount: 0,
      description: '',
      paymentMethod: 'Efectivo'
    });
  };

  const categories = ['Insumos', 'Nómina', 'Servicios', 'Local', 'Publicidad', 'Otros'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Control de Egresos</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Nuevo Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.map(expense => (
          <div key={expense.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-black uppercase tracking-widest">
                  {expense.category}
                </span>
                {expense.paymentMethod && (
                  <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest ${
                    expense.paymentMethod === 'Efectivo' ? 'bg-green-50 text-green-700' : 
                    expense.paymentMethod === 'Transferencia' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {expense.paymentMethod}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{expense.description || 'Sin descripción'}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
              <Calendar className="w-3 h-3" /> {new Date(expense.date).toLocaleDateString()}
            </p>
            <p className="text-2xl font-bold text-red-600">-L {expense.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-6">Registrar Gasto</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto / Descripción</label>
                <input 
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ej: Carbón premium 20kg"
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (L)</label>
                  <input 
                    type="number"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Pago</label>
                <div className="flex justify-between gap-2">
                  <button 
                    type="button"
                    onClick={() => setNewExpense({...newExpense, paymentMethod: 'Efectivo'})}
                    className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${newExpense.paymentMethod === 'Efectivo' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Efectivo</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewExpense({...newExpense, paymentMethod: 'TD'})}
                    className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${newExpense.paymentMethod === 'TD' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-bold">TD</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewExpense({...newExpense, paymentMethod: 'TC'})}
                    className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${newExpense.paymentMethod === 'TC' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-bold">TC</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewExpense({...newExpense, paymentMethod: 'Transferencia'})}
                    className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${newExpense.paymentMethod === 'Transferencia' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Trf</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 text-gray-600">Cancelar</button>
                 <button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
