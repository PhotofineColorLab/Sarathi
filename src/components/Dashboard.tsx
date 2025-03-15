import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardStats from './DashboardStats';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import StaffList from './StaffList';
import StaffForm from './StaffForm';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { useOrderStore } from '../store/orderStore';
import { useStaffStore } from '../store/staffStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { Order, Staff } from '../types';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'orders' | 'staff' | 'products'>('dashboard');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const { orders, addOrder, updateOrder, deleteOrder } = useOrderStore();
  const { staff, addStaff, updateStaff, deleteStaff } = useStaffStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const user = useAuthStore(state => state.user);

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
        return user?.role === 'admin' ? (
          showProductForm ? (
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
                <button
                  onClick={() => setShowProductForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Product
                </button>
              </div>
              <ProductList
                products={products}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
              />
            </div>
          )
        ) : (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
          </div>
        );

      default:
        return (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
              <p className="text-gray-600">Order management dashboard</p>
            </div>
            {user?.role === 'admin' && <DashboardStats stats={stats} />}
            <div className="mt-8">
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