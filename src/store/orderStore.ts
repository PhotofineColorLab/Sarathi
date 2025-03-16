import { create } from 'zustand';
import { Order } from '../types';
import { mockOrders } from '../data';
import { useNotificationStore } from './notificationStore';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: mockOrders,
  addOrder: (orderData) => {
    const notificationStore = useNotificationStore.getState();
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      date: new Date().toISOString()
    };
    
    set((state) => ({
      orders: [newOrder, ...state.orders]
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'New Order Created',
      message: `Order #${newOrder.id} has been created for ${newOrder.customerName}`,
      type: 'success'
    });
  },
  updateOrder: (id, orderData) => {
    const notificationStore = useNotificationStore.getState();
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id
          ? { ...order, ...orderData }
          : order
      )
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'Order Updated',
      message: `Order #${id} has been updated`,
      type: 'info'
    });
  },
  deleteOrder: (id) => {
    const notificationStore = useNotificationStore.getState();
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id)
    }));

    // Trigger notification
    notificationStore.addNotification({
      title: 'Order Deleted',
      message: `Order #${id} has been deleted`,
      type: 'warning'
    });
  }
}));