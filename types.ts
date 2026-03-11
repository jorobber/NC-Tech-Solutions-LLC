
export interface Category {
  id: string;
  name: string;
}

export type OrderStatus = 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Cancelado';

export interface RecipeItem {
  productId: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  salePrice: number;
  recipe: RecipeItem[];
  isSpecialty?: boolean;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  stock: number;
  unit: string;
}

export interface Sale {
  id: string;
  orderNumber: number;
  date: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  status: OrderStatus;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: 'Efectivo' | 'TD' | 'TC' | 'Transferencia';
}

export interface BusinessStats {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  salesCount: number;
}
