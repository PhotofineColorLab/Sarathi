import { create } from 'zustand';
import { Order, OrderActivity } from '../types';
import { mockOrders } from '../data';
import { useNotificationStore } from './notificationStore';
import { useAuthStore } from './authStore';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'activities'>) => void;
  updateOrder: (id: string, orderData: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  trackOrderActivity: (orderId: string, action: 'viewed' | 'modified') => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: mockOrders,
  addOrder: (orderData) => {
    const notificationStore = useNotificationStore.getState();
    const newOrder: Order = {
      ...orderData,
      id: `ORD${String(Date.now()).slice(-6)}`,
      createdAt: new Date(),
      activities: [],
      date: orderData.date || new Date().toISOString().split('T')[0]
    };
    
    set((state) => ({
      orders: [...state.orders, newOrder]
    }));

    notificationStore.addNotification({
      title: 'New Order Created',
      message: `Order ${newOrder.id} has been created successfully.`,
      type: 'success'
    });
  },
  updateOrder: (id, orderData) => {
    const notificationStore = useNotificationStore.getState();
    const user = useAuthStore.getState().user;
    
    set((state) => {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === id) {
          // Create a new activity entry for the modification
          const newActivity: OrderActivity = {
            staffId: user?.id || '',
            staffName: user?.name || '',
            action: 'modified',
            timestamp: new Date()
          };

          return {
            ...order,
            ...orderData,
            activities: [...(order.activities || []), newActivity]
          };
        }
        return order;
      });

      return { orders: updatedOrders };
    });

    notificationStore.addNotification({
      title: 'Order Updated',
      message: `Order ${id} has been updated successfully.`,
      type: 'success'
    });
  },
  deleteOrder: (id) => {
    const notificationStore = useNotificationStore.getState();
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id)
    }));

    notificationStore.addNotification({
      title: 'Order Deleted',
      message: `Order ${id} has been deleted.`,
      type: 'warning'
    });
  },
  trackOrderActivity: (orderId, action) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newActivity: OrderActivity = {
      staffId: user.id,
      staffName: user.name,
      action,
      timestamp: new Date()
    };

    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, activities: [...(order.activities || []), newActivity] }
          : order
      )
    }));
  }
}));