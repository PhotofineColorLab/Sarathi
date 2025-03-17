export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  activities: OrderActivity[];
  date: string;
  imageUrl?: string;
  createdBy?: string;
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

export interface OrderActivity {
  staffId: string;
  staffName: string;
  action: 'viewed' | 'modified';
  timestamp: Date;
}