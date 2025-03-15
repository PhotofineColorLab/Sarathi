import { create } from 'zustand';
import { Product, ProductCategory } from '../types';

// Sample product data
const mockProducts: Product[] = [
  {
    id: 'PROD001',
    name: 'Ceiling Fan',
    description: 'High-quality ceiling fan with 3-speed settings',
    price: 89.99,
    category: 'Fans',
    imageUrl: 'https://images.unsplash.com/photo-1591543620767-582b2e76369e?q=80&w=400',
    stock: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PROD002',
    name: 'LED Bulb Pack',
    description: 'Energy-efficient LED bulbs, pack of 4',
    price: 19.99,
    category: 'Lights',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=400',
    stock: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PROD003',
    name: 'Copper Wire Roll',
    description: '100m roll of high-quality copper wire',
    price: 45.99,
    category: 'Wires',
    imageUrl: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?q=80&w=400',
    stock: 20,
    createdAt: new Date().toISOString()
  }
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  addProduct: (product) => set((state) => ({
    products: [
      ...state.products,
      {
        ...product,
        id: `PROD${state.products.length + 1}`.padStart(7, '0'),
        createdAt: new Date().toISOString()
      }
    ]
  })),
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    )
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product.id !== id)
  }))
})); 