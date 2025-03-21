import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import DashboardStats from './DashboardStats';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import StaffList from './StaffList';
import StaffForm from './StaffForm';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Settings from './Settings';
import Analytics from './Analytics';
import Notifications from './Notifications';
import { useOrderStore } from '../store/orderStore';
import { useStaffStore } from '../store/staffStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Order, Staff, Product } from '../types';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

// Define a type for the view options
type ViewType = 'dashboard' | 'orders' | 'staff' | 'products' | 'settings' | 'analytics';

const ITEMS_PER_PAGE = 5;

const LowStockAlerts: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const lowStockProducts = useMemo(() => 
    products.filter(product => product.stock <= 10)
    .sort((a, b) => a.stock - b.stock), // Sort by lowest stock first
  [products]);

  const totalPages = Math.ceil(lowStockProducts.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentItems = lowStockProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (lowStockProducts.length === 0) return null;

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-red-50 border-b border-red-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="text-lg font-semibold text-red-700">Low Stock Alerts</h2>
          </div>
          <div className="text-sm text-gray-500">
            Showing {Math.min(currentPage * ITEMS_PER_PAGE, lowStockProducts.length)} of {lowStockProducts.length} items
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {currentItems.map(product => (
          <div key={product.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Stock: <span className="text-red-600">{product.stock}</span> units
                </p>
                <p className="text-sm text-gray-500">
                  Price: ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const { orders, addOrder, updateOrder, deleteOrder } = useOrderStore();
  const { staff, addStaff, updateStaff, deleteStaff } = useStaffStore();
  const { products, addProduct, updateProduct, deleteProduct, checkLowStock } = useProductStore();
  const user = useAuthStore(state => state.user);
  const { notifications, markAsRead, clearAll } = useNotificationStore();

  // Check for low stock products when dashboard loads
  useEffect(() => {
    checkLowStock();
  }, []);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  const handleAddOrder = (data: Partial<Order>) => {
    if (data.customerName && data.items && data.status) {
      addOrder({
        customerName: data.customerName,
        items: data.items,
        status: data.status,
        total: data.total || 0,
        imageUrl: data.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
        createdBy: user?.id || ''
      });
    }
    setShowOrderForm(false);
  };

  const handleAddStaff = (data: Partial<Staff>) => {
    if (data.name && data.email && data.phone && data.password) {
      addStaff({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });
    }
    setShowStaffForm(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'orders':
        return showOrderForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
            <OrderForm
              onSubmit={handleAddOrder}
              onCancel={() => setShowOrderForm(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
              <button
                onClick={() => setShowOrderForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create Order
              </button>
            </div>
            <OrderList
              orders={orders}
              onUpdate={updateOrder}
              onDelete={deleteOrder}
              showActions={true}
            />
          </div>
        );

      case 'staff':
        return user?.role === 'admin' ? (
          showStaffForm ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Staff</h2>
              <StaffForm
                onSubmit={handleAddStaff}
                onCancel={() => setShowStaffForm(false)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                <button
                  onClick={() => setShowStaffForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Staff
                </button>
              </div>
              <StaffList
                staff={staff}
                onUpdate={updateStaff}
                onDelete={deleteStaff}
              />
            </div>
          )
        ) : (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
          </div>
        );

      case 'products':
        return showProductForm && user?.role === 'admin' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
            <ProductForm
              onSubmit={(data) => {
                addProduct(data);
                setShowProductForm(false);
              }}
              onCancel={() => setShowProductForm(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Product
                </button>
              )}
            </div>
            <ProductList
              products={products}
              onUpdate={user?.role === 'admin' ? updateProduct : undefined}
              onDelete={user?.role === 'admin' ? deleteProduct : undefined}
            />
          </div>
        );

      case 'analytics':
        return user?.role === 'admin' ? (
          <Analytics />
        ) : (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
          </div>
        );

      case 'settings':
        return <Settings />;

      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                <p className="text-gray-600">Order management dashboard</p>
              </div>
              <Notifications
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onClearAll={clearAll}
              />
            </div>
            {user?.role === 'admin' && <DashboardStats stats={stats} />}
            
            {/* Low Stock Alerts Section */}
            <div className="mt-8">
              <LowStockAlerts products={products} />
            </div>

            {/* Recent Orders Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
              <OrderList 
                orders={orders.slice(0, 5)} 
                showActions={false}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onNavigate={setActiveView} activeView={activeView} role={user?.role} />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;