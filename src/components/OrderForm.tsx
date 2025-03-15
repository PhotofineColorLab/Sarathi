import React from 'react';
import { useForm } from 'react-hook-form';
import { Order, OrderItem } from '../types';
import { X, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface OrderFormProps {
  onSubmit: (data: Partial<Order>) => void;
  initialData?: Order;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialData || {
      customerName: '',
      items: [{ id: '1', name: '', quantity: 1, price: 0 }],
      status: 'pending',
      imageUrl: ''
    }
  });

  const user = useAuthStore(state => state.user);
  const items = watch('items') as OrderItem[];
  const imageUrl = watch('imageUrl');
  const total = items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      total,
      createdBy: user?.id || ''
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue('items', newItems);
  };

  const handleAddItem = () => {
    setValue('items', [...items, { id: String(items.length + 1), name: '', quantity: 1, price: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
        <input
          type="text"
          {...register('customerName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter customer name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          {...register('imageUrl')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <img
              src={imageUrl}
              alt="Order preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
        <div className="space-y-3 p-4 bg-gray-50 rounded-md">
          {items?.map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Item name"
                {...register(`items.${index}.name`)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Qty"
                {...register(`items.${index}.quantity`)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                {...register(`items.${index}.price`)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end p-3 bg-gray-50 rounded-md">
        <span className="text-lg font-semibold">
          Total: ${total.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;