import { create } from 'zustand';
import { Order } from '../types';
import { mockOrders } from '../data';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: mockOrders,
  addOrder: (order) => set((state) => ({
    orders: [...state.orders, {
      ...order,
      id: `ORD${String(state.orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      imageUrl: order.imageUrl || 'https://via.placeholder.com/150?text=No+Image'
    }]
  })),
  updateOrder: (id, updatedOrder) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === id ? { ...order, ...updatedOrder } : order
    )
  })),
  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter(order => order.id !== id)
  }))
}));