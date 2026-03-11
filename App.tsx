
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import Sales from './views/Sales';
import Expenses from './views/Expenses';
import AIInsights from './views/AIInsights';
import Customers from './views/Customers';
import OrderControl from './views/OrderControl';
import Menu from './views/Menu';
import PriceManagement from './views/PriceManagement';
import { Product, Sale, Expense, Category, OrderStatus, MenuItem, Unit } from './types';

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Carnes' },
  { id: '2', name: 'Acompañamientos' },
  { id: '3', name: 'Bebidas' },
  { id: '4', name: 'Otros' }
];

const INITIAL_UNITS: Unit[] = [
  { id: '1', name: 'kg' },
  { id: '2', name: 'unidad' },
  { id: '3', name: 'porción' }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Tajo de Res', category: 'Carnes', costPrice: 90, stock: 15, unit: 'kg' },
  { id: '2', name: 'Churrasco Especial', category: 'Carnes', costPrice: 110, stock: 8, unit: 'kg' },
  { id: '3', name: 'Orden de Tajadas', category: 'Acompañamientos', costPrice: 15, stock: 60, unit: 'porcion' },
  { id: '4', name: 'Refresco 500ml', category: 'Bebidas', costPrice: 14, stock: 48, unit: 'unidad' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('asadopro_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('asadopro_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('asadopro_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('asadopro_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('asadopro_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('asadopro_menu_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyGoal, setWeeklyGoal] = useState<number>(() => {
    const saved = localStorage.getItem('asadopro_weekly_goal');
    return saved ? JSON.parse(saved) : 5000;
  });

  useEffect(() => {
    localStorage.setItem('asadopro_products', JSON.stringify(products));
    localStorage.setItem('asadopro_categories', JSON.stringify(categories));
    localStorage.setItem('asadopro_units', JSON.stringify(units));
    localStorage.setItem('asadopro_sales', JSON.stringify(sales));
    localStorage.setItem('asadopro_expenses', JSON.stringify(expenses));
    localStorage.setItem('asadopro_menu_items', JSON.stringify(menuItems));
    localStorage.setItem('asadopro_weekly_goal', JSON.stringify(weeklyGoal));
  }, [products, categories, sales, expenses, menuItems, weeklyGoal]);

  const stats = useMemo(() => {
    // Solo contamos ventas entregadas para las estadísticas financieras reales
    const deliveredSales = sales.filter(s => s.status === 'Entregado');
    const totalSales = deliveredSales.reduce((acc, s) => acc + s.total, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    return {
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      salesCount: deliveredSales.length,
      inventoryValue: products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0)
    };
  }, [sales, expenses, products]);

  const handleAddSale = (sale: Omit<Sale, 'id' | 'orderNumber' | 'status'>) => {
    const nextOrderNumber = sales.length > 0 ? Math.max(...sales.map(s => s.orderNumber)) + 1 : 1;
    const newSale: Sale = { 
      ...sale, 
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: nextOrderNumber,
      status: 'Pendiente'
    };
    setSales(prev => [newSale, ...prev]);
    
    setProducts(prev => {
      let updatedProducts = [...prev];
      sale.items.forEach(soldItem => {
        const menuItem = menuItems.find(m => m.id === soldItem.productId);
        if (menuItem) {
          // Es un plato del menú, descontar según receta
          menuItem.recipe.forEach(recipeItem => {
            updatedProducts = updatedProducts.map(p => 
              p.id === recipeItem.productId 
                ? { ...p, stock: p.stock - (recipeItem.quantity * soldItem.quantity) } 
                : p
            );
          });
        } else {
          // Si no es un plato del menú, intentar descontar como producto directo (retrocompatibilidad)
          updatedProducts = updatedProducts.map(p => 
            p.id === soldItem.productId 
              ? { ...p, stock: p.stock - soldItem.quantity } 
              : p
          );
        }
      });
      return updatedProducts;
    });
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    const saleToUpdate = sales.find(s => s.id === id);
    if (!saleToUpdate) return;

    const oldStatus = saleToUpdate.status;

    // Si la orden se cancela, devolvemos los insumos al inventario
    if (oldStatus !== 'Cancelado' && status === 'Cancelado') {
      setProducts(prev => {
        let updatedProducts = [...prev];
        saleToUpdate.items.forEach(soldItem => {
          const menuItem = menuItems.find(m => m.id === soldItem.productId);
          if (menuItem) {
            menuItem.recipe.forEach(recipeItem => {
              updatedProducts = updatedProducts.map(p => 
                p.id === recipeItem.productId 
                  ? { ...p, stock: p.stock + (recipeItem.quantity * soldItem.quantity) } 
                  : p
              );
            });
          } else {
            updatedProducts = updatedProducts.map(p => 
              p.id === soldItem.productId 
                ? { ...p, stock: p.stock + soldItem.quantity } 
                : p
            );
          }
        });
        return updatedProducts;
      });
    }

    // Si una orden cancelada se reactiva (vuelve a cualquier otro estado), restamos los insumos
    if (oldStatus === 'Cancelado' && status !== 'Cancelado') {
      setProducts(prev => {
        let updatedProducts = [...prev];
        saleToUpdate.items.forEach(soldItem => {
          const menuItem = menuItems.find(m => m.id === soldItem.productId);
          if (menuItem) {
            menuItem.recipe.forEach(recipeItem => {
              updatedProducts = updatedProducts.map(p => 
                p.id === recipeItem.productId 
                  ? { ...p, stock: p.stock - (recipeItem.quantity * soldItem.quantity) } 
                  : p
              );
            });
          } else {
            updatedProducts = updatedProducts.map(p => 
              p.id === soldItem.productId 
                ? { ...p, stock: p.stock - soldItem.quantity } 
                : p
            );
          }
        });
        return updatedProducts;
      });
    }

    setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateSale = (id: string, updates: Partial<Sale>) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} sales={sales} expenses={expenses} weeklyGoal={weeklyGoal} setWeeklyGoal={setWeeklyGoal} />;
      case 'menu':
        return <Menu menuItems={menuItems} categories={categories} onAddSale={handleAddSale} />;
      case 'prices':
        return <PriceManagement products={products} menuItems={menuItems} setMenuItems={setMenuItems} categories={categories} />;
      case 'orders':
        return <OrderControl sales={sales} onUpdateStatus={handleUpdateOrderStatus} onUpdateSale={handleUpdateSale} products={products} menuItems={menuItems} setActiveTab={setActiveTab} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} units={units} setUnits={setUnits} />;
      case 'sales':
        return <Sales sales={sales} products={products} menuItems={menuItems} onAddSale={handleAddSale} onUpdateStatus={handleUpdateOrderStatus} onUpdateSale={handleUpdateSale} onDeleteSale={handleDeleteSale} />;
      case 'expenses':
        return <Expenses expenses={expenses} setExpenses={setExpenses} />;
      case 'customers':
        return <Customers sales={sales} />;
      case 'ai':
        return <AIInsights stats={stats} products={products} />;
      default:
        return <Dashboard stats={stats} sales={sales} expenses={expenses} weeklyGoal={weeklyGoal} setWeeklyGoal={setWeeklyGoal} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
