import React from 'react';
import { LayoutDashboard, Package, Users, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onNavigate: (view: 'dashboard' | 'orders' | 'staff' | 'products' | 'settings') => void;
  activeView: string;
  role?: 'admin' | 'staff';
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView, role }) => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Package className="w-8 h-8" />
        <span className="text-xl font-bold">Sarathi Electricals</span>
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-2 p-3 w-full rounded-lg ${
            activeView === 'dashboard' ? 'bg-gray-800' : 'hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onNavigate('orders')}
          className={`flex items-center gap-2 p-3 w-full rounded-lg ${
            activeView === 'orders' ? 'bg-gray-800' : 'hover:bg-gray-800'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </button>
        {role === 'admin' && (
          <>
            <button
              onClick={() => onNavigate('products')}
              className={`flex items-center gap-2 p-3 w-full rounded-lg ${
                activeView === 'products' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => onNavigate('staff')}
              className={`flex items-center gap-2 p-3 w-full rounded-lg ${
                activeView === 'staff' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Staff</span>
            </button>
          </>
        )}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-2 p-3 w-full rounded-lg ${
            activeView === 'settings' ? 'bg-gray-800' : 'hover:bg-gray-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 w-full rounded-lg hover:bg-gray-800 mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;