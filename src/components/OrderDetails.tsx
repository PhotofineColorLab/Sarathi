import React from 'react';
import { Order } from '../types';
import { ArrowLeft, Pencil } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onEdit?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onEdit }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h2 className="text-xl font-semibold">Order Details</h2>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Order Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium mt-1">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium mt-1">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium mt-1">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mt-1`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium text-lg mt-1">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          {order.imageUrl && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Order Image</h3>
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-medium bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right">Total:</td>
                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 