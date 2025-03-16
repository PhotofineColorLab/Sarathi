export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  imageUrl?: string;
  createdBy: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  name: string;
}

export type ProductCategory = 'Fans' | 'Lights' | 'Wires' | 'Switches' | 'Sockets';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  createdAt: string;
}