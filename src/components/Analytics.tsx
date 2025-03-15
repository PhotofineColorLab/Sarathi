import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Order, Product } from '../types';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';

const Analytics: React.FC = () => {
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate revenue by status
  const revenueByStatus = [
    { name: 'Pending', value: calculateRevenueByStatus('pending') },
    { name: 'Processing', value: calculateRevenueByStatus('processing') },
    { name: 'Completed', value: calculateRevenueByStatus('completed') },
    { name: 'Cancelled', value: calculateRevenueByStatus('cancelled') },
  ];

  // Calculate revenue by category
  const revenueByCategory = calculateRevenueByCategory();

  // Calculate orders by date
  const ordersByDate = calculateOrdersByDate();

  // Calculate product stock levels
  const productStockLevels = calculateProductStockLevels();

  // Calculate monthly revenue
  const monthlyRevenue = calculateMonthlyRevenue();

  // Helper functions
  function calculateRevenueByStatus(status: Order['status']): number {
    return orders
      .filter(order => order.status === status)
      .reduce((sum, order) => sum + order.total, 0);
  }

  function calculateRevenueByCategory(): { name: string; value: number }[] {
    const categoryMap = new Map<string, number>();
    
    // Initialize with all product categories
    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, 0);
      }
    });
    
    // Calculate revenue for each category
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product) {
          const currentValue = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, currentValue + (item.price * item.quantity));
        }
      });
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }

  function calculateOrdersByDate(): { date: string; count: number }[] {
    const dateMap = new Map<string, number>();
    const today = new Date();
    
    // Initialize with dates based on selected time range
    let daysToShow = 30; // Default to month
    if (timeRange === 'week') daysToShow = 7;
    if (timeRange === 'year') daysToShow = 12; // Show months instead of days
    
    if (timeRange === 'year') {
      // Initialize with months
      for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        dateMap.set(monthName, 0);
      }
      
      // Count orders by month
      orders.forEach(order => {
        const orderDate = new Date(order.date);
        if (orderDate.getFullYear() === today.getFullYear()) {
          const monthName = orderDate.toLocaleString('default', { month: 'short' });
          const currentCount = dateMap.get(monthName) || 0;
          dateMap.set(monthName, currentCount + 1);
        }
      });
    } else {
      // Initialize with days
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dateMap.set(dateString, 0);
      }
      
      // Count orders by day
      orders.forEach(order => {
        const orderDate = order.date.split('T')[0];
        if (dateMap.has(orderDate)) {
          const currentCount = dateMap.get(orderDate) || 0;
          dateMap.set(orderDate, currentCount + 1);
        }
      });
    }
    
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        if (timeRange === 'year') {
          const monthA = new Date(Date.parse(`${a.date} 1, 2000`)).getMonth();
          const monthB = new Date(Date.parse(`${b.date} 1, 2000`)).getMonth();
          return monthA - monthB;
        }
        return a.date.localeCompare(b.date);
      });
  }

  function calculateProductStockLevels(): { name: string; stock: number }[] {
    return products
      .sort((a, b) => a.stock - b.stock) // Sort by stock level (ascending)
      .slice(0, 10) // Get top 10 products with lowest stock
      .map(product => ({
        name: product.name,
        stock: product.stock
      }));
  }

  function calculateMonthlyRevenue(): { month: string; revenue: number }[] {
    const monthlyMap = new Map<string, number>();
    
    // Initialize with all months
    for (let i = 0; i < 12; i++) {
      const date = new Date(new Date().getFullYear(), i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      monthlyMap.set(monthName, 0);
    }
    
    // Calculate revenue for each month
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate.getFullYear() === new Date().getFullYear()) {
        const monthName = orderDate.toLocaleString('default', { month: 'short' });
        const currentRevenue = monthlyMap.get(monthName) || 0;
        monthlyMap.set(monthName, currentRevenue + order.total);
      }
    });
    
    return Array.from(monthlyMap.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => {
        const monthA = new Date(Date.parse(`${a.month} 1, 2000`)).getMonth();
        const monthB = new Date(Date.parse(`${b.month} 1, 2000`)).getMonth();
        return monthA - monthB;
      });
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const STATUS_COLORS = {
    pending: '#FFBB28',
    processing: '#0088FE',
    completed: '#00C49F',
    cancelled: '#FF8042'
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md ${
              timeRange === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {revenueByStatus.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Product Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="value" name="Revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Date */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="Orders" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Stock Levels */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productStockLevels} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" name="Stock Level" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 