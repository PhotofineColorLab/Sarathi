import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { Pencil, Trash2, Filter, Eye, ChevronLeft, ChevronRight, Search, Calendar, Info, ZoomIn } from 'lucide-react';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import ImageModal from './ImageModal';

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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
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
  
  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click event
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageModalOpen(true);
    }
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

  // After pagination logic and before return
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
              setCurrentPage(1); // Reset to first page when date filter is cleared
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewOrder(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.imageUrl && (
                    <div 
                      className="relative overflow-hidden rounded-md cursor-pointer group"
                      onClick={(e) => handleImageClick(order.imageUrl || '', e)}
                    >
                      <img 
                        src={order.imageUrl} 
                        alt={`Order ${order.id}`}
                        className="w-12 h-12 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-1 rounded-full">
                          <ZoomIn size={10} className="text-gray-700" />
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <button
                      className="p-1.5 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}
                      title="View Order"
                    >
                      <Eye size={18} />
                    </button>
                    
                    {showActions && canModifyOrder(order) && (
                      <>
                        <button
                          className="p-1.5 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditOrder(order);
                          }}
                          title="Edit Order"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="p-1.5 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this order?')) {
                              onDelete?.(order.id);
                            }
                          }}
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    
                    {order.activities && order.activities.length > 0 && (
                      <div className="relative">
                        <button
                          className={`p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50 transition-colors ${showActivityPopup === order.id ? 'bg-gray-50' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActivityPopup(prev => prev === order.id ? null : order.id);
                          }}
                          title="Activity History"
                        >
                          <Info size={18} />
                        </button>
                        {showActivityPopup === order.id && <ActivityPopup orderId={order.id} />}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {currentOrders.length === 0 && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500" colSpan={7}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, statusFilteredOrders.length)} of {statusFilteredOrders.length} orders
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(number => {
                const isFirstPage = number === 1;
                const isLastPage = number === totalPages;
                const isCurrentPage = number === currentPage;
                const isNearCurrentPage = Math.abs(number - currentPage) <= 1;
                return isFirstPage || isLastPage || isCurrentPage || isNearCurrentPage;
              })
              .map((number, index, array) => {
                const isPrevValueNotConsecutive = index > 0 && array[index] - array[index - 1] > 1;
                
                return (
                  <React.Fragment key={number}>
                    {isPrevValueNotConsecutive && <span className="text-gray-500">...</span>}
                    <button
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${currentPage === number 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {number}
                    </button>
                  </React.Fragment>
                );
              })}
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage}
        alt="Order image"
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </div>
  );
};

export default OrderList;