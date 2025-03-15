import React, { useState } from 'react';
import { Order } from '../types';
import { Pencil, Trash2, Filter, Eye } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';
import { useAuthStore } from '../store/authStore';

interface OrderListProps {
  orders: Order[];
  onUpdate?: (id: string, order: Partial<Order>) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdate, onDelete, showActions = true }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const user = useAuthStore(state => state.user);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const canModifyOrder = (order: Order) => {
    return user?.role === 'admin' || order.createdBy === user?.id;
  };

  const filteredOrders = user?.role === 'admin' 
    ? orders 
    : orders.filter(order => order.createdBy === user?.id);

  // Apply status filter
  const statusFilteredOrders = statusFilter === 'all'
    ? filteredOrders
    : filteredOrders.filter(order => order.status === statusFilter);

  if (viewingOrder) {
    return (
      <OrderDetails 
        order={viewingOrder} 
        onClose={() => setViewingOrder(null)}
        onEdit={() => {
          setEditingOrder(viewingOrder);
          setViewingOrder(null);
        }}
      />
    );
  }

  if (editingOrder) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
        <OrderForm
          initialData={editingOrder}
          onSubmit={(data) => {
            onUpdate?.(editingOrder.id, data);
            setEditingOrder(null);
          }}
          onCancel={() => setEditingOrder(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">View Order</th>
                {showActions && <th className="text-left py-3 px-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {statusFilteredOrders.length > 0 ? (
                statusFilteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>
                    </td>
                    {showActions && (
                      <td className="py-3 px-4">
                        {canModifyOrder(order) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => onDelete?.(order.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showActions ? 7 : 6} className="py-8 text-center text-gray-500">
                    No orders found with the selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;