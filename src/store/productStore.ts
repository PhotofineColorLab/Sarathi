import { create } from 'zustand';
import { Product, ProductCategory } from '../types';
import { mockProducts } from '../data';
import { useNotificationStore } from './notificationStore';

// Threshold for low stock alerts
const LOW_STOCK_THRESHOLD = 5;

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  
  // Actions
  fetchProducts: () => void;
  fetchProductById: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  checkLowStock: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  loading: false,
  error: null,
  selectedProduct: null,
  
  fetchProducts: () => {
    try {
      set({ loading: true, error: null });
      // Using mock data directly
      set({ products: mockProducts, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch products',
        type: 'error'
      });
    }
  },
  
  fetchProductById: (id: string) => {
    try {
      set({ loading: true, error: null });
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        set({ selectedProduct: product, loading: false });
      } else {
        set({ 
          error: 'Product not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Product not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch product',
        type: 'error'
      });
    }
  },
  
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      set({ loading: true, error: null });
      const newProduct: Product = {
        ...productData,
        id: `PROD${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({ 
        products: [newProduct, ...state.products],
        loading: false 
      }));
      
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Product Added',
        message: `${newProduct.name} has been added successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding product:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add product', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to add product',
        type: 'error'
      });
    }
  },
  
  updateProduct: (id: string, productData: Partial<Product>) => {
    try {
      set({ loading: true, error: null });
      const currentProduct = get().products.find(p => p.id === id);
      
      if (currentProduct) {
        const updatedProduct = {
          ...currentProduct,
          ...productData
        };
        
        set(state => ({ 
          products: state.products.map(p => p.id === id ? updatedProduct : p),
          selectedProduct: state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Product Updated',
          message: `${updatedProduct.name} has been updated successfully`,
          type: 'success'
        });
      } else {
        set({ 
          error: 'Product not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Product not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update product', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to update product',
        type: 'error'
      });
    }
  },
  
  deleteProduct: (id: string) => {
    try {
      set({ loading: true, error: null });
      const productToDelete = get().products.find(p => p.id === id);
      
      if (productToDelete) {
        set(state => ({ 
          products: state.products.filter(p => p.id !== id),
          selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Product Deleted',
          message: `${productToDelete.name} has been deleted`,
          type: 'warning'
        });
      } else {
        set({ 
          error: 'Product not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Product not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete product', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to delete product',
        type: 'error'
      });
    }
  },
  
  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },
  
  checkLowStock: () => {
    const lowStockProducts = get().products.filter(p => p.stock <= LOW_STOCK_THRESHOLD);
    
    if (lowStockProducts.length > 0) {
      const notificationStore = useNotificationStore.getState();
      
      lowStockProducts.forEach(product => {
        notificationStore.addNotification({
          title: 'Low Stock Alert',
          message: `${product.name} is running low (${product.stock} left)`,
          type: 'warning'
        });
      });
    }
  }
})); 