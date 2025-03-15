import React from 'react';
import { Order } from '../types';
import { X, ArrowLeft, Pencil } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onEdit?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onEdit }) => {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Order Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div>
            {order.imageUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Order Image</h3>
                <img 
                  src={order.imageUrl} 
                  alt={`Order ${order.id}`} 
                  className="w-full max-w-xs h-auto object-cover rounded-md border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td colSpan={3} className="py-3 px-4 text-right">Total:</td>
                  <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 