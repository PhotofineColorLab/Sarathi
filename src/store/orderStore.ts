import { create } from 'zustand';
import { Order, OrderStatus, OrderActivity } from '../types';
import { mockOrders } from '../data';
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  
  // Actions
  fetchOrders: () => void;
  fetchOrderById: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'activities'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  setSelectedOrder: (order: Order | null) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  trackOrderActivity: (orderId: string, action: 'viewed' | 'modified') => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,
  loading: false,
  error: null,
  selectedOrder: null,
  
  fetchOrders: () => {
    try {
      set({ loading: true, error: null });
      // Using mock data directly
      set({ orders: mockOrders, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch orders',
        type: 'error'
      });
    }
  },
  
  fetchOrderById: (id: string) => {
    try {
      set({ loading: true, error: null });
      const order = mockOrders.find(o => o.id === id);
      if (order) {
        set({ selectedOrder: order, loading: false });
      } else {
        set({ 
          error: 'Order not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Order not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch order', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch order',
        type: 'error'
      });
    }
  },
  
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'activities'>) => {
    try {
      set({ loading: true, error: null });
      const newOrder: Order = {
        ...orderData,
        id: `ORD${Date.now().toString().slice(-6)}`,
        createdAt: new Date(),
        activities: [],
        date: orderData.date || new Date().toISOString().split('T')[0]
      };
      
      set(state => ({ 
        orders: [newOrder, ...state.orders],
        loading: false 
      }));
      
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Order Created',
        message: `New order #${newOrder.id} for ${newOrder.customerName} has been created`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add order', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to create order',
        type: 'error'
      });
    }
  },
  
  updateOrder: (id: string, orderData: Partial<Order>) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      const currentOrder = get().orders.find(o => o.id === id);
      
      if (currentOrder) {
        // Create a new activity entry for the modification
        const newActivity: OrderActivity = {
          staffId: user?.id || '',
          staffName: user?.name || '',
          action: 'modified',
          timestamp: new Date()
        };
        
        const updatedOrder = {
          ...currentOrder,
          ...orderData,
          activities: [...(currentOrder.activities || []), newActivity]
        };
        
        set(state => ({ 
          orders: state.orders.map(o => o.id === id ? updatedOrder : o),
          selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Order Updated',
          message: `Order #${id} has been updated successfully`,
          type: 'success'
        });
      } else {
        set({ 
          error: 'Order not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Order not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update order', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to update order',
        type: 'error'
      });
    }
  },
  
  deleteOrder: (id: string) => {
    try {
      set({ loading: true, error: null });
      const orderToDelete = get().orders.find(o => o.id === id);
      
      if (orderToDelete) {
        set(state => ({ 
          orders: state.orders.filter(o => o.id !== id),
          selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Order Deleted',
          message: `Order #${id} has been deleted`,
          type: 'warning'
        });
      } else {
        set({ 
          error: 'Order not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Order not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete order', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to delete order',
        type: 'error'
      });
    }
  },
  
  setSelectedOrder: (order: Order | null) => {
    set({ selectedOrder: order });
  },
  
  updateOrderStatus: (id: string, status: OrderStatus) => {
    try {
      set({ loading: true, error: null });
      const currentOrder = get().orders.find(o => o.id === id);
      
      if (currentOrder) {
        const updatedOrder = {
          ...currentOrder,
          status
        };
        
        set(state => ({ 
          orders: state.orders.map(o => o.id === id ? updatedOrder : o),
          selectedOrder: state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Order Status Updated',
          message: `Order #${id} status changed to ${status}`,
          type: 'info'
        });
      } else {
        set({ 
          error: 'Order not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Order not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update order status', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to update order status',
        type: 'error'
      });
    }
  },
  
  trackOrderActivity: (orderId: string, action: 'viewed' | 'modified') => {
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