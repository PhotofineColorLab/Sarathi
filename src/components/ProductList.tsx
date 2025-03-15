import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { Pencil, Trash2, Filter, Search } from 'lucide-react';
import ProductForm from './ProductForm';

interface ProductListProps {
  products: Product[];
  onUpdate?: (id: string, product: Partial<Product>) => void;
  onDelete?: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onUpdate, onDelete }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply search filter
  const searchFilteredProducts = searchQuery
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Apply category filter
  const filteredProducts = categoryFilter === 'all'
    ? searchFilteredProducts
    : searchFilteredProducts.filter(product => product.category === categoryFilter);

  if (editingProduct) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <ProductForm
          initialData={editingProduct}
          onSubmit={(data: Omit<Product, 'id' | 'createdAt'>) => {
            onUpdate?.(editingProduct.id, data);
            setEditingProduct(null);
          }}
          onCancel={() => setEditingProduct(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Fans">Fans</option>
                <option value="Lights">Lights</option>
                <option value="Wires">Wires</option>
                <option value="Switches">Switches</option>
                <option value="Sockets">Sockets</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Image</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{product.id}</td>
                    <td className="py-3 px-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      {(onUpdate || onDelete) && (
                        <div className="flex gap-2">
                          {onUpdate && (
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No products found in the selected category.
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

export default ProductList; 