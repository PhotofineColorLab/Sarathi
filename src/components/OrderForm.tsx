import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Order, OrderItem, Product } from '../types';
import { X, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';

interface OrderFormProps {
  onSubmit: (data: Partial<Order>) => void;
  initialData?: Order;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialData || {
      customerName: '',
      items: [],
      status: 'pending',
      imageUrl: ''
    }
  });

  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = useAuthStore(state => state.user);
  const { products, updateProduct } = useProductStore();
  
  const items = watch('items') as OrderItem[];
  const imageUrl = watch('imageUrl');
  const total = items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (data: any) => {
    // Update product stock levels
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
    });

    onSubmit({
      ...data,
      total,
      createdBy: user?.id || ''
    });
  };

  const handleAddProduct = (product: Product) => {
    if (product.stock <= 0) {
      alert('This product is out of stock!');
      return;
    }

    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Cannot add more units than available in stock!');
        return;
      }
      
      const updatedItems = items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setValue('items', updatedItems);
    } else {
      setValue('items', [
        ...items,
        {
          id: String(items.length + 1),
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.price
        }
      ]);
    }
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue('items', newItems);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const item = items[index];
    const product = products.find(p => p.id === item.productId);
    
    if (product && value > product.stock) {
      alert('Cannot set quantity higher than available stock!');
      return;
    }

    const newItems = items.map((item, i) =>
      i === index ? { ...item, quantity: value } : item
    );
    setValue('items', newItems);
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
          {/* Product Search */}
          <button
            type="button"
            onClick={() => setShowProductSearch(true)}
            className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </button>

          {showProductSearch && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded-md"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Items */}
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-center bg-white p-3 rounded-md border border-gray-200">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="w-24 text-right font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
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