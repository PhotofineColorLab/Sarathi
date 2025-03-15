import React from 'react';
import { useForm } from 'react-hook-form';
import { Order, OrderItem } from '../types';
import { X } from 'lucide-react';
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          {...register('customerName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          {...register('imageUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <img
              src={imageUrl}
              alt="Order preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Items</label>
        <div className="space-y-4">
          {items?.map((_, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Item name"
                {...register(`items.${index}.name`)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                {...register(`items.${index}.quantity`)}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                {...register(`items.${index}.price`)}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          Add Item
        </button>
      </div>

      <div className="text-right text-lg font-semibold">
        Total: ${total.toFixed(2)}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;