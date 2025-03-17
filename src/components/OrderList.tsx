import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { Pencil, Trash2, Filter, Eye, ChevronLeft, ChevronRight, Search, Calendar, Info } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

interface OrderListProps {
  orders: Order[];
  onUpdate?: (id: string, order: Partial<Order>) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdate, onDelete, showActions = true }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showActivityPopup, setShowActivityPopup] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const { trackOrderActivity } = useOrderStore();

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

  const canModifyOrder = (order: Order) => {
    return user?.role === 'admin' || order.createdBy === user?.id;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (!startDate && !endDate) return true;
      
      const orderDate = new Date(order.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return orderDate >= start && orderDate <= end;
      } else if (start) {
        return orderDate >= start;
      } else if (end) {
        return orderDate <= end;
      }
      
      return true;
    });
  }, [orders, startDate, endDate]);

  // Apply search filter
  const searchFilteredOrders = searchQuery
    ? filteredOrders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredOrders;

  // Apply status filter
  const statusFilteredOrders = statusFilter === 'all'
    ? searchFilteredOrders
    : searchFilteredOrders.filter(order => order.status === statusFilter);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = statusFilteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(statusFilteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getLatestActivity = (order: Order) => {
    if (!order.activities || order.activities.length === 0) return null;
    return order.activities[order.activities.length - 1];
  };

  const handleViewOrder = (order: Order) => {
    trackOrderActivity(order.id, 'viewed');
    setViewingOrder(order);
  };

  const handleEditOrder = (order: Order) => {
    trackOrderActivity(order.id, 'modified');
    setEditingOrder(order);
  };

  const ActivityPopup = ({ orderId }: { orderId: string }) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.activities) return null;

    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Activity History</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {order.activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {activity.staffName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.staffName}</p>
                  <p className="text-gray-500">
                    {activity.action === 'viewed' ? 'Viewed' : 'Modified'} the order
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (viewingOrder) {
    return (
      <OrderDetails 
        order={viewingOrder} 
        onClose={() => setViewingOrder(null)}
        onEdit={() => {
          setEditingOrder(viewingOrder);
          setViewingOrder(null);
        }}
      />
    );
  }

  if (editingOrder) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Order</h2>
        <OrderForm
          initialData={editingOrder}
          onSubmit={(data) => {
            onUpdate?.(editingOrder.id, data);
            setEditingOrder(null);
          }}
          onCancel={() => setEditingOrder(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Order['status'] | 'all');
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-500" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear dates
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {user?.role === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Order</th>
              {showActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => {
                const latestActivity = getLatestActivity(order);
                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex items-center gap-2">
                          {latestActivity ? (
                            <>
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{latestActivity.staffName}</div>
                                <div className="text-gray-500">
                                  {latestActivity.action === 'viewed' ? 'Viewed' : 'Modified'}
                                </div>
                              </div>
                              <button
                                onClick={() => setShowActivityPopup(showActivityPopup === order.id ? null : order.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                              >
                                <Info size={16} className="text-blue-500" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400">No activity</span>
                          )}
                          {showActivityPopup === order.id && (
                            <ActivityPopup orderId={order.id} />
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canModifyOrder(order) && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditOrder(order)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => onDelete?.(order.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={showActions ? (user?.role === 'admin' ? 8 : 7) : (user?.role === 'admin' ? 7 : 6)} className="py-8 text-center text-gray-500">
                  No orders found with the selected status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {statusFilteredOrders.length > 0 && (
        <div className="flex justify-between items-center mt-6 px-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, statusFilteredOrders.length)} of {statusFilteredOrders.length} orders
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;